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
import { UserManagement } from "./pages/UserManagement";
import { NotFound } from "./pages/NotFound";
import { HouseholdDataProvider } from "./context/HouseholdDataContext";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

function RootWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <HouseholdDataProvider>
        {children}
      </HouseholdDataProvider>
    </AuthProvider>
  );
}

export const router = createBrowserRouter([
  // Public login route
  {
    path: "/login",
    element: <RootWrapper><Login /></RootWrapper>,
  },

  // Protected routes
  {
    element: <RootWrapper><Layout /></RootWrapper>,
    children: [
      { 
        index: true, 
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )
      },
      { 
        path: "households", 
        element: (
          <ProtectedRoute>
            <HouseholdManagement />
          </ProtectedRoute>
        )
      },
      { 
        path: "family-members", 
        element: (
          <ProtectedRoute>
            <FamilyMembers />
          </ProtectedRoute>
        )
      },
      { 
        path: "students", 
        element: (
          <ProtectedRoute>
            <Students />
          </ProtectedRoute>
        )
      },
      { 
        path: "property-land", 
        element: (
          <ProtectedRoute>
            <PropertyLand />
          </ProtectedRoute>
        )
      },
      { 
        path: "boarders", 
        element: (
          <ProtectedRoute>
            <Boarders />
          </ProtectedRoute>
        )
      },
      { 
        path: "animals", 
        element: (
          <ProtectedRoute>
            <Animals />
          </ProtectedRoute>
        )
      },
      { 
        path: "vehicles", 
        element: (
          <ProtectedRoute>
            <Vehicles />
          </ProtectedRoute>
        )
      },
      { 
        path: "reports", 
        element: (
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        )
      },
      { 
        path: "settings", 
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        )
      },
      { 
        path: "user-management", 
        element: (
          <ProtectedRoute requiredRole={["Admin"]}>
            <UserManagement />
          </ProtectedRoute>
        )
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);