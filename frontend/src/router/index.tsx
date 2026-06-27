import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "../layouts/app-shell";
import { Skeleton } from "../components/ui/feedback";

const LandingPage = lazy(() => import("../pages/landing-page"));
const UploadPage = lazy(() => import("../pages/upload-page"));
const InterviewPage = lazy(() => import("../pages/interview-page"));
const ReportPage = lazy(() => import("../pages/report-page"));
const DashboardPage = lazy(() => import("../pages/dashboard-page"));
const ReportsPage = lazy(() => import("../pages/reports-page"));
const SettingsPage = lazy(() => import("../pages/settings-page"));
const NotFoundPage = lazy(() => import("../pages/not-found-page"));

function LoadingPage() {
  return <div className="mx-auto max-w-6xl space-y-5 p-6 pt-24"><Skeleton className="h-10 w-64" /><Skeleton className="h-5 w-96 max-w-full" /><div className="grid gap-4 pt-8 md:grid-cols-3"><Skeleton className="h-48" /><Skeleton className="h-48" /><Skeleton className="h-48" /></div></div>;
}

const suspend = (element: React.ReactNode) => <Suspense fallback={<LoadingPage />}>{element}</Suspense>;

export const router = createBrowserRouter([
  { path: "/", element: suspend(<LandingPage />) },
  { path: "/upload", element: suspend(<UploadPage />) },
  { path: "/interview", element: suspend(<InterviewPage />) },
  { path: "/report", element: suspend(<ReportPage />) },
  { path: "/report/:reportId", element: suspend(<ReportPage />) },
  {
    path: "/app",
    element: <AppShell />,
    children: [
      { index: true, element: suspend(<DashboardPage />) },
      { path: "reports", element: suspend(<ReportsPage />) },
      { path: "settings", element: suspend(<SettingsPage />) },
    ],
  },
  { path: "*", element: suspend(<NotFoundPage />) },
]);
