import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, LayoutDashboard, Upload, History, LogOut, Menu, X, ChevronRight } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { to: '/app', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/app/analyze', icon: Upload, label: 'Analisis Kontrak' },
  { to: '/app/history', icon: History, label: 'Riwayat Analisis' },
];

export default function Layout() {
  const { user, setUser, toggleSidebar, sidebarOpen } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    toast.success('Berhasil keluar.');
    navigate('/');
  };

  const isActive = (to: string, exact?: boolean) =>
    exact ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar backdrop (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 w-64 flex flex-col bg-brand-900 text-white transition-transform duration-300',
          'lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-brand-800">
          <div className="flex items-center justify-center w-9 h-9 bg-brand-500 rounded-lg">
            <Shield className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">ContractGuard</span>
          <button className="ml-auto lg:hidden" onClick={toggleSidebar}>
            <X className="w-5 h-5 text-brand-300" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ to, icon: Icon, label, exact }) => (
            <Link
              key={to}
              to={to}
              onClick={() => sidebarOpen && toggleSidebar()}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive(to, exact)
                  ? 'bg-brand-700 text-white'
                  : 'text-brand-200 hover:bg-brand-800 hover:text-white',
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{label}</span>
              {isActive(to, exact) && <ChevronRight className="w-3 h-3 ml-auto opacity-60" />}
            </Link>
          ))}
        </nav>

        {/* User info */}
        <div className="px-3 py-4 border-t border-brand-800">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center text-sm font-bold">
              {user?.name?.charAt(0).toUpperCase() ?? 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name ?? 'Pengguna'}</p>
              <p className="text-xs text-brand-300 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-brand-300 hover:bg-brand-800 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Keluar
          </button>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center gap-4 px-6 py-4 bg-white border-b border-gray-200 lg:px-8">
          <button
            className="lg:hidden p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            onClick={toggleSidebar}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="text-sm text-gray-500">
            Paket:{' '}
            <span className="font-semibold text-brand-600 capitalize">{user?.plan ?? 'free'}</span>
          </div>
          <div className="ml-auto text-sm text-gray-500">
            {user && (
              <>
                <span className="font-medium text-gray-700">{user.analysisCount}</span>/{user.analysisLimit} analisis
              </>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="page-enter">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
