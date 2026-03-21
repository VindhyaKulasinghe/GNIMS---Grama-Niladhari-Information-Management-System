import { useState } from "react";
import { useTranslation } from "react-i18next";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Search, GraduationCap, Home, Users, BarChart3, List, MapPin, Phone } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function Students() {
  const { t } = useTranslation();
  const { getStudents, households } = useHouseholdData();
  const [searchQuery, setSearchQuery] = useState("");

  // View dialog state
  const [viewDialog, setViewDialog] = useState(false);
  const [viewingStudent, setViewingStudent] = useState<any>(null);

  const students = getStudents();

  const filteredStudents = students.filter(
    (s) =>
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.houseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.institutionName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.grade || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getHouseAddress = (houseNumber: string) => {
    const house = households.find((h) => h.houseNumber === houseNumber);
    return house?.address || "";
  };

  const gradeGroups = filteredStudents.reduce<Record<string, number>>(
    (acc, s) => {
      const g = s.grade || "Unknown";
      acc[g] = (acc[g] || 0) + 1;
      return acc;
    },
    {}
  );

  const institutionGroups = filteredStudents.reduce<Record<string, number>>(
    (acc, s) => {
      const inst = s.institutionName || "Unknown";
      acc[inst] = (acc[inst] || 0) + 1;
      return acc;
    },
    {}
  );

  // Analytics data for charts
  const genderData = [
    { name: t("male"), value: students.filter((s) => s.gender === "Male").length },
    { name: t("female"), value: students.filter((s) => s.gender === "Female").length },
  ].filter(item => item.value > 0);

  const gradeData = Object.entries(gradeGroups).map(([name, value]) => ({
    name,
    value,
  }));

  const institutionData = Object.entries(institutionGroups)
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
          <h1 className="text-3xl font-bold text-slate-900">{t("students")}</h1>
          <p className="text-slate-600 mt-1">
            {t("studentsDescription")}
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            {t("overview")}
          </TabsTrigger>
          <TabsTrigger value="all-students" className="gap-2">
            <List className="h-4 w-4" />
            {t("allStudents")}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-blue-600 text-white border-blue-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <GraduationCap className="h-10 w-10 text-white/90" />
                  <div>
                    <p className="text-sm text-blue-100">{t("totalStudents")}</p>
                    <p className="text-3xl font-bold">{students.length}</p>
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
                    <p className="text-sm text-green-100">{t("households")}</p>
                    <p className="text-3xl font-bold">
                      {new Set(students.map((s) => s.houseNumber)).size}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-orange-600 text-white border-orange-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-orange-100">{t("institutions")}</p>
                    <p className="text-3xl font-bold">
                      {new Set(students.map((s) => s.institutionName)).size}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-purple-600 text-white border-purple-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <span className="text-2xl font-bold">{Object.keys(gradeGroups).length}</span>
                  </div>
                  <div>
                    <p className="text-sm text-purple-100">{t("gradeLevels")}</p>
                    <p className="text-xl font-semibold">{t("tracked")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart - Gender Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>{t("genderDistribution")}</CardTitle>
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

            {/* Bar Chart - Top Institutions */}
            <Card>
              <CardHeader>
                <CardTitle>{t("topInstitutions")}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={institutionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-15} textAnchor="end" height={80} fontSize={11} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Grade Distribution Chart */}
          {gradeData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t("studentsByGrade")}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={gradeData}>
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
        </TabsContent>

        {/* All Students Tab */}
        <TabsContent value="all-students" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder={t("searchStudentsPlaceholder")}
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
                      <TableHead>{t("age")}</TableHead>
                      <TableHead>{t("gender")}</TableHead>
                      <TableHead>{t("grade")}</TableHead>
                      <TableHead>{t("institutionName")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow 
                        key={student.id}
                        className="cursor-pointer hover:bg-blue-50"
                        onClick={() => {
                          setViewingStudent(student);
                          setViewDialog(true);
                        }}
                      >
                        <TableCell className="font-medium text-gray-500 text-xs">
                          {student.uniqueNumber}
                        </TableCell>
                        <TableCell className="font-medium">{student.fullName}</TableCell>
                        <TableCell>
                          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                            {student.houseNumber}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-gray-500">
                          {getHouseAddress(student.houseNumber)}
                        </TableCell>
                        <TableCell>{student.age}</TableCell>
                        <TableCell className="text-xs">{student.gender ? t(student.gender.toLowerCase()) : "-"}</TableCell>
                        <TableCell>
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded">
                            {student.grade || "-"}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm">{student.institutionName || "-"}</TableCell>
                      </TableRow>
                    ))}
                    {filteredStudents.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-gray-400 py-8">
                          {students.length === 0
                            ? t("noStudentsRegistered")
                            : t("noStudentsMatch")}
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

      {/* View Student Details Dialog */}
      <Dialog open={viewDialog} onOpenChange={setViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-blue-600" />
              {t("studentDetails")}
            </DialogTitle>
          </DialogHeader>
          {viewingStudent && (
            <div className="space-y-6">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{viewingStudent.fullName}</h3>
                    <p className="text-blue-700 font-medium">{t("id") || "ID"}: {viewingStudent.uniqueNumber}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1.5 rounded-full font-medium">
                    {t("student")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-blue-700">
                  <Home className="h-4 w-4" />
                  <span className="font-medium">{t("house")} {viewingStudent.houseNumber}</span>
                  <span className="text-blue-400">•</span>
                  <span className="text-sm">{getHouseAddress(viewingStudent.houseNumber)}</span>
                </div>
              </div>

              {/* Personal Information */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 pb-2 border-b">{t("personalInformation")}</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">{t("nic") || "NIC"}</p>
                    <p className="font-medium text-gray-900">{viewingStudent.nicNumber || t("notProvided")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t("birthYear")}</p>
                    <p className="font-medium text-gray-900">
                      {viewingStudent.birthYear} <span className="text-sm text-gray-500">({t("age")}: {viewingStudent.age})</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t("gender")}</p>
                    <p className="font-medium text-gray-900">{viewingStudent.gender ? t(viewingStudent.gender.toLowerCase()) : "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t("nationality")}</p>
                    <p className="font-medium text-gray-900">{viewingStudent.nationality}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t("religion")}</p>
                    <p className="font-medium text-gray-900">{viewingStudent.religion}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t("educationStatus")}</p>
                    <p className="font-medium text-gray-900">{viewingStudent.educationStatus}</p>
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  {t("academicInformation")}
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-green-600">{t("gradeYearStudy")}</p>
                    <p className="font-medium text-green-900">{viewingStudent.grade || t("notSpecified")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-green-600">{t("institutionName")}</p>
                    <p className="font-medium text-green-900">{viewingStudent.institutionName || t("notSpecified")}</p>
                  </div>
                </div>
              </div>

              {/* Employment Information (if any) */}
              {viewingStudent.jobType && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 pb-2 border-b">{t("employmentAndIncome")}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">{t("jobType")}</p>
                      <p className="font-medium text-gray-900">{viewingStudent.jobType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{t("monthlyIncome")}</p>
                      <p className="font-medium text-gray-900">{viewingStudent.monthlyIncome || t("notSpecified")}</p>
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