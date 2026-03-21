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
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

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
            <Card className="hover:shadow-lg hover:scale-[1.02] transition-all bg-gradient-to-br from-white to-blue-50/50">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-blue-600/80 uppercase tracking-wider mb-1">{t("totalStudents")}</p>
                    <p className="text-3xl font-bold text-slate-800">{students.length}</p>
                    <p className="text-xs text-slate-500 mt-1">{t("active") || "Active"}</p>
                  </div>
                  <div className="bg-blue-500 p-3 rounded-2xl shadow-sm text-white">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg hover:scale-[1.02] transition-all bg-gradient-to-br from-white to-emerald-50/50">
               <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-emerald-600/80 uppercase tracking-wider mb-1">{t("institutions")}</p>
                      <p className="text-3xl font-bold text-slate-800">{new Set(students.map((s) => s.institutionName)).size}</p>
                      <p className="text-xs text-slate-500 mt-1">{t("schools") || "Schools/Universities"}</p>
                    </div>
                    <div className="bg-emerald-500 p-3 rounded-2xl shadow-sm text-white">
                      <Users className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg hover:scale-[1.02] transition-all bg-gradient-to-br from-white to-amber-50/50">
               <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-amber-600/80 uppercase tracking-wider mb-1">{t("households")}</p>
                      <p className="text-3xl font-bold text-slate-800">{new Set(students.map((s) => s.houseNumber)).size}</p>
                      <p className="text-xs text-slate-500 mt-1">{t("withStudents") || "With Students"}</p>
                    </div>
                    <div className="bg-amber-500 p-3 rounded-2xl shadow-sm text-white">
                      <Home className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg hover:scale-[1.02] transition-all bg-gradient-to-br from-white to-purple-50/50">
               <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-purple-600/80 uppercase tracking-wider mb-1">{t("gradeLevels")}</p>
                      <p className="text-3xl font-bold text-slate-800">{Object.keys(gradeGroups).length}</p>
                      <p className="text-xs text-slate-500 mt-1">{t("differentGrades") || "Different Grades"}</p>
                    </div>
                    <div className="bg-purple-500 p-3 rounded-2xl shadow-sm text-white">
                      <GraduationCap className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart - Gender Distribution */}
            <Card className="hover:shadow-md transition-all border-slate-200">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                <CardTitle className="text-lg text-slate-800 font-semibold">{t("genderDistribution")}</CardTitle>
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
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      dataKey="value"
                    >
                      {genderData.map((entry, index) => (
                        <Cell
                          key={`gender-${entry.name}-${index}`}
                          fill={index === 0 ? "#3b82f6" : "#ec4899"} // Male / Female
                        />
                      ))}
                    </Pie>
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Bar Chart - Top Institutions */}
            <Card className="hover:shadow-md transition-all border-slate-200">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                <CardTitle className="text-lg text-slate-800 font-semibold">{t("topInstitutions")}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={institutionData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" angle={-15} textAnchor="end" height={80} fontSize={11} axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Grade Distribution Chart */}
          {gradeData.length > 0 && (
            <Card className="hover:shadow-md transition-all border-slate-200 mt-6">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                <CardTitle className="text-lg text-slate-800 font-semibold">{t("studentsByGrade")}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={gradeData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} />
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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