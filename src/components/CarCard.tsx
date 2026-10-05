import React, { useState } from 'react';
import { Star, Scale, Check, ChevronRight, Zap } from 'lucide-react';
import { Car } from '../types/car';

interface CarCardProps {
  car: Car;
  onSelect: (car: Car) => void;
  onToggleCompare: (car: Car) => void;
  isCompared: boolean;
}

export const CarCard: React.FC<CarCardProps> = ({
  car,
  onSelect,
  onToggleCompare,
  isCompared
}) => {
  const [imgError, setImgError] = useState(false);
  const primaryImage = car.images[0] || '/src/assets/images/hero_porsche_gt3_1791195531411.jpg';

  return (
    <article className="group relative flex flex-col bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg transition-all duration-200">
      
      {/* Lead with Imagery (65-70% visual focus) */}
      <div 
        onClick={() => onSelect(car)}
        className="relative aspect-16/10 w-full overflow-hidden bg-slate-100 dark:bg-slate-950 cursor-pointer"
      >
        {!imgError ? (
          <img
            src={primaryImage}
            alt={`${car.make} ${car.model}`}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 text-slate-400 p-4 text-center">
            <Zap className="w-8 h-8 text-amber-500 mb-2 opacity-80" />
            <span className="text-sm font-semibold text-slate-200">{car.make} {car.model}</span>
            <span className="text-xs text-slate-400">{car.category}</span>
          </div>
        )}

        {/* Subtle Gradient Scrim at Bottom of Image */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-80" />

        {/* Quick Compare Trigger (Floating on Top Right) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleCompare(car);
          }}
          title={isCompared ? 'Remove from comparison' : 'Add to comparison'}
          className={`absolute top-3 right-3 p-2 rounded-lg backdrop-blur-md transition-all cursor-pointer z-10 ${
            isCompared
              ? 'bg-amber-500 text-slate-950 shadow-md scale-105'
              : 'bg-slate-950/60 text-white hover:bg-slate-950/90 border border-white/20'
          }`}
        >
          {isCompared ? <Check className="w-4 h-4 stroke-[3]" /> : <Scale className="w-4 h-4" />}
        </button>

        {/* Floating Category Kicker on Image Bottom Left (Clean unboxed text) */}
        <div className="absolute bottom-3 left-3 text-[11px] font-semibold text-white/90 uppercase tracking-wider drop-shadow-md">
          {car.powertrain} · {car.specs.drivetrain}
        </div>
      </div>

      {/* Card Content Section */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        
        <div>
          {/* Unboxed Metadata (Zero-Pill Discipline) */}
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">
            <span>{car.make}</span>
            <span aria-hidden="true">·</span>
            <span>{car.year}</span>
            <span aria-hidden="true">·</span>
            <span>{car.category}</span>
          </div>

          {/* Model Title */}
          <h3 
            onClick={() => onSelect(car)}
            className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors cursor-pointer truncate font-display"
          >
            {car.model}
          </h3>

          {/* Subtitle / Trim */}
          {car.trim && (
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mb-2">
              {car.trim}
            </p>
          )}

          {/* Tagline snippet */}
          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4">
            {car.tagline}
          </p>
        </div>

        <div>
          {/* Key Spec Triad in Tabular Numerals */}
          <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-slate-50 dark:bg-slate-950/80 rounded-lg border border-slate-100 dark:border-slate-800/80 text-center mb-4">
            <div>
              <span className="block text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Power</span>
              <span className="text-xs sm:text-sm font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                {car.specs.horsepower} <span className="text-[10px] font-normal text-slate-500">HP</span>
              </span>
            </div>

            <div className="border-x border-slate-200 dark:border-slate-800">
              <span className="block text-[10px] uppercase font-semibold text-slate-400 tracking-wider">0–60</span>
              <span className="text-xs sm:text-sm font-bold font-mono tabular-nums text-amber-600 dark:text-amber-400">
                {car.specs.zeroToSixty}s
              </span>
            </div>

            <div>
              <span className="block text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Top Speed</span>
              <span className="text-xs sm:text-sm font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                {car.specs.topSpeed} <span className="text-[10px] font-normal text-slate-500">MPH</span>
              </span>
            </div>
          </div>

          {/* Price & Action Row */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <div>
              <span className="block text-[10px] text-slate-400 font-medium">Starting MSRP</span>
              <span className="text-base font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                ${car.price.toLocaleString()}
              </span>
            </div>

            <button
              onClick={() => onSelect(car)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-900 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 transition-colors cursor-pointer group-hover:translate-x-0.5"
            >
              <span>Full Specs</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </article>
  );
};
