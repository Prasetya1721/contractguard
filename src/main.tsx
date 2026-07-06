import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';
import { useAppStore, applyDarkMode } from './store/appStore';

// Apply persisted dark mode preference BEFORE first render to avoid flash
const stored = localStorage.getItem('contractguard-storage');
if (stored) {
  try {
    const parsed = JSON.parse(stored) as { state?: { darkMode?: boolean } };
    if (parsed?.state?.darkMode) applyDarkMode(true);
  } catch { /* ignore */ }
}

// Rehydrate dark mode after store is ready
function DarkModeSync() {
  const { darkMode } = useAppStore();
  React.useEffect(() => { applyDarkMode(darkMode); }, [darkMode]);
  return null;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <DarkModeSync />
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '10px',
            background: '#1f2328',
            color: '#fff',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>,
);
