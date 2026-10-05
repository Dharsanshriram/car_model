import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { HeroShowcase } from './components/HeroShowcase';
import { CarSearchFilter } from './components/CarSearchFilter';
import { CarCard } from './components/CarCard';
import { CarDetailModal } from './components/CarDetailModal';
import { CarComparisonModal } from './components/CarComparisonModal';
import { ComparisonTray } from './components/ComparisonTray';
import { AdminDashboard } from './components/AdminDashboard';
import { ThemeProvider } from './context/ThemeContext';
import { Car, FilterState, UserReview } from './types/car';
import { 
  getStoredCars, 
  saveStoredCars, 
  getStoredReviews, 
  saveStoredReviews, 
  resetDatabaseToDefaults, 
  calculateAverageRating 
} from './utils/storage';
import { Scale, Sparkles, Filter, ChevronUp } from 'lucide-react';

const INITIAL_FILTERS: FilterState = {
  search: '',
  category: 'All',
  powertrain: 'All',
  drivetrain: 'All',
  minPrice: 0,
  maxPrice: 3000000,
  minHp: 0,
  sortBy: 'featured'
};

export function AppContent() {
  const [cars, setCars] = useState<Car[]>(() => getStoredCars());
  const [reviews, setReviews] = useState<UserReview[]>(() => getStoredReviews());
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [selectedCarsForCompare, setSelectedCarsForCompare] = useState<Car[]>([]);
  const [activeCarDetail, setActiveCarDetail] = useState<Car | null>(null);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<'showroom' | 'database'>('showroom');

  // Sync cars and reviews with updated ratings
  useEffect(() => {
    saveStoredCars(cars);
  }, [cars]);

  useEffect(() => {
    saveStoredReviews(reviews);
  }, [reviews]);

  // Handle adding new review
  const handleAddReview = (newReview: UserReview) => {
    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);

    // Recalculate car's aggregate rating
    const { rating, count } = calculateAverageRating(updatedReviews, newReview.carId);
    setCars((prevCars) =>
      prevCars.map((c) =>
        c.id === newReview.carId
          ? { ...c, rating, reviewsCount: count }
          : c
      )
    );
  };

  // Handle helpful votes on a review
  const handleVoteHelpful = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, helpfulVotes: r.helpfulVotes + 1 } : r))
    );
  };

  // Compare toggling
  const handleToggleCompare = (car: Car) => {
    if (selectedCarsForCompare.some((c) => c.id === car.id)) {
      setSelectedCarsForCompare((prev) => prev.filter((c) => c.id !== car.id));
    } else {
      if (selectedCarsForCompare.length >= 4) {
        alert('You can compare a maximum of 4 vehicles simultaneously.');
        return;
      }
      setSelectedCarsForCompare((prev) => [...prev, car]);
    }
  };

  const handleRemoveFromCompare = (carId: string) => {
    setSelectedCarsForCompare((prev) => prev.filter((c) => c.id !== carId));
  };

  const handleClearCompare = () => {
    setSelectedCarsForCompare([]);
  };

  // Admin Car Handlers
  const handleAddCar = (newCar: Car) => {
    const updated = [newCar, ...cars];
    setCars(updated);
  };

  const handleUpdateCar = (updatedCar: Car) => {
    setCars((prev) => prev.map((c) => (c.id === updatedCar.id ? updatedCar : c)));
    if (activeCarDetail?.id === updatedCar.id) {
      setActiveCarDetail(updatedCar);
    }
  };

  const handleDeleteCar = (carId: string) => {
    setCars((prev) => prev.filter((c) => c.id !== carId));
    setSelectedCarsForCompare((prev) => prev.filter((c) => c.id !== carId));
    if (activeCarDetail?.id === carId) {
      setActiveCarDetail(null);
    }
  };

  const handleUpdateReview = (updatedReview: UserReview) => {
    setReviews((prev) => prev.map((r) => (r.id === updatedReview.id ? updatedReview : r)));
  };

  const handleDeleteReview = (reviewId: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
  };

  const handleResetDefaults = () => {
    const { cars: defaultCars, reviews: defaultReviews } = resetDatabaseToDefaults();
    setCars(defaultCars);
    setReviews(defaultReviews);
    setSelectedCarsForCompare([]);
  };

  // Filtering and Sorting
  const filteredCars = useMemo(() => {
    return cars
      .filter((car) => {
        // Search text
        if (filters.search) {
          const q = filters.search.toLowerCase();
          const matchMake = car.make.toLowerCase().includes(q);
          const matchModel = car.model.toLowerCase().includes(q);
          const matchEngine = car.specs.engineType.toLowerCase().includes(q);
          const matchTrim = car.trim?.toLowerCase().includes(q);
          const matchCategory = car.category.toLowerCase().includes(q);
          if (!matchMake && !matchModel && !matchEngine && !matchTrim && !matchCategory) {
            return false;
          }
        }

        // Category
        if (filters.category !== 'All' && car.category !== filters.category) {
          return false;
        }

        // Powertrain
        if (filters.powertrain !== 'All' && car.powertrain !== filters.powertrain) {
          return false;
        }

        // Drivetrain
        if (filters.drivetrain !== 'All' && car.specs.drivetrain !== filters.drivetrain) {
          return false;
        }

        // Horsepower
        if (filters.minHp > 0 && (car.specs.horsepower || 0) < filters.minHp) {
          return false;
        }

        // Max price
        if (filters.maxPrice < 3000000 && car.price > filters.maxPrice) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'hp-desc':
            return (b.specs.horsepower || 0) - (a.specs.horsepower || 0);
          case 'acceleration-asc':
            return (a.specs.zeroToSixty || 99) - (b.specs.zeroToSixty || 99);
          case 'topspeed-desc':
            return (b.specs.topSpeed || 0) - (a.specs.topSpeed || 0);
          case 'rating-desc':
            return (b.rating || 0) - (a.rating || 0);
          case 'featured':
          default:
            return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        }
      });
  }, [cars, filters]);

  const heroCar = cars.find((c) => c.featured) || cars[0] || null;

  const scrollToSearch = () => {
    const el = document.getElementById('search-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      
      {/* Top Bar Contract Navigation */}
      <Navbar
        onOpenCompare={() => setIsCompareModalOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        compareCount={selectedCarsForCompare.length}
        activeView={activeView}
        setActiveView={setActiveView}
        onScrollToSearch={scrollToSearch}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Showcase (only in Showroom view) */}
        {activeView === 'showroom' && heroCar && (
          <HeroShowcase
            heroCar={heroCar}
            onSelectCar={(c) => setActiveCarDetail(c)}
            onExploreClick={scrollToSearch}
            onCompareHero={handleToggleCompare}
            isCompared={selectedCarsForCompare.some((c) => c.id === heroCar.id)}
          />
        )}

        {/* Database Search & Filter Bar */}
        <CarSearchFilter
          filters={filters}
          setFilters={setFilters}
          totalMatches={filteredCars.length}
          totalCars={cars.length}
          onReset={() => setFilters(INITIAL_FILTERS)}
        />

        {/* Vehicle Grid Container */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          
          {/* Section Kicker */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-amber-500 mb-1">
                {activeView === 'showroom' ? 'Curated Collection' : 'Comprehensive Database'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
                {filters.category === 'All' ? 'Benchmark Performance Vehicles' : `${filters.category} Models`}
              </h2>
            </div>

            <div className="text-xs text-slate-500 font-mono">
              Click any vehicle for complete technical dossiers and owner ratings
            </div>
          </div>

          {/* Cards Grid */}
          {filteredCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredCars.map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  onSelect={(c) => setActiveCarDetail(c)}
                  onToggleCompare={handleToggleCompare}
                  isCompared={selectedCarsForCompare.some((c) => c.id === car.id)}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg mx-auto">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400">
                <Filter className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                No matching vehicles found
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                We couldn't find any car models matching your search filters. Try loosening your criteria or resetting filters.
              </p>
              <button
                onClick={() => setFilters(INITIAL_FILTERS)}
                className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>
          )}

        </section>
      </main>

      {/* Floating Comparison Tray (Sticky dock on bottom) */}
      <ComparisonTray
        selectedCars={selectedCarsForCompare}
        onOpenCompare={() => setIsCompareModalOpen(true)}
        onRemoveCar={handleRemoveFromCompare}
        onClearAll={handleClearCompare}
      />

      {/* Vehicle Full Dossier & Review Modal */}
      <CarDetailModal
        car={activeCarDetail}
        onClose={() => setActiveCarDetail(null)}
        onToggleCompare={handleToggleCompare}
        isCompared={activeCarDetail ? selectedCarsForCompare.some((c) => c.id === activeCarDetail.id) : false}
        reviews={reviews}
        onAddReview={handleAddReview}
        onVoteHelpful={handleVoteHelpful}
      />

      {/* Side-by-Side Comparison Matrix Modal */}
      <CarComparisonModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        selectedCars={selectedCarsForCompare}
        allCars={cars}
        onRemoveCar={handleRemoveFromCompare}
        onAddCar={(car) => handleToggleCompare(car)}
        onClearAll={handleClearCompare}
        onSelectCarDetail={(car) => {
          setIsCompareModalOpen(false);
          setActiveCarDetail(car);
        }}
      />

      {/* Admin Content Management Dashboard Modal */}
      <AdminDashboard
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        cars={cars}
        reviews={reviews}
        onAddCar={handleAddCar}
        onUpdateCar={handleUpdateCar}
        onDeleteCar={handleDeleteCar}
        onUpdateReview={handleUpdateReview}
        onDeleteReview={handleDeleteReview}
        onResetDefaults={handleResetDefaults}
        onSelectCar={(car) => {
          setIsAdminModalOpen(false);
          setActiveCarDetail(car);
        }}
      />

      {/* Clean Footnotes & Copyright (Zero ornamental engines per constitution) */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-8 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white font-display">APEXMOTIV</span>
            <span aria-hidden="true">·</span>
            <span>Automotive Specifications & Comparison Matrix</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Admin CMS
            </button>
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>Back to Top</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
