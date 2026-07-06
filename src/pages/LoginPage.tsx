import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Shield, Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useTranslation } from '@/hooks/useTranslation';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { generateId } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const isRegister = searchParams.get('mode') === 'register';
  const navigate = useNavigate();
  const setUser = useAppStore((s) => s.setUser);
  const { t } = useTranslation();

  const [mode, setMode] = useState<'login' | 'register'>(isRegister ? 'register' : 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    if (mode === 'register' && !name) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setUser({
      id: generateId(),
      email,
      name: mode === 'register' ? name : email.split('@')[0],
      plan: 'free',
      analysisCount: 0,
      analysisLimit: 3,
      createdAt: new Date(),
    });
    toast.success(mode === 'register' ? t.auth.registerSuccess : t.auth.loginSuccess);
    setLoading(false);
    navigate('/app');
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setUser({ id: 'demo-user', email: 'demo@contractguard.id', name: 'Demo User', plan: 'pro', analysisCount: 5, analysisLimit: 999, createdAt: new Date() });
    toast.success(t.auth.demoSuccess);
    setLoading(false);
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex justify-between items-center pt-10 pb-6 px-6 max-w-md mx-auto w-full">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-gray-900 text-xl">{t.common.appName}</span>
        </Link>
        <LanguageSwitcher />
      </div>

      <div className="flex-1 flex items-start justify-center px-4 pt-2">
        <div className="w-full max-w-md card p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-1">
            {mode === 'login' ? t.auth.loginTitle : t.auth.registerTitle}
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            {mode === 'login' ? t.auth.loginSubtitle : t.auth.registerSubtitle}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="label">{t.auth.name}</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" className="input pl-10" placeholder={t.auth.namePlaceholder} value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
              </div>
            )}
            <div>
              <label className="label">{t.auth.email}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" className="input pl-10" placeholder={t.auth.emailPlaceholder} value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>
            <div>
              <label className="label">{t.auth.password}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} className="input pl-10 pr-10" placeholder={t.auth.passwordPlaceholder} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => setShowPassword((v) => !v)}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn-primary w-full py-3 mt-2" disabled={loading}>
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" />{mode === 'login' ? t.auth.loggingIn : t.auth.registering}</>
              ) : mode === 'login' ? t.auth.loginBtn : t.auth.registerBtn}
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-3 text-gray-500">{t.common.or}</span></div>
          </div>

          <button onClick={handleDemoLogin} className="btn-secondary w-full py-2.5" disabled={loading}>
            {t.auth.demoLogin}
          </button>

          <p className="text-sm text-center text-gray-500 mt-5">
            {mode === 'login' ? t.auth.noAccount : t.auth.hasAccount}{' '}
            <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-brand-600 font-medium hover:underline">
              {mode === 'login' ? t.auth.registerFree : t.auth.loginHere}
            </button>
          </p>
        </div>
      </div>
      <p className="text-center text-xs text-gray-400 py-6">© 2026 {t.common.appName} · {t.common.disclaimerShort}</p>
    </div>
  );
}
