import { createBrowserRouter } from "react-router-dom";

import DashboardPage from "../pages/DashboardPage";
import LoginPage from "../pages/LoginPage";
import InvoicesPage from "../pages/InvoicesPage";
import ProtectedRoute from "./ProtectedRoute";
import CreateInvoicePage from "../pages/CreateInvoicePage";
import InvoiceDetailsPage from "../pages/InvoiceDetailsPage";
import ReportsPage from "../pages/ReportsPage";
import UniversitiesPage from "../pages/UniversitiesPage";
import SubjectsPage from "../pages/SubjectsPage";
import UniversitySubjectsPage from "../pages/UniversitySubjectsPage";
import TeachingSessionsPage from "../pages/TeachingSessionsPage";
import ServiceActivitiesPage from "../pages/ServiceActivitiesPage";
import ServiceTypesPage from "../pages/ServiceTypesPage";
import UsersPage from "../pages/UsersPage";
import RegisterPage from "../pages/RegisterPage";
import HomePage from "../pages/HomePage";
import SubscriptionPage from "../pages/SubscriptionPage";
import ProfilePage from "../pages/ProfilePage";

export const router = createBrowserRouter([

  /*
  public pages
  */

  {
    path: "/",
    element: <HomePage />
  },

  {
    path: "/login",
    element: <LoginPage />
  },

  {
    path: "/register",
    element: <RegisterPage />
  },

  {
    path: "/subscription",
    element: <SubscriptionPage />
  },

  /*
  protected pages
  */

  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    )
  },

  {
    path: "/invoices",
    element: (
      <ProtectedRoute>
        <InvoicesPage />
      </ProtectedRoute>
    )
  },

  {
    path: "/create-invoice",
    element: (
      <ProtectedRoute>
        <CreateInvoicePage />
      </ProtectedRoute>
    )
  },

  {
    path: "/invoices/:id",
    element: (
      <ProtectedRoute>
        <InvoiceDetailsPage />
      </ProtectedRoute>
    )
  },

  {
    path: "/reports",
    element: (
      <ProtectedRoute>
        <ReportsPage />
      </ProtectedRoute>
    )
  },

  {
    path: "/universities",
    element: (
      <ProtectedRoute>
        <UniversitiesPage />
      </ProtectedRoute>
    )
  },

  {
    path: "/subjects",
    element: (
      <ProtectedRoute>
        <SubjectsPage />
      </ProtectedRoute>
    )
  },

  {
    path: "/university-subjects",
    element: (
      <ProtectedRoute>
        <UniversitySubjectsPage />
      </ProtectedRoute>
    )
  },

  {
    path: "/teaching-sessions",
    element: (
      <ProtectedRoute>
        <TeachingSessionsPage />
      </ProtectedRoute>
    )
  },

  {
    path: "/service-activities",
    element: (
      <ProtectedRoute>
        <ServiceActivitiesPage />
      </ProtectedRoute>
    )
  },

  {
    path: "/service-types",
    element: (
      <ProtectedRoute>
        <ServiceTypesPage />
      </ProtectedRoute>
    )
  },

  {
    path: "/users",
    element: (
      <ProtectedRoute>
        <UsersPage />
      </ProtectedRoute>
    )
  },

  {
path:"/profile",
element:(
<ProtectedRoute>
<ProfilePage/>
</ProtectedRoute>
)
}

]);