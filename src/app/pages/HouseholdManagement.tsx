import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useHouseholdData, Household } from "../context/HouseholdDataContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
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
  DialogFooter,
} from "../components/ui/dialog";
import { Plus, Pencil, Trash2, Search, Home, PawPrint, X, BarChart3, List, Zap, Droplets, Bath, AlertTriangle, Activity, Users } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export function HouseholdManagement() {
  const { t } = useTranslation();
  const {
    households,
    getMembersForHouse,
    animals,
    householdAnimals,
    addHousehold,
    updateHousehold,
    deleteHousehold,
    addHouseholdAnimal,
    deleteHouseholdAnimal,
  } = useHouseholdData();
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [animalsDialogOpen, setAnimalsDialogOpen] = useState(false);
  const [selectedHouseNumber, setSelectedHouseNumber] = useState("");
  const [editingHousehold, setEditingHousehold] = useState<Household | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [householdToDelete, setHouseholdToDelete] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Household>>({
    electricity: false,
    water: false,
    toilet: false,
    cow: 0,
    chicken: 0,
    goat: 0,
  });
  const [formAnimals, setFormAnimals] = useState<Array<{ id: string; animalId: string; count: number }>>([]);

  // View dialog state
  const [viewDialog, setViewDialog] = useState(false);
  const [viewingHousehold, setViewingHousehold] = useState<Household | null>(null);

  const filteredHouseholds = households.filter(
    (h) =>
      h.houseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.telephone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    setEditingHousehold(null);
    setFormData({
      electricity: false,
      water: false,
      toilet: false,
      cow: 0,
      chicken: 0,
      goat: 0,
    });
    setFormAnimals([]);
    setDialogOpen(true);
  };

  const handleEdit = (household: Household) => {
    setEditingHousehold(household);
    setFormData(household);

    // Load animals for this household
    const householdAnimalsList = householdAnimals.filter(
      (ha) => ha.houseNumber === household.houseNumber
    );
    setFormAnimals(
      householdAnimalsList.map((ha, idx) => ({
        id: `animal-${idx}`,
        animalId: ha.animalId.toString(),
        count: ha.count,
      }))
    );

    setDialogOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setHouseholdToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (householdToDelete !== null) {
      await deleteHousehold(householdToDelete);
      toast.success(t("householdDeleted") || "Household deleted successfully.");
      setDeleteDialogOpen(false);
      setHouseholdToDelete(null);
    }
  };

  const handleSave = async () => {
    const errors: { [key: string]: string } = {};

    if (!formData.houseNumber) {
      errors.houseNumber = "House number is required";
    }

    if (!formData.address || !formData.telephone) {
      if (!formData.address) {
        errors.address = "Address is required";
      }
      if (!formData.telephone) {
        errors.telephone = "Telephone is required";
      }
    }

    const phone = formData.telephone || "";
    if (!/^\d{10}$/.test(phone)) {
      errors.telephone = "Telephone must be exactly 10 digits (e.g. 0712345678)";
    }

    if (!formData.roofType || !formData.wallType || !formData.floorType) {
      errors.roofType = "Roof type is required";
      errors.wallType = "Wall type is required";
      errors.floorType = "Floor type is required";
    }

    if (Object.keys(errors).length > 0) {
      // Simple way to surface all current validation errors inline + toast
      toast.error("Please fix the highlighted household form errors.");
      // Store errors on formData via a helper key so we can read them below
      (formData as any).__errors = errors;
      return;
    }

    const { __errors, ...cleanForm } = formData as any;
    const coreData = cleanForm as Household;

    if (editingHousehold) {
      await updateHousehold(editingHousehold.id, coreData);

      const houseNumber = editingHousehold.houseNumber;

      const existing = householdAnimals.filter(
        (ha) => ha.houseNumber === houseNumber
      );

      const desired = formAnimals
        .filter((fa) => fa.animalId && fa.count > 0)
        .map((fa) => ({
          animalId: parseInt(fa.animalId),
          count: fa.count,
        }));

      const desiredIds = new Set(desired.map((d) => d.animalId));

      await Promise.all(
        existing
          .filter((ha) => !desiredIds.has(ha.animalId))
          .map((ha) => deleteHouseholdAnimal(houseNumber, ha.animalId))
      );

      await Promise.all(
        desired.map((d) =>
          addHouseholdAnimal(houseNumber, d.animalId, d.count)
        )
      );
      toast.success("Household updated successfully.");
    } else {
      const { id, createdAt, updatedAt, ...rest } = coreData as any;
      await addHousehold(rest);

      const houseNumber = coreData.houseNumber;

      const desired = formAnimals
        .filter((fa) => fa.animalId && fa.count > 0)
        .map((fa) => ({
          animalId: parseInt(fa.animalId),
          count: fa.count,
        }));

      await Promise.all(
        desired.map((d) =>
          addHouseholdAnimal(houseNumber, d.animalId, d.count)
        )
      );
      toast.success("Household added successfully.");
    }
    setDialogOpen(false);
  };

  const handleAddAnimalField = () => {
    setFormAnimals([
      ...formAnimals,
      { id: `animal-${Date.now()}`, animalId: "", count: 0 },
    ]);
  };

  const handleRemoveAnimalField = (id: string) => {
    setFormAnimals(formAnimals.filter((fa) => fa.id !== id));
  };

  const handleAnimalFieldChange = (
    id: string,
    field: "animalId" | "count",
    value: string | number
  ) => {
    setFormAnimals(
      formAnimals.map((fa) =>
        fa.id === id ? { ...fa, [field]: value } : fa
      )
    );
  };

  const handleManageAnimals = (houseNumber: string) => {
    setSelectedHouseNumber(houseNumber);
    setAnimalsDialogOpen(true);
  };

  const getHouseholdAnimalCount = (houseNumber: string, animalId: number) => {
    const ha = householdAnimals.find(
      (item) => item.houseNumber === houseNumber && item.animalId === animalId
    );
    return ha ? ha.count : 0;
  };

  const handleAnimalCountChange = async (animalId: number, count: number) => {
    if (!selectedHouseNumber) return;

    if (count === 0) {
      await deleteHouseholdAnimal(selectedHouseNumber, animalId);
    } else {
      await addHouseholdAnimal(selectedHouseNumber, animalId, count);
    }
  };

  // Analytics calculations
  const totalMembers = households.reduce((sum, h) => sum + getMembersForHouse(h.houseNumber).length, 0);
  const avgHouseholdSize = households.length ? (totalMembers / households.length).toFixed(1) : "0.0";

  let allUtilitiesCount = 0;
  let partialUtilitiesCount = 0;
  let noUtilitiesCount = 0;

  households.forEach(h => {
    const score = (h.electricity ? 1 : 0) + (h.water ? 1 : 0) + (h.toilet ? 1 : 0);
    if (score === 3) allUtilitiesCount++;
    else if (score === 0) noUtilitiesCount++;
    else partialUtilitiesCount++;
  });

  const basicNeedsDeficit = households.length - allUtilitiesCount;
  
  const vulnerableHousingCount = households.filter(h => 
    h.roofType === 'Cadjan' || h.wallType === 'Cadjan' || h.floorType === 'Earth'
  ).length;

  const basicNeedsData = [
    { name: t("allUtilities"), value: allUtilitiesCount, fill: "#10b981" },
    { name: t("partialUtilities"), value: partialUtilitiesCount, fill: "#f59e0b" },
    { name: t("noUtilities"), value: noUtilitiesCount, fill: "#ef4444" },
  ].filter(item => item.value > 0);

  const electricityCount = households.filter((h) => h.electricity).length;
  const waterCount = households.filter((h) => h.water).length;
  const toiletCount = households.filter((h) => h.toilet).length;

  const utilitiesData = [
    { name: t("electricityCount"), value: electricityCount },
    { name: t("waterSupplyCount"), value: waterCount },
    { name: t("toiletFacilityCount"), value: toiletCount },
  ].filter(item => item.value > 0);

  // Roof types distribution
  const roofTypeCounts = households.reduce((acc, h) => {
    if (h.roofType) {
      acc[h.roofType] = (acc[h.roofType] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const roofTypeData = Object.entries(roofTypeCounts).map(([name, value]) => ({
    name: t(name.toLowerCase()),
    value,
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {t("householdManagement")}
          </h1>
          <p className="text-slate-600 mt-1">
            {t("householdManagementSubtitle")}
          </p>
        </div>
        <Button onClick={handleAdd} className="bg-slate-900 hover:bg-slate-800">
          <Plus className="h-4 w-4 mr-2" />
          {t("addHousehold")}
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            {t("overview")}
          </TabsTrigger>
          <TabsTrigger value="all-households" className="gap-2">
            <List className="h-4 w-4" />
            {t("allHouseholds")}
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
                    <p className="text-xs font-semibold text-blue-600/80 uppercase tracking-wider mb-1">{t("totalHouseholds")}</p>
                    <p className="text-3xl font-bold text-slate-800">{households.length}</p>
                    <p className="text-xs text-slate-500 mt-1">{t("registeredHouseholds") || "Registered Households"}</p>
                  </div>
                  <div className="bg-blue-500 p-3 rounded-2xl shadow-sm text-white">
                    <Home className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg hover:scale-[1.02] transition-all bg-gradient-to-br from-white to-amber-50/50">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-amber-600/80 uppercase tracking-wider mb-1">{t("basicNeedsDeficit")}</p>
                    <p className="text-3xl font-bold text-slate-800">{basicNeedsDeficit}</p>
                    <p className="text-xs text-amber-600 font-medium mt-1">{t("needsAttention")}</p>
                  </div>
                  <div className="bg-amber-500 p-3 rounded-2xl shadow-sm text-white">
                    <Activity className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg hover:scale-[1.02] transition-all bg-gradient-to-br from-white to-indigo-50/50">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-indigo-600/80 uppercase tracking-wider mb-1">{t("electricityCount")}</p>
                    <p className="text-3xl font-bold text-slate-800">{electricityCount}</p>
                    <p className="text-xs text-indigo-600 font-medium mt-1">{t("households")}</p>
                  </div>
                  <div className="bg-indigo-500 p-3 rounded-2xl shadow-sm text-white">
                    <Zap className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg hover:scale-[1.02] transition-all bg-gradient-to-br from-white to-emerald-50/50">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-emerald-600/80 uppercase tracking-wider mb-1">{t("avgHouseholdSize")}</p>
                    <p className="text-3xl font-bold text-slate-800">{avgHouseholdSize}</p>
                    <p className="text-xs text-slate-500 mt-1">{t("members")}</p>
                  </div>
                  <div className="bg-emerald-500 p-3 rounded-2xl shadow-sm text-white">
                    <Users className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pie Chart - Basic Needs Access */}
            <Card className="hover:shadow-md transition-all border-slate-200">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                <CardTitle className="text-lg text-slate-800 font-semibold">{t("basicNeedsAccess")}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={basicNeedsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      dataKey="value"
                    >
                      {basicNeedsData.map((entry, index) => (
                        <Cell
                          key={`basic-needs-${index}`}
                          fill={entry.fill || COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Bar Chart - Utilities */}
            <Card className="hover:shadow-md transition-all border-slate-200">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                <CardTitle className="text-lg text-slate-800 font-semibold">{t("utilitiesDistribution")}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={utilitiesData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Bar Chart - Roof Types */}
            <Card className="hover:shadow-md transition-all border-slate-200">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                <CardTitle className="text-lg text-slate-800 font-semibold">{t("roofTypeDistribution")}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={roofTypeData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={50} />
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
              {t("addNewHousehold")}
            </Button>
          </div>
        </TabsContent>

        {/* All Households Tab */}
        <TabsContent value="all-households" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder={`${t("search")} by house no., address or telephone...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={handleAdd} className="bg-slate-900 hover:bg-slate-800">
              <Plus className="h-4 w-4 mr-2" />
              {t("addHousehold")}
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("houseNumber")}</TableHead>
                      <TableHead>{t("address")}</TableHead>
                      <TableHead>{t("telephone")}</TableHead>
                      <TableHead>{t("members")}</TableHead>
                      <TableHead>{t("animals")}</TableHead>
                      <TableHead>{t("utilities")}</TableHead>
                      <TableHead>{t("housing")}</TableHead>
                      <TableHead className="text-right">{t("actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredHouseholds.map((household) => {
                      const members = getMembersForHouse(household.houseNumber);
                      const head = members.find((m) => m.isHeadOfHousehold);
                      const householdAnimalsList = householdAnimals.filter(
                        (ha) => ha.houseNumber === household.houseNumber
                      );
                      const totalAnimals = householdAnimalsList.reduce(
                        (sum, ha) => sum + ha.count,
                        0
                      );
                      return (
                        <TableRow 
                          key={household.id}
                          className="cursor-pointer hover:bg-blue-50"
                          onClick={(e) => {
                            // Don't trigger if clicking on buttons
                            if ((e.target as HTMLElement).closest('button')) return;
                            setViewingHousehold(household);
                            setViewDialog(true);
                          }}
                        >
                          <TableCell className="font-medium text-blue-700">
                            {household.houseNumber}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm">{household.address}</p>
                              {head && (
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {t("headOfHouseholdLabel")}: {head.fullName}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{household.telephone}</TableCell>
                          <TableCell>
                            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                              {members.length} {t("members").toLowerCase()}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleManageAnimals(household.houseNumber)}
                              className="gap-2"
                            >
                              <PawPrint className="h-3 w-3" />
                              {totalAnimals > 0 ? (
                                <span className="font-medium">{totalAnimals}</span>
                              ) : (
                                <span className="text-gray-400">0</span>
                              )}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1 text-xs">
                              {household.electricity && (
                                <span className="bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded" title="Electricity">⚡</span>
                              )}
                              {household.water && (
                                <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded" title="Water">💧</span>
                              )}
                              {household.toilet && (
                                <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded" title="Toilet">🚽</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-xs text-gray-600 space-y-0.5">
                              <div>{t("roof")}: {household.roofType ? t(household.roofType.toLowerCase()) : "-"}</div>
                              <div>{t("wall")}: {household.wallType ? t(household.wallType.toLowerCase()) : "-"}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-1 justify-end">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(household)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteClick(household.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {filteredHouseholds.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-gray-400 py-8">
                          {t("noHouseholdsFound") || "No households found."}
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
              {editingHousehold ? t("edit") : t("add")} {t("households").slice(0, -1)}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("houseNumber")}</Label>
                <Input
                  value={formData.houseNumber || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, houseNumber: e.target.value })
                  }
                  placeholder="e.g. 23/A"
                />
                {(formData as any).__errors?.houseNumber && (
                  <p className="text-xs text-red-500">
                    {(formData as any).__errors.houseNumber}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>{t("telephone")}</Label>
                <Input
                  value={formData.telephone || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, telephone: e.target.value })
                  }
                  placeholder="0XX XXXXXXX"
                />
                {(formData as any).__errors?.telephone && (
                  <p className="text-xs text-red-500">
                    {(formData as any).__errors.telephone}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t("address")}</Label>
              <Input
                value={formData.address || ""}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Street, Village, Town"
              />
              {(formData as any).__errors?.address && (
                <p className="text-xs text-red-500">
                  {(formData as any).__errors.address}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Label className="text-base">{t("utilities")}</Label>
              <div className="grid grid-cols-3 gap-4 bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">⚡ {t("electricity")}</span>
                  <Switch
                    checked={formData.electricity}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, electricity: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">💧 {t("water")}</span>
                  <Switch
                    checked={formData.water}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, water: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">🚽 {t("toilet")}</span>
                  <Switch
                    checked={formData.toilet}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, toilet: checked })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-base">{t("housingMaterials")}</Label>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-gray-500">{t("roofType")}</Label>
                  <Select
                    value={formData.roofType}
                    onValueChange={(val) =>
                      setFormData({ ...formData, roofType: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tiles">{t("tiles")}</SelectItem>
                      <SelectItem value="Asbestos">{t("asbestos")}</SelectItem>
                      <SelectItem value="Metal">{t("metal")}</SelectItem>
                      <SelectItem value="Concrete">{t("concrete")}</SelectItem>
                      <SelectItem value="Cadjan">{t("cadjan")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-500">{t("wallType")}</Label>
                  <Select
                    value={formData.wallType}
                    onValueChange={(val) =>
                      setFormData({ ...formData, wallType: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Brick">{t("brick")}</SelectItem>
                      <SelectItem value="Stone">{t("stone")}</SelectItem>
                      <SelectItem value="Cement">{t("cement")}</SelectItem>
                      <SelectItem value="Wood">{t("wood")}</SelectItem>
                      <SelectItem value="Cadjan">{t("cadjan")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-500">{t("floorType")}</Label>
                  <Select
                    value={formData.floorType}
                    onValueChange={(val) =>
                      setFormData({ ...formData, floorType: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cement">{t("cement")}</SelectItem>
                      <SelectItem value="Tiles">{t("tiles")}</SelectItem>
                      <SelectItem value="Earth">{t("earth")}</SelectItem>
                      <SelectItem value="Wood">{t("wood")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base">{t("domesticAnimals")}</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddAnimalField}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  {t("add")} {t("animals").slice(0, -1)}
                </Button>
              </div>

              {formAnimals.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed rounded-lg">
                  No animals added. Click "Add Animal" to add.
                </div>
              ) : (
                <div className="space-y-3">
                  {formAnimals.map((formAnimal) => (
                    <div
                      key={formAnimal.id}
                      className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg border"
                    >
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-500">
                            {t("selectAnimal")}
                          </Label>
                          <Select
                            value={formAnimal.animalId}
                            onValueChange={(val) =>
                              handleAnimalFieldChange(formAnimal.id, "animalId", val)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choose animal..." />
                            </SelectTrigger>
                            <SelectContent>
                              {animals.map((animal) => (
                                <SelectItem
                                  key={animal.id}
                                  value={animal.id.toString()}
                                >
                                  {animal.name} ({animal.category})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-500">{t("count")}</Label>
                          <Input
                            type="number"
                            min="0"
                            value={formAnimal.count}
                            onChange={(e) =>
                              handleAnimalFieldChange(
                                formAnimal.id,
                                "count",
                                parseInt(e.target.value) || 0
                              )
                            }
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveAnimalField(formAnimal.id)}
                        className="mt-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              {t("save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Animals Dialog */}
      <Dialog open={animalsDialogOpen} onOpenChange={setAnimalsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {t("manageAnimals")} - {t("house")} {selectedHouseNumber}
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-gray-600 mb-4">
              {t("manageAnimalsSubtitle")}
            </p>

            <div className="space-y-3">
              {animals.map((animal) => {
                const currentCount = getHouseholdAnimalCount(
                  selectedHouseNumber,
                  animal.id
                );
                return (
                  <div
                    key={animal.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-medium">{animal.name}</p>
                      <p className="text-xs text-gray-500">{animal.category}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Label className="text-xs text-gray-500">{t("count")}:</Label>
                      <Input
                        type="number"
                        min="0"
                        value={currentCount}
                        onChange={(e) =>
                          handleAnimalCountChange(
                            animal.id,
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-20"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setAnimalsDialogOpen(false)} className="bg-blue-600 hover:bg-blue-700">
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
              {t("householdDetails")} - {viewingHousehold?.houseNumber}
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-gray-600 mb-4">
              {t("viewDetailedHouseholdInfo")}
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium">{t("houseNumber")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-xs text-gray-500">:</Label>
                  <p className="font-medium">{viewingHousehold?.houseNumber}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium">{t("address")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-xs text-gray-500">:</Label>
                  <p className="font-medium">{viewingHousehold?.address}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium">{t("telephone")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-xs text-gray-500">:</Label>
                  <p className="font-medium">{viewingHousehold?.telephone}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium">{t("utilities")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-xs text-gray-500">:</Label>
                  <div className="flex gap-1 text-xs">
                    {viewingHousehold?.electricity && (
                      <span className="bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded" title="Electricity">⚡</span>
                    )}
                    {viewingHousehold?.water && (
                      <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded" title="Water">💧</span>
                    )}
                    {viewingHousehold?.toilet && (
                      <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded" title="Toilet">🚽</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium">{t("housingMaterials")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-xs text-gray-500">:</Label>
                  <div className="text-xs text-gray-600 space-y-0.5">
                    <div>{t("roof")}: {viewingHousehold?.roofType ? t(viewingHousehold.roofType.toLowerCase()) : "-"}</div>
                    <div>{t("wall")}: {viewingHousehold?.wallType ? t(viewingHousehold.wallType.toLowerCase()) : "-"}</div>
                    <div>{t("floor")}: {viewingHousehold?.floorType ? t(viewingHousehold.floorType.toLowerCase()) : "-"}</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium">{t("animals")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-xs text-gray-500">:</Label>
                  <div className="space-y-2">
                    {householdAnimals
                      .filter((ha) => ha.houseNumber === viewingHousehold?.houseNumber)
                      .map((ha) => (
                        <div key={ha.animalId} className="flex items-center gap-2">
                          <p className="font-medium">
                            {animals.find((a) => a.id === ha.animalId)?.name || "Unknown"}
                          </p>
                          <p className="text-gray-500">({ha.count})</p>
                        </div>
                      ))}
                  </div>
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
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              {t("confirmDelete")}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600 text-sm">{t("confirmDeleteHousehold") || "Are you sure you want to delete this household?"}</p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              {t("cancel")}
            </Button>
            <Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white" onClick={confirmDelete}>
              {t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}