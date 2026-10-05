import React, { useState } from 'react';
import { 
  X, Plus, Edit, Trash2, ShieldCheck, Database, MessageSquare, 
  Car as CarIcon, CheckCircle2, AlertTriangle, Download, Upload, 
  RotateCcw, Search, Eye
} from 'lucide-react';
import { Car, CarCategory, PowertrainType, UserReview } from '../types/car';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  cars: Car[];
  reviews: UserReview[];
  onAddCar: (car: Car) => void;
  onUpdateCar: (car: Car) => void;
  onDeleteCar: (carId: string) => void;
  onUpdateReview: (review: UserReview) => void;
  onDeleteReview: (reviewId: string) => void;
  onResetDefaults: () => void;
  onSelectCar: (car: Car) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  cars,
  reviews,
  onAddCar,
  onUpdateCar,
  onDeleteCar,
  onUpdateReview,
  onDeleteReview,
  onResetDefaults,
  onSelectCar
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'vehicles' | 'reviews' | 'settings'>('vehicles');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal / Form state for Add/Edit Car
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Form Fields State
  const [formData, setFormData] = useState<Partial<Car>>({
    make: '',
    model: '',
    year: 2025,
    trim: '',
    tagline: '',
    category: 'Supercar',
    powertrain: 'Gasoline',
    price: 150000,
    description: '',
    images: [''],
    specs: {
      engineType: '4.0L V8 Twin-Turbo',
      horsepower: 650,
      torque: 590,
      transmission: '8-Speed Dual-Clutch',
      drivetrain: 'RWD',
      zeroToSixty: 3.1,
      topSpeed: 200,
      curbWeight: 3500,
      length: 185,
      width: 76,
      height: 50,
      wheelbase: 106,
      efficiency: '18 City / 24 Hwy',
      features: ['Active Aerodynamic Wing', 'Carbon Ceramic Brakes']
    }
  });

  const showStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleStartAdd = () => {
    setIsAddMode(true);
    setEditingCar(null);
    setFormData({
      make: '',
      model: '',
      year: 2025,
      trim: '',
      tagline: '',
      category: 'Supercar',
      powertrain: 'Gasoline',
      price: 150000,
      description: '',
      images: ['/src/assets/images/hero_porsche_gt3_1791195531411.jpg'],
      specs: {
        engineType: '4.0L Twin-Turbo V8',
        horsepower: 650,
        torque: 580,
        transmission: '8-Speed Dual-Clutch',
        drivetrain: 'RWD',
        zeroToSixty: 3.1,
        topSpeed: 200,
        curbWeight: 3450,
        length: 185,
        width: 76,
        height: 50,
        wheelbase: 106,
        efficiency: '17 City / 23 Hwy mpg',
        features: ['Carbon Ceramic Rotors', 'Adaptive Aero Dynamics']
      }
    });
  };

  const handleStartEdit = (car: Car) => {
    setIsAddMode(false);
    setEditingCar(car);
    setFormData(JSON.parse(JSON.stringify(car)));
  };

  const handleSaveCar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.make || !formData.model || !formData.price) {
      alert('Please fill out Make, Model, and Price.');
      return;
    }

    if (isAddMode) {
      const newCar: Car = {
        ...(formData as Car),
        id: `${formData.make?.toLowerCase().replace(/\s+/g, '-')}-${formData.model?.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
        rating: 5.0,
        reviewsCount: 0,
        featured: false
      };
      onAddCar(newCar);
      showStatus(`Created vehicle: ${newCar.make} ${newCar.model}`);
    } else if (editingCar) {
      const updated: Car = {
        ...editingCar,
        ...(formData as Car)
      };
      onUpdateCar(updated);
      showStatus(`Updated vehicle: ${updated.make} ${updated.model}`);
    }

    setIsAddMode(false);
    setEditingCar(null);
  };

  const handleDeleteConfirmed = (carId: string) => {
    onDeleteCar(carId);
    setDeleteConfirmId(null);
    showStatus('Vehicle deleted from inventory.');
  };

  // Review status toggle
  const handleToggleReviewStatus = (review: UserReview) => {
    const nextStatus = review.status === 'approved' ? 'pending' : 'approved';
    onUpdateReview({ ...review, status: nextStatus });
    showStatus(`Review marked as ${nextStatus}.`);
  };

  // Export JSON
  const handleExportData = () => {
    const payload = JSON.stringify({ cars, reviews }, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `apexmotiv_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showStatus('Database JSON exported successfully.');
  };

  // Filtered cars for table
  const filteredCars = cars.filter((c) => {
    const q = searchQuery.toLowerCase();
    return c.make.toLowerCase().includes(q) || c.model.toLowerCase().includes(q) || c.category.toLowerCase().includes(q);
  });

  // Calculate Overview Stats
  const totalVehicles = cars.length;
  const avgHp = Math.round(cars.reduce((sum, c) => sum + (c.specs.horsepower || 0), 0) / (totalVehicles || 1));
  const avgMSRP = Math.round(cars.reduce((sum, c) => sum + c.price, 0) / (totalVehicles || 1));
  const totalReviewsCount = reviews.length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex justify-center p-2 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-6xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col my-auto max-h-[94vh]">
        
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Content Management</div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                Showroom Administration Console
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {statusMessage && (
              <span className="hidden sm:inline-block px-3 py-1 text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-lg animate-in fade-in">
                {statusMessage}
              </span>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dashboard Tabs & Navigation */}
        <div className="px-6 pt-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            <button
              onClick={() => { setActiveTab('vehicles'); setIsAddMode(false); setEditingCar(null); }}
              className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'vehicles'
                  ? 'border-amber-500 text-slate-900 dark:text-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <CarIcon className="w-4 h-4" />
              <span>Vehicle Inventory ({totalVehicles})</span>
            </button>

            <button
              onClick={() => { setActiveTab('reviews'); setIsAddMode(false); setEditingCar(null); }}
              className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'reviews'
                  ? 'border-amber-500 text-slate-900 dark:text-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>User Reviews ({totalReviewsCount})</span>
            </button>

            <button
              onClick={() => { setActiveTab('settings'); setIsAddMode(false); setEditingCar(null); }}
              className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'settings'
                  ? 'border-amber-500 text-slate-900 dark:text-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Data Tools & Backups</span>
            </button>
          </div>

          {activeTab === 'vehicles' && !isAddMode && !editingCar && (
            <button
              onClick={handleStartAdd}
              className="mb-2 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Add Vehicle</span>
            </button>
          )}
        </div>

        {/* Overview Metric Row */}
        {!isAddMode && !editingCar && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-6 bg-slate-50 dark:bg-slate-950/30 border-b border-slate-200 dark:border-slate-800 text-xs">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
              <span className="text-slate-400 uppercase font-semibold">Active Fleet</span>
              <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1 tabular-nums">
                {totalVehicles} Models
              </div>
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
              <span className="text-slate-400 uppercase font-semibold">Fleet Avg Output</span>
              <div className="text-xl font-bold font-mono text-amber-500 mt-1 tabular-nums">
                {avgHp} HP
              </div>
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
              <span className="text-slate-400 uppercase font-semibold">Average MSRP</span>
              <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1 tabular-nums">
                ${avgMSRP.toLocaleString()}
              </div>
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
              <span className="text-slate-400 uppercase font-semibold">Verified Critiques</span>
              <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1 tabular-nums">
                {totalReviewsCount} Reviews
              </div>
            </div>
          </div>
        )}

        {/* Body Content */}
        <div className="overflow-y-auto flex-1 p-6">
          
          {/* TAB 1: VEHICLES MANAGEMENT */}
          {activeTab === 'vehicles' && (
            <div>
              {/* If in Add or Edit Mode: Show Form */}
              {(isAddMode || editingCar) ? (
                <form onSubmit={handleSaveCar} className="space-y-6 max-w-4xl mx-auto">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {isAddMode ? 'Add New Vehicle Model' : `Edit Vehicle: ${editingCar?.make} ${editingCar?.model}`}
                    </h3>
                    <button
                      type="button"
                      onClick={() => { setIsAddMode(false); setEditingCar(null); }}
                      className="text-xs text-slate-500 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                  </div>

                  {/* Core Identification */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                        Make / Manufacturer *
                      </label>
                      <input
                        type="text"
                        value={formData.make || ''}
                        onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                        placeholder="e.g. McLaren"
                        required
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                        Model Name *
                      </label>
                      <input
                        type="text"
                        value={formData.model || ''}
                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                        placeholder="e.g. 750S Spider"
                        required
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                        Model Year & Trim
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={formData.year || 2025}
                          onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                          className="w-24 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-mono"
                        />
                        <input
                          type="text"
                          value={formData.trim || ''}
                          onChange={(e) => setFormData({ ...formData, trim: e.target.value })}
                          placeholder="e.g. Performance Spec"
                          className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Classification & Pricing */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                        Body Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as CarCategory })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                      >
                        <option value="Supercar">Supercar</option>
                        <option value="Hypercar">Hypercar</option>
                        <option value="Electric EV">Electric EV</option>
                        <option value="Sports Coupe">Sports Coupe</option>
                        <option value="Luxury Sedan">Luxury Sedan</option>
                        <option value="Grand Tourer">Grand Tourer</option>
                        <option value="Performance SUV">Performance SUV</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                        Powertrain Type
                      </label>
                      <select
                        value={formData.powertrain}
                        onChange={(e) => setFormData({ ...formData, powertrain: e.target.value as PowertrainType })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                      >
                        <option value="Gasoline">Gasoline</option>
                        <option value="Electric">Electric</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Plug-in Hybrid">Plug-in Hybrid</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                        Base MSRP (USD) *
                      </label>
                      <input
                        type="number"
                        value={formData.price || 0}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        required
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Tagline & Editorial Overview */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                      Short Tagline
                    </label>
                    <input
                      type="text"
                      value={formData.tagline || ''}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      placeholder="One sentence performance motto..."
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                      Editorial Review Description
                    </label>
                    <textarea
                      rows={3}
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Detailed engineering background and road test impressions..."
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                    />
                  </div>

                  {/* Primary Performance Numbers */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
                    <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider">
                      Technical Benchmarks
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Horsepower (HP)</label>
                        <input
                          type="number"
                          value={formData.specs?.horsepower || 0}
                          onChange={(e) => setFormData({
                            ...formData,
                            specs: { ...formData.specs!, horsepower: Number(e.target.value) }
                          })}
                          className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">0–60 MPH (Sec)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.specs?.zeroToSixty || 3.0}
                          onChange={(e) => setFormData({
                            ...formData,
                            specs: { ...formData.specs!, zeroToSixty: Number(e.target.value) }
                          })}
                          className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Top Speed (MPH)</label>
                        <input
                          type="number"
                          value={formData.specs?.topSpeed || 190}
                          onChange={(e) => setFormData({
                            ...formData,
                            specs: { ...formData.specs!, topSpeed: Number(e.target.value) }
                          })}
                          className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Curb Weight (lbs)</label>
                        <input
                          type="number"
                          value={formData.specs?.curbWeight || 3500}
                          onChange={(e) => setFormData({
                            ...formData,
                            specs: { ...formData.specs!, curbWeight: Number(e.target.value) }
                          })}
                          className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Engine / Motor Type</label>
                        <input
                          type="text"
                          value={formData.specs?.engineType || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            specs: { ...formData.specs!, engineType: e.target.value }
                          })}
                          placeholder="e.g. 4.0L Twin-Turbo Flat-6"
                          className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Transmission</label>
                        <input
                          type="text"
                          value={formData.specs?.transmission || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            specs: { ...formData.specs!, transmission: e.target.value }
                          })}
                          placeholder="e.g. 7-Speed Dual Clutch"
                          className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Primary Image URL */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                      Primary Hero Image URL
                    </label>
                    <input
                      type="text"
                      value={formData.images?.[0] || ''}
                      onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                      placeholder="e.g. /src/assets/images/hero_porsche_gt3_1791195531411.jpg or web url"
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                    />
                  </div>

                  {/* Form Submission */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => { setIsAddMode(false); setEditingCar(null); }}
                      className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                    >
                      Discard Changes
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm"
                    >
                      {isAddMode ? 'Create Vehicle Record' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              ) : (
                /* Vehicles Table View */
                <div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Filter inventory table..."
                        className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                    <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                      <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 font-semibold text-slate-400 uppercase tracking-wider">
                        <tr>
                          <th className="p-3">Vehicle</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Powertrain</th>
                          <th className="p-3">Output</th>
                          <th className="p-3">0-60</th>
                          <th className="p-3">MSRP</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {filteredCars.map((car) => (
                          <tr key={car.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                            <td className="p-3 flex items-center gap-2.5">
                              <img
                                src={car.images[0] || '/src/assets/images/hero_porsche_gt3_1791195531411.jpg'}
                                alt={car.model}
                                referrerPolicy="no-referrer"
                                className="w-10 h-7 object-cover rounded bg-slate-800 shrink-0"
                              />
                              <div>
                                <div className="font-bold text-slate-900 dark:text-white font-display">
                                  {car.make} {car.model}
                                </div>
                                <div className="text-[11px] text-slate-400">{car.year} {car.trim}</div>
                              </div>
                            </td>
                            <td className="p-3 text-slate-700 dark:text-slate-300">{car.category}</td>
                            <td className="p-3 text-slate-700 dark:text-slate-300">{car.powertrain}</td>
                            <td className="p-3 font-mono font-bold tabular-nums text-slate-900 dark:text-white">
                              {car.specs.horsepower} HP
                            </td>
                            <td className="p-3 font-mono tabular-nums text-amber-500 font-bold">
                              {car.specs.zeroToSixty}s
                            </td>
                            <td className="p-3 font-mono tabular-nums text-slate-900 dark:text-white">
                              ${car.price.toLocaleString()}
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => onSelectCar(car)}
                                  title="Inspect vehicle in showroom"
                                  className="p-1.5 text-slate-400 hover:text-amber-500 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleStartEdit(car)}
                                  title="Edit vehicle specifications"
                                  className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                {deleteConfirmId === car.id ? (
                                  <button
                                    onClick={() => handleDeleteConfirmed(car.id)}
                                    className="px-2 py-1 text-[11px] bg-rose-600 text-white rounded font-bold"
                                  >
                                    Confirm?
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => setDeleteConfirmId(car.id)}
                                    title="Delete vehicle from inventory"
                                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: REVIEWS MODERATION */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Manage and moderate user comments across all vehicles.</span>
                <span>{reviews.length} total reviews stored</span>
              </div>

              <div className="space-y-3">
                {reviews.map((rev) => {
                  const car = cars.find((c) => c.id === rev.carId);
                  return (
                    <div 
                      key={rev.id}
                      className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                    >
                      <div className="space-y-1 max-w-2xl">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {rev.author}
                          </span>
                          <span className="text-slate-400 font-mono">
                            for {car ? `${car.make} ${car.model}` : 'Unknown vehicle'}
                          </span>
                          <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold uppercase ${
                            rev.status === 'approved' 
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          }`}>
                            {rev.status}
                          </span>
                        </div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          ★ {rev.overallRating}/5 — {rev.title}
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 line-clamp-2">
                          {rev.comment}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleToggleReviewStatus(rev)}
                          className={`px-3 py-1.5 rounded text-xs font-semibold cursor-pointer ${
                            rev.status === 'approved'
                              ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                              : 'bg-emerald-500 text-slate-950'
                          }`}
                        >
                          {rev.status === 'approved' ? 'Mark Pending' : 'Approve'}
                        </button>
                        <button
                          onClick={() => {
                            onDeleteReview(rev.id);
                            showStatus('Review removed.');
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-500 rounded hover:bg-slate-200 dark:hover:bg-slate-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: DATA TOOLS & BACKUPS */}
          {activeTab === 'settings' && (
            <div className="max-w-xl mx-auto space-y-6 text-xs">
              <div className="p-5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                  <Download className="w-4 h-4 text-amber-500" />
                  <span>Export Database JSON</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Download a complete JSON snapshot containing all vehicle technical specifications, images, and user reviews currently stored in your browser session.
                </p>
                <button
                  onClick={handleExportData}
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg cursor-pointer flex items-center gap-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Backup JSON</span>
                </button>
              </div>

              <div className="p-5 bg-rose-50/50 dark:bg-rose-950/20 rounded-xl border border-rose-200 dark:border-rose-900/60 space-y-3">
                <div className="flex items-center gap-2 font-bold text-rose-600 dark:text-rose-400 text-sm">
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset to Factory Showroom Seed</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Restore the initial curated dataset of benchmarks (Porsche 911 GT3 RS, Ferrari Roma Spider, Lucid Air Sapphire, Rimac Nevera, etc.) and original reviews.
                </p>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to reset all vehicles and reviews to default seed data?')) {
                      onResetDefaults();
                      showStatus('Database restored to showroom factory defaults.');
                    }
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg cursor-pointer"
                >
                  Reset All Data to Defaults
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
