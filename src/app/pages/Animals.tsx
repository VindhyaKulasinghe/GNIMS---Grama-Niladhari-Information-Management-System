import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHouseholdData, Animal } from "../context/HouseholdDataContext";
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
  DialogFooter,
} from "../components/ui/dialog";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  PawPrint,
  BarChart3,
  List,
  Home,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
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

export function Animals() {
  const { t } = useTranslation();
  const { animals, householdAnimals, addAnimal, updateAnimal, deleteAnimal } =
    useHouseholdData();
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [animalToDelete, setAnimalToDelete] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Animal>>({});

  // View dialog state
  const [viewDialog, setViewDialog] = useState(false);
  const [viewingAnimal, setViewingAnimal] = useState<Animal | null>(null);

  // Loading states
  const [savingAnimal, setSavingAnimal] = useState(false);
  const [deletingAnimal, setDeletingAnimal] = useState(false);

  const filteredAnimals = animals.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAdd = () => {
    setEditingAnimal(null);
    setFormData({});
    setDialogOpen(true);
  };

  const handleEdit = (animal: Animal) => {
    setEditingAnimal(animal);
    setFormData(animal);
    setDialogOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setAnimalToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (animalToDelete !== null) {
      setDeletingAnimal(true);
      try {
        await deleteAnimal(animalToDelete);
        toast.success(
          t("animalDeleted") || "Animal type deleted successfully.",
        );
        setDeleteDialogOpen(false);
        setAnimalToDelete(null);
      } finally {
        setDeletingAnimal(false);
      }
    }
  };

  const handleSave = async () => {
    setSavingAnimal(true);
    try {
      const errors: { [key: string]: string } = {};
      if (!formData.name) errors.name = t("animalNameRequired");
      if (!formData.category) errors.category = t("categoryRequired");

      if (Object.keys(errors).length > 0) {
        (formData as any).__errors = errors;
        toast.error(t("fillRequiredFields"));
        return;
      }

      const { __errors, ...cleanForm } = formData as any;

      if (editingAnimal) {
        const { id, createdAt, updatedAt, ...rest } =
          cleanForm as Animal as any;
        await updateAnimal(editingAnimal.id, rest);
        toast.success(t("animalTypeUpdated"));
      } else {
        const { id, createdAt, updatedAt, ...rest } =
          cleanForm as Animal as any;
        await addAnimal(rest);
        toast.success(t("animalTypeAdded"));
      }
      setDialogOpen(false);
    } finally {
      setSavingAnimal(false);
    }
  };

  // Analytics calculations
  const categoryCounts = animals.reduce(
    (acc, animal) => {
      acc[animal.category] = (acc[animal.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({
    name: t(name.toLowerCase().replace(" ", "")) || name,
    value,
  }));

  // Calculate total animals in households
  const animalPopulation = animals
    .map((animal) => {
      const total = householdAnimals
        .filter((ha) => ha.animalId === animal.id)
        .reduce((sum, ha) => sum + ha.count, 0);
      return {
        name: animal.name,
        count: total,
        category: animal.category,
      };
    })
    .filter((a) => a.count > 0);

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
          <h1 className="text-3xl font-bold text-slate-900">
            {t("animalManagement")}
          </h1>
          <p className="text-slate-600 mt-1">{t("animalManagementSubtitle")}</p>
        </div>
        <Button onClick={handleAdd} className="bg-slate-900 hover:bg-slate-800">
          <Plus className="h-4 w-4 mr-2" />
          {t("addAnimalType")}
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            {t("overview")}
          </TabsTrigger>
          <TabsTrigger value="all-animals" className="gap-2">
            <List className="h-4 w-4" />
            {t("allAnimals")}
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
                      {t("totalTypes")}
                    </p>
                    <p className="text-3xl font-bold text-slate-800">
                      {animals.length}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {t("tracked") || "Tracked"}
                    </p>
                  </div>
                  <div className="bg-blue-500 p-3 rounded-2xl shadow-sm text-white">
                    <PawPrint className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg hover:scale-[1.02] transition-all bg-gradient-to-br from-white to-emerald-50/50">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-emerald-600/80 uppercase tracking-wider mb-1">
                      {t("categories")}
                    </p>
                    <p className="text-3xl font-bold text-slate-800">
                      {Object.keys(categoryCounts).length}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {t("categories")}
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
                      {t("totalPopulation")}
                    </p>
                    <p className="text-3xl font-bold text-slate-800">
                      {householdAnimals.reduce((sum, ha) => sum + ha.count, 0)}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {t("totalPopulation")}
                    </p>
                  </div>
                  <div className="bg-amber-500 p-3 rounded-2xl shadow-sm text-white">
                    <PawPrint className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg hover:scale-[1.02] transition-all bg-gradient-to-br from-white to-purple-50/50">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-purple-600/80 uppercase tracking-wider mb-1">
                      {t("householdsWithAnimals")}
                    </p>
                    <p className="text-3xl font-bold text-slate-800">
                      {
                        new Set(householdAnimals.map((ha) => ha.houseNumber))
                          .size
                      }
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {t("households")}
                    </p>
                  </div>
                  <div className="bg-purple-500 p-3 rounded-2xl shadow-sm text-white">
                    <Home className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart - Animal Types by Category */}
            <Card className="hover:shadow-md transition-all border-slate-200">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                <CardTitle className="text-lg text-slate-800 font-semibold">
                  {t("animalTypesByCategory")}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
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
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`animal-category-cell-${index}`}
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

            {/* Bar Chart - Animal Population */}
            <Card className="hover:shadow-md transition-all border-slate-200">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                <CardTitle className="text-lg text-slate-800 font-semibold">
                  {t("animalPopulationDistribution")}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={animalPopulation}
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

          {/* Individual Animal Detail Cards */}
          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              {t("animalDetailsByType")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {animals.map((animal) => {
                const totalCount = householdAnimals
                  .filter((ha) => ha.animalId === animal.id)
                  .reduce((sum, ha) => sum + ha.count, 0);
                const householdCount = householdAnimals.filter(
                  (ha) => ha.animalId === animal.id,
                ).length;

                return (
                  <Card
                    key={animal.id}
                    className="border-slate-200 hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                            <PawPrint className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900">
                              {animal.name}
                            </h4>
                            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                              {t(
                                animal.category.toLowerCase().replace(" ", ""),
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100">
                        <div>
                          <p className="text-xs text-slate-600">
                            {t("totalCount")}
                          </p>
                          <p className="text-2xl font-bold text-blue-600">
                            {totalCount}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600">
                            {t("households")}
                          </p>
                          <p className="text-2xl font-bold text-orange-600">
                            {householdCount}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button
              onClick={handleAdd}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <Plus className="h-5 w-5" />
              {t("addNewAnimalType")}
            </Button>
          </div>
        </TabsContent>

        {/* All Animals Tab */}
        <TabsContent value="all-animals" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder={t("searchAnimalsPlaceholder")}
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
              {t("addAnimalType")}
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("animalName")}</TableHead>
                      <TableHead>{t("category")}</TableHead>
                      <TableHead className="text-right">
                        {t("totalInDivision")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("households")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("actions")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAnimals.map((animal) => {
                      const totalCount = householdAnimals
                        .filter((ha) => ha.animalId === animal.id)
                        .reduce((sum, ha) => sum + ha.count, 0);
                      const householdCount = householdAnimals.filter(
                        (ha) => ha.animalId === animal.id,
                      ).length;

                      return (
                        <TableRow
                          key={animal.id}
                          className="cursor-pointer hover:bg-blue-50"
                          onClick={(e) => {
                            // Don't trigger if clicking on buttons
                            if ((e.target as HTMLElement).closest("button"))
                              return;
                            setViewingAnimal(animal);
                            setViewDialog(true);
                          }}
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <PawPrint className="h-4 w-4 text-slate-600" />
                              {animal.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
                              {t(
                                animal.category.toLowerCase().replace(" ", ""),
                              )}
                            </span>
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {totalCount}
                          </TableCell>
                          <TableCell className="text-right text-slate-600">
                            {householdCount}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-1 justify-end">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(animal)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteClick(animal.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {filteredAnimals.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center text-slate-400 py-8"
                        >
                          {t("noAnimalsFound")}
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
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingAnimal ? t("edit") : t("add")} {t("animalType")}
            </DialogTitle>
            <p className="text-sm text-slate-600">{t("defineAnimalType")}</p>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>{t("animalName")} *</Label>
              <Input
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g. Horse, Rabbit, Duck"
              />
              {(formData as any).__errors?.name && (
                <p className="text-xs text-red-500">
                  {(formData as any).__errors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t("category")} *</Label>
              <Select
                value={formData.category}
                onValueChange={(val) =>
                  setFormData({ ...formData, category: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("selectCategory")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Livestock">{t("livestock")}</SelectItem>
                  <SelectItem value="Poultry">{t("poultry")}</SelectItem>
                  <SelectItem value="Pets">{t("pets")}</SelectItem>
                  <SelectItem value="Small Animals">
                    {t("smallAnimals")}
                  </SelectItem>
                  <SelectItem value="Other">{t("other")}</SelectItem>
                </SelectContent>
              </Select>
              {(formData as any).__errors?.category && (
                <p className="text-xs text-red-500">
                  {(formData as any).__errors.category}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {t("cancel")}
            </Button>
            <Button
              onClick={handleSave}
              disabled={savingAnimal}
              className="bg-slate-900 hover:bg-slate-800"
            >
              {savingAnimal && <Loader2 className="h-4 w-4 animate-spin" />}
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
              {t("details")} - {viewingAnimal?.name}
            </DialogTitle>
            <p className="text-sm text-slate-600">{t("viewDetailedInfo")}</p>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-gray-600 mb-4">
              View detailed information about this animal type
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium">{t("animalName")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-xs text-gray-500">:</Label>
                  <p className="font-medium">{viewingAnimal?.name}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium">{t("category")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-xs text-gray-500">:</Label>
                  <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
                    {viewingAnimal?.category}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium">{t("totalPopulation")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-xs text-gray-500">:</Label>
                  <p className="font-semibold text-xl text-blue-600">
                    {householdAnimals
                      .filter((ha) => ha.animalId === viewingAnimal?.id)
                      .reduce((sum, ha) => sum + ha.count, 0)}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium">{t("householdsWithAnimals")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-xs text-gray-500">:</Label>
                  <p className="font-semibold text-xl text-orange-600">
                    {
                      householdAnimals.filter(
                        (ha) => ha.animalId === viewingAnimal?.id,
                      ).length
                    }
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
            <p className="text-gray-600 text-sm">
              {t("confirmDeleteAnimalType")}
            </p>
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
              disabled={deletingAnimal}
            >
              {deletingAnimal && <Loader2 className="h-4 w-4 animate-spin" />}
              {t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
