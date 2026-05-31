/* eslint-disable */
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
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
  Trash2,
  Landmark,
  Search,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import * as divisionService from "../../lib/services/divisionService";
import { useLoading } from "../context/LoadingContext";

export function DivisionManagement() {
  const { t } = useTranslation();
  const [divisions, setDivisions] = useState<divisionService.Division[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newDivisionName, setNewDivisionName] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [divisionToDelete, setDivisionToDelete] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { setIsLoading } = useLoading();

  const [savingDivision, setSavingDivision] = useState(false);
  const [deletingDivision, setDeletingDivision] = useState(false);

  useEffect(() => {
    loadDivisions();
  }, []);

  const loadDivisions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await divisionService.getDivisions();
      setDivisions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("failedLoadDivisions") || "Failed to load divisions.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddClick = () => {
    setNewDivisionName("");
    setAddDialogOpen(true);
  };

  const handleSaveDivision = async () => {
    if (!newDivisionName.trim()) {
      setError(t("divisionNameRequired") || "Division name is required.");
      return;
    }

    setSavingDivision(true);
    try {
      const created = await divisionService.createDivision(newDivisionName.trim());
      setDivisions([...divisions, created]);
      toast.success(t("divisionCreated") || "Division added successfully.");
      setAddDialogOpen(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("failedSaveDivision") || "Failed to save division.");
    } finally {
      setSavingDivision(false);
    }
  };

  const handleDeleteClick = (id: number | undefined) => {
    if (id === undefined) return;
    setDivisionToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (divisionToDelete === null) return;

    setDeletingDivision(true);
    try {
      await divisionService.deleteDivision(divisionToDelete);
      setDivisions(divisions.filter((d) => d.id !== divisionToDelete));
      toast.success(t("divisionDeleted") || "Division deleted successfully.");
      setDeleteDialogOpen(false);
      setDivisionToDelete(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("failedDeleteDivision") || "Failed to delete division.");
    } finally {
      setDeletingDivision(false);
    }
  };

  const filteredDivisions = divisions.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t("divisionManagement") || "GN Division Management"}
          </h1>
          <p className="text-gray-600 mt-1">
            {t("divisionManagementDesc") || "Configure Grama Niladhari divisions so users can be mapped to them."}
          </p>
        </div>
        <Button onClick={handleAddClick} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          {t("add") || "Add GN Division"}
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="absolute top-0 right-0 p-3 font-bold">
            ×
          </button>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={t("search") || "Search divisions..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("gnDivision") || "Division Name"}</TableHead>
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDivisions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-gray-500 py-8">
                    {t("noDivisionsFound") || "No GN divisions found. Click Add to create one."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredDivisions.map((division) => (
                  <TableRow key={division.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Landmark className="h-4 w-4 text-gray-400" />
                        <span className="font-semibold text-slate-800">{division.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(division.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500 hover:text-red-700" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {t("addGNDivision") || "Add GN Division"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{t("gnDivisionName") || "GN Division Name"}</Label>
              <Input
                placeholder="e.g. Hambantota, Mirijjawila, etc."
                value={newDivisionName}
                onChange={(e) => setNewDivisionName(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              {t("cancel")}
            </Button>
            <Button
              onClick={handleSaveDivision}
              disabled={savingDivision}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {savingDivision && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {t("save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              {t("confirmDelete") || "Confirm Delete"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600 text-sm">
              {t("confirmDeleteDivision") || 
                "Are you sure you want to delete this GN division? This will not alter mapped users, but they may lose division configurations."}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              {t("cancel")}
            </Button>
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={confirmDelete}
              disabled={deletingDivision}
            >
              {deletingDivision && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DivisionManagement;
