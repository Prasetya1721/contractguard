import { Moon, Sun } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/lib/utils';

interface DarkModeToggleProps {
  className?: string;
}

export default function DarkModeToggle({ className }: DarkModeToggleProps) {
  const { darkMode, toggleDarkMode } = useAppStore();

  return (
    <button
      onClick={toggleDarkMode}
      title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={cn(
        'relative flex items-center justify-center w-9 h-9 rounded-lg transition-colors',
        'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800',
        className,
      )}
      aria-label={darkMode ? 'Light mode' : 'Dark mode'}
    >
      {darkMode ? (
        <Sun className="w-4 h-4 text-amber-400" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </button>
  );
}
