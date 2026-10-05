import React from 'react';
import { ArrowRight, ChevronRight, Gauge, Zap, Flame, ShieldAlert } from 'lucide-react';
import { Car } from '../types/car';

interface HeroShowcaseProps {
  heroCar: Car;
  onSelectCar: (car: Car) => void;
  onExploreClick: () => void;
  onCompareHero: (car: Car) => void;
  isCompared: boolean;
}

export const HeroShowcase: React.FC<HeroShowcaseProps> = ({
  heroCar,
  onSelectCar,
  onExploreClick,
  onCompareHero,
  isCompared
}) => {
  return (
    <section className="relative w-full overflow-hidden bg-slate-950 text-white">
      {/* Background Image Container */}
      <div className="relative h-[480px] sm:h-[560px] lg:h-[640px] w-full overflow-hidden">
        <img
          src={heroCar.images[0] || '/src/assets/images/hero_porsche_gt3_1791195531411.jpg'}
          alt={`${heroCar.make} ${heroCar.model}`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 transform hover:scale-100 transition-transform duration-1000 ease-out"
        />
        {/* Measured Scrim for Media Overlays (WCAG AA compliant contrast) */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/20" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-slate-950/40 to-slate-950" />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-14">
        
        {/* Unboxed Metadata Header (Zero-Pill Rule) */}
        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-300 tracking-wider uppercase mb-2">
          <span>{heroCar.make}</span>
          <span aria-hidden="true" className="text-amber-400">·</span>
          <span>{heroCar.year} Model</span>
          <span aria-hidden="true" className="text-amber-400">·</span>
          <span>{heroCar.category}</span>
        </div>

        {/* Headline with text-wrap: balance */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-3xl leading-[1.1] font-display mb-3">
          {heroCar.model}
          {heroCar.trim && (
            <span className="block text-xl sm:text-2xl font-semibold text-amber-400 mt-1">
              {heroCar.trim}
            </span>
          )}
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl line-clamp-2 sm:line-clamp-3 mb-6 font-normal leading-relaxed">
          {heroCar.tagline}
        </p>

        {/* Spec Triad in Tabular Numerals */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-white/10 max-w-3xl mb-6 backdrop-blur-xs bg-slate-950/30 rounded-lg px-4">
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">Power</div>
            <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white mt-0.5">
              {heroCar.specs.horsepower} <span className="text-xs font-sans font-normal text-slate-400">HP</span>
            </div>
            <div className="text-[11px] text-slate-400 truncate">{heroCar.specs.redline || 'Max Output'}</div>
          </div>

          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">0–60 MPH</div>
            <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-amber-400 mt-0.5">
              {heroCar.specs.zeroToSixty} <span className="text-xs font-sans font-normal text-slate-400">SEC</span>
            </div>
            <div className="text-[11px] text-slate-400 truncate">Launch Control</div>
          </div>

          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">Top Speed</div>
            <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white mt-0.5">
              {heroCar.specs.topSpeed} <span className="text-xs font-sans font-normal text-slate-400">MPH</span>
            </div>
            <div className="text-[11px] text-slate-400 truncate">Track Verified</div>
          </div>

          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">Starting MSRP</div>
            <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white mt-0.5">
              ${heroCar.price.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 truncate">Est. Base Price</div>
          </div>
        </div>

        {/* Hero Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onSelectCar(heroCar)}
            className="px-5 py-2.5 text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer flex items-center gap-2 shadow-lg shadow-amber-500/20"
          >
            <span>View Technical Dossier</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onCompareHero(heroCar)}
            className={`px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors cursor-pointer border ${
              isCompared
                ? 'bg-white/20 border-white text-white'
                : 'bg-white/10 hover:bg-white/15 border-white/20 text-white'
            }`}
          >
            {isCompared ? '✓ Added to Comparison' : '+ Add to Compare'}
          </button>

          <button
            onClick={onExploreClick}
            className="text-xs sm:text-sm font-medium text-slate-400 hover:text-white px-3 py-2 transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>Explore All {heroCar.make} & Database Models</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
