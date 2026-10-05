import React, { useState } from 'react';
import { Search, SlidersHorizontal, X, RotateCcw, ChevronDown } from 'lucide-react';
import { FilterState, SortOption } from '../types/car';

interface CarSearchFilterProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  totalMatches: number;
  totalCars: number;
  onReset: () => void;
}

const CATEGORIES = [
  'All',
  'Supercar',
  'Hypercar',
  'Electric EV',
  'Sports Coupe',
  'Luxury Sedan',
  'Grand Tourer'
];

const POWERTRAINS = ['All', 'Gasoline', 'Electric', 'Hybrid'];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Curated Showroom' },
  { value: 'hp-desc', label: 'Horsepower: Highest First' },
  { value: 'acceleration-asc', label: '0–60 MPH: Quickest First' },
  { value: 'topspeed-desc', label: 'Top Speed: Highest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Owner Rating: Highest' }
];

export const CarSearchFilter: React.FC<CarSearchFilterProps> = ({
  filters,
  setFilters,
  totalMatches,
  totalCars,
  onReset
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const hasActiveFilters = 
    filters.search !== '' ||
    filters.category !== 'All' ||
    filters.powertrain !== 'All' ||
    filters.drivetrain !== 'All' ||
    filters.minHp > 0 ||
    filters.maxPrice < 3000000;

  return (
    <div id="search-section" className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Top Search & Primary Sort Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-4">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              placeholder="Search by make, model, engine (e.g. Porsche, V8, Flat-6, Electric, 911)..."
              className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors"
            />
            {filters.search && (
              <button
                onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Right Action Controls: Sort + Filter Toggle */}
          <div className="flex items-center gap-2">
            <div className="relative shrink-0">
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as SortOption }))}
                className="appearance-none pl-3.5 pr-8 py-2.5 text-xs sm:text-sm font-medium bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 cursor-pointer focus:outline-hidden focus:border-amber-500"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`inline-flex items-center gap-1.5 px-3 py-2.5 text-xs sm:text-sm font-medium rounded-lg border transition-colors cursor-pointer shrink-0 ${
                showAdvanced || hasActiveFilters
                  ? 'border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Advanced Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-amber-500 ml-0.5" />
              )}
            </button>

            {hasActiveFilters && (
              <button
                onClick={onReset}
                title="Reset all filters"
                className="p-2.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

        {/* Category Segmented Filter Tabs (Interactive Functional Buttons per constitution) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = filters.category === cat;
            return (
              <button
                key={cat}
                onClick={() => setFilters((prev) => ({ ...prev, category: cat }))}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-amber-400 dark:text-slate-950 font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Advanced Filters Expandable Drawer */}
        {showAdvanced && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-150">
            
            {/* Powertrain */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Powertrain
              </label>
              <div className="flex flex-wrap gap-1">
                {POWERTRAINS.map((pt) => (
                  <button
                    key={pt}
                    onClick={() => setFilters((prev) => ({ ...prev, powertrain: pt }))}
                    className={`px-2.5 py-1 text-xs rounded border transition-colors cursor-pointer ${
                      filters.powertrain === pt
                        ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    {pt}
                  </button>
                ))}
              </div>
            </div>

            {/* Drivetrain */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Drivetrain
              </label>
              <div className="flex gap-1">
                {['All', 'AWD', 'RWD'].map((dt) => (
                  <button
                    key={dt}
                    onClick={() => setFilters((prev) => ({ ...prev, drivetrain: dt }))}
                    className={`px-2.5 py-1 text-xs rounded border transition-colors cursor-pointer ${
                      filters.drivetrain === dt
                        ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    {dt}
                  </button>
                ))}
              </div>
            </div>

            {/* Min Horsepower */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Minimum Power
                </label>
                <span className="text-xs font-mono tabular-nums text-slate-800 dark:text-slate-200 font-medium">
                  {filters.minHp > 0 ? `${filters.minHp} HP` : 'Any HP'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1500"
                step="100"
                value={filters.minHp}
                onChange={(e) => setFilters((prev) => ({ ...prev, minHp: Number(e.target.value) }))}
                className="w-full accent-amber-500 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer h-1.5"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>0 HP</span>
                <span>750 HP</span>
                <span>1,500+ HP</span>
              </div>
            </div>

            {/* Max Price Cap */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Max MSRP
                </label>
                <span className="text-xs font-mono tabular-nums text-slate-800 dark:text-slate-200 font-medium">
                  {filters.maxPrice >= 3000000 ? 'Any Price' : `$${(filters.maxPrice / 1000).toFixed(0)}k`}
                </span>
              </div>
              <input
                type="range"
                min="100000"
                max="3000000"
                step="50000"
                value={filters.maxPrice}
                onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))}
                className="w-full accent-amber-500 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer h-1.5"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>$100k</span>
                <span>$1.5M</span>
                <span>$3.0M+</span>
              </div>
            </div>

          </div>
        )}

        {/* Status Line: Results Count & Active Filter Reset */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 font-mono">
          <div>
            Showing <span className="font-semibold text-slate-900 dark:text-white tabular-nums">{totalMatches}</span> of{' '}
            <span className="tabular-nums">{totalCars}</span> high-performance models
          </div>
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="text-amber-600 dark:text-amber-400 hover:underline cursor-pointer flex items-center gap-1 font-sans text-xs"
            >
              <span>Reset all search filters</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
