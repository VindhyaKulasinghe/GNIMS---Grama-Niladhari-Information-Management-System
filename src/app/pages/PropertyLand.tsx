import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { toast } from "sonner";
import {
  useHouseholdData,
  Property,
} from "../context/HouseholdDataContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
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
  Landmark,
  BarChart3,
  List,
  Check,
  Loader2,
  AlertCircle,
  Users,
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
  ResponsiveContainer,
} from "recharts";

export function PropertyLand() {
  const { t } = useLanguage();
  const {
    properties,
    addProperty,
    updateProperty,
    deleteProperty,
    familyMembers,
    households,
  } = useHouseholdData();
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] =
    useState<Property | null>(null);
  const [formData, setFormData] = useState<Partial<Property>>(
    {},
  );
  const [userId, setUserId] = useState("");
  const [userValidation, setUserValidation] = useState<
    "idle" | "validating" | "valid" | "invalid"
  >("idle");
  const [validatedUser, setValidatedUser] = useState<any>(null);
  
  // View dialog state
  const [viewDialog, setViewDialog] = useState(false);
  const [viewingProperty, setViewingProperty] = useState<Property | null>(null);

  const filteredProperties = properties.filter(
    (p) =>
      p.ownerName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      p.oppuNumber
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      p.propertyType
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  const handleAdd = () => {
    setEditingProperty(null);
    setFormData({ propertyCategory: "living" }); // Default to "living"
    setUserId("");
    setUserValidation("idle");
    setValidatedUser(null);
    setDialogOpen(true);
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setFormData(property);
    setUserId(property.userId);
    // Auto-validate for editing
    const member = familyMembers.find(
      (m) => m.id.toString() === property.userId,
    );
    if (member) {
      setUserValidation("valid");
      const household = households.find(
        (h) => h.houseNumber === member.houseNumber,
      );
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
    if (
      confirm(
        "Are you sure you want to delete this property record?",
      )
    ) {
      await deleteProperty(id);
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
      const member = familyMembers.find(
        (m) => m.nicNumber === value,
      );
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
    const errors: { [key: string]: string } = {};

    if (
      !formData.propertyType ||
      !formData.oppuNumber ||
      !formData.landSize ||
      !formData.ownership ||
      userValidation !== "valid"
    ) {
      if (!formData.propertyType) errors.propertyType = "Property type is required";
      if (!formData.oppuNumber) errors.oppuNumber = "OPPU number is required";
      if (!formData.landSize) errors.landSize = "Land size is required";
      if (!formData.ownership) errors.ownership = "Ownership type is required";
      if (userValidation !== "valid") errors.userId = "Please validate the NIC before saving";

      (formData as any).__errors = errors;
      toast.error("Please fix the highlighted property form errors.");
      return;
    }

    const { __errors, ...cleanForm } = formData as any;

    if (editingProperty) {
      const { id, createdAt, updatedAt, userId, ...rest } = (cleanForm as Property) as any;
      await updateProperty(editingProperty.id, rest);
      toast.success("Property updated successfully.");
    } else {
      const { id, createdAt, updatedAt, userId, ...rest } = (cleanForm as Property) as any;
      await addProperty(rest);
      toast.success("Property added successfully.");
    }
    setDialogOpen(false);
  };

  // Analytics calculations
  const propertyTypeCounts = properties.reduce(
    (acc, property) => {
      acc[property.propertyType] =
        (acc[property.propertyType] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const propertyTypeData = Object.entries(
    propertyTypeCounts,
  ).map(([name, value]) => ({
    name,
    value,
  }));

  const ownershipData = properties.reduce(
    (acc, property) => {
      acc[property.ownership] =
        (acc[property.ownership] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const ownershipChartData = Object.entries(ownershipData).map(
    ([name, value]) => ({
      name,
      value,
    }),
  );

  const agriculturalUseCount = properties.filter(
    (p) => p.agriculturalUse && p.agriculturalUse !== "None",
  ).length;

  const COLORS = [
    "#3b82f6", // Blue
    "#10b981", // Green
    "#f59e0b", // Orange
    "#8b5cf6", // Purple
    "#ef4444", // Red
    "#06b6d4", // Cyan
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {t("propertyLand")}
          </h1>
          <p className="text-slate-600 mt-1">
            Property and land ownership management system
          </p>
        </div>
        <Button
          onClick={handleAdd}
          className="bg-slate-900 hover:bg-slate-800"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t("add")} Property
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="property-details"
            className="gap-2"
          >
            <List className="h-4 w-4" />
            Property Details
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-blue-600 text-white border-blue-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Landmark className="h-10 w-10 text-white/90" />
                  <div>
                    <p className="text-sm text-blue-100">
                      Total Properties
                    </p>
                    <p className="text-3xl font-bold">
                      {properties.length}
                    </p>
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
                    <p className="text-sm text-green-100">
                      Property Types
                    </p>
                    <p className="text-3xl font-bold">
                      {Object.keys(propertyTypeCounts).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-orange-600 text-white border-orange-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <Landmark className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-orange-100">
                      Agricultural Use
                    </p>
                    <p className="text-3xl font-bold">
                      {agriculturalUseCount}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-purple-600 text-white border-purple-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-purple-100">
                      Unique Owners
                    </p>
                    <p className="text-3xl font-bold">
                      {
                        new Set(
                          properties.map((p) => p.ownerName),
                        ).size
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart - Property Types */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Property Distribution by Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={propertyTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) =>
                        `${name}: ${value}`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {propertyTypeData.map((entry, index) => (
                        <Cell
                          key={`property-type-${entry.name}-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Bar Chart - Ownership Types */}
            <Card>
              <CardHeader>
                <CardTitle>Ownership Types</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={ownershipChartData}>
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
              Add New Property
            </Button>
          </div>
        </TabsContent>

        {/* Property Details Tab */}
        <TabsContent
          value="property-details"
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder={`${t("search")} by owner, oppu number, or property type...`}
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
              Add Property
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Owner</TableHead>
                      <TableHead>Oppu Number</TableHead>
                      <TableHead>Property Type</TableHead>
                      <TableHead>Land Size</TableHead>
                      <TableHead>Ownership</TableHead>
                      <TableHead>Agricultural Use</TableHead>
                      <TableHead className="text-right">
                        {t("actions")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProperties.map((property) => (
                      <TableRow 
                        key={property.id}
                        className="cursor-pointer hover:bg-blue-50"
                        onClick={(e) => {
                          // Don't trigger if clicking on buttons
                          if ((e.target as HTMLElement).closest('button')) return;
                          setViewingProperty(property);
                          setViewDialog(true);
                        }}
                      >
                        <TableCell className="font-medium">
                          {property.ownerName}
                        </TableCell>
                        <TableCell className="font-mono">
                          {property.oppuNumber}
                        </TableCell>
                        <TableCell>
                          <span className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-full">
                            {property.propertyType}
                          </span>
                        </TableCell>
                        <TableCell>
                          {property.landSize}
                        </TableCell>
                        <TableCell>
                          {property.ownership}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {property.agriculturalUse}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleEdit(property)
                              }
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDelete(property.id)
                              }
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredProperties.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center text-slate-400 py-8"
                        >
                          No properties found.
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
              {editingProperty ? t("edit") : t("add")} Property
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* NIC Validation Section */}
            <div className="space-y-2">
              <Label>NIC Number *</Label>
              <div className="relative">
                <Input
                  value={userId}
                  onChange={(e) =>
                    handleUserIdChange(e.target.value)
                  }
                  placeholder="Enter NIC (e.g., 850123456V or 198512300890)"
                  disabled={!!editingProperty}
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
                <p className="text-sm text-red-500">
                  NIC not found. Please enter a valid family member NIC.
                </p>
              )}
            </div>

            {/* User Details Display */}
            {userValidation === "valid" && validatedUser && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">
                  Validated User Details
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-green-700 font-medium">
                      Name:
                    </p>
                    <p className="text-green-900">
                      {validatedUser.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-green-700 font-medium">
                      House Number:
                    </p>
                    <p className="text-green-900">
                      {validatedUser.houseNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-green-700 font-medium">
                      Address:
                    </p>
                    <p className="text-green-900">
                      {validatedUser.address}
                    </p>
                  </div>
                  <div>
                    <p className="text-green-700 font-medium">
                      Phone:
                    </p>
                    <p className="text-green-900">
                      {validatedUser.phone}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Property Category Selector */}
            {userValidation === "valid" && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <Label className="text-base font-semibold text-slate-900 mb-3 block">
                  Property Category *
                </Label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        propertyCategory: "living",
                      })
                    }
                    className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                      formData.propertyCategory === "living"
                        ? "border-blue-500 bg-blue-50 text-blue-700 font-semibold shadow-sm"
                        : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                    }`}
                  >
                    <div className="text-center">
                      <p className="font-medium">Living Property</p>
                      <p className="text-xs mt-1 opacity-80">
                        Primary residence or living space
                      </p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        propertyCategory: "additional",
                      })
                    }
                    className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                      formData.propertyCategory === "additional"
                        ? "border-orange-500 bg-orange-50 text-orange-700 font-semibold shadow-sm"
                        : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                    }`}
                  >
                    <div className="text-center">
                      <p className="font-medium">Additional Property</p>
                      <p className="text-xs mt-1 opacity-80">
                        Additional land or investment property
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Property Details Section */}
            {userValidation === "valid" && (
              <>
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-slate-900 mb-4">
                    Property Information
                  </h4>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Property Type *</Label>
                        <Select
                          value={formData.propertyType}
                          onValueChange={(val) =>
                            setFormData({
                              ...formData,
                              propertyType: val,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select property type..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Land">
                              Land
                            </SelectItem>
                            <SelectItem value="House">
                              House
                            </SelectItem>
                            <SelectItem value="Commercial">
                              Commercial
                            </SelectItem>
                            <SelectItem value="Agricultural">
                              Agricultural
                            </SelectItem>
                            <SelectItem value="Other">
                              Other
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {(formData as any).__errors?.propertyType && (
                          <p className="text-xs text-red-500">
                            {(formData as any).__errors.propertyType}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Oppu Number *</Label>
                        <Input
                          value={formData.oppuNumber || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              oppuNumber: e.target.value,
                            })
                          }
                          placeholder="e.g., OPPU12345"
                        />
                        {(formData as any).__errors?.oppuNumber && (
                          <p className="text-xs text-red-500">
                            {(formData as any).__errors.oppuNumber}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Land Size *</Label>
                        <Input
                          value={formData.landSize || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              landSize: e.target.value,
                            })
                          }
                          placeholder="e.g., 5 acres, 30 perches"
                        />
                        {(formData as any).__errors?.landSize && (
                          <p className="text-xs text-red-500">
                            {(formData as any).__errors.landSize}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Ownership Type *</Label>
                        <Select
                          value={formData.ownership}
                          onValueChange={(val) =>
                            setFormData({
                              ...formData,
                              ownership: val,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select ownership..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Private">
                              Private
                            </SelectItem>
                            <SelectItem value="Leasehold">
                              Leasehold
                            </SelectItem>
                            <SelectItem value="Government">
                              Government
                            </SelectItem>
                            <SelectItem value="Other">
                              Other
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {(formData as any).__errors?.ownership && (
                          <p className="text-xs text-red-500">
                            {(formData as any).__errors.ownership}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Agricultural Use</Label>
                      <Textarea
                        value={formData.agriculturalUse || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            agriculturalUse: e.target.value,
                          })
                        }
                        placeholder="e.g., Paddy farming, Coconut plantation, Vegetable cultivation"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
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
              Property Details - {viewingProperty?.oppuNumber}
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-gray-600 mb-4">
              View detailed information about this property
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium">Owner Name</p>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-xs text-gray-500">:</Label>
                  <p className="font-medium">{viewingProperty?.ownerName}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium">Oppu Number</p>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-xs text-gray-500">:</Label>
                  <p className="font-mono font-semibold">{viewingProperty?.oppuNumber}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium">Property Type</p>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-xs text-gray-500">:</Label>
                  <span className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-full">
                    {viewingProperty?.propertyType}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium">Property Category</p>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-xs text-gray-500">:</Label>
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    viewingProperty?.propertyCategory === "living"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-orange-100 text-orange-700"
                  }`}>
                    {viewingProperty?.propertyCategory === "living" ? "Living Property" : "Additional Property"}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium">Land Size</p>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-xs text-gray-500">:</Label>
                  <p className="font-medium">{viewingProperty?.landSize}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium">Ownership</p>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-xs text-gray-500">:</Label>
                  <p className="font-medium">{viewingProperty?.ownership}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium">Agricultural Use</p>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-xs text-gray-500">:</Label>
                  <p className="font-medium">{viewingProperty?.agriculturalUse || "-"}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium">Owner Address</p>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-xs text-gray-500">:</Label>
                  <p className="font-medium">{viewingProperty?.ownerAddress}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium">House Number</p>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-xs text-gray-500">:</Label>
                  <p className="font-mono font-semibold">{viewingProperty?.houseNumber}</p>
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