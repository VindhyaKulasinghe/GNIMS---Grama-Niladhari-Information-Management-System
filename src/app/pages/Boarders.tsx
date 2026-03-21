import {
  Search,
  UserCheck,
  Home,
  Briefcase,
  BarChart3,
  List,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHouseholdData } from "../context/HouseholdDataContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
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
  const { t } = useTranslation();
  const { getBoarders, households, familyMembers } = useHouseholdData();
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
      (b.boarderDistrict || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  const getHouseAddress = (houseNumber: string) => {
    const house = households.find((h) => h.houseNumber === houseNumber);
    return house?.address || "";
  };

  const purposeGroups = boarders.reduce<Record<string, number>>((acc, b) => {
    const p = b.purpose || "other";
    acc[p] = (acc[p] || 0) + 1;
    return acc;
  }, {});

  // Analytics data for charts
  const genderData = [
    {
      name: t("male"),
      value: boarders.filter((b) => b.gender === "Male").length,
    },
    {
      name: t("female"),
      value: boarders.filter((b) => b.gender === "Female").length,
    },
  ].filter((item) => item.value > 0);

  const purposeData = Object.entries(purposeGroups).map(([name, value]) => ({
    name: t(name.toLowerCase()) || name,
    value,
  }));

  const sectorGroups = familyMembers.reduce<Record<string, number>>(
    (acc, m) => {
      const sector = m.sector || "Unknown";
      acc[sector] = (acc[sector] || 0) + 1;
      return acc;
    },
    {},
  );

  const sectorData = Object.entries(sectorGroups).map(([name, value]) => ({
    name: name === "Unknown" ? t("unknown") : name,
    value,
  }));

  const countryGroups = boarders.reduce<Record<string, number>>((acc, b) => {
    const country = b.boarderDistrict || t("unknown");
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
          <h1 className="text-3xl font-bold text-slate-900">{t("boarders")}</h1>
          <p className="text-slate-600 mt-1">{t("boardersDescription")}</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            {t("overview")}
          </TabsTrigger>
          <TabsTrigger value="all-boarders" className="gap-2">
            <List className="h-4 w-4" />
            {t("allBoarders")}
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
                      {t("totalBoarders")}
                    </p>
                    <p className="text-3xl font-bold text-slate-800">
                      {boarders.length}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {t("active") || "Active"}
                    </p>
                  </div>
                  <div className="bg-blue-500 p-3 rounded-2xl shadow-sm text-white">
                    <UserCheck className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg hover:scale-[1.02] transition-all bg-gradient-to-br from-white to-emerald-50/50">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-emerald-600/80 uppercase tracking-wider mb-1">
                      {t("households")}
                    </p>
                    <p className="text-3xl font-bold text-slate-800">
                      {new Set(boarders.map((b) => b.houseNumber)).size}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {t("withBoarders") || "With Boarders"}
                    </p>
                  </div>
                  <div className="bg-emerald-500 p-3 rounded-2xl shadow-sm text-white">
                    <Home className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg hover:scale-[1.02] transition-all bg-gradient-to-br from-white to-amber-50/50">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-amber-600/80 uppercase tracking-wider mb-1">
                      {t("forEmployment")}
                    </p>
                    <p className="text-3xl font-bold text-slate-800">
                      {boarders.filter((b) => b.purpose === "Job").length}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {t("boarders") || "Boarders"}
                    </p>
                  </div>
                  <div className="bg-amber-500 p-3 rounded-2xl shadow-sm text-white">
                    <Briefcase className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg hover:scale-[1.02] transition-all bg-gradient-to-br from-white to-purple-50/50">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-purple-600/80 uppercase tracking-wider mb-1">
                      {t("stayPurposes")}
                    </p>
                    <p className="text-3xl font-bold text-slate-800">
                      {Object.keys(purposeGroups).length}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {t("categories") || "Categories"}
                    </p>
                  </div>
                  <div className="bg-purple-500 p-3 rounded-2xl shadow-sm text-white">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart - Purpose Distribution */}
            <Card className="hover:shadow-md transition-all border-slate-200">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                <CardTitle className="text-lg text-slate-800 font-semibold">
                  {t("jobSector") || "Job Sector"}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sectorData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
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
                          fill={index === 0 ? "#3b82f6" : "#ec4899"} // Male / Female
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

          {/* Country Distribution Chart */}
          {countryData.length > 0 && (
            <Card className="hover:shadow-md transition-all border-slate-200 mt-6">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                <CardTitle className="text-lg text-slate-800 font-semibold">
                  {t("topCountriesOrigin")}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={countryData}
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
                      fill="#f59e0b"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={50}
                    />
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
                  placeholder={t("searchBoardersPlaceholder")}
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
                      <TableHead>{t("uniqueNo")}</TableHead>
                      <TableHead>{t("fullName")}</TableHead>
                      <TableHead>{t("houseNo")}</TableHead>
                      <TableHead>{t("address")}</TableHead>
                      <TableHead>{t("ageGender")}</TableHead>
                      <TableHead>{t("nic")}</TableHead>
                      <TableHead>{t("purpose")}</TableHead>
                      <TableHead>{t("countryOrigin")}</TableHead>
                      <TableHead>{t("employment")}</TableHead>
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
                        <TableCell className="font-medium">
                          {boarder.fullName}
                        </TableCell>
                        <TableCell>
                          <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full">
                            {boarder.houseNumber}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-gray-500">
                          {getHouseAddress(boarder.houseNumber)}
                        </TableCell>
                        <TableCell className="text-xs">
                          {boarder.age} /{" "}
                          {boarder.gender
                            ? t(boarder.gender.toLowerCase())
                            : "-"}
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
                            {boarder.purpose
                              ? t(boarder.purpose.toLowerCase())
                              : "-"}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm">
                          {boarder.boarderDistrict || "-"}
                        </TableCell>
                        <TableCell className="text-xs text-gray-600">
                          {boarder.jobType ? (
                            <span>
                              {t(boarder.jobType.toLowerCase()) ||
                                boarder.jobType}
                              {boarder.sector && (
                                <span className="text-gray-400">
                                  {" "}
                                  (
                                  {t(boarder.sector.toLowerCase()) ||
                                    boarder.sector}
                                  )
                                </span>
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
                        <TableCell
                          colSpan={9}
                          className="text-center text-gray-400 py-8"
                        >
                          {boarders.length === 0
                            ? t("noBoardersRegistered")
                            : t("noBoardersMatch")}
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-amber-600" />
              {t("boarderDetails")}
            </DialogTitle>
          </DialogHeader>
          {viewingBoarder && (
            <div className="space-y-6">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {viewingBoarder.fullName}
                    </h3>
                    <p className="text-amber-700 font-medium">
                      {t("id")}: {viewingBoarder.uniqueNumber}
                    </p>
                  </div>
                  <span className="bg-amber-100 text-amber-700 text-xs px-3 py-1.5 rounded-full font-medium">
                    {t("boarder")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-amber-700">
                  <Home className="h-4 w-4" />
                  <span className="font-medium">
                    {t("house")} {viewingBoarder.houseNumber}
                  </span>
                  <span className="text-amber-400">•</span>
                  <span className="text-sm">
                    {getHouseAddress(viewingBoarder.houseNumber)}
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
                    <p className="text-sm text-gray-600">{t("nic")}</p>
                    <p className="font-medium text-gray-900">
                      {viewingBoarder.nicNumber || t("notProvided")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t("birthYear")}</p>
                    <p className="font-medium text-gray-900">
                      {viewingBoarder.birthYear}{" "}
                      <span className="text-sm text-gray-500">
                        ({t("age")}: {viewingBoarder.age})
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t("gender")}</p>
                    <p className="font-medium text-gray-900">
                      {t(viewingBoarder.gender.toLowerCase()) ||
                        viewingBoarder.gender}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t("nationality")}</p>
                    <p className="font-medium text-gray-900">
                      {viewingBoarder.nationality}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t("religion")}</p>
                    <p className="font-medium text-gray-900">
                      {t(viewingBoarder.religion.toLowerCase()) ||
                        viewingBoarder.religion}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      {t("maritalStatus")}
                    </p>
                    <p className="font-medium text-gray-900">
                      {t(viewingBoarder.maritalStatus.toLowerCase()) ||
                        viewingBoarder.maritalStatus}
                    </p>
                  </div>
                </div>
              </div>

              {/* Boarder-Specific Information */}
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
                      {viewingBoarder.purpose
                        ? t(viewingBoarder.purpose.toLowerCase())
                        : t("notSpecified")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-amber-600">
                      {t("countryDistrictOrigin")}
                    </p>
                    <p className="font-medium text-amber-900">
                      {viewingBoarder.boarderDistrict ||
                        viewingBoarder.boarderCountry ||
                        t("notSpecified")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Employment Information */}
              {viewingBoarder.jobType && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 pb-2 border-b">
                    {t("employmentAndIncome")}
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">{t("jobType")}</p>
                      <p className="font-medium text-gray-900">
                        {viewingBoarder.jobType}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        {t("employmentSector")}
                      </p>
                      <p className="font-medium text-gray-900">
                        {t(viewingBoarder.sector.toLowerCase()) ||
                          viewingBoarder.sector ||
                          t("notSpecified")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        {t("monthlyIncome")}
                      </p>
                      <p className="font-medium text-gray-900">
                        {viewingBoarder.monthlyIncome || t("notSpecified")}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewDialog(false)}>{t("close")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
