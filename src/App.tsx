import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';
import Layout from '@/components/layout/Layout';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import AnalyzePage from '@/pages/AnalyzePage';
import ResultPage from '@/pages/ResultPage';
import HistoryPage from '@/pages/HistoryPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useAppStore((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected routes */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="analyze" element={<AnalyzePage />} />
        <Route path="result/:id" element={<ResultPage />} />
        <Route path="history" element={<HistoryPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
