import { Search, UserCheck, Home, Briefcase, BarChart3, List } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useHouseholdData } from "../context/HouseholdDataContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

const PURPOSE_COLORS: Record<string, string> = {
  Education: "bg-blue-100 text-blue-700",
  Job: "bg-green-100 text-green-700",
  Medical: "bg-red-100 text-red-700",
  Business: "bg-purple-100 text-purple-700",
  Other: "bg-gray-100 text-gray-600",
};

export function Boarders() {
  const { t } = useLanguage();
  const { getBoarders, households } = useHouseholdData();
  const [searchQuery, setSearchQuery] = useState("");

  // View dialog state
  const [viewDialog, setViewDialog] = useState(false);
  const [viewingBoarder, setViewingBoarder] = useState<any>(null);

  const boarders = getBoarders();

  const filteredBoarders = boarders.filter(
    (b) =>
      b.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.houseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.purpose || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.boarderCountry || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getHouseAddress = (houseNumber: string) => {
    const house = households.find((h) => h.houseNumber === houseNumber);
    return house?.address || "";
  };

  const purposeGroups = boarders.reduce<Record<string, number>>((acc, b) => {
    const p = b.purpose || "Other";
    acc[p] = (acc[p] || 0) + 1;
    return acc;
  }, {});

  // Analytics data for charts
  const genderData = [
    { name: "Male", value: boarders.filter((b) => b.gender === "Male").length },
    { name: "Female", value: boarders.filter((b) => b.gender === "Female").length },
  ].filter(item => item.value > 0);

  const purposeData = Object.entries(purposeGroups).map(([name, value]) => ({
    name,
    value,
  }));

  const countryGroups = boarders.reduce<Record<string, number>>((acc, b) => {
    const country = b.boarderCountry || "Unknown";
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {});

  const countryData = Object.entries(countryGroups)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, value]) => ({
      name,
      value,
    }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t("boarders")}</h1>
          <p className="text-slate-600 mt-1">
            Boarders registered across all households. To add a boarder, go to{" "}
            <strong>Family Member Registry</strong> and set member type to "Boarder".
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="all-boarders" className="gap-2">
            <List className="h-4 w-4" />
            All Boarders
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-blue-600 text-white border-blue-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <UserCheck className="h-10 w-10 text-white/90" />
                  <div>
                    <p className="text-sm text-blue-100">Total Boarders</p>
                    <p className="text-3xl font-bold">{boarders.length}</p>
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
                      {new Set(boarders.map((b) => b.houseNumber)).size}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-orange-600 text-white border-orange-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-orange-100">For Employment</p>
                    <p className="text-3xl font-bold">
                      {boarders.filter((b) => b.purpose === "Job").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-purple-600 text-white border-purple-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <span className="text-2xl font-bold">{Object.keys(purposeGroups).length}</span>
                  </div>
                  <div>
                    <p className="text-sm text-purple-100">Stay Purposes</p>
                    <p className="text-xl font-semibold">Tracked</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart - Purpose Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Purpose of Stay</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={purposeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {purposeData.map((entry, index) => (
                        <Cell
                          key={`purpose-${entry.name}-${index}`}
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

          {/* Country Distribution Chart */}
          {countryData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Top Countries of Origin</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={countryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* All Boarders Tab */}
        <TabsContent value="all-boarders" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by name, house number, purpose, or country..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Unique No.</TableHead>
                      <TableHead>Full Name</TableHead>
                      <TableHead>House No.</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Age / Gender</TableHead>
                      <TableHead>NIC</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Country of Origin</TableHead>
                      <TableHead>Employment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBoarders.map((boarder) => (
                      <TableRow 
                        key={boarder.id}
                        className="cursor-pointer hover:bg-amber-50"
                        onClick={() => {
                          setViewingBoarder(boarder);
                          setViewDialog(true);
                        }}
                      >
                        <TableCell className="font-medium text-gray-500 text-xs">
                          {boarder.uniqueNumber}
                        </TableCell>
                        <TableCell className="font-medium">{boarder.fullName}</TableCell>
                        <TableCell>
                          <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full">
                            {boarder.houseNumber}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-gray-500">
                          {getHouseAddress(boarder.houseNumber)}
                        </TableCell>
                        <TableCell className="text-xs">
                          {boarder.age} / {boarder.gender}
                        </TableCell>
                        <TableCell className="text-xs text-gray-500">
                          {boarder.nicNumber || "-"}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`text-xs px-2 py-0.5 rounded ${
                              PURPOSE_COLORS[boarder.purpose || "Other"] ||
                              "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {boarder.purpose || "-"}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm">
                          {boarder.boarderCountry || "-"}
                        </TableCell>
                        <TableCell className="text-xs text-gray-600">
                          {boarder.jobType ? (
                            <span>
                              {boarder.jobType}
                              {boarder.sector && (
                                <span className="text-gray-400"> ({boarder.sector})</span>
                              )}
                            </span>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredBoarders.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center text-gray-400 py-8">
                          {boarders.length === 0
                            ? "No boarders registered yet. Add members with type 'Boarder' in Family Member Registry."
                            : "No boarders match your search."}
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

      {/* View Boarder Details Dialog */}
      <Dialog open={viewDialog} onOpenChange={setViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-amber-600" />
              Boarder Details
            </DialogTitle>
          </DialogHeader>
          {viewingBoarder && (
            <div className="space-y-6">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{viewingBoarder.fullName}</h3>
                    <p className="text-amber-700 font-medium">ID: {viewingBoarder.uniqueNumber}</p>
                  </div>
                  <span className="bg-amber-100 text-amber-700 text-xs px-3 py-1.5 rounded-full font-medium">
                    Boarder
                  </span>
                </div>
                <div className="flex items-center gap-2 text-amber-700">
                  <Home className="h-4 w-4" />
                  <span className="font-medium">House {viewingBoarder.houseNumber}</span>
                  <span className="text-amber-400">•</span>
                  <span className="text-sm">{getHouseAddress(viewingBoarder.houseNumber)}</span>
                </div>
              </div>

              {/* Personal Information */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 pb-2 border-b">Personal Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">National ID (NIC)</p>
                    <p className="font-medium text-gray-900">{viewingBoarder.nicNumber || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Birth Year</p>
                    <p className="font-medium text-gray-900">
                      {viewingBoarder.birthYear} <span className="text-sm text-gray-500">(Age: {viewingBoarder.age})</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Gender</p>
                    <p className="font-medium text-gray-900">{viewingBoarder.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Nationality</p>
                    <p className="font-medium text-gray-900">{viewingBoarder.nationality}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Religion</p>
                    <p className="font-medium text-gray-900">{viewingBoarder.religion}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Marital Status</p>
                    <p className="font-medium text-gray-900">{viewingBoarder.maritalStatus}</p>
                  </div>
                </div>
              </div>

              {/* Boarder-Specific Information */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  Boarder Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-amber-600">Purpose of Stay</p>
                    <p className="font-medium text-amber-900">{viewingBoarder.purpose || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-amber-600">Country/District of Origin</p>
                    <p className="font-medium text-amber-900">{viewingBoarder.boarderCountry || viewingBoarder.boarderDistrict || "Not specified"}</p>
                  </div>
                </div>
              </div>

              {/* Employment Information */}
              {viewingBoarder.jobType && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 pb-2 border-b">Employment & Income</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Job Type</p>
                      <p className="font-medium text-gray-900">{viewingBoarder.jobType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Employment Sector</p>
                      <p className="font-medium text-gray-900">{viewingBoarder.sector || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Monthly Income</p>
                      <p className="font-medium text-gray-900">{viewingBoarder.monthlyIncome || "Not specified"}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}