import React from 'react';
import { Scale, X, ArrowRight } from 'lucide-react';
import { Car } from '../types/car';

interface ComparisonTrayProps {
  selectedCars: Car[];
  onOpenCompare: () => void;
  onRemoveCar: (carId: string) => void;
  onClearAll: () => void;
}

export const ComparisonTray: React.FC<ComparisonTrayProps> = ({
  selectedCars,
  onOpenCompare,
  onRemoveCar,
  onClearAll
}) => {
  if (selectedCars.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 z-35 flex justify-center px-3 sm:px-6 pointer-events-none animate-in slide-in-from-bottom-4 duration-200">
      
      <div className="pointer-events-auto max-w-2xl w-full bg-slate-900/95 dark:bg-slate-950/95 text-white border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-md px-4 py-2.5 flex items-center justify-between gap-3">
        
        {/* Left Side: Selected Thumbnails & Counter */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="hidden xs:flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
            <Scale className="w-4 h-4" />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            {selectedCars.map((car) => (
              <div 
                key={car.id} 
                className="relative group shrink-0 w-11 h-8 sm:w-14 sm:h-9 rounded-md overflow-hidden border border-slate-700 bg-slate-800"
              >
                <img 
                  src={car.images[0] || '/src/assets/images/hero_porsche_gt3_1791195531411.jpg'} 
                  alt={car.model}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover" 
                />
                <button
                  onClick={() => onRemoveCar(car.id)}
                  title="Remove from comparison"
                  className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                >
                  <X className="w-3.5 h-3.5 text-rose-400" />
                </button>
              </div>
            ))}
          </div>

          <div className="text-xs font-mono text-slate-300 whitespace-nowrap pl-1">
            <span className="font-bold text-amber-400 tabular-nums">{selectedCars.length}</span>
            <span className="text-slate-500">/4</span>
          </div>
        </div>

        {/* Right Side: Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onClearAll}
            className="text-[11px] text-slate-400 hover:text-white px-2 py-1 transition-colors cursor-pointer"
          >
            Clear
          </button>

          <button
            onClick={onOpenCompare}
            className="px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-md shadow-amber-500/20"
          >
            <span>Compare Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
