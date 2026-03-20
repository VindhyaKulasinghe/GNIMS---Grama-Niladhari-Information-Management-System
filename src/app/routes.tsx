import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/Layout";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { HouseholdManagement } from "./pages/HouseholdManagement";
import { FamilyMembers } from "./pages/FamilyMembers";
import { Students } from "./pages/Students";
import { PropertyLand } from "./pages/PropertyLand";
import { Boarders } from "./pages/Boarders";
import { Animals } from "./pages/Animals";
import { Vehicles } from "./pages/Vehicles";
import { Reports } from "./pages/Reports";
import { Settings } from "./pages/Settings";
import { NotFound } from "./pages/NotFound";
import { LanguageProvider } from "./context/LanguageContext";
import { HouseholdDataProvider } from "./context/HouseholdDataContext";
import { AuthProvider } from "./context/AuthContext";

function RootWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LanguageProvider>
        <HouseholdDataProvider>
          {children}
        </HouseholdDataProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export const router = createBrowserRouter([
  {
    element: <RootWrapper><Layout /></RootWrapper>,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "households", element: <HouseholdManagement /> },
      { path: "family-members", element: <FamilyMembers /> },
      { path: "students", element: <Students /> },
      { path: "property-land", element: <PropertyLand /> },
      { path: "boarders", element: <Boarders /> },
      { path: "animals", element: <Animals /> },
      { path: "vehicles", element: <Vehicles /> },
      { path: "reports", element: <Reports /> },
      { path: "settings", element: <Settings /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    path: "/login",
    element: <RootWrapper><Login /></RootWrapper>,
  },
]);