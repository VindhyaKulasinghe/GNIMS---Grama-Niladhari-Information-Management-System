import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  useHouseholdData,
  FamilyMember,
  MemberType,
  Household,
} from "../context/HouseholdDataContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
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
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  ArrowLeft,
  Home,
  Users,
  GraduationCap,
  UserCheck,
  Crown,
  BarChart3,
  List,
  Briefcase,
  Activity,
  Phone,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
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

type ViewState = "search" | "house";

const MEMBER_TYPE_CONFIG: Record<
  MemberType,
  { labelKey: string; color: string; icon: React.ReactNode }
> = {
  regular: {
    labelKey: "regular",
    color: "bg-gray-100 text-gray-700",
    icon: <Users className="h-3 w-3" />,
  },
  student: {
    labelKey: "student",
    color: "bg-blue-100 text-blue-700",
    icon: <GraduationCap className="h-3 w-3" />,
  },
  boarder: {
    labelKey: "boarder",
    color: "bg-amber-100 text-amber-700",
    icon: <UserCheck className="h-3 w-3" />,
  },
};

export function FamilyMembers() {
  const { t } = useTranslation();
  const {
    households,
    familyMembers,
    addFamilyMember,
    updateFamilyMember,
    deleteFamilyMember,
    getMembersForHouse,
  } = useHouseholdData();

  const [view, setView] = useState<ViewState>("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHouse, setSelectedHouse] = useState<Household | null>(null);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [formData, setFormData] = useState<Partial<FamilyMember>>({
    memberType: "regular",
    isHeadOfHousehold: false,
    nationality: "Sri Lankan",
    religion: "Buddhist",
    gender: "Male",
    maritalStatus: "Single",
    educationStatus: "Secondary",
  });
  const [activeTab, setActiveTab] = useState("personal");

  // View detail dialogs
  const [viewHouseDialog, setViewHouseDialog] = useState(false);
  const [viewingHouse, setViewingHouse] = useState<Household | null>(null);
  const [viewMemberDialog, setViewMemberDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<number | null>(null);

  // Loading states
  const [savingMember, setSavingMember] = useState(false);
  const [deletingMember, setDeletingMember] = useState(false);
  const [viewingMember, setViewingMember] = useState<FamilyMember | null>(null);

  // Filtered houses in search view
  const filteredHouses = households.filter(
    (h) =>
      h.houseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.address.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Members of selected house
  const houseMembers = selectedHouse
    ? getMembersForHouse(selectedHouse.houseNumber)
    : [];

  const headOfHouse = houseMembers.find((m) => m.isHeadOfHousehold);

  const calculateAge = (birthYear: number) => 2026 - birthYear;

  // ---- House selection ----
  const handleSelectHouse = (house: Household) => {
    setSelectedHouse(house);
    setView("house");
    setSearchQuery("");
  };

  // ---- Add member ----
  const handleAddMember = () => {
    if (!selectedHouse) return;
    setEditingMember(null);
    const nextNum = (getMembersForHouse(selectedHouse.houseNumber).length + 1)
      .toString()
      .padStart(3, "0");
    const autoUniqueNum = `${selectedHouse.houseNumber.replace(/\//g, "")}-${nextNum}`;
    setFormData({
      houseNumber: selectedHouse.houseNumber,
      uniqueNumber: autoUniqueNum,
      memberType: "regular",
      isHeadOfHousehold: houseMembers.length === 0, // First member auto-marked as head
      nationality: "Sri Lankan",
      religion: "Buddhist",
      gender: "Male",
      maritalStatus: "Single",
      educationStatus: "Secondary",
    });
    setActiveTab("personal");
    setDialogOpen(true);
  };

  // ---- Edit member ----
  const handleEditMember = (member: FamilyMember) => {
    setEditingMember(member);
    setFormData(member);
    setActiveTab("personal");
    setDialogOpen(true);
  };

  // ---- Delete member ----
  const handleDeleteMemberClick = (id: number) => {
    setMemberToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (memberToDelete !== null) {
      setDeletingMember(true);
      try {
        await deleteFamilyMember(memberToDelete);
        toast.success(
          t("memberDeleted") || "Family member deleted successfully.",
        );
        setDeleteDialogOpen(false);
        setMemberToDelete(null);
      } finally {
        setDeletingMember(false);
      }
    }
  };

  // ---- Save member ----
  const handleSave = async () => {
    setSavingMember(true);
    try {
      const errors: { [key: string]: string } = {};

      if (!formData.nicNumber) {
        errors.nicNumber = t("nicRequired");
      } else if (!/^(\d{9}[VvXx]|\d{12})$/.test(formData.nicNumber)) {
        errors.nicNumber = t("nicInvalid");
      }

      if (!formData.birthYear) {
        errors.birthYear = t("birthYearRequired");
      }

      if (Object.keys(errors).length > 0) {
        toast.error(t("fixFormErrors"));
        (formData as any).__errors = errors;
        return;
      }

      const age = formData.birthYear ? calculateAge(formData.birthYear) : 0;

      const { __errors, ...cleanForm } = formData as any;
      const payload = { ...(cleanForm as FamilyMember), age };

      if (editingMember) {
        if (payload.isHeadOfHousehold) {
          const others = familyMembers.filter(
            (m) =>
              m.houseNumber === payload.houseNumber &&
              m.id !== editingMember.id,
          );
          await Promise.all(
            others.map((m) =>
              updateFamilyMember(m.id, { isHeadOfHousehold: false }),
            ),
          );
        }

        const { id, createdAt, updatedAt, ...rest } = payload as any;
        await updateFamilyMember(editingMember.id, rest);
        toast.success(t("memberUpdated"));
      } else {
        if (payload.isHeadOfHousehold) {
          const others = familyMembers.filter(
            (m) => m.houseNumber === payload.houseNumber,
          );
          await Promise.all(
            others.map((m) =>
              updateFamilyMember(m.id, { isHeadOfHousehold: false }),
            ),
          );
        }

        const { id, createdAt, updatedAt, ...rest } = payload as any;
        await addFamilyMember(rest);
        toast.success(t("memberAdded"));
      }
      setDialogOpen(false);
    } finally {
      setSavingMember(false);
    }
  };

  const memberTypeValue = formData.memberType as MemberType;

  // Analytics calculations for all members
  const totalMembers = familyMembers.length;
  const regularMembers = familyMembers.filter(
    (m) => m.memberType === "regular",
  ).length;
  const studentMembers = familyMembers.filter(
    (m) => m.memberType === "student",
  ).length;
  const boarderMembers = familyMembers.filter(
    (m) => m.memberType === "boarder",
  ).length;

  const workingAdults = familyMembers.filter(
    (m) => m.jobType && m.jobType.trim().length > 0,
  ).length;
  const dependentPopulation = familyMembers.filter(
    (m) => m.age <= 18 || m.age >= 60,
  ).length;

  const memberTypeData = [
    { name: t("regular"), value: regularMembers },
    { name: t("students"), value: studentMembers },
    { name: t("boarders"), value: boarderMembers },
  ].filter((item) => item.value > 0);

  const genderData = [
    {
      name: t("male"),
      value: familyMembers.filter((m) => m.gender === "Male").length,
    },
    {
      name: t("female"),
      value: familyMembers.filter((m) => m.gender === "Female").length,
    },
  ].filter((item) => item.value > 0);

  // Age distribution
  const ageRanges = {
    "0-17": 0,
    "18-35": 0,
    "36-50": 0,
    "51-65": 0,
    "66+": 0,
  };

  familyMembers.forEach((m) => {
    if (m.age <= 17) ageRanges["0-17"]++;
    else if (m.age <= 35) ageRanges["18-35"]++;
    else if (m.age <= 50) ageRanges["36-50"]++;
    else if (m.age <= 65) ageRanges["51-65"]++;
    else ageRanges["66+"]++;
  });

  const ageData = Object.entries(ageRanges)
    .map(([name, value]) => ({
      name,
      value,
    }))
    .filter((item) => item.value > 0);

  // Top households by member count
  const householdMemberCounts = households
    .map((h) => ({
      name: h.houseNumber,
      value: getMembersForHouse(h.houseNumber).length,
    }))
    .filter((h) => h.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

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
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {view === "house" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setView("search");
                setSelectedHouse(null);
                setSearchQuery("");
              }}
              className="text-blue-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {t("familyMembers")}
            </h1>
            <p className="text-slate-600 mt-1">
              {view === "search"
                ? t("manageFamilyMembersAcrossHouseholds")
                : `${t("house")} ${selectedHouse?.houseNumber} — ${selectedHouse?.address}`}
            </p>
          </div>
        </div>
        {view === "house" && (
          <Button
            onClick={handleAddMember}
            className="bg-slate-900 hover:bg-slate-800"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t("addMember")}
          </Button>
        )}
      </div>

      {/* SEARCH VIEW */}
      {view === "search" && (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              {t("overview")}
            </TabsTrigger>
            <TabsTrigger value="manage" className="gap-2">
              <List className="h-4 w-4" />
              {t("manageMembers")}
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
                        {t("totalMembers")}
                      </p>
                      <p className="text-3xl font-bold text-slate-800">
                        {totalMembers}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {t("population") || "Population"}
                      </p>
                    </div>
                    <div className="bg-blue-500 p-3 rounded-2xl shadow-sm text-white">
                      <Users className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg hover:scale-[1.02] transition-all bg-gradient-to-br from-white to-cyan-50/50">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-cyan-600/80 uppercase tracking-wider mb-1">
                        {t("activeStudents")}
                      </p>
                      <p className="text-3xl font-bold text-slate-800">
                        {studentMembers}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {t("students")}
                      </p>
                    </div>
                    <div className="bg-cyan-500 p-3 rounded-2xl shadow-sm text-white">
                      <GraduationCap className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg hover:scale-[1.02] transition-all bg-gradient-to-br from-white to-emerald-50/50">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-emerald-600/80 uppercase tracking-wider mb-1">
                        {t("workingAdults")}
                      </p>
                      <p className="text-3xl font-bold text-slate-800">
                        {workingAdults}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {t("employedResidents") || "Employed"}
                      </p>
                    </div>
                    <div className="bg-emerald-500 p-3 rounded-2xl shadow-sm text-white">
                      <Briefcase className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg hover:scale-[1.02] transition-all bg-gradient-to-br from-white to-amber-50/50">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-amber-600/80 uppercase tracking-wider mb-1">
                        {t("dependentPopulation")}
                      </p>
                      <p className="text-3xl font-bold text-slate-800">
                        {dependentPopulation}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        &lt;18 or &gt;60 {t("years")}
                      </p>
                    </div>
                    <div className="bg-amber-500 p-3 rounded-2xl shadow-sm text-white">
                      <Activity className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart - Member Types */}
              <Card className="hover:shadow-md transition-all border-slate-200">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                  <CardTitle className="text-lg text-slate-800 font-semibold">
                    {t("memberTypesDistribution")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={memberTypeData}
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
                        {memberTypeData.map((entry, index) => (
                          <Cell
                            key={`member-type-${entry.name}-${index}`}
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

              {/* Pie Chart - Gender Distribution */}
              <Card className="hover:shadow-md transition-all border-slate-200">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                  <CardTitle className="text-lg text-slate-800 font-semibold">
                    {t("genderDistribution")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={genderData}
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
                        {genderData.map((entry, index) => (
                          <Cell
                            key={`gender-${entry.name}-${index}`}
                            fill={index === 0 ? "#3b82f6" : "#ec4899"} // Male / Female colors
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
            </div>

            {/* Second Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bar Chart - Age Distribution */}
              {ageData.length > 0 && (
                <Card className="hover:shadow-md transition-all border-slate-200">
                  <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                    <CardTitle className="text-lg text-slate-800 font-semibold">
                      {t("ageDistribution")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={ageData}
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
                          dataKey="value"
                          fill="#3b82f6"
                          radius={[4, 4, 0, 0]}
                          maxBarSize={50}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}

              {/* Bar Chart - Top Households */}
              {householdMemberCounts.length > 0 && (
                <Card className="hover:shadow-md transition-all border-slate-200">
                  <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                    <CardTitle className="text-lg text-slate-800 font-semibold">
                      {t("topHouseholdsByMembers")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={householdMemberCounts}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          horizontal={false}
                          stroke="#e2e8f0"
                        />
                        <XAxis
                          type="number"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#64748b" }}
                        />
                        <YAxis
                          dataKey="name"
                          type="category"
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
                          dataKey="value"
                          fill="#10b981"
                          radius={[0, 4, 4, 0]}
                          maxBarSize={30}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Manage Members Tab */}
          <TabsContent value="manage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {t("searchByHouseNumberOrAddress")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={t("searchHousePlaceholder")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    autoFocus
                  />
                </div>
              </CardContent>
            </Card>

            {/* Households Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {searchQuery.length > 0
                    ? t("searchResults", { count: filteredHouses.length })
                    : t("allHouseholds")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(searchQuery.length > 0 ? filteredHouses : households)
                  .length === 0 ? (
                  <p className="text-center text-gray-400 py-6">
                    {t("noHousesFound", { searchQuery })}
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("houseNo")}</TableHead>
                        <TableHead>{t("address")}</TableHead>
                        <TableHead>{t("headOfHousehold")}</TableHead>
                        <TableHead>{t("members")}</TableHead>
                        <TableHead className="text-right">
                          {t("actions")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(searchQuery.length > 0
                        ? filteredHouses
                        : households
                      ).map((house) => {
                        const members = getMembersForHouse(house.houseNumber);
                        const head = members.find((m) => m.isHeadOfHousehold);
                        return (
                          <TableRow
                            key={house.id}
                            className="cursor-pointer hover:bg-blue-50"
                            onClick={(e) => {
                              // Don't trigger if clicking on the Manage button
                              if ((e.target as HTMLElement).closest("button"))
                                return;
                              setViewingHouse(house);
                              setViewHouseDialog(true);
                            }}
                          >
                            <TableCell className="font-medium text-blue-700">
                              {house.houseNumber}
                            </TableCell>
                            <TableCell>{house.address}</TableCell>
                            <TableCell>
                              {head ? (
                                <div className="flex items-center gap-1">
                                  <Crown className="h-3 w-3 text-amber-500" />
                                  <span className="text-sm">
                                    {head.fullName}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-gray-400 text-xs italic">
                                  {t("notAssigned")}
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
                                  {
                                    members.filter(
                                      (m) => m.memberType === "regular",
                                    ).length
                                  }{" "}
                                  {t("regular")}
                                </span>
                                {members.filter(
                                  (m) => m.memberType === "student",
                                ).length > 0 && (
                                  <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded">
                                    {
                                      members.filter(
                                        (m) => m.memberType === "student",
                                      ).length
                                    }{" "}
                                    {t("student")}
                                  </span>
                                )}
                                {members.filter(
                                  (m) => m.memberType === "boarder",
                                ).length > 0 && (
                                  <span className="bg-amber-100 text-amber-600 text-xs px-2 py-0.5 rounded">
                                    {
                                      members.filter(
                                        (m) => m.memberType === "boarder",
                                      ).length
                                    }{" "}
                                    {t("boarder")}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-blue-600 border-blue-300 hover:bg-blue-50"
                                onClick={() => handleSelectHouse(house)}
                              >
                                <Users className="h-3 w-3 mr-1" />
                                {t("manage")}
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* HOUSE MEMBER VIEW */}
      {view === "house" && selectedHouse && (
        <>
          {/* House Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-wrap gap-4 items-start">
            <div className="flex items-center gap-3 flex-1 min-w-[200px]">
              <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <Home className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-blue-900 text-lg">
                  {t("houseNo")}: {selectedHouse.houseNumber}
                </p>
                <p className="text-blue-700 text-sm">{selectedHouse.address}</p>
                <p className="text-blue-600 text-xs">
                  {selectedHouse.telephone}
                </p>
              </div>
            </div>
            <div className="flex gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-800">
                  {houseMembers.length}
                </p>
                <p className="text-xs text-blue-600">{t("total") || "Total"}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-700">
                  {
                    houseMembers.filter((m) => m.memberType === "regular")
                      .length
                  }
                </p>
                <p className="text-xs text-gray-500">{t("regular")}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700">
                  {
                    houseMembers.filter((m) => m.memberType === "student")
                      .length
                  }
                </p>
                <p className="text-xs text-blue-500">{t("students")}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-700">
                  {
                    houseMembers.filter((m) => m.memberType === "boarder")
                      .length
                  }
                </p>
                <p className="text-xs text-amber-500">{t("boarders")}</p>
              </div>
            </div>
          </div>

          {/* Members Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />
                {t("membersOfHouse", {
                  houseNumber: selectedHouse.houseNumber,
                })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {houseMembers.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="mb-4">{t("noMembersRegistered")}</p>
                  <Button
                    onClick={handleAddMember}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t("addFirstMember")}
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("no")}.</TableHead>
                        <TableHead>{t("fullName")}</TableHead>
                        <TableHead>{t("nic")}</TableHead>
                        <TableHead>{t("age")}</TableHead>
                        <TableHead>{t("gender")}</TableHead>
                        <TableHead>{t("type")}</TableHead>
                        <TableHead>{t("details")}</TableHead>
                        <TableHead className="text-right">
                          {t("actions")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {houseMembers.map((member) => {
                        const typeConfig =
                          MEMBER_TYPE_CONFIG[member.memberType];
                        return (
                          <TableRow
                            key={member.id}
                            className="cursor-pointer hover:bg-blue-50"
                            onClick={(e) => {
                              // Don't trigger if clicking on action buttons
                              if ((e.target as HTMLElement).closest("button"))
                                return;
                              setViewingMember(member);
                              setViewMemberDialog(true);
                            }}
                          >
                            <TableCell className="font-medium text-gray-500 text-xs">
                              {member.uniqueNumber}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">
                                  {member.fullName}
                                </span>
                                {member.isHeadOfHousehold && (
                                  <span className="flex items-center gap-0.5 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">
                                    <Crown className="h-2.5 w-2.5" />
                                    {t("head")}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-xs text-gray-500">
                              {member.nicNumber || t("notProvided")}
                            </TableCell>
                            <TableCell>{member.age}</TableCell>
                            <TableCell className="text-xs">
                              {member.gender
                                ? t(member.gender.toLowerCase())
                                : "-"}
                            </TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${typeConfig.color}`}
                              >
                                {typeConfig.icon}
                                {t(typeConfig.labelKey)}
                              </span>
                            </TableCell>
                            <TableCell className="text-xs text-gray-500">
                              {member.memberType === "student" && (
                                <span>
                                  {member.grade} · {member.institutionName}
                                </span>
                              )}
                              {member.memberType === "boarder" && (
                                <span>
                                  {member.purpose} · {member.boarderDistrict}
                                </span>
                              )}
                              {member.memberType === "regular" && (
                                <span>
                                  {member.jobType || member.educationStatus}
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-1 justify-end">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditMember(member)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleDeleteMemberClick(member.id)
                                  }
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Add/Edit Member Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingMember ? t("editMember") : t("addMember")} — {t("house")}{" "}
              {formData.houseNumber}
            </DialogTitle>
            <DialogDescription>
              {editingMember
                ? t("editMemberDescription")
                : t("addMemberDescription")}
            </DialogDescription>
          </DialogHeader>

          {/* Member Type Selector */}
          <div className="bg-gray-50 rounded-lg p-4 flex flex-wrap gap-3 items-center">
            <Label className="text-sm font-medium">{t("memberType")}:</Label>
            {(["regular", "student", "boarder"] as MemberType[]).map((type) => {
              const cfg = MEMBER_TYPE_CONFIG[type];
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, memberType: type });
                    setActiveTab("personal"); // Reset to first tab when switching member type
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 text-sm transition-all ${
                    formData.memberType === type
                      ? "border-blue-500 bg-blue-50 text-blue-700 font-medium"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {cfg.icon}
                  {t(cfg.labelKey)}
                </button>
              );
            })}

            <div className="ml-auto flex items-center gap-2">
              <Label className="text-sm">{t("headOfHousehold")}:</Label>
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    isHeadOfHousehold: !formData.isHeadOfHousehold,
                  })
                }
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 text-sm transition-all ${
                  formData.isHeadOfHousehold
                    ? "border-amber-400 bg-amber-50 text-amber-700 font-medium"
                    : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                }`}
              >
                <Crown className="h-3.5 w-3.5" />
                {formData.isHeadOfHousehold ? t("yesHead") : t("no")}
              </button>
            </div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList
              className={`grid w-full ${
                memberTypeValue === "student"
                  ? "grid-cols-3"
                  : memberTypeValue === "boarder"
                    ? "grid-cols-3"
                    : "grid-cols-2"
              }`}
            >
              <TabsTrigger value="personal">{t("personalInfo")}</TabsTrigger>
              <TabsTrigger value="employment">
                {t("employmentAndIncome")}
              </TabsTrigger>
              {memberTypeValue === "student" && (
                <TabsTrigger value="student">
                  <GraduationCap className="h-3.5 w-3.5 mr-1" />
                  {t("studentDetails")}
                </TabsTrigger>
              )}
              {memberTypeValue === "boarder" && (
                <TabsTrigger value="boarder">
                  <UserCheck className="h-3.5 w-3.5 mr-1" />
                  {t("boarderDetails")}
                </TabsTrigger>
              )}
            </TabsList>

            {/* Personal Info Tab */}
            <TabsContent value="personal" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("uniqueNumber")}</Label>
                  <Input
                    value={formData.uniqueNumber || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, uniqueNumber: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("nationalIdNumber")}</Label>
                  <Input
                    value={formData.nicNumber || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, nicNumber: e.target.value })
                    }
                    placeholder="850123456V or 198512300890"
                    className={
                      (formData as any).__errors?.nicNumber
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : ""
                    }
                  />
                  {(formData as any).__errors?.nicNumber && (
                    <p className="text-xs text-red-500">
                      {(formData as any).__errors.nicNumber}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t("fullName")}</Label>
                <Input
                  value={formData.fullName || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  placeholder={t("fullNamePlaceholder")}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("birthYear")}</Label>
                  <Input
                    type="number"
                    min="1900"
                    max="2026"
                    value={formData.birthYear || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        birthYear: parseInt(e.target.value) || 0,
                      })
                    }
                    className={
                      (formData as any).__errors?.birthYear
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : ""
                    }
                  />
                  {(formData as any).__errors?.birthYear && (
                    <p className="text-xs text-red-500">
                      {(formData as any).__errors.birthYear}
                    </p>
                  )}
                  {formData.birthYear && formData.birthYear > 1900 && (
                    <p className="text-xs text-blue-600">
                      {t("age")}: {calculateAge(formData.birthYear)}{" "}
                      {t("years")}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>{t("gender")}</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(val) =>
                      setFormData({ ...formData, gender: val as any })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">{t("male")}</SelectItem>
                      <SelectItem value="Female">{t("female")}</SelectItem>
                      <SelectItem value="Other">{t("other")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("nationality")}</Label>
                  <Input
                    value={formData.nationality || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, nationality: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("religion")}</Label>
                  <Select
                    value={formData.religion}
                    onValueChange={(val) =>
                      setFormData({ ...formData, religion: val as any })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Buddhist">{t("buddhist")}</SelectItem>
                      <SelectItem value="Hindu">{t("hindu")}</SelectItem>
                      <SelectItem value="Christian">
                        {t("christian")}
                      </SelectItem>
                      <SelectItem value="Islam">{t("islam")}</SelectItem>
                      <SelectItem value="Other">{t("other")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("maritalStatus")}</Label>
                  <Select
                    value={formData.maritalStatus}
                    onValueChange={(val) =>
                      setFormData({ ...formData, maritalStatus: val as any })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single">{t("single")}</SelectItem>
                      <SelectItem value="Married">{t("married")}</SelectItem>
                      <SelectItem value="Divorced">{t("divorced")}</SelectItem>
                      <SelectItem value="Widowed">{t("widowed")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t("educationStatus")}</Label>
                  <Select
                    value={formData.educationStatus}
                    onValueChange={(val) =>
                      setFormData({ ...formData, educationStatus: val as any })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Primary">{t("primary")}</SelectItem>
                      <SelectItem value="Secondary">
                        {t("secondaryOL")}
                      </SelectItem>
                      <SelectItem value="A/L">
                        {t("advancedLevelAL")}
                      </SelectItem>
                      <SelectItem value="Diploma">{t("diploma")}</SelectItem>
                      <SelectItem value="Degree">{t("degree")}</SelectItem>
                      <SelectItem value="Postgraduate">
                        {t("postgraduate")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            {/* Employment Tab */}
            <TabsContent value="employment" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>{t("jobTypeOccupation")}</Label>
                <Input
                  value={formData.jobType || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, jobType: e.target.value })
                  }
                  placeholder={t("jobTypePlaceholder")}
                />
              </div>

              <div className="space-y-2">
                <Label>{t("trainingReceived")}</Label>
                <Textarea
                  value={formData.trainingReceived || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      trainingReceived: e.target.value,
                    })
                  }
                  placeholder={t("trainingReceivedPlaceholder")}
                  className="resize-none"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>{t("employmentSector")}</Label>
                <Select
                  value={formData.sector}
                  onValueChange={(val) =>
                    setFormData({ ...formData, sector: val as any })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectSector")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Government">
                      {t("government")}
                    </SelectItem>
                    <SelectItem value="Private">{t("private")}</SelectItem>
                    <SelectItem value="Self-Employed">
                      {t("selfEmployed")}
                    </SelectItem>
                    <SelectItem value="Unemployed">
                      {t("unemployed")}
                    </SelectItem>
                    <SelectItem value="Student">
                      {t("studentNoIncome")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t("monthlyIncomeRange")}</Label>
                <Select
                  value={formData.monthlyIncome}
                  onValueChange={(val) =>
                    setFormData({ ...formData, monthlyIncome: val as any })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectIncomeRange")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="<750">&lt; 750</SelectItem>
                    <SelectItem value="751-1499">751 – 1,499</SelectItem>
                    <SelectItem value="1500-4999">1,500 – 4,999</SelectItem>
                    <SelectItem value="5000-7999">5,000 – 7,999</SelectItem>
                    <SelectItem value="8000-9999">8,000 – 9,999</SelectItem>
                    <SelectItem value=">10000">&gt; 10,000</SelectItem>
                    <SelectItem value="None">{t("noIncome")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            {/* Student Details Tab */}
            {memberTypeValue === "student" && (
              <TabsContent value="student" className="space-y-4 mt-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                  <GraduationCap className="h-5 w-5 text-blue-600 mt-0.5" />
                  <p className="text-sm text-blue-700">
                    {t("studentMemberDescription")}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>{t("gradeYearOfStudy")}</Label>
                  <Input
                    value={formData.grade || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, grade: e.target.value })
                    }
                    placeholder={t("gradeYearPlaceholder")}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t("institutionName")}</Label>
                  <Input
                    value={formData.institutionName || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        institutionName: e.target.value,
                      })
                    }
                    placeholder={t("institutionNamePlaceholder")}
                  />
                </div>
              </TabsContent>
            )}

            {/* Boarder Details Tab */}
            {memberTypeValue === "boarder" && (
              <TabsContent value="boarder" className="space-y-4 mt-4">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
                  <UserCheck className="h-5 w-5 text-amber-600 mt-0.5" />
                  <p className="text-sm text-amber-700">
                    {t("boarderMemberDescription")}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>{t("purposeOfStay")}</Label>
                  <Select
                    value={formData.purpose}
                    onValueChange={(val) =>
                      setFormData({ ...formData, purpose: val as any })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectPurpose")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Education">
                        {t("education")}
                      </SelectItem>
                      <SelectItem value="Job">{t("employmentJob")}</SelectItem>
                      <SelectItem value="Medical">
                        {t("medicalTreatment")}
                      </SelectItem>
                      <SelectItem value="Business">{t("business")}</SelectItem>
                      <SelectItem value="Other">{t("other")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t("districtWithinSriLanka")}</Label>
                  <Input
                    value={formData.boarderDistrict || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        boarderDistrict: e.target.value,
                      })
                    }
                    placeholder={t("districtPlaceholder")}
                  />
                </div>
              </TabsContent>
            )}
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {t("cancel")}
            </Button>
            <Button
              onClick={handleSave}
              disabled={savingMember}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {savingMember && <Loader2 className="h-4 w-4 animate-spin" />}
              {t("saveMember")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Household Details Dialog */}
      <Dialog open={viewHouseDialog} onOpenChange={setViewHouseDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Home className="h-5 w-5 text-blue-600" />
              {t("householdDetails")}
            </DialogTitle>
            <DialogDescription>{t("viewHouseholdDetails")}</DialogDescription>
          </DialogHeader>
          {viewingHouse && (
            <div className="space-y-6">
              {/* Header Card */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium mb-1">
                      {t("houseNumber")}
                    </p>
                    <p className="text-3xl font-bold text-blue-900">
                      {viewingHouse.houseNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-blue-600 font-medium mb-1">
                      {t("totalMembers")}
                    </p>
                    <p className="text-3xl font-bold text-blue-900">
                      {getMembersForHouse(viewingHouse.houseNumber).length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span className="font-medium">{t("address")}</span>
                  </div>
                  <p className="text-gray-900 ml-6">{viewingHouse.address}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Phone className="h-4 w-4" />
                    <span className="font-medium">{t("telephone")}</span>
                  </div>
                  <p className="text-gray-900 ml-6">
                    {viewingHouse.telephone || t("notProvided")}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Crown className="h-4 w-4 text-amber-500" />
                    <span className="font-medium">{t("headOfHousehold")}</span>
                  </div>
                  <p className="text-gray-900 ml-6">
                    {(() => {
                      const head = getMembersForHouse(
                        viewingHouse.houseNumber,
                      ).find((m) => m.isHeadOfHousehold);
                      return head ? head.fullName : t("notAssigned");
                    })()}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Users className="h-4 w-4" />
                    <span className="font-medium">{t("memberBreakdown")}</span>
                  </div>
                  <div className="ml-6 flex flex-wrap gap-1">
                    {(() => {
                      const members = getMembersForHouse(
                        viewingHouse.houseNumber,
                      );
                      const regular = members.filter(
                        (m) => m.memberType === "regular",
                      ).length;
                      const students = members.filter(
                        (m) => m.memberType === "student",
                      ).length;
                      const boarders = members.filter(
                        (m) => m.memberType === "boarder",
                      ).length;
                      return (
                        <>
                          <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded">
                            {regular} {t("regular")}
                          </span>
                          {students > 0 && (
                            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded">
                              {students} {t("student")}
                              {students > 1 ? "s" : ""}
                            </span>
                          )}
                          {boarders > 0 && (
                            <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded">
                              {boarders} {t("boarder")}
                              {boarders > 1 ? "s" : ""}
                            </span>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Members List */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {t("membersInThisHousehold")}
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {getMembersForHouse(viewingHouse.houseNumber).map(
                    (member) => {
                      const typeConfig = MEMBER_TYPE_CONFIG[member.memberType];
                      return (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900">
                                  {member.fullName}
                                </span>
                                {member.isHeadOfHousehold && (
                                  <Crown className="h-3 w-3 text-amber-500" />
                                )}
                              </div>
                              <span className="text-xs text-gray-500">
                                {member.uniqueNumber} • {t("age")} {member.age}{" "}
                                •{" "}
                                {member.gender
                                  ? t(member.gender.toLowerCase())
                                  : "-"}
                              </span>
                            </div>
                          </div>
                          <span
                            className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${typeConfig.color}`}
                          >
                            {typeConfig.icon}
                            {t(typeConfig.labelKey)}
                          </span>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewHouseDialog(false)}>
              {t("close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Member Details Dialog */}
      <Dialog open={viewMemberDialog} onOpenChange={setViewMemberDialog}>
        <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              {t("memberDetails")}
            </DialogTitle>
            <DialogDescription>{t("viewMemberDetails")}</DialogDescription>
          </DialogHeader>
          {viewingMember && (
            <div className="space-y-6">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {viewingMember.fullName}
                      </h3>
                      {viewingMember.isHeadOfHousehold && (
                        <span className="flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                          <Crown className="h-3 w-3" />
                          {t("headOfHousehold")}
                        </span>
                      )}
                    </div>
                    <p className="text-blue-700 font-medium">
                      {t("id")}: {viewingMember.uniqueNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    {(() => {
                      const typeConfig =
                        MEMBER_TYPE_CONFIG[viewingMember.memberType];
                      return (
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${typeConfig.color}`}
                        >
                          {typeConfig.icon}
                          <span className="font-medium">
                            {t(typeConfig.labelKey)}
                          </span>
                        </span>
                      );
                    })()}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-blue-700">
                  <Home className="h-4 w-4" />
                  <span className="font-medium">
                    {t("house")} {viewingMember.houseNumber}
                  </span>
                  <span className="text-blue-400">•</span>
                  <span className="text-sm">
                    {
                      households.find(
                        (h) => h.houseNumber === viewingMember.houseNumber,
                      )?.address
                    }
                  </span>
                </div>
              </div>

              {/* Personal Information */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 pb-2 border-b">
                  {t("personalInformation")}
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      {t("nationalIdNic")}
                    </p>
                    <p className="font-medium text-gray-900">
                      {viewingMember.nicNumber || t("notProvided")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t("birthYear")}</p>
                    <p className="font-medium text-gray-900">
                      {viewingMember.birthYear}{" "}
                      <span className="text-sm text-gray-500">
                        (Age: {viewingMember.age})
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t("gender")}</p>
                    <p className="font-medium text-gray-900">
                      {viewingMember.gender
                        ? t(viewingMember.gender.toLowerCase())
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      {t("maritalStatus")}
                    </p>
                    <p className="font-medium text-gray-900">
                      {viewingMember.maritalStatus
                        ? t(viewingMember.maritalStatus.toLowerCase())
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t("nationality")}</p>
                    <p className="font-medium text-gray-900">
                      {viewingMember.nationality}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t("religion")}</p>
                    <p className="font-medium text-gray-900">
                      {viewingMember.religion
                        ? t(viewingMember.religion.toLowerCase())
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      {t("educationStatus")}
                    </p>
                    <p className="font-medium text-gray-900">
                      {viewingMember.educationStatus
                        ? t(viewingMember.educationStatus.toLowerCase())
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Employment Information */}
              <h4 className="font-semibold text-gray-900 mb-3 pb-2 border-b">
                {t("employmentAndIncome")}
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">
                    {t("jobTypeOccupation")}
                  </p>
                  <p className="font-medium text-gray-900">
                    {viewingMember.jobType || t("notSpecified")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    {t("employmentSector")}
                  </p>
                  <p className="font-medium text-gray-900">
                    {viewingMember.sector
                      ? t(viewingMember.sector.toLowerCase())
                      : t("notSpecified")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    {t("trainingReceived")}
                  </p>
                  <p className="font-medium text-gray-900">
                    {viewingMember.trainingReceived || t("none")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t("monthlyIncome")}</p>
                  <p className="font-medium text-gray-900">
                    {viewingMember.monthlyIncome || t("notSpecified")}
                  </p>
                </div>
              </div>

              {/* Student Details (if applicable) */}
              {viewingMember.memberType === "student" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    {t("studentInformation")}
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-blue-600">
                        {t("gradeYearOfStudy")}
                      </p>
                      <p className="font-medium text-blue-900">
                        {viewingMember.grade || t("notSpecified")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-600">
                        {t("institutionName")}
                      </p>
                      <p className="font-medium text-blue-900">
                        {viewingMember.institutionName || t("notSpecified")}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Boarder Details (if applicable) */}
              {viewingMember.memberType === "boarder" && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                    <UserCheck className="h-5 w-5" />
                    {t("boarderInformation")}
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-amber-600">
                        {t("purposeOfStay")}
                      </p>
                      <p className="font-medium text-amber-900">
                        {viewingMember.purpose || t("notSpecified")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-amber-600">
                        {t("districtWithinSriLanka")}
                      </p>
                      <p className="font-medium text-amber-900">
                        {viewingMember.boarderDistrict || t("notSpecified")}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setViewMemberDialog(false);
                if (viewingMember) {
                  handleEditMember(viewingMember);
                }
              }}
              className="mr-auto"
            >
              <Pencil className="h-4 w-4 mr-2" />
              {t("editMember")}
            </Button>
            <Button onClick={() => setViewMemberDialog(false)}>
              {t("close")}
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
            <DialogDescription>{t("confirmDeleteMember")}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600 text-sm">
              {t("confirmDeleteMember") ||
                "Are you sure you want to delete this member?"}
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
              disabled={deletingMember}
            >
              {deletingMember && <Loader2 className="h-4 w-4 animate-spin" />}
              {t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
