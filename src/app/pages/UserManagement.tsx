import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Shield,
  User,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "../components/ui/badge";
import * as userService from "../../lib/services/userService";
import { User as UserType } from "../../lib/validationSchemas";

export function UserManagement() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<UserType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<UserType>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Loading states for operations
  const [savingUser, setSavingUser] = useState(false);
  const [deletingUser, setDeletingUser] = useState(false);

  // Load users on mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getUsers();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("failedLoadUsers"));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAdd = () => {
    setEditingUser(null);
    setFormData({ status: "Active" });
    setDialogOpen(true);
  };

  const handleEdit = (user: UserType) => {
    setEditingUser(user);
    setFormData(user);
    setDialogOpen(true);
  };

  const handleDeleteClick = (id: string | undefined) => {
    if (!id) return;
    setUserToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      setDeletingUser(true);
      try {
        await userService.deleteUser(userToDelete);
        setUsers(users.filter((u) => u.id !== userToDelete));
        toast.success(t("userDeleted") || "User deleted successfully.");
      } catch (err) {
        setError(err instanceof Error ? err.message : t("failedDeleteUser"));
      } finally {
        setDeleteDialogOpen(false);
        setUserToDelete(null);
        setDeletingUser(false);
      }
    }
  };

  const handleSave = async () => {
    setSavingUser(true);
    try {
      if (
        !formData.name ||
        !formData.email ||
        !formData.role ||
        !formData.division ||
        !formData.status
      ) {
        setError(t("allFieldsRequired"));
        return;
      }

      if (editingUser) {
        const updated = await userService.updateUser(editingUser.id!, {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          division: formData.division,
          status: formData.status,
        });
        setUsers(users.map((u) => (u.id === editingUser.id ? updated : u)));
      } else {
        const newUser = await userService.createUser({
          name: formData.name!,
          email: formData.email!,
          role: formData.role as any,
          division: formData.division!,
          status: formData.status as any,
        });
        setUsers([newUser, ...users]);
      }
      toast.success(t("userSaved") || "User saved successfully.");
      setDialogOpen(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("failedSaveUser"));
    } finally {
      setSavingUser(false);
    }
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      Admin: "bg-red-100 text-red-700",
      "GN Officer": "bg-blue-100 text-blue-700",
      "Divisional Secretariat": "bg-purple-100 text-purple-700",
    };
    return colors[role] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t("userManagement")}
          </h1>
          <p className="text-gray-600 mt-1">{t("userManagementDescription")}</p>
        </div>
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          {t("add")}
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
          <button onClick={() => setError(null)} className="float-right">
            Ã—
          </button>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={t("search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              {t("loading") || "Loading..."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("name")}</TableHead>
                  <TableHead>{t("email")}</TableHead>
                  <TableHead>{t("role")}</TableHead>
                  <TableHead>{t("division")}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                  <TableHead className="text-right">{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        {user.name}
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge className={getRoleBadge(user.role)}>
                        <Shield className="h-3 w-3 mr-1" />
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.division}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          user.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }
                      >
                        {user.status === "Active" ? t("active") : t("inactive")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(user)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(user.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? t("edit") : t("add")} {t("user") || "User"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>{t("name")}</Label>
              <Input
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>{t("email")}</Label>
              <Input
                type="email"
                value={formData.email || ""}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>{t("role")}</Label>
              <Select
                value={formData.role || ""}
                onValueChange={(val) =>
                  setFormData({ ...formData, role: val as any })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("selectRole")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">{t("admin")}</SelectItem>
                  <SelectItem value="GN Officer">{t("gnOfficer")}</SelectItem>
                  <SelectItem value="Divisional Secretariat">
                    {t("divisionalSecretariatLabel")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("division")}</Label>
              <Input
                value={formData.division || ""}
                onChange={(e) =>
                  setFormData({ ...formData, division: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>{t("status")}</Label>
              <Select
                value={formData.status || ""}
                onValueChange={(val) =>
                  setFormData({ ...formData, status: val as any })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("selectStatus")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">{t("active")}</SelectItem>
                  <SelectItem value="Inactive">{t("inactive")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {t("cancel")}
            </Button>
            <Button
              onClick={handleSave}
              disabled={savingUser}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {savingUser && <Loader2 className="h-4 w-4 animate-spin" />}
              {t("save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              {t("confirmDelete")}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600 text-sm">{t("confirmDeleteUser")}</p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              {t("cancel")}
            </Button>
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={confirmDelete}
              disabled={deletingUser}
            >
              {deletingUser && <Loader2 className="h-4 w-4 animate-spin" />}
              {t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UserManagement;
