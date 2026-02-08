import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 bg-[var(--bg-tertiary)] rounded-lg p-1">
      <button
        onClick={() => setTheme('light')}
        className={`p-2 rounded-md transition-all duration-200 ${
          theme === 'light'
            ? 'bg-[var(--card-bg)] text-primary-600 shadow-sm'
            : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
        }`}
        title="Modo claro"
      >
        <Sun className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`p-2 rounded-md transition-all duration-200 ${
          theme === 'dark'
            ? 'bg-[var(--card-bg)] text-primary-600 shadow-sm'
            : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
        }`}
        title="Modo oscuro"
      >
        <Moon className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`p-2 rounded-md transition-all duration-200 ${
          theme === 'system'
            ? 'bg-[var(--card-bg)] text-primary-600 shadow-sm'
            : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
        }`}
        title="Según sistema"
      >
        <Monitor className="w-4 h-4" />
      </button>
    </div>
  );
}
