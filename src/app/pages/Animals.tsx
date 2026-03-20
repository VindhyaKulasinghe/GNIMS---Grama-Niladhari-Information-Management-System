import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useHouseholdData, Animal } from "../context/HouseholdDataContext";
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
import { Plus, Pencil, Trash2, Search, PawPrint, BarChart3, List } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export function Animals() {
  const { t } = useLanguage();
  const { animals, householdAnimals, addAnimal, updateAnimal, deleteAnimal } = useHouseholdData();
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null);
  const [formData, setFormData] = useState<Partial<Animal>>({});
  
  // View dialog state
  const [viewDialog, setViewDialog] = useState(false);
  const [viewingAnimal, setViewingAnimal] = useState<Animal | null>(null);

  const filteredAnimals = animals.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase())
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

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this animal type?")) {
      await deleteAnimal(id);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.category) {
      alert("Please fill in all required fields");
      return;
    }

    if (editingAnimal) {
      const { id, createdAt, updatedAt, ...rest } = (formData as Animal) as any;
      await updateAnimal(editingAnimal.id, rest);
    } else {
      const { id, createdAt, updatedAt, ...rest } = (formData as Animal) as any;
      await addAnimal(rest);
    }
    setDialogOpen(false);
  };

  // Analytics calculations
  const categoryCounts = animals.reduce((acc, animal) => {
    acc[animal.category] = (acc[animal.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({
    name,
    value,
  }));

  // Calculate total animals in households
  const animalPopulation = animals.map(animal => {
    const total = householdAnimals
      .filter(ha => ha.animalId === animal.id)
      .reduce((sum, ha) => sum + ha.count, 0);
    return {
      name: animal.name,
      count: total,
      category: animal.category,
    };
  }).filter(a => a.count > 0);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {t("animalManagement")}
          </h1>
          <p className="text-slate-600 mt-1">
            Manage and analyze animal distribution across households
          </p>
        </div>
        <Button onClick={handleAdd} className="bg-slate-900 hover:bg-slate-800">
          <Plus className="h-4 w-4 mr-2" />
          {t("add")} Animal Type
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="all-animals" className="gap-2">
            <List className="h-4 w-4" />
            All Animals
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-blue-600 text-white border-blue-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <PawPrint className="h-10 w-10 text-white/90" />
                  <div>
                    <p className="text-sm text-blue-100">Total Types</p>
                    <p className="text-3xl font-bold">{animals.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-green-600 text-white border-green-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <span className="text-2xl font-bold">{Object.keys(categoryCounts).length}</span>
                  </div>
                  <div>
                    <p className="text-sm text-green-100">Categories</p>
                    <p className="text-xl font-semibold">Types</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-orange-600 text-white border-orange-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <span className="text-2xl font-bold">{householdAnimals.reduce((sum, ha) => sum + ha.count, 0)}</span>
                  </div>
                  <div>
                    <p className="text-sm text-orange-100">Total</p>
                    <p className="text-xl font-semibold">Population</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-purple-600 text-white border-purple-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <span className="text-2xl font-bold">{new Set(householdAnimals.map(ha => ha.houseNumber)).size}</span>
                  </div>
                  <div>
                    <p className="text-sm text-purple-100">Households</p>
                    <p className="text-xl font-semibold">with Animals</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart - Animal Types by Category */}
            <Card>
              <CardHeader>
                <CardTitle>Animal Types by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`animal-category-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Bar Chart - Animal Population */}
            <Card>
              <CardHeader>
                <CardTitle>Animal Population Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={animalPopulation}>
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

          {/* Individual Animal Detail Cards */}
          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Animal Details by Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {animals.map(animal => {
                const totalCount = householdAnimals
                  .filter(ha => ha.animalId === animal.id)
                  .reduce((sum, ha) => sum + ha.count, 0);
                const householdCount = householdAnimals.filter(ha => ha.animalId === animal.id).length;
                
                return (
                  <Card key={animal.id} className="border-slate-200 hover:shadow-lg transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                            <PawPrint className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900">{animal.name}</h4>
                            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                              {animal.category}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100">
                        <div>
                          <p className="text-xs text-slate-600">Total Count</p>
                          <p className="text-2xl font-bold text-blue-600">{totalCount}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600">Households</p>
                          <p className="text-2xl font-bold text-orange-600">{householdCount}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button onClick={handleAdd} variant="outline" size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Add New Animal Type
            </Button>
          </div>
        </TabsContent>

        {/* All Animals Tab */}
        <TabsContent value="all-animals" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder={`${t("search")} by animal name or category...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={handleAdd} className="bg-slate-900 hover:bg-slate-800">
              <Plus className="h-4 w-4 mr-2" />
              Add Animal
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Animal Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Total in Division</TableHead>
                      <TableHead className="text-right">Households</TableHead>
                      <TableHead className="text-right">{t("actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAnimals.map((animal) => {
                      const totalCount = householdAnimals
                        .filter(ha => ha.animalId === animal.id)
                        .reduce((sum, ha) => sum + ha.count, 0);
                      const householdCount = householdAnimals.filter(ha => ha.animalId === animal.id).length;
                      
                      return (
                        <TableRow 
                          key={animal.id}
                          className="cursor-pointer hover:bg-blue-50"
                          onClick={(e) => {
                            // Don't trigger if clicking on buttons
                            if ((e.target as HTMLElement).closest('button')) return;
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
                              {animal.category}
                            </span>
                          </TableCell>
                          <TableCell className="text-right font-semibold">{totalCount}</TableCell>
                          <TableCell className="text-right text-slate-600">{householdCount}</TableCell>
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
                                onClick={() => handleDelete(animal.id)}
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
                        <TableCell colSpan={5} className="text-center text-slate-400 py-8">
                          No animals found.
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
              {editingAnimal ? t("edit") : t("add")} Animal Type
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Animal Name *</Label>
              <Input
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g. Horse, Rabbit, Duck"
              />
            </div>

            <div className="space-y-2">
              <Label>Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(val) =>
                  setFormData({ ...formData, category: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Livestock">Livestock</SelectItem>
                  <SelectItem value="Poultry">Poultry</SelectItem>
                  <SelectItem value="Pets">Pets</SelectItem>
                  <SelectItem value="Small Animals">Small Animals</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={handleSave} className="bg-slate-900 hover:bg-slate-800">
              {t("save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialog} onOpenChange={setViewDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Animal Details - {viewingAnimal?.name}</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-gray-600 mb-4">
              View detailed information about this animal type
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium">Animal Name</p>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-xs text-gray-500">:</Label>
                  <p className="font-medium">{viewingAnimal?.name}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium">Category</p>
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
                  <p className="font-medium">Total Population</p>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-xs text-gray-500">:</Label>
                  <p className="font-semibold text-xl text-blue-600">
                    {householdAnimals
                      .filter(ha => ha.animalId === viewingAnimal?.id)
                      .reduce((sum, ha) => sum + ha.count, 0)}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium">Households with this Animal</p>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-xs text-gray-500">:</Label>
                  <p className="font-semibold text-xl text-orange-600">
                    {householdAnimals.filter(ha => ha.animalId === viewingAnimal?.id).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setViewDialog(false)} className="bg-blue-600 hover:bg-blue-700">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}