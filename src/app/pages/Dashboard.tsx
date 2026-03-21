import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHouseholdData } from "../context/HouseholdDataContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Home,
  Users,
  GraduationCap,
  Briefcase,
  UserCheck,
  Car,
} from "lucide-react";
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

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

export function Dashboard() {
  const { t } = useTranslation();
  const { households, familyMembers, vehicles, loading, error } =
    useHouseholdData();

  // Calculate statistics from real data
  const stats = useMemo(() => {
    const totalHouseholds = households.length;
    const totalResidents = familyMembers.length;
    const students = familyMembers.filter(
      (m) => m.memberType === "student",
    ).length;
    const employed = familyMembers.filter(
      (m) => m.jobType && m.jobType.trim().length > 0,
    ).length;
    const retired = familyMembers.filter(
      (m) =>
        m.trainingReceived?.toLowerCase().includes("retired") ||
        m.sector?.toLowerCase().includes("retired"),
    ).length;
    const totalVehicles = vehicles.length;

    return [
      {
        title: t("totalHouseholds"),
        value: totalHouseholds.toString(),
        icon: Home,
        color: "bg-blue-500",
        change: t("registeredHouseholds"),
      },
      {
        title: t("totalResidents"),
        value: totalResidents.toString(),
        icon: Users,
        color: "bg-green-500",
        change: t("totalMembers"),
      },
      {
        title: t("studentsCount"),
        value: students.toString(),
        icon: GraduationCap,
        color: "bg-orange-500",
        change: t("activeStudents"),
      },
      {
        title: t("employedResidents"),
        value: employed.toString(),
        icon: Briefcase,
        color: "bg-purple-500",
        change: t("currentlyEmployed"),
      },
      {
        title: t("retiredPersons"),
        value: retired.toString(),
        icon: UserCheck,
        color: "bg-pink-500",
        change: t("retiredPersons"),
      },
      {
        title: t("registeredVehicles"),
        value: totalVehicles.toString(),
        icon: Car,
        color: "bg-cyan-500",
        change: t("totalVehicles"),
      },
    ];
  }, [households, familyMembers, vehicles, t]);

  // Calculate income distribution
  const incomeData = useMemo(() => {
    const ranges = {
      "<750": 0,
      "751-1499": 0,
      "1500-4999": 0,
      "5000-7999": 0,
      "8000-9999": 0,
      ">10000": 0,
    };

    familyMembers.forEach((member) => {
      if (member.monthlyIncome) {
        const income = parseInt(member.monthlyIncome) || 0;
        if (income < 750) ranges["<750"]++;
        else if (income <= 1499) ranges["751-1499"]++;
        else if (income <= 4999) ranges["1500-4999"]++;
        else if (income <= 7999) ranges["5000-7999"]++;
        else if (income <= 9999) ranges["8000-9999"]++;
        else ranges[">10000"]++;
      }
    });

    return Object.entries(ranges).map(([range, count]) => ({ range, count }));
  }, [familyMembers]);

  // Calculate education distribution
  const educationData = useMemo(() => {
    const education: Record<string, { value: number; color: string }> = {};
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];
    let colorIdx = 0;

    familyMembers.forEach((member) => {
      const status = member.educationStatus || "Unknown";
      if (!education[status]) {
        education[status] = {
          value: 0,
          color: colors[colorIdx++ % colors.length],
        };
      }
      education[status].value++;
    });

    return Object.entries(education).map(([name, data]) => ({ name, ...data }));
  }, [familyMembers]);

  // Calculate employment sectors
  const employmentData = useMemo(() => {
    const sectors: Record<string, number> = {};

    familyMembers.forEach((member) => {
      const sector = member.sector || "Unknown";
      sectors[sector] = (sectors[sector] || 0) + 1;
    });

    // Function to translate sector names
    const translateSector = (sector: string) => {
      switch (sector.toLowerCase()) {
        case "unknown":
          return t("unknown");
        case "government":
          return t("government");
        case "private":
          return t("private");
        case "agricultural":
          return t("agricultural");
        default:
          return sector;
      }
    };

    return Object.entries(sectors).map(([sector, count]) => ({
      sector: translateSector(sector),
      count,
    }));
  }, [familyMembers, t]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("dashboard")}</h1>
        <p className="text-gray-600 mt-1">{t("overviewVillageStats")}</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error loading data: {error}
        </div>
      )}

      <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((stat, idx) => (
              <Card
                key={`stat-${idx}`}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {stat.change}
                      </p>
                    </div>
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <stat.icon className="h-6 w-6 text-white" />
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
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart id="income-chart" data={incomeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="count"
                      fill="#3b82f6"
                      name={t("households")}
                    />
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
                <ResponsiveContainer width="100%" height={260}>
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
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart id="employment-chart" data={employmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="sector" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#10b981" name={t("count")} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </>
    </div>
  );
}
