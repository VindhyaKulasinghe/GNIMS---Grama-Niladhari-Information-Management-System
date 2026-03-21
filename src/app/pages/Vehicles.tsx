import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useHouseholdData, Vehicle } from "../context/HouseholdDataContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
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
import { Plus, Pencil, Trash2, Search, Car, BarChart3, List, Check, Loader2, AlertCircle, Home } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export function Vehicles() {
  const { t } = useTranslation();
  const { vehicles, addVehicle, updateVehicle, deleteVehicle, familyMembers, households } = useHouseholdData();
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState<Partial<Vehicle>>({});
  const [userId, setUserId] = useState("");
  const [userValidation, setUserValidation] = useState<"idle" | "validating" | "valid" | "invalid">("idle");
  const [validatedUser, setValidatedUser] = useState<any>(null);

  // View dialog state
  const [viewDialog, setViewDialog] = useState(false);
  const [viewingVehicle, setViewingVehicle] = useState<Vehicle | null>(null);

  const filteredVehicles = vehicles.filter(v =>
    v.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.vehicleType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    setEditingVehicle(null);
    setFormData({});
    setUserId("");
    setUserValidation("idle");
    setValidatedUser(null);
    setDialogOpen(true);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormData(vehicle);
    setUserId(vehicle.userId || "");
    // Auto-validate for editing
    const member = familyMembers.find(m => m.id.toString() === vehicle.userId);
    if (member) {
      setUserValidation("valid");
      const household = households.find(h => h.houseNumber === member.houseNumber);
      setValidatedUser({
        name: member.fullName,
        address: household?.address || "",
        phone: household?.telephone || "",
        houseNumber: member.houseNumber,
      });
    }
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm(t("confirmDeleteVehicle"))) {
      await deleteVehicle(id);
    }
  };

  const handleUserIdChange = (value: string) => {
    setUserId(value);
    if (!value) {
      setUserValidation("idle");
      setValidatedUser(null);
      return;
    }

    setUserValidation("validating");

    // Simulate async validation against NIC number
    setTimeout(() => {
      const member = familyMembers.find(m => m.nicNumber === value);
      if (member) {
        const household = households.find(h => h.houseNumber === member.houseNumber);
        setUserValidation("valid");
        setValidatedUser({
          name: member.fullName,
          address: household?.address || "",
          phone: household?.telephone || "",
          houseNumber: member.houseNumber,
        });
        setFormData(prev => ({
          ...prev,
          houseNumber: member.houseNumber,
          ownerName: member.fullName,
          ownerAddress: household?.address || "",
          ownerPhone: household?.telephone || "",
        }));
      } else {
        setUserValidation("invalid");
        setValidatedUser(null);
      }
    }, 800);
  };

  const handleSave = async () => {
    const errors: { [key: string]: string } = {};

    if (!formData.vehicleType) errors.vehicleType = t("vehicleTypeRequired");
    if (!formData.vehicleNumber) errors.vehicleNumber = t("vehicleNumberRequired");
    if (!formData.registrationYear) errors.registrationYear = t("registrationYearRequired");
    if (userValidation !== "valid") errors.userId = t("validateNicPrompt");

    if (Object.keys(errors).length > 0) {
      (formData as any).__errors = errors;
      toast.error(t("fixFormErrors"));
      return;
    }

    const { __errors, ...cleanForm } = formData as any;

    if (editingVehicle) {
      const { id, createdAt, updatedAt, userId, ...rest } = (cleanForm as Vehicle) as any;
      await updateVehicle(editingVehicle.id, rest);
      toast.success(t("vehicleUpdated"));
    } else {
      const { id, createdAt, updatedAt, userId, ...rest } = (cleanForm as Vehicle) as any;
      await addVehicle(rest);
      toast.success(t("vehicleAdded"));
    }
    setDialogOpen(false);
  };

  // Analytics calculations
  const vehicleTypeCounts = vehicles.reduce((acc, vehicle) => {
    acc[vehicle.vehicleType] = (acc[vehicle.vehicleType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const vehicleTypeData = Object.entries(vehicleTypeCounts).map(([name, value]) => ({
    name: t(name.toLowerCase().replace("-", "")) || name,
    value,
  }));

  const registrationYearData = vehicles.reduce((acc, vehicle) => {
    const decade = Math.floor(vehicle.registrationYear / 5) * 5;
    const label = `${decade}-${decade + 4}`;
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const yearData = Object.entries(registrationYearData).map(([name, count]) => ({
    name,
    count,
  })).sort((a, b) => a.name.localeCompare(b.name));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t("vehicles")}</h1>
          <p className="text-slate-600 mt-1">{t("vehicleManagementSubtitle")}</p>
        </div>
        <Button onClick={handleAdd} className="bg-slate-900 hover:bg-slate-800">
          <Plus className="h-4 w-4 mr-2" />
          {t("addVehicle")}
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            {t("overview")}
          </TabsTrigger>
          <TabsTrigger value="vehicle-details" className="gap-2">
            <List className="h-4 w-4" />
            {t("details")}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-blue-600 text-white border-blue-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Car className="h-10 w-10 text-white/90" />
                  <div>
                    <p className="text-sm text-blue-100">{t("totalVehicles")}</p>
                    <p className="text-3xl font-bold">{vehicles.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-green-600 text-white border-green-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-green-100">{t("vehicleType")}</p>
                    <p className="text-3xl font-bold">{Object.keys(vehicleTypeCounts).length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-orange-600 text-white border-orange-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <Home className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-orange-100">{t("householdsWithVehicles")}</p>
                    <p className="text-3xl font-bold">
                      {new Set(vehicles.map(v => v.houseNumber)).size}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-purple-600 text-white border-purple-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <Car className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-purple-100">{t("avgRegistrationYear")}</p>
                    <p className="text-3xl font-bold">
                      {Math.round(vehicles.reduce((sum, v) => sum + v.registrationYear, 0) / vehicles.length)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart - Vehicle Types */}
            <Card>
              <CardHeader>
                <CardTitle>{t("vehicleDistributionByType")}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={vehicleTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {vehicleTypeData.map((entry, index) => (
                        <Cell key={`vehicles-pie-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Bar Chart - Registration Years */}
            <Card>
              <CardHeader>
                <CardTitle>{t("vehiclesByRegistrationPeriod")}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={yearData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center pt-4">
            <Button onClick={handleAdd} variant="outline" size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              {t("addNewVehicle")}
            </Button>
          </div>
        </TabsContent>

        {/* Vehicle Details Tab */}
        <TabsContent value="vehicle-details" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder={t("searchVehiclesPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={handleAdd} className="bg-slate-900 hover:bg-slate-800">
              <Plus className="h-4 w-4 mr-2" />
              {t("addVehicle")}
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("vehicleNumber")}</TableHead>
                      <TableHead>{t("type") || "Type"}</TableHead>
                      <TableHead>{t("owner")}</TableHead>
                      <TableHead>{t("houseNumber")}</TableHead>
                      <TableHead>{t("registrationYear")}</TableHead>
                      <TableHead className="text-right">{t("actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVehicles.map((vehicle) => (
                      <TableRow 
                        key={vehicle.id}
                        className="cursor-pointer hover:bg-blue-50"
                        onClick={(e) => {
                          // Don't trigger if clicking on buttons
                          if ((e.target as HTMLElement).closest('button')) return;
                          setViewingVehicle(vehicle);
                          setViewDialog(true);
                        }}
                      >
                        <TableCell className="font-mono font-semibold">{vehicle.vehicleNumber}</TableCell>
                        <TableCell>
                          <span className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-full">
                            {vehicle.vehicleType}
                          </span>
                        </TableCell>
                        <TableCell>{vehicle.ownerName}</TableCell>
                        <TableCell className="font-mono">{vehicle.houseNumber}</TableCell>
                        <TableCell>{vehicle.registrationYear}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(vehicle)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(vehicle.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredVehicles.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-slate-400 py-8">
                          {t("noVehiclesFound")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingVehicle ? t("edit") : t("add")} {t("vehicles")}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* NIC Validation Section */}
            <div className="space-y-2">
              <Label>{t("nicNumber")} *</Label>
              <div className="relative">
                <Input
                  value={userId}
                  onChange={(e) => handleUserIdChange(e.target.value)}
                  placeholder={t("nicNumberPlaceholder")}
                  disabled={!!editingVehicle}
                  className="pr-10"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {userValidation === "validating" && <Loader2 className="h-5 w-5 animate-spin text-slate-400" />}
                  {userValidation === "valid" && <Check className="h-5 w-5 text-green-600" />}
                  {userValidation === "invalid" && <AlertCircle className="h-5 w-5 text-red-500" />}
                </div>
              </div>
              {userValidation === "invalid" && (
                <p className="text-sm text-red-500">{t("nicNotFound")}</p>
              )}
            </div>

            {/* User Details Display */}
            {userValidation === "valid" && validatedUser && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">{t("validatedUserDetails")}</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-green-700 font-medium">{t("name")}:</p>
                    <p className="text-green-900">{validatedUser.name}</p>
                  </div>
                  <div>
                    <p className="text-green-700 font-medium">{t("houseNumber")}:</p>
                    <p className="text-green-900">{validatedUser.houseNumber}</p>
                  </div>
                  <div>
                    <p className="text-green-700 font-medium">{t("address")}:</p>
                    <p className="text-green-900">{validatedUser.address}</p>
                  </div>
                  <div>
                    <p className="text-green-700 font-medium">{t("phone")}:</p>
                    <p className="text-green-900">{validatedUser.phone}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Vehicle Details Section */}
            {userValidation === "valid" && (
              <>
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-slate-900 mb-4">{t("vehicleInformation")}</h4>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label>{t("vehicleType")} *</Label>
                      <Select
                        value={formData.vehicleType}
                        onValueChange={(val) => setFormData({ ...formData, vehicleType: val })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectVehicleType")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Car">{t("car")}</SelectItem>
                          <SelectItem value="Motorcycle">{t("motorcycle")}</SelectItem>
                          <SelectItem value="Van">{t("van")}</SelectItem>
                          <SelectItem value="Truck">{t("truck")}</SelectItem>
                          <SelectItem value="Three-Wheeler">{t("threeWheeler")}</SelectItem>
                          <SelectItem value="Tractor">{t("tractor")}</SelectItem>
                          <SelectItem value="Other">{t("other")}</SelectItem>
                        </SelectContent>
                      </Select>
                      {(formData as any).__errors?.vehicleType && (
                        <p className="text-xs text-red-500">
                          {(formData as any).__errors.vehicleType}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>{t("vehicleNumber")} *</Label>
                      <Input
                        value={formData.vehicleNumber || ""}
                        onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value.toUpperCase() })}
                        placeholder="e.g., ABC1234"
                        className="font-mono"
                      />
                      {(formData as any).__errors?.vehicleNumber && (
                        <p className="text-xs text-red-500">
                          {(formData as any).__errors.vehicleNumber}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>{t("registrationYear")} *</Label>
                      <Input
                        type="number"
                        value={formData.registrationYear || ""}
                        onChange={(e) => setFormData({ ...formData, registrationYear: parseInt(e.target.value) })}
                        placeholder="e.g., 2020"
                        min="1900"
                        max="2026"
                      />
                      {(formData as any).__errors?.registrationYear && (
                        <p className="text-xs text-red-500">
                          {(formData as any).__errors.registrationYear}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {t("cancel")}
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={userValidation !== "valid"}
              className="bg-slate-900 hover:bg-slate-800"
            >
              {t("save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialog} onOpenChange={setViewDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {t("details")} - {viewingVehicle?.vehicleNumber}
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-gray-600 mb-4">
              {t("viewDetailedInfo")}
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium">{t("vehicleNumber")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-xs text-gray-500">:</Label>
                  <p className="font-mono font-semibold">{viewingVehicle?.vehicleNumber}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium">{t("vehicleType")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-xs text-gray-500">:</Label>
                  <span className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-full">
                    {viewingVehicle?.vehicleType}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium">{t("ownerName")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-xs text-gray-500">:</Label>
                  <p className="font-medium">{viewingVehicle?.ownerName}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium">{t("houseNumber")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-xs text-gray-500">:</Label>
                  <p className="font-mono font-semibold">{viewingVehicle?.houseNumber}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium">{t("ownerAddress")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-xs text-gray-500">:</Label>
                  <p className="font-medium">{viewingVehicle?.ownerAddress}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium">{t("ownerPhone")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-xs text-gray-500">:</Label>
                  <p className="font-medium">{viewingVehicle?.ownerPhone}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium">{t("registrationYear")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-xs text-gray-500">:</Label>
                  <p className="font-medium">{viewingVehicle?.registrationYear}</p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setViewDialog(false)} className="bg-blue-600 hover:bg-blue-700">
              {t("close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}