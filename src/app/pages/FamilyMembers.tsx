import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useHouseholdData, FamilyMember, MemberType, Household } from "../context/HouseholdDataContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
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
  DialogFooter,
} from "../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
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
  Phone,
  MapPin,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type ViewState = "search" | "house";

const MEMBER_TYPE_CONFIG: Record<MemberType, { label: string; color: string; icon: React.ReactNode }> = {
  regular: {
    label: "Regular",
    color: "bg-gray-100 text-gray-700",
    icon: <Users className="h-3 w-3" />,
  },
  student: {
    label: "Student",
    color: "bg-blue-100 text-blue-700",
    icon: <GraduationCap className="h-3 w-3" />,
  },
  boarder: {
    label: "Boarder",
    color: "bg-amber-100 text-amber-700",
    icon: <UserCheck className="h-3 w-3" />,
  },
};

export function FamilyMembers() {
  const { t } = useLanguage();
  const { households, familyMembers, setFamilyMembers, getMembersForHouse } =
    useHouseholdData();

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
  const [viewingMember, setViewingMember] = useState<FamilyMember | null>(null);

  // Filtered houses in search view
  const filteredHouses = households.filter(
    (h) =>
      h.houseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.address.toLowerCase().includes(searchQuery.toLowerCase())
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
  const handleDeleteMember = (id: number) => {
    if (confirm("Are you sure you want to delete this member?")) {
      setFamilyMembers(familyMembers.filter((m) => m.id !== id));
    }
  };

  // ---- Save member ----
  const handleSave = () => {
    const age = formData.birthYear ? calculateAge(formData.birthYear) : 0;

    if (editingMember) {
      setFamilyMembers(
        familyMembers.map((m) => {
          if (m.id === editingMember.id) {
            return { ...formData as FamilyMember, id: m.id, age };
          }
          // If this member is being set as head, remove head from others in same house
          if (
            formData.isHeadOfHousehold &&
            m.houseNumber === formData.houseNumber &&
            m.id !== editingMember.id
          ) {
            return { ...m, isHeadOfHousehold: false };
          }
          return m;
        })
      );
    } else {
      const newMember: FamilyMember = {
        ...formData as FamilyMember,
        id: Math.max(...familyMembers.map((m) => m.id), 0) + 1,
        age,
      };
      let updatedMembers = [...familyMembers];
      // If new member is head, remove head from others in same house
      if (newMember.isHeadOfHousehold) {
        updatedMembers = updatedMembers.map((m) =>
          m.houseNumber === newMember.houseNumber
            ? { ...m, isHeadOfHousehold: false }
            : m
        );
      }
      setFamilyMembers([...updatedMembers, newMember]);
    }
    setDialogOpen(false);
  };

  const memberTypeValue = formData.memberType as MemberType;

  // Analytics calculations for all members
  const totalMembers = familyMembers.length;
  const regularMembers = familyMembers.filter((m) => m.memberType === "regular").length;
  const studentMembers = familyMembers.filter((m) => m.memberType === "student").length;
  const boarderMembers = familyMembers.filter((m) => m.memberType === "boarder").length;

  const memberTypeData = [
    { name: "Regular", value: regularMembers },
    { name: "Students", value: studentMembers },
    { name: "Boarders", value: boarderMembers },
  ].filter(item => item.value > 0);

  const genderData = [
    { name: "Male", value: familyMembers.filter((m) => m.gender === "Male").length },
    { name: "Female", value: familyMembers.filter((m) => m.gender === "Female").length },
  ].filter(item => item.value > 0);

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

  const ageData = Object.entries(ageRanges).map(([name, value]) => ({
    name,
    value,
  })).filter(item => item.value > 0);

  // Top households by member count
  const householdMemberCounts = households.map(h => ({
    name: h.houseNumber,
    value: getMembersForHouse(h.houseNumber).length,
  })).filter(h => h.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

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
                ? "Manage family members across all households"
                : `House ${selectedHouse?.houseNumber} — ${selectedHouse?.address}`}
            </p>
          </div>
        </div>
        {view === "house" && (
          <Button
            onClick={handleAddMember}
            className="bg-slate-900 hover:bg-slate-800"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        )}
      </div>

      {/* SEARCH VIEW */}
      {view === "search" && (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="manage" className="gap-2">
              <List className="h-4 w-4" />
              Manage Members
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-blue-600 text-white border-blue-700">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Users className="h-10 w-10 text-white/90" />
                    <div>
                      <p className="text-sm text-blue-100">Total Members</p>
                      <p className="text-3xl font-bold">{totalMembers}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-green-600 text-white border-green-700">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
                      <Home className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm text-green-100">Households</p>
                      <p className="text-3xl font-bold">
                        {new Set(familyMembers.map((m) => m.houseNumber)).size}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-orange-600 text-white border-orange-700">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
                      <GraduationCap className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm text-orange-100">Students</p>
                      <p className="text-3xl font-bold">{studentMembers}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-purple-600 text-white border-purple-700">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
                      <UserCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm text-purple-100">Boarders</p>
                      <p className="text-3xl font-bold">{boarderMembers}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart - Member Types */}
              <Card>
                <CardHeader>
                  <CardTitle>Member Types Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={memberTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {memberTypeData.map((entry, index) => (
                          <Cell
                            key={`member-type-${entry.name}-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Pie Chart - Gender Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Gender Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={genderData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {genderData.map((entry, index) => (
                          <Cell
                            key={`gender-${entry.name}-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Second Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bar Chart - Age Distribution */}
              {ageData.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Age Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={ageData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}

              {/* Bar Chart - Top Households */}
              {householdMemberCounts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Top 5 Households by Members</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={householdMemberCounts}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#10b981" />
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
                <CardTitle className="text-base">Search by House Number or Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Enter house number (e.g. 23/A) or address..."
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
                  {searchQuery.length > 0 ? `Search Results (${filteredHouses.length})` : 'All Households'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(searchQuery.length > 0 ? filteredHouses : households).length === 0 ? (
                  <p className="text-center text-gray-400 py-6">
                    No houses found matching "{searchQuery}"
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>House No.</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Head of Household</TableHead>
                        <TableHead>Members</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(searchQuery.length > 0 ? filteredHouses : households).map((house) => {
                        const members = getMembersForHouse(house.houseNumber);
                        const head = members.find((m) => m.isHeadOfHousehold);
                        return (
                          <TableRow 
                            key={house.id}
                            className="cursor-pointer hover:bg-blue-50"
                            onClick={(e) => {
                              // Don't trigger if clicking on the Manage button
                              if ((e.target as HTMLElement).closest('button')) return;
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
                                  <span className="text-sm">{head.fullName}</span>
                                </div>
                              ) : (
                                <span className="text-gray-400 text-xs italic">Not assigned</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
                                  {members.filter((m) => m.memberType === "regular").length} regular
                                </span>
                                {members.filter((m) => m.memberType === "student").length > 0 && (
                                  <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded">
                                    {members.filter((m) => m.memberType === "student").length} student
                                  </span>
                                )}
                                {members.filter((m) => m.memberType === "boarder").length > 0 && (
                                  <span className="bg-amber-100 text-amber-600 text-xs px-2 py-0.5 rounded">
                                    {members.filter((m) => m.memberType === "boarder").length} boarder
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
                                Manage
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
                  House No: {selectedHouse.houseNumber}
                </p>
                <p className="text-blue-700 text-sm">{selectedHouse.address}</p>
                <p className="text-blue-600 text-xs">{selectedHouse.telephone}</p>
              </div>
            </div>
            <div className="flex gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-800">{houseMembers.length}</p>
                <p className="text-xs text-blue-600">Total</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-700">
                  {houseMembers.filter((m) => m.memberType === "regular").length}
                </p>
                <p className="text-xs text-gray-500">Regular</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700">
                  {houseMembers.filter((m) => m.memberType === "student").length}
                </p>
                <p className="text-xs text-blue-500">Students</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-700">
                  {houseMembers.filter((m) => m.memberType === "boarder").length}
                </p>
                <p className="text-xs text-amber-500">Boarders</p>
              </div>
            </div>
          </div>

          {/* Members Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />
                Members of House {selectedHouse.houseNumber}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {houseMembers.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="mb-4">No members registered for this house yet.</p>
                  <Button
                    onClick={handleAddMember}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Member (Head of Household)
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>No.</TableHead>
                        <TableHead>Full Name</TableHead>
                        <TableHead>NIC</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead className="text-right">{t("actions")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {houseMembers.map((member) => {
                        const typeConfig = MEMBER_TYPE_CONFIG[member.memberType];
                        return (
                          <TableRow 
                            key={member.id}
                            className="cursor-pointer hover:bg-blue-50"
                            onClick={(e) => {
                              // Don't trigger if clicking on action buttons
                              if ((e.target as HTMLElement).closest('button')) return;
                              setViewingMember(member);
                              setViewMemberDialog(true);
                            }}
                          >
                            <TableCell className="font-medium text-gray-500 text-xs">
                              {member.uniqueNumber}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{member.fullName}</span>
                                {member.isHeadOfHousehold && (
                                  <span className="flex items-center gap-0.5 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">
                                    <Crown className="h-2.5 w-2.5" />
                                    Head
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-xs text-gray-500">
                              {member.nicNumber || "-"}
                            </TableCell>
                            <TableCell>{member.age}</TableCell>
                            <TableCell className="text-xs">{member.gender}</TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${typeConfig.color}`}
                              >
                                {typeConfig.icon}
                                {typeConfig.label}
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
                                <span>{member.jobType || member.educationStatus}</span>
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
                                  onClick={() => handleDeleteMember(member.id)}
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
              {editingMember ? "Edit" : "Add"} Member — House{" "}
              {formData.houseNumber}
            </DialogTitle>
          </DialogHeader>

          {/* Member Type Selector */}
          <div className="bg-gray-50 rounded-lg p-4 flex flex-wrap gap-3 items-center">
            <Label className="text-sm font-medium">Member Type:</Label>
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
                  {cfg.label}
                </button>
              );
            })}

            <div className="ml-auto flex items-center gap-2">
              <Label className="text-sm">Head of Household:</Label>
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
                {formData.isHeadOfHousehold ? "Yes (Head)" : "No"}
              </button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList
              className={`grid w-full ${
                memberTypeValue === "student"
                  ? "grid-cols-3"
                  : memberTypeValue === "boarder"
                  ? "grid-cols-3"
                  : "grid-cols-2"
              }`}
            >
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="employment">Employment & Income</TabsTrigger>
              {memberTypeValue === "student" && (
                <TabsTrigger value="student">
                  <GraduationCap className="h-3.5 w-3.5 mr-1" />
                  Student Details
                </TabsTrigger>
              )}
              {memberTypeValue === "boarder" && (
                <TabsTrigger value="boarder">
                  <UserCheck className="h-3.5 w-3.5 mr-1" />
                  Boarder Details
                </TabsTrigger>
              )}
            </TabsList>

            {/* Personal Info Tab */}
            <TabsContent value="personal" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Unique Number (Anu Ankaya)</Label>
                  <Input
                    value={formData.uniqueNumber || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, uniqueNumber: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>National ID Number</Label>
                  <Input
                    value={formData.nicNumber || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, nicNumber: e.target.value })
                    }
                    placeholder="850123456V or 198512300890"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={formData.fullName || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  placeholder="Full legal name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Birth Year</Label>
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
                  />
                  {formData.birthYear && formData.birthYear > 1900 && (
                    <p className="text-xs text-blue-600">
                      Age: {calculateAge(formData.birthYear)} years
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(val) =>
                      setFormData({ ...formData, gender: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nationality</Label>
                  <Input
                    value={formData.nationality || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, nationality: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Religion</Label>
                  <Select
                    value={formData.religion}
                    onValueChange={(val) =>
                      setFormData({ ...formData, religion: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Buddhist">Buddhist</SelectItem>
                      <SelectItem value="Hindu">Hindu</SelectItem>
                      <SelectItem value="Christian">Christian</SelectItem>
                      <SelectItem value="Islam">Islam</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Marital Status</Label>
                  <Select
                    value={formData.maritalStatus}
                    onValueChange={(val) =>
                      setFormData({ ...formData, maritalStatus: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Married">Married</SelectItem>
                      <SelectItem value="Divorced">Divorced</SelectItem>
                      <SelectItem value="Widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Education Status</Label>
                  <Select
                    value={formData.educationStatus}
                    onValueChange={(val) =>
                      setFormData({ ...formData, educationStatus: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Primary">Primary</SelectItem>
                      <SelectItem value="Secondary">Secondary (O/L)</SelectItem>
                      <SelectItem value="A/L">Advanced Level (A/L)</SelectItem>
                      <SelectItem value="Diploma">Diploma</SelectItem>
                      <SelectItem value="Degree">Degree</SelectItem>
                      <SelectItem value="Postgraduate">Postgraduate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            {/* Employment Tab */}
            <TabsContent value="employment" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Job Type / Occupation</Label>
                <Input
                  value={formData.jobType || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, jobType: e.target.value })
                  }
                  placeholder="e.g. Teacher, Farmer, Engineer"
                />
              </div>

              <div className="space-y-2">
                <Label>Training Received</Label>
                <Input
                  value={formData.trainingReceived || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, trainingReceived: e.target.value })
                  }
                  placeholder="e.g. Professional, Vocational, Technical"
                />
              </div>

              <div className="space-y-2">
                <Label>Employment Sector</Label>
                <Select
                  value={formData.sector}
                  onValueChange={(val) =>
                    setFormData({ ...formData, sector: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sector..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Government">Government</SelectItem>
                    <SelectItem value="Private">Private</SelectItem>
                    <SelectItem value="Self-Employed">Self-Employed / Individual</SelectItem>
                    <SelectItem value="Unemployed">Unemployed</SelectItem>
                    <SelectItem value="Student">Student (No Income)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Monthly Income Range (LKR)</Label>
                <Select
                  value={formData.monthlyIncome}
                  onValueChange={(val) =>
                    setFormData({ ...formData, monthlyIncome: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select income range..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="<750">&lt; 750</SelectItem>
                    <SelectItem value="751-1499">751 – 1,499</SelectItem>
                    <SelectItem value="1500-4999">1,500 – 4,999</SelectItem>
                    <SelectItem value="5000-7999">5,000 – 7,999</SelectItem>
                    <SelectItem value="8000-9999">8,000 – 9,999</SelectItem>
                    <SelectItem value=">10000">&gt; 10,000</SelectItem>
                    <SelectItem value="None">No Income</SelectItem>
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
                    This member is registered as a <strong>Student</strong>. Fill in their
                    educational details below. They will also appear in the Students module.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Grade / Year of Study</Label>
                  <Input
                    value={formData.grade || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, grade: e.target.value })
                    }
                    placeholder="e.g. Grade 10, A/L Science, University Year 2"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Institution Name</Label>
                  <Input
                    value={formData.institutionName || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, institutionName: e.target.value })
                    }
                    placeholder="e.g. Hambantota National School"
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
                    This member is registered as a <strong>Boarder</strong> (temporary
                    resident). They will appear in the Boarders module.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Purpose of Stay</Label>
                  <Select
                    value={formData.purpose}
                    onValueChange={(val) =>
                      setFormData({ ...formData, purpose: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select purpose..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Job">Employment / Job</SelectItem>
                      <SelectItem value="Medical">Medical Treatment</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>District (within Sri Lanka)</Label>
                  <Input
                    value={formData.boarderDistrict || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, boarderDistrict: e.target.value })
                    }
                    placeholder="e.g. Hambantota, Colombo, Matara, Galle"
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
              className="bg-blue-600 hover:bg-blue-700"
            >
              {t("save")} Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Household Details Dialog */}
      <Dialog open={viewHouseDialog} onOpenChange={setViewHouseDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Home className="h-5 w-5 text-blue-600" />
              Household Details
            </DialogTitle>
          </DialogHeader>
          {viewingHouse && (
            <div className="space-y-6">
              {/* Header Card */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium mb-1">House Number</p>
                    <p className="text-3xl font-bold text-blue-900">{viewingHouse.houseNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-blue-600 font-medium mb-1">Total Members</p>
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
                    <span className="font-medium">Address</span>
                  </div>
                  <p className="text-gray-900 ml-6">{viewingHouse.address}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Phone className="h-4 w-4" />
                    <span className="font-medium">Telephone</span>
                  </div>
                  <p className="text-gray-900 ml-6">{viewingHouse.telephone || "Not provided"}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Crown className="h-4 w-4 text-amber-500" />
                    <span className="font-medium">Head of Household</span>
                  </div>
                  <p className="text-gray-900 ml-6">
                    {(() => {
                      const head = getMembersForHouse(viewingHouse.houseNumber).find(
                        (m) => m.isHeadOfHousehold
                      );
                      return head ? head.fullName : "Not assigned";
                    })()}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Users className="h-4 w-4" />
                    <span className="font-medium">Member Breakdown</span>
                  </div>
                  <div className="ml-6 flex flex-wrap gap-1">
                    {(() => {
                      const members = getMembersForHouse(viewingHouse.houseNumber);
                      const regular = members.filter((m) => m.memberType === "regular").length;
                      const students = members.filter((m) => m.memberType === "student").length;
                      const boarders = members.filter((m) => m.memberType === "boarder").length;
                      return (
                        <>
                          <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded">
                            {regular} Regular
                          </span>
                          {students > 0 && (
                            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded">
                              {students} Student{students > 1 ? "s" : ""}
                            </span>
                          )}
                          {boarders > 0 && (
                            <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded">
                              {boarders} Boarder{boarders > 1 ? "s" : ""}
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
                  Members in this Household
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {getMembersForHouse(viewingHouse.houseNumber).map((member) => {
                    const typeConfig = MEMBER_TYPE_CONFIG[member.memberType];
                    return (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">{member.fullName}</span>
                              {member.isHeadOfHousehold && (
                                <Crown className="h-3 w-3 text-amber-500" />
                              )}
                            </div>
                            <span className="text-xs text-gray-500">
                              {member.uniqueNumber} • Age {member.age} • {member.gender}
                            </span>
                          </div>
                        </div>
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${typeConfig.color}`}>
                          {typeConfig.icon}
                          {typeConfig.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewHouseDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Member Details Dialog */}
      <Dialog open={viewMemberDialog} onOpenChange={setViewMemberDialog}>
        <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Member Details
            </DialogTitle>
          </DialogHeader>
          {viewingMember && (
            <div className="space-y-6">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-2xl font-bold text-gray-900">{viewingMember.fullName}</h3>
                      {viewingMember.isHeadOfHousehold && (
                        <span className="flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                          <Crown className="h-3 w-3" />
                          Head of Household
                        </span>
                      )}
                    </div>
                    <p className="text-blue-700 font-medium">ID: {viewingMember.uniqueNumber}</p>
                  </div>
                  <div className="text-right">
                    {(() => {
                      const typeConfig = MEMBER_TYPE_CONFIG[viewingMember.memberType];
                      return (
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${typeConfig.color}`}>
                          {typeConfig.icon}
                          <span className="font-medium">{typeConfig.label}</span>
                        </span>
                      );
                    })()}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-blue-700">
                  <Home className="h-4 w-4" />
                  <span className="font-medium">House {viewingMember.houseNumber}</span>
                  <span className="text-blue-400">•</span>
                  <span className="text-sm">
                    {households.find((h) => h.houseNumber === viewingMember.houseNumber)?.address}
                  </span>
                </div>
              </div>

              {/* Personal Information */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 pb-2 border-b">Personal Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">National ID (NIC)</p>
                    <p className="font-medium text-gray-900">{viewingMember.nicNumber || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Birth Year</p>
                    <p className="font-medium text-gray-900">
                      {viewingMember.birthYear} <span className="text-sm text-gray-500">(Age: {viewingMember.age})</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Gender</p>
                    <p className="font-medium text-gray-900">{viewingMember.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Marital Status</p>
                    <p className="font-medium text-gray-900">{viewingMember.maritalStatus}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Nationality</p>
                    <p className="font-medium text-gray-900">{viewingMember.nationality}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Religion</p>
                    <p className="font-medium text-gray-900">{viewingMember.religion}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Education Status</p>
                    <p className="font-medium text-gray-900">{viewingMember.educationStatus}</p>
                  </div>
                </div>
              </div>

              {/* Employment Information */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 pb-2 border-b">Employment & Income</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Job Type / Occupation</p>
                    <p className="font-medium text-gray-900">{viewingMember.jobType || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Employment Sector</p>
                    <p className="font-medium text-gray-900">{viewingMember.sector || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Training Received</p>
                    <p className="font-medium text-gray-900">{viewingMember.trainingReceived || "None"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Monthly Income (LKR)</p>
                    <p className="font-medium text-gray-900">{viewingMember.monthlyIncome || "Not specified"}</p>
                  </div>
                </div>
              </div>

              {/* Student Details (if applicable) */}
              {viewingMember.memberType === "student" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Student Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-blue-600">Grade / Year</p>
                      <p className="font-medium text-blue-900">{viewingMember.grade || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-600">Institution</p>
                      <p className="font-medium text-blue-900">{viewingMember.institutionName || "Not specified"}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Boarder Details (if applicable) */}
              {viewingMember.memberType === "boarder" && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                    <UserCheck className="h-5 w-5" />
                    Boarder Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-amber-600">Purpose of Stay</p>
                      <p className="font-medium text-amber-900">{viewingMember.purpose || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-amber-600">Home District</p>
                      <p className="font-medium text-amber-900">{viewingMember.boarderDistrict || "Not specified"}</p>
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
              Edit Member
            </Button>
            <Button onClick={() => setViewMemberDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}