import { Outlet, Link, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Home,
  Users,
  GraduationCap,
  Landmark,
  UserPlus,
  PawPrint,
  Car,
  FileText,
  Settings as SettingsIcon,
  Menu,
  X,
  Globe,
  LogOut
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const navigation = [
  { name: "dashboard", icon: LayoutDashboard, path: "/" },
  { name: "householdManagement", icon: Home, path: "/households" },
  { name: "familyMembers", icon: Users, path: "/family-members" },
  { name: "students", icon: GraduationCap, path: "/students" },
  { name: "propertyLand", icon: Landmark, path: "/property-land" },
  { name: "boarders", icon: UserPlus, path: "/boarders" },
  { name: "animals", icon: PawPrint, path: "/animals" },
  { name: "vehicles", icon: Car, path: "/vehicles" },
  { name: "reports", icon: FileText, path: "/reports" },
  { name: "settings", icon: SettingsIcon, path: "/settings" },
];

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { isAuthenticated, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Don't render layout if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900/95 backdrop-blur-md text-white shadow-sm fixed top-0 left-0 right-0 z-50 border-b border-slate-800">
        <div className="flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white hover:bg-slate-800"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
            <div>
              <h1 className="font-extrabold text-xl lg:text-2xl tracking-tight text-white">{t("appName")}</h1>
              <p className="text-[10px] uppercase tracking-[0.1em] font-semibold text-slate-400 hidden sm:block leading-none mt-0.5">{t("southernProvinceHambantota")}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Select value={i18n.language} onValueChange={(val) => i18n.changeLanguage(val)}>
              <SelectTrigger className="w-[140px] bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
                <Globe className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="si">සිංහල</SelectItem>
                <SelectItem value="ta">தமிழ்</SelectItem>
              </SelectContent>
            </Select>

            <div className="hidden sm:flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600">
                <span className="text-sm font-medium">GN</span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{t("gnOfficerLabel")}</p>
                <p className="text-xs text-slate-300">{t("hambantotaDivision")}</p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-slate-800 gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">{t("logout")}</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar - Fixed */}
        <aside className={`
          fixed top-16 bottom-0 left-0 z-40 w-64 bg-slate-900 shadow-xl transform transition-transform duration-300 ease-in-out border-r border-slate-800
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <nav className="h-full overflow-y-auto py-10 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${isActive
                      ? 'bg-slate-800 text-white font-medium shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                    }
                  `}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-sm">{t(item.name)}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 p-6 lg:p-10 min-h-[calc(100vh-64px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}