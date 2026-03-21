import { useState } from "react";
import { useTranslation } from "react-i18next";
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
  Legend,
} from "recharts";

export function PropertyLand() {
  const { t } = useTranslation();
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
    setUserId(property.userId || "");
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
        t("confirmDeleteProperty"),
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
      if (!formData.propertyType) errors.propertyType = t("propertyTypeRequired");
      if (!formData.oppuNumber) errors.oppuNumber = t("oppuNumberRequired");
      if (!formData.landSize) errors.landSize = t("landSizeRequired");
      if (!formData.ownership) errors.ownership = t("ownershipTypeRequired");
      if (userValidation !== "valid") errors.userId = t("validateNicPrompt");

      if (Object.keys(errors).length > 0) {
        (formData as any).__errors = errors;
        toast.error(t("fixFormErrors"));
        return;
      }
    }

    const { __errors, ...cleanForm } = formData as any;

    if (editingProperty) {
      const { id, createdAt, updatedAt, userId, ...rest } = (cleanForm as Property) as any; // Kept Property type
      await updateProperty(editingProperty.id, rest); // Kept updateProperty
      toast.success(t("propertyUpdated"));
    } else {
      const { id, createdAt, updatedAt, userId, ...rest } = (cleanForm as Property) as any; // Kept Property type
      await addProperty(rest); // Kept addProperty
      toast.success(t("propertyAdded"));
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
    name: t(name.toLowerCase()) || name,
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
      name: t(name.toLowerCase()) || name,
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
          <h1 className="text-3xl font-bold text-slate-900">{t("propertyLand")}</h1>
          <p className="text-slate-600 mt-1">{t("propertyLandDescription")}</p>
        </div>
        <Button onClick={handleAdd} className="bg-slate-900 hover:bg-slate-800">
          <Plus className="h-4 w-4 mr-2" />
          {t("add")} {t("property")}
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            {t("overview")}
          </TabsTrigger>
          <TabsTrigger value="property-details" className="gap-2">
            <List className="h-4 w-4" />
            {t("propertyDetails")}
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
                    <p className="text-xs font-semibold text-blue-600/80 uppercase tracking-wider mb-1">{t("totalProperties")}</p>
                    <p className="text-3xl font-bold text-slate-800">{properties.length}</p>
                    <p className="text-xs text-slate-500 mt-1">{t("recorded") || "Recorded"}</p>
                  </div>
                  <div className="bg-blue-500 p-3 rounded-2xl shadow-sm text-white">
                    <Landmark className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg hover:scale-[1.02] transition-all bg-gradient-to-br from-white to-emerald-50/50">
               <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-emerald-600/80 uppercase tracking-wider mb-1">{t("propertyTypes")}</p>
                      <p className="text-3xl font-bold text-slate-800">{Object.keys(propertyTypeCounts).length}</p>
                      <p className="text-xs text-slate-500 mt-1">{t("categories") || "Categories"}</p>
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
                      <p className="text-xs font-semibold text-amber-600/80 uppercase tracking-wider mb-1">{t("agriculturalUse")}</p>
                      <p className="text-3xl font-bold text-slate-800">{agriculturalUseCount}</p>
                      <p className="text-xs text-slate-500 mt-1">{t("properties") || "Properties"}</p>
                    </div>
                    <div className="bg-amber-500 p-3 rounded-2xl shadow-sm text-white">
                      <Landmark className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg hover:scale-[1.02] transition-all bg-gradient-to-br from-white to-purple-50/50">
               <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-purple-600/80 uppercase tracking-wider mb-1">{t("uniqueOwners")}</p>
                      <p className="text-3xl font-bold text-slate-800">{new Set(properties.map((p) => p.ownerName)).size}</p>
                      <p className="text-xs text-slate-500 mt-1">{t("owners") || "Owners"}</p>
                    </div>
                    <div className="bg-purple-500 p-3 rounded-2xl shadow-sm text-white">
                      <Users className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart - Property Types */}
            <Card className="hover:shadow-md transition-all border-slate-200">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                <CardTitle className="text-lg text-slate-800 font-semibold">{t("propertyDistributionByType")}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={propertyTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      dataKey="value"
                    >
                      {propertyTypeData.map((entry, index) => (
                        <Cell key={`property-type-${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Bar Chart - Ownership Types */}
            <Card className="hover:shadow-md transition-all border-slate-200">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                <CardTitle className="text-lg text-slate-800 font-semibold">{t("ownershipTypes")}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={ownershipChartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} />
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
              {t("addNewProperty")}
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
                placeholder={t("searchPropertyPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={handleAdd} className="bg-slate-900 hover:bg-slate-800">
              <Plus className="h-4 w-4 mr-2" />
              {t("add")} {t("property")}
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("owner")}</TableHead>
                      <TableHead>{t("oppuNumber")}</TableHead>
                      <TableHead>{t("propertyType")}</TableHead>
                      <TableHead>{t("landSize")}</TableHead>
                      <TableHead>{t("ownershipType")}</TableHead>
                      <TableHead>{t("agriculturalUse")}</TableHead>
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
                            {t(property.propertyType.toLowerCase()) || property.propertyType}
                          </span>
                        </TableCell>
                        <TableCell>
                          {property.landSize}
                        </TableCell>
                        <TableCell>
                          {t(property.ownership.toLowerCase()) || property.ownership}
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
                          {t("noPropertiesFound")}
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
              {editingProperty ? t("edit") : t("add")} {t("property")}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* NIC Validation Section */}
            <div className="space-y-2">
              <Label>{t("nicNumber")} *</Label>
              <div className="relative">
                <Input
                  value={userId}
                  onChange={(e) =>
                    handleUserIdChange(e.target.value)
                  }
                  placeholder={t("nicPlaceholder")}
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
                  {t("nicNotFound")}
                </p>
              )}
            </div>

            {/* User Details Display */}
            {userValidation === "valid" && validatedUser && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">
                  {t("validatedUserDetails")}
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-green-700 font-medium">
                      {t("name")}:
                    </p>
                    <p className="text-green-900">
                      {validatedUser.name}
                    </p>
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
                    <p className="text-green-900">
                      {validatedUser.address}
                    </p>
                  </div>
                  <div>
                    <p className="text-green-700 font-medium">
                      {t("phone")}:
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
                  {t("propertyCategory")} *
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
                      <p className="font-medium">{t("livingProperty")}</p>
                      <p className="text-xs mt-1 opacity-80">
                        {t("primaryResidence")}
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
                      <p className="font-medium">{t("additionalProperty")}</p>
                      <p className="text-xs mt-1 opacity-80">
                        {t("investmentProperty")}
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
                    {t("propertyInformation")}
                  </h4>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>{t("propertyType")} *</Label>
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
                            <SelectValue placeholder={t("selectPropertyType")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Land">
                              {t("land")}
                            </SelectItem>
                            <SelectItem value="House">
                              {t("house")}
                            </SelectItem>
                            <SelectItem value="Commercial">
                              {t("commercial")}
                            </SelectItem>
                            <SelectItem value="Agricultural">
                              {t("agricultural")}
                            </SelectItem>
                            <SelectItem value="Other">
                              {t("other")}
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
                        <Label>{t("oppuNumber")} *</Label>
                        <Input
                          value={formData.oppuNumber || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              oppuNumber: e.target.value,
                            })
                          }
                          placeholder={t("oppuNumberPlaceholder")}
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
                        <Label>{t("landSize")} *</Label>
                        <Input
                          value={formData.landSize || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              landSize: e.target.value,
                            })
                          }
                          placeholder={t("landSizePlaceholder")}
                        />
                        {(formData as any).__errors?.landSize && (
                          <p className="text-xs text-red-500">
                            {(formData as any).__errors.landSize}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>{t("ownershipType")} *</Label>
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
                            <SelectValue placeholder={t("selectOwnership")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Private">
                              {t("private")}
                            </SelectItem>
                            <SelectItem value="Government">
                              {t("government")}
                            </SelectItem>
                            <SelectItem value="Grant">
                              {t("grant")}
                            </SelectItem>
                            <SelectItem value="Permit">
                              {t("permit")}
                            </SelectItem>
                            <SelectItem value="Leasehold">
                              {t("leasehold")}
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
                      <Label>{t("agriculturalUse")}</Label>
                      <Textarea
                        value={formData.agriculturalUse || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            agriculturalUse: e.target.value,
                          })
                        }
                        placeholder={t("paddyFarmingPlaceholder")}
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
              {t("propertyDetails")} — {viewingProperty?.oppuNumber}
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-gray-600 mb-4">
              {t("viewDetailedPropertyInfo")}
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium">{t("ownerName")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-xs text-gray-500">:</Label>
                  <p className="font-medium">{viewingProperty?.ownerName}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium">{t("oppuNumber")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-xs text-gray-500">:</Label>
                  <p className="font-mono font-semibold">{viewingProperty?.oppuNumber}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium">{t("propertyType")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-xs text-gray-500">:</Label>
                  <span className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-full">
                    {viewingProperty?.propertyType ? t(viewingProperty.propertyType.toLowerCase()) : "-"}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium">{t("propertyCategory")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-xs text-gray-500">:</Label>
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    viewingProperty?.propertyCategory === "living"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-orange-100 text-orange-700"
                  }`}>
                    {viewingProperty?.propertyCategory === "living" ? t("livingProperty") : t("additionalProperty")}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium">{t("landSize")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-xs text-gray-500">:</Label>
                  <p className="font-medium">{viewingProperty?.landSize}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium">{t("ownership")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-xs text-gray-500">:</Label>
                  <p className="font-medium">{viewingProperty?.ownership ? t(viewingProperty.ownership.toLowerCase()) : "-"}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium">{t("agriculturalUse")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-xs text-gray-500">:</Label>
                  <p className="font-medium">{viewingProperty?.agriculturalUse || "-"}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium">{t("ownerAddress")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-xs text-gray-500">:</Label>
                  <p className="font-medium">{viewingProperty?.ownerAddress}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium">{t("houseNumber")}</p>
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
              {t("close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}