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

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      <header className="bg-slate-900/95 backdrop-blur-md text-white shadow-sm fixed top-0 left-0 right-0 z-[60] border-b border-slate-800 pt-[env(safe-area-inset-top)] lg:left-64 lg:w-[calc(100%-16rem)]">
        <div className="flex items-center justify-between gap-2 px-3 sm:px-6 min-h-14 sm:min-h-16 py-2 min-w-0">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white hover:bg-slate-800 shrink-0"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label={sidebarOpen ? "Close menu" : "Open menu"}
            >
              {sidebarOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="font-extrabold text-base sm:text-xl lg:text-2xl tracking-tight text-white truncate leading-tight">
                {t("appName")}
              </h1>
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.08em] font-semibold text-slate-400 leading-none mt-0.5 truncate">
                {displayDivision}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            <Select
              value={i18n.language}
              onValueChange={(val) => i18n.changeLanguage(val)}
            >
              <SelectTrigger className="w-10 sm:w-[8.75rem] bg-slate-800 border-slate-700 text-white hover:bg-slate-700 h-10 px-2 sm:px-3 text-base sm:text-sm justify-center sm:justify-between">
                <Globe className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline truncate">
                  <SelectValue />
                </span>
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="si">සිංහල</SelectItem>
                <SelectItem value="ta">தமிழ்</SelectItem>
              </SelectContent>
            </Select>

            <div className="hidden md:flex items-center gap-2 min-w-0 max-w-xs">
              <div className="h-8 w-8 shrink-0 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600">
                <span className="text-xs font-semibold">{avatarInitials}</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate" title={displayName}>
                  {displayName}
                </p>
                <p
                  className="text-xs text-slate-300 truncate"
                  title={displayDivision}
                >
                  {displayDivision}
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-slate-800 sm:size-auto sm:px-3 sm:gap-2"
              onClick={handleLogout}
              aria-label={t("logout")}
            >
              <LogOut className="h-5 w-5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">{t("logout")}</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex pt-[calc(3.5rem+env(safe-area-inset-top))] sm:pt-[calc(4rem+env(safe-area-inset-top))] lg:pt-[calc(4rem+env(safe-area-inset-top))]">
        <aside
          className={`
          fixed top-[calc(3.5rem+env(safe-area-inset-top))] sm:top-[calc(4rem+env(safe-area-inset-top))] bottom-0 left-0 z-[55] flex w-[min(88vw,16rem)] flex-col bg-slate-900 shadow-xl transform transition-transform duration-300 ease-in-out border-r border-slate-800
          lg:top-0 lg:z-30 lg:w-64 lg:shadow-none lg:pt-[env(safe-area-inset-top)]
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        >
          <div className="hidden lg:block px-4 py-4 border-b border-slate-800">
            <p className="font-bold text-white text-sm leading-tight truncate">
              {t("appName")}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-slate-400 mt-1 truncate">
              {displayDivision}
            </p>
          </div>
          <nav className="h-full overflow-y-auto overscroll-contain py-4 p-3 sm:p-4 space-y-1.5 lg:flex-1">
            {(user?.role === "Admin" ? adminNavigation : userNavigation).map(
              (item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                    flex items-center gap-3 px-4 py-3.5 rounded-lg transition-colors text-base sm:text-sm
                    ${
                      isActive
                        ? "bg-slate-800 text-white font-medium shadow-sm"
                        : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                    }
                  `}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    <span className="leading-snug">{t(item.name)}</span>
                  </Link>
                );
              },
            )}
          </nav>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[50] lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        <main className="relative z-0 flex-1 w-full min-w-0 max-w-full p-3 sm:p-6 lg:ml-64 lg:p-10 min-h-[calc(100vh-3.5rem-env(safe-area-inset-top))] sm:min-h-[calc(100vh-4rem-env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
