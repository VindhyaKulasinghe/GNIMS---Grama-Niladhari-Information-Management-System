import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
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
import { Plus, Pencil, Trash2, Search, Home, PawPrint, X, BarChart3, List } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function HouseholdManagement() {
  const { t } = useLanguage();
  const {
    households,
    setHouseholds,
    getMembersForHouse,
    animals,
    householdAnimals,
    setHouseholdAnimals,
  } = useHouseholdData();
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [animalsDialogOpen, setAnimalsDialogOpen] = useState(false);
  const [selectedHouseNumber, setSelectedHouseNumber] = useState("");
  const [editingHousehold, setEditingHousehold] = useState<Household | null>(null);
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

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this household?")) {
      setHouseholds(households.filter((h) => h.id !== id));
    }
  };

  const handleSave = () => {
    if (editingHousehold) {
      setHouseholds(
        households.map((h) =>
          h.id === editingHousehold.id
            ? { ...formData as Household, id: h.id }
            : h
        )
      );

      // Update animals for this household
      const houseNumber = editingHousehold.houseNumber;

      // Remove old animals for this household
      const filteredAnimals = householdAnimals.filter(
        (ha) => ha.houseNumber !== houseNumber
      );

      // Add new animals
      const newAnimals = formAnimals
        .filter((fa) => fa.animalId && fa.count > 0)
        .map((fa) => ({
          houseNumber,
          animalId: parseInt(fa.animalId),
          count: fa.count,
        }));

      setHouseholdAnimals([...filteredAnimals, ...newAnimals]);
    } else {
      const newHousehold: Household = {
        ...formData as Household,
        id: Math.max(...households.map((h) => h.id), 0) + 1,
      };
      setHouseholds([...households, newHousehold]);

      // Add animals for new household
      if (formData.houseNumber) {
        const newAnimals = formAnimals
          .filter((fa) => fa.animalId && fa.count > 0)
          .map((fa) => ({
            houseNumber: formData.houseNumber!,
            animalId: parseInt(fa.animalId),
            count: fa.count,
          }));

        setHouseholdAnimals([...householdAnimals, ...newAnimals]);
      }
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

  const handleAnimalCountChange = (animalId: number, count: number) => {
    const existing = householdAnimals.find(
      (item) =>
        item.houseNumber === selectedHouseNumber && item.animalId === animalId
    );

    if (count === 0) {
      // Remove if count is 0
      setHouseholdAnimals(
        householdAnimals.filter(
          (item) =>
            !(
              item.houseNumber === selectedHouseNumber &&
              item.animalId === animalId
            )
        )
      );
    } else if (existing) {
      // Update existing
      setHouseholdAnimals(
        householdAnimals.map((item) =>
          item.houseNumber === selectedHouseNumber && item.animalId === animalId
            ? { ...item, count }
            : item
        )
      );
    } else {
      // Add new
      setHouseholdAnimals([
        ...householdAnimals,
        { houseNumber: selectedHouseNumber, animalId, count },
      ]);
    }
  };

  // Analytics calculations
  const electricityCount = households.filter((h) => h.electricity).length;
  const waterCount = households.filter((h) => h.water).length;
  const toiletCount = households.filter((h) => h.toilet).length;

  const utilitiesData = [
    { name: "Electricity", value: electricityCount },
    { name: "Water", value: waterCount },
    { name: "Toilet", value: toiletCount },
    { name: "None", value: households.length - Math.max(electricityCount, waterCount, toiletCount) },
  ].filter(item => item.value > 0);

  // Roof types distribution
  const roofTypeCounts = households.reduce((acc, h) => {
    if (h.roofType) {
      acc[h.roofType] = (acc[h.roofType] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const roofTypeData = Object.entries(roofTypeCounts).map(([name, value]) => ({
    name,
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
            Manage household address and property details
          </p>
        </div>
        <Button onClick={handleAdd} className="bg-slate-900 hover:bg-slate-800">
          <Plus className="h-4 w-4 mr-2" />
          {t("add")} Household
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="all-households" className="gap-2">
            <List className="h-4 w-4" />
            All Households
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-blue-600 text-white border-blue-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Home className="h-10 w-10 text-white/90" />
                  <div>
                    <p className="text-sm text-blue-100">Total Households</p>
                    <p className="text-3xl font-bold">{households.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-green-600 text-white border-green-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <p className="text-sm text-green-100">Electricity</p>
                    <p className="text-3xl font-bold">{electricityCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-orange-600 text-white border-orange-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <span className="text-2xl">💧</span>
                  </div>
                  <div>
                    <p className="text-sm text-orange-100">Water Supply</p>
                    <p className="text-3xl font-bold">{waterCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-purple-600 text-white border-purple-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <span className="text-2xl">🚽</span>
                  </div>
                  <div>
                    <p className="text-sm text-purple-100">Toilet Facility</p>
                    <p className="text-3xl font-bold">{toiletCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart - Utilities Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Utilities Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={utilitiesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {utilitiesData.map((entry, index) => (
                        <Cell
                          key={`utility-${entry.name}-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Bar Chart - Roof Types */}
            <Card>
              <CardHeader>
                <CardTitle>Roof Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={roofTypeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
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
              Add New Household
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
              Add Household
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
                      <TableHead>Members</TableHead>
                      <TableHead>Animals</TableHead>
                      <TableHead>{t("utilities")}</TableHead>
                      <TableHead>Housing</TableHead>
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
                                  Head: {head.fullName}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{household.telephone}</TableCell>
                          <TableCell>
                            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                              {members.length} members
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
                              <div>Roof: {household.roofType || "-"}</div>
                              <div>Wall: {household.wallType || "-"}</div>
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
                                onClick={() => handleDelete(household.id)}
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
                          No households found.
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
              {editingHousehold ? t("edit") : t("add")} Household
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
                      <SelectItem value="Tiles">Tiles</SelectItem>
                      <SelectItem value="Asbestos">Asbestos</SelectItem>
                      <SelectItem value="Metal">Metal</SelectItem>
                      <SelectItem value="Cadjan">Cadjan</SelectItem>
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
                      <SelectItem value="Brick">Brick</SelectItem>
                      <SelectItem value="Cement">Cement</SelectItem>
                      <SelectItem value="Wood">Wood</SelectItem>
                      <SelectItem value="Cadjan">Cadjan</SelectItem>
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
                      <SelectItem value="Cement">Cement</SelectItem>
                      <SelectItem value="Tiles">Tiles</SelectItem>
                      <SelectItem value="Earth">Earth</SelectItem>
                      <SelectItem value="Wood">Wood</SelectItem>
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
                  Add Animal
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
                            Select Animal
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
                          <Label className="text-xs text-gray-500">Count</Label>
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
              Manage Animals - House {selectedHouseNumber}
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-gray-600 mb-4">
              Select animals and enter the count for this household
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
                      <Label className="text-xs text-gray-500">Count:</Label>
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
              Household Details - {viewingHousehold?.houseNumber}
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-gray-600 mb-4">
              View detailed information about this household
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium">House Number</p>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-xs text-gray-500">:</Label>
                  <p className="font-medium">{viewingHousehold?.houseNumber}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium">Address</p>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-xs text-gray-500">:</Label>
                  <p className="font-medium">{viewingHousehold?.address}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium">Telephone</p>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-xs text-gray-500">:</Label>
                  <p className="font-medium">{viewingHousehold?.telephone}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium">Utilities</p>
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
                  <p className="font-medium">Housing Materials</p>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-xs text-gray-500">:</Label>
                  <div className="text-xs text-gray-600 space-y-0.5">
                    <div>Roof: {viewingHousehold?.roofType || "-"}</div>
                    <div>Wall: {viewingHousehold?.wallType || "-"}</div>
                    <div>Floor: {viewingHousehold?.floorType || "-"}</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium">Animals</p>
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
    </div>
  );
}