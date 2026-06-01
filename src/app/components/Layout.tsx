import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
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
  LogOut,
  UserCog,
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

const adminNavigation = [
  { name: "divisionManagement", icon: Landmark, path: "/divisions" },
  { name: "userManagement", icon: UserCog, path: "/user-management" },
];

const userNavigation = [
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
  const { isAuthenticated, loading, logout, user } = useAuth();
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

  const displayName = user?.fullName?.trim() || t("gnOfficerLabel");
  const displayDivision =
    user?.division?.trim() ||
    (user?.role === "Admin"
      ? t("admin")
      : user?.role === "Divisional Secretariat"
        ? t("divisionalSecretariat")
        : t("hambantotaDivision"));

  const avatarInitials =
    user?.fullName
      ?.trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "GN";

  // Don't render layout if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* Header — full width on mobile; beside sidebar on lg+ */}
      <header className="bg-slate-900/95 backdrop-blur-md text-white shadow-sm fixed top-0 left-0 right-0 z-50 border-b border-slate-800 lg:left-64 lg:w-[calc(100%-16rem)]">
        <div className="flex items-center justify-between gap-2 px-3 sm:px-6 min-h-16 py-2 min-w-0">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white hover:bg-slate-800 shrink-0"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
            <div className="min-w-0">
              <h1 className="font-extrabold text-lg sm:text-xl lg:text-2xl tracking-tight text-white truncate leading-tight">{t("appName")}</h1>
              <p className="text-xs sm:text-[10px] uppercase tracking-[0.1em] font-semibold text-slate-400 leading-none mt-0.5 truncate">{displayDivision}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
            <Select value={i18n.language} onValueChange={(val) => i18n.changeLanguage(val)}>
              <SelectTrigger className="w-[6.5rem] sm:w-[140px] bg-slate-800 border-slate-700 text-white hover:bg-slate-700 h-10 px-2 sm:px-3 text-base sm:text-sm">
                <Globe className="h-4 w-4 sm:mr-2 shrink-0" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="si">සිංහල</SelectItem>
                <SelectItem value="ta">தமிழ்</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 min-w-0 max-w-[5rem] sm:max-w-[12rem] md:max-w-xs">
              <div className="h-9 w-9 sm:h-8 sm:w-8 shrink-0 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600">
                <span className="text-sm sm:text-xs font-semibold">{avatarInitials}</span>
              </div>
              <div className="min-w-0 hidden sm:block">
                <p className="text-sm font-medium truncate" title={displayName}>
                  {displayName}
                </p>
                <p className="text-xs text-slate-300 truncate hidden md:block" title={displayDivision}>
                  {displayDivision}
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-slate-800 gap-2 px-2 sm:px-3"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">{t("logout")}</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex pt-[4.75rem] sm:pt-16 lg:pt-16">
        {/* Sidebar — drawer on mobile; fixed column on desktop */}
        <aside className={`
          fixed top-16 bottom-0 left-0 z-40 flex w-[min(88vw,16rem)] flex-col bg-slate-900 shadow-xl transform transition-transform duration-300 ease-in-out border-r border-slate-800
          lg:top-0 lg:z-30 lg:w-64 lg:shadow-none
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="hidden lg:block px-4 py-4 border-b border-slate-800">
            <p className="font-bold text-white text-sm leading-tight truncate">{t("appName")}</p>
            <p className="text-[10px] uppercase tracking-wider text-slate-400 mt-1 truncate">{displayDivision}</p>
          </div>
          <nav className="h-full overflow-y-auto py-4 p-3 sm:p-4 space-y-1.5 lg:flex-1">
            {(user?.role === "Admin" ? adminNavigation : userNavigation).map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3.5 rounded-lg transition-colors text-base sm:text-sm
                    ${isActive
                      ? 'bg-slate-800 text-white font-medium shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                    }
                  `}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span>{t(item.name)}</span>
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

        {/* Main Content — offset matches sidebar (w-64) and header height */}
        <main className="relative z-0 flex-1 w-full min-w-0 max-w-full p-3 sm:p-6 lg:ml-64 lg:p-10 min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}