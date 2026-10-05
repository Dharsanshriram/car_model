import React from 'react';
import { Sun, Moon, Scale, ShieldCheck, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  onOpenCompare: () => void;
  onOpenAdmin: () => void;
  compareCount: number;
  activeView: 'showroom' | 'database';
  setActiveView: (view: 'showroom' | 'database') => void;
  onScrollToSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCompare,
  onOpenAdmin,
  compareCount,
  activeView,
  setActiveView,
  onScrollToSearch
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Single element wordmark */}
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); setActiveView('showroom'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2 group shrink-0"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 group-hover:scale-125 transition-transform" />
          <span className="font-display">APEXMOTIV</span>
        </a>

        {/* Zone 2: Clean 4 nav links, single-line */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button
            onClick={() => { setActiveView('showroom'); }}
            className={`transition-colors whitespace-nowrap cursor-pointer ${
              activeView === 'showroom' 
                ? 'text-amber-500 font-semibold' 
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Showroom
          </button>

          <button
            onClick={() => { setActiveView('database'); }}
            className={`transition-colors whitespace-nowrap cursor-pointer ${
              activeView === 'database' 
                ? 'text-amber-500 font-semibold' 
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Specs Database
          </button>

          <button
            onClick={onOpenCompare}
            className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5"
          >
            <span>Compare Matrix</span>
            {compareCount > 0 && (
              <span className="inline-flex items-center justify-center text-xs font-mono tabular-nums px-1.5 py-0.2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded">
                {compareCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenAdmin}
            className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5"
          >
            <span>Admin Console</span>
          </button>
        </nav>

        {/* Zone 3: Primary interactive controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick Compare Trigger */}
          <button
            onClick={onOpenCompare}
            title="Open Vehicle Comparison"
            className="relative p-2 text-slate-700 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-lg transition-colors cursor-pointer"
          >
            <Scale className="w-5 h-5" />
            {compareCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-slate-950 font-mono">
                {compareCount}
              </span>
            )}
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-lg transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
          </button>

          {/* Admin Management Button */}
          <button
            onClick={onOpenAdmin}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span>Admin CMS</span>
          </button>

          {/* Mobile Search/Browse Button */}
          <button
            onClick={onScrollToSearch}
            className="inline-flex md:hidden px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-amber-500 dark:text-slate-950 rounded-lg transition-colors whitespace-nowrap"
          >
            Browse
          </button>
        </div>

      </div>
    </header>
  );
};
