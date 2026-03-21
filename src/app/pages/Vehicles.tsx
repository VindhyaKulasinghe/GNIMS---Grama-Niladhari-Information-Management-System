import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useHouseholdData, Vehicle } from "../context/HouseholdDataContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
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
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Car,
  BarChart3,
  List,
  Check,
  Loader2,
  AlertCircle,
  Home,
  AlertTriangle,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export function Vehicles() {
  const { t } = useTranslation();
  const {
    vehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    familyMembers,
    households,
  } = useHouseholdData();
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Vehicle>>({});
  const [userId, setUserId] = useState("");
  const [userValidation, setUserValidation] = useState<
    "idle" | "validating" | "valid" | "invalid"
  >("idle");
  const [validatedUser, setValidatedUser] = useState<any>(null);

  // View dialog state
  const [viewDialog, setViewDialog] = useState(false);
  const [viewingVehicle, setViewingVehicle] = useState<Vehicle | null>(null);

  // Loading states
  const [savingVehicle, setSavingVehicle] = useState(false);
  const [deletingVehicle, setDeletingVehicle] = useState(false);

  const filteredVehicles = vehicles.filter(
    (v) =>
      v.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.vehicleType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.ownerName.toLowerCase().includes(searchQuery.toLowerCase()),
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
    // For editing, use the owner info from the vehicle record
    setValidatedUser({
      name: vehicle.ownerName,
      address: vehicle.ownerAddress,
      phone: vehicle.ownerPhone,
      houseNumber: vehicle.houseNumber,
    });
    setUserValidation("valid");
    setDialogOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setVehicleToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (vehicleToDelete !== null) {
      setDeletingVehicle(true);
      try {
        await deleteVehicle(vehicleToDelete);
        toast.success(t("vehicleDeleted") || "Vehicle deleted successfully.");
        setDeleteDialogOpen(false);
        setVehicleToDelete(null);
      } finally {
        setDeletingVehicle(false);
      }
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
      const member = familyMembers.find((m) => m.nicNumber === value);
      if (member) {
        const household = households.find(
          (h) => h.houseNumber === member.houseNumber,
        );
        setUserValidation("valid");
        setValidatedUser({
          name: member.fullName,
          address: household?.address || "",
          phone: household?.telephone || "",
          houseNumber: member.houseNumber,
        });
        setFormData((prev) => ({
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
    setSavingVehicle(true);
    try {
      const errors: { [key: string]: string } = {};

      if (!formData.vehicleType) errors.vehicleType = t("vehicleTypeRequired");
      if (!formData.vehicleNumber)
        errors.vehicleNumber = t("vehicleNumberRequired");
      if (!formData.registrationYear)
        errors.registrationYear = t("registrationYearRequired");
      // Only require NIC validation when adding (not editing)
      if (!editingVehicle && userValidation !== "valid")
        errors.userId = t("validateNicPrompt");

      if (Object.keys(errors).length > 0) {
        (formData as any).__errors = errors;
        toast.error(t("fixFormErrors"));
        return;
      }

      const { __errors, ...cleanForm } = formData as any;

      if (editingVehicle) {
        const { id, createdAt, updatedAt, userId, ...rest } =
          cleanForm as Vehicle as any;
        await updateVehicle(editingVehicle.id, rest);
        toast.success(t("vehicleUpdated"));
      } else {
        const { id, createdAt, updatedAt, userId, ...rest } =
          cleanForm as Vehicle as any;
        await addVehicle(rest);
        toast.success(t("vehicleAdded"));
      }
      setDialogOpen(false);
    } finally {
      setSavingVehicle(false);
    }
  };

  // Analytics calculations
  const vehicleTypeCounts = vehicles.reduce(
    (acc, vehicle) => {
      acc[vehicle.vehicleType] = (acc[vehicle.vehicleType] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const vehicleTypeData = Object.entries(vehicleTypeCounts).map(
    ([name, value]) => ({
      name: t(name.toLowerCase().replace(/[- ]/g, "")) || name,
      value,
    }),
  );

  const topVehicleKey =
    Object.entries(vehicleTypeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "";
  const topVehicleStr = topVehicleKey
    ? t(topVehicleKey.toLowerCase().replace(/[- ]/g, "")) || topVehicleKey
    : "-";

  const registrationYearData = vehicles.reduce(
    (acc, vehicle) => {
      const decade = Math.floor(vehicle.registrationYear / 5) * 5;
      const label = `${decade}-${decade + 4}`;
      acc[label] = (acc[label] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const yearData = Object.entries(registrationYearData)
    .map(([name, count]) => ({
      name,
      count,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const COLORS = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ef4444",
    "#06b6d4",
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t("vehicles")}</h1>
          <p className="text-slate-600 mt-1">
            {t("vehicleManagementSubtitle")}
          </p>
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
            <Card className="hover:shadow-lg hover:scale-[1.02] transition-all bg-gradient-to-br from-white to-blue-50/50">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-blue-600/80 uppercase tracking-wider mb-1">
                      {t("totalVehicles")}
                    </p>
                    <p className="text-3xl font-bold text-slate-800">
                      {vehicles.length}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {t("registered") || "Registered"}
                    </p>
                  </div>
                  <div className="bg-blue-500 p-3 rounded-2xl shadow-sm text-white">
                    <Car className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg hover:scale-[1.02] transition-all bg-gradient-to-br from-white to-emerald-50/50">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-emerald-600/80 uppercase tracking-wider mb-1">
                      {t("vehicleTypes")}
                    </p>
                    <p className="text-3xl font-bold text-slate-800">
                      {Object.keys(vehicleTypeCounts).length}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {t("categories") || "Categories"}
                    </p>
                  </div>
                  <div className="bg-emerald-500 p-3 rounded-2xl shadow-sm text-white">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg hover:scale-[1.02] transition-all bg-gradient-to-br from-white to-amber-50/50">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-amber-600/80 uppercase tracking-wider mb-1">
                      {t("householdsWithVehicles")}
                    </p>
                    <p className="text-3xl font-bold text-slate-800">
                      {new Set(vehicles.map((v) => v.houseNumber)).size}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {t("households")}
                    </p>
                  </div>
                  <div className="bg-amber-500 p-3 rounded-2xl shadow-sm text-white">
                    <Home className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg hover:scale-[1.02] transition-all bg-gradient-to-br from-white to-purple-50/50">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-purple-600/80 uppercase tracking-wider mb-1">
                      {t("popularity")}
                    </p>
                    <p className="text-xl font-bold text-slate-800">
                      {topVehicleStr}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {t("vehicleType")}
                    </p>
                  </div>
                  <div className="bg-purple-500 p-3 rounded-2xl shadow-sm text-white">
                    <Car className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart - Vehicle Types */}
            <Card className="hover:shadow-md transition-all border-slate-200">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                <CardTitle className="text-lg text-slate-800 font-semibold">
                  {t("vehicleDistributionByType")}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={vehicleTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      dataKey="value"
                    >
                      {vehicleTypeData.map((entry, index) => (
                        <Cell
                          key={`vehicles-pie-cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      cursor={{ fill: "transparent" }}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Bar Chart - Registration Years */}
            <Card className="hover:shadow-md transition-all border-slate-200">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                <CardTitle className="text-lg text-slate-800 font-semibold">
                  {t("vehiclesByRegistrationPeriod")}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={yearData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e2e8f0"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b" }}
                    />
                    <Tooltip
                      cursor={{ fill: "#f1f5f9" }}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Bar
                      dataKey="count"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={50}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center pt-4">
            <Button
              onClick={handleAdd}
              variant="outline"
              size="lg"
              className="gap-2"
            >
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
            <Button
              onClick={handleAdd}
              className="bg-slate-900 hover:bg-slate-800"
            >
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
                      <TableHead className="text-right">
                        {t("actions")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVehicles.map((vehicle) => (
                      <TableRow
                        key={vehicle.id}
                        className="cursor-pointer hover:bg-blue-50"
                        onClick={(e) => {
                          // Don't trigger if clicking on buttons
                          if ((e.target as HTMLElement).closest("button"))
                            return;
                          setViewingVehicle(vehicle);
                          setViewDialog(true);
                        }}
                      >
                        <TableCell className="font-mono font-semibold">
                          {vehicle.vehicleNumber}
                        </TableCell>
                        <TableCell>
                          <span className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-full">
                            {vehicle.vehicleType}
                          </span>
                        </TableCell>
                        <TableCell>{vehicle.ownerName}</TableCell>
                        <TableCell className="font-mono">
                          {vehicle.houseNumber}
                        </TableCell>
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
                              onClick={() => handleDeleteClick(vehicle.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredVehicles.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center text-slate-400 py-8"
                        >
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
            <DialogDescription>
              {editingVehicle
                ? t("editVehicleDescription")
                : t("addVehicleDescription")}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* NIC Validation Section - Only show when adding */}
            {!editingVehicle && (
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
                    {userValidation === "validating" && (
                      <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                    )}
                    {userValidation === "valid" && (
                      <Check className="h-5 w-5 text-green-600" />
                    )}
                    {userValidation === "invalid" && (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </div>
                {userValidation === "invalid" && (
                  <p className="text-sm text-red-500">{t("nicNotFound")}</p>
                )}
              </div>
            )}

            {/* User Details Display */}
            {((!editingVehicle && userValidation === "valid") ||
              editingVehicle) &&
              validatedUser && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">
                    {editingVehicle
                      ? t("currentOwnerDetails")
                      : t("validatedUserDetails")}
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-green-700 font-medium">{t("name")}:</p>
                      <p className="text-green-900">{validatedUser.name}</p>
                    </div>
                    <div>
                      <p className="text-green-700 font-medium">
                        {t("houseNumber")}:
                      </p>
                      <p className="text-green-900">
                        {validatedUser.houseNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-green-700 font-medium">
                        {t("address")}:
                      </p>
                      <p className="text-green-900">{validatedUser.address}</p>
                    </div>
                    <div>
                      <p className="text-green-700 font-medium">
                        {t("phone")}:
                      </p>
                      <p className="text-green-900">{validatedUser.phone}</p>
                    </div>
                  </div>
                </div>
              )}

            {/* Vehicle Details Section */}
            {(!editingVehicle && userValidation === "valid") ||
            editingVehicle ? (
              <>
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-slate-900 mb-4">
                    {t("vehicleInformation")}
                  </h4>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label>{t("vehicleType")} *</Label>
                      <Select
                        value={formData.vehicleType}
                        onValueChange={(val) =>
                          setFormData({ ...formData, vehicleType: val })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectVehicleType")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Car">{t("car")}</SelectItem>
                          <SelectItem value="Motorcycle">
                            {t("motorcycle")}
                          </SelectItem>
                          <SelectItem value="Van">{t("van")}</SelectItem>
                          <SelectItem value="Truck">{t("truck")}</SelectItem>
                          <SelectItem value="Three-Wheeler">
                            {t("threeWheeler")}
                          </SelectItem>
                          <SelectItem value="Tractor">
                            {t("tractor")}
                          </SelectItem>
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
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            vehicleNumber: e.target.value.toUpperCase(),
                          })
                        }
                        placeholder="e.g., ABC1234"
                        className={`font-mono ${(formData as any).__errors?.vehicleNumber ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
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
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            registrationYear: parseInt(e.target.value),
                          })
                        }
                        placeholder="e.g., 2020"
                        min="1900"
                        max="2026"
                        className={
                          (formData as any).__errors?.registrationYear
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : ""
                        }
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
            ) : null}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {t("cancel")}
            </Button>
            <Button
              onClick={handleSave}
              disabled={userValidation !== "valid" || savingVehicle}
              className="bg-slate-900 hover:bg-slate-800"
            >
              {savingVehicle && <Loader2 className="h-4 w-4 animate-spin" />}
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
            <DialogDescription>
              {t("viewDetailedVehicleInfo")}
            </DialogDescription>
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
                  <p className="font-mono font-semibold">
                    {viewingVehicle?.vehicleNumber}
                  </p>
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
                  <p className="font-mono font-semibold">
                    {viewingVehicle?.houseNumber}
                  </p>
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
                  <p className="font-medium">
                    {viewingVehicle?.registrationYear}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => setViewDialog(false)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {t("close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              {t("confirmDelete")}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600 text-sm">{t("confirmDeleteVehicle")}</p>
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
              disabled={deletingVehicle}
            >
              {deletingVehicle && <Loader2 className="h-4 w-4 animate-spin" />}
              {t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
