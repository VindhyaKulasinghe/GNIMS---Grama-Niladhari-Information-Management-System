import { useLanguage } from "../context/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Home, Users, GraduationCap, Briefcase, UserCheck, Car } from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const incomeData = [
  { range: "<750", count: 45 },
  { range: "751-1499", count: 78 },
  { range: "1500-4999", count: 156 },
  { range: "5000-7999", count: 89 },
  { range: "8000-9999", count: 34 },
  { range: ">10000", count: 28 },
];

const educationData = [
  { name: "Primary", value: 89, color: "#3b82f6" },
  { name: "Secondary", value: 234, color: "#10b981" },
  { name: "A/L", value: 145, color: "#f59e0b" },
  { name: "Diploma", value: 67, color: "#8b5cf6" },
  { name: "Degree", value: 95, color: "#ec4899" },
];

const employmentData = [
  { sector: "Government", count: 123 },
  { sector: "Private", count: 198 },
  { sector: "Self-Employed", count: 87 },
  { sector: "Unemployed", count: 22 },
];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

export function Dashboard() {
  const { t } = useLanguage();

  const stats = [
    { 
      title: t("totalHouseholds"), 
      value: "430", 
      icon: Home, 
      color: "bg-blue-500",
      change: "+12 this month"
    },
    { 
      title: t("totalResidents"), 
      value: "1,856", 
      icon: Users, 
      color: "bg-green-500",
      change: "+23 this month"
    },
    { 
      title: t("studentsCount"), 
      value: "342", 
      icon: GraduationCap, 
      color: "bg-orange-500",
      change: "Active students"
    },
    { 
      title: t("employedResidents"), 
      value: "408", 
      icon: Briefcase, 
      color: "bg-purple-500",
      change: "Currently employed"
    },
    { 
      title: t("retiredPersons"), 
      value: "89", 
      icon: UserCheck, 
      color: "bg-pink-500",
      change: "Receiving pension"
    },
    { 
      title: t("registeredVehicles"), 
      value: "267", 
      icon: Car, 
      color: "bg-cyan-500",
      change: "Total vehicles"
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("dashboard")}</h1>
        <p className="text-gray-600 mt-1">Overview of village statistics and data</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <Card key={`stat-${idx}`} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-2">{stat.change}</p>
                </div>
                <div className={`${stat.color} p-4 rounded-lg`}>
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>{t("incomeDistribution")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart id="income-chart" data={incomeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3b82f6" name="Households" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Education Levels */}
        <Card>
          <CardHeader>
            <CardTitle>{t("educationLevels")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart id="education-chart">
                <Pie
                  data={educationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                >
                  {educationData.map((entry, index) => (
                    <Cell key={`edu-cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Employment Sectors */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t("employmentSectors")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart id="employment-chart" data={employmentData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="sector" type="category" />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#10b981" name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
