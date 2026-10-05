import React, { useState } from 'react';
import { X, Plus, Trash2, Check, Sparkles, Trophy, ArrowRight, ArrowLeft } from 'lucide-react';
import { Car } from '../types/car';

interface CarComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCars: Car[];
  allCars: Car[];
  onRemoveCar: (carId: string) => void;
  onAddCar: (car: Car) => void;
  onClearAll: () => void;
  onSelectCarDetail: (car: Car) => void;
}

export const CarComparisonModal: React.FC<CarComparisonModalProps> = ({
  isOpen,
  onClose,
  selectedCars,
  allCars,
  onRemoveCar,
  onAddCar,
  onClearAll,
  onSelectCarDetail
}) => {
  if (!isOpen) return null;

  const [highlightDiffs, setHighlightDiffs] = useState(false);
  const [highlightBest, setHighlightBest] = useState(true);
  const [showAddDropdown, setShowAddDropdown] = useState(false);

  // Available cars to add
  const availableToAdd = allCars.filter(
    (c) => !selectedCars.some((sel) => sel.id === c.id)
  );

  // Helper to determine best-in-class values among selected cars
  const maxHp = Math.max(...selectedCars.map((c) => c.specs.horsepower || 0));
  const minZeroToSixty = Math.min(...selectedCars.map((c) => c.specs.zeroToSixty || 99));
  const maxTopSpeed = Math.max(...selectedCars.map((c) => c.specs.topSpeed || 0));
  const minWeight = Math.min(...selectedCars.map((c) => c.specs.curbWeight || 99999));
  const minPrice = Math.min(...selectedCars.map((c) => c.price || 9999999));
  const maxRating = Math.max(...selectedCars.map((c) => c.rating || 0));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex justify-center p-2 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-6xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col my-auto max-h-[94vh]">
        
        {/* Sticky Modal Header */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="text-xs text-amber-500 font-bold uppercase tracking-wider">
              Technical Matrix
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
              Side-by-Side Vehicle Comparison
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Toggles */}
            <div className="hidden sm:flex items-center gap-3 text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={highlightBest}
                  onChange={(e) => setHighlightBest(e.target.checked)}
                  className="rounded accent-amber-500 cursor-pointer"
                />
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>Highlight Class Leaders</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={highlightDiffs}
                  onChange={(e) => setHighlightDiffs(e.target.checked)}
                  className="rounded accent-amber-500 cursor-pointer"
                />
                <span>Differences Only</span>
              </label>
            </div>

            {selectedCars.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-rose-500 hover:text-rose-600 dark:text-rose-400 font-medium px-2 py-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
              >
                Clear All
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison Content */}
        <div className="overflow-y-auto flex-1">
          {selectedCars.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Trophy className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                No vehicles selected for comparison
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                Select 2 to 4 models from the showroom or specs database using the "Compare" checkbox to view an in-depth technical analysis.
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg"
              >
                Back to Showroom
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                
                {/* Vehicle Cards Header Row (Sticky) */}
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80">
                    <th className="p-4 w-48 text-xs font-bold uppercase tracking-wider text-slate-400 align-top">
                      Vehicle Overview
                    </th>
                    {selectedCars.map((car) => (
                      <th key={car.id} className="p-4 w-64 align-top">
                        <div className="relative group">
                          {/* Image */}
                          <div className="aspect-16/10 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800 mb-2 relative">
                            <img
                              src={car.images[0] || '/src/assets/images/hero_porsche_gt3_1791195531411.jpg'}
                              alt={car.model}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() => onRemoveCar(car.id)}
                              title="Remove from comparison"
                              className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Titles */}
                          <div className="text-xs text-slate-400">{car.make}</div>
                          <div 
                            onClick={() => onSelectCarDetail(car)}
                            className="font-bold text-sm text-slate-900 dark:text-white hover:text-amber-500 cursor-pointer font-display"
                          >
                            {car.model}
                          </div>
                          <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 mt-1">
                            ${car.price.toLocaleString()}
                          </div>
                        </div>
                      </th>
                    ))}

                    {/* Add Slot Button if fewer than 4 cars */}
                    {selectedCars.length < 4 && (
                      <th className="p-4 w-60 align-middle text-center border-l border-dashed border-slate-200 dark:border-slate-800">
                        {showAddDropdown ? (
                          <div className="text-left space-y-2">
                            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                              Choose Vehicle:
                            </div>
                            <div className="max-h-48 overflow-y-auto space-y-1">
                              {availableToAdd.map((avail) => (
                                <button
                                  key={avail.id}
                                  onClick={() => {
                                    onAddCar(avail);
                                    setShowAddDropdown(false);
                                  }}
                                  className="w-full text-left p-1.5 text-xs rounded hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
                                >
                                  <span className="truncate">{avail.make} {avail.model}</span>
                                  <span className="font-mono text-slate-400">${(avail.price / 1000).toFixed(0)}k</span>
                                </button>
                              ))}
                            </div>
                            <button
                              onClick={() => setShowAddDropdown(false)}
                              className="text-[11px] text-slate-400 hover:underline"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowAddDropdown(true)}
                            className="flex flex-col items-center justify-center w-full py-8 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-xl hover:border-amber-500 hover:bg-amber-500/5 transition-all text-slate-400 hover:text-amber-500 cursor-pointer"
                          >
                            <Plus className="w-6 h-6 mb-1" />
                            <span className="text-xs font-semibold">+ Add Vehicle</span>
                            <span className="text-[10px] text-slate-400">({4 - selectedCars.length} slots left)</span>
                          </button>
                        )}
                      </th>
                    )}
                  </tr>
                </thead>

                {/* Spec Attributes Body */}
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                  
                  {/* Category & Segment */}
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/40">
                      Segment / Class
                    </td>
                    {selectedCars.map((car) => (
                      <td key={car.id} className="p-3.5 text-slate-900 dark:text-slate-200">
                        {car.category}
                      </td>
                    ))}
                    {selectedCars.length < 4 && <td />}
                  </tr>

                  {/* Powertrain & Drivetrain */}
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/40">
                      Powertrain & Drive
                    </td>
                    {selectedCars.map((car) => (
                      <td key={car.id} className="p-3.5 text-slate-900 dark:text-slate-200">
                        {car.powertrain} · {car.specs.drivetrain}
                      </td>
                    ))}
                    {selectedCars.length < 4 && <td />}
                  </tr>

                  {/* Engine Architecture */}
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/40">
                      Engine / Motor
                    </td>
                    {selectedCars.map((car) => (
                      <td key={car.id} className="p-3.5 text-slate-900 dark:text-slate-200">
                        {car.specs.engineType}
                      </td>
                    ))}
                    {selectedCars.length < 4 && <td />}
                  </tr>

                  {/* Horsepower */}
                  <tr className="bg-amber-500/5">
                    <td className="p-3.5 font-semibold text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-950/40">
                      Max Horsepower
                    </td>
                    {selectedCars.map((car) => {
                      const isLeader = highlightBest && car.specs.horsepower === maxHp && selectedCars.length > 1;
                      return (
                        <td key={car.id} className="p-3.5">
                          <div className="flex items-center gap-1.5 font-mono text-sm font-bold tabular-nums text-slate-900 dark:text-white">
                            <span>{car.specs.horsepower} HP</span>
                            {isLeader && (
                              <span className="text-[10px] font-sans px-1.5 py-0.2 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded font-semibold">
                                Best
                              </span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                    {selectedCars.length < 4 && <td />}
                  </tr>

                  {/* Torque */}
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/40">
                      Torque
                    </td>
                    {selectedCars.map((car) => (
                      <td key={car.id} className="p-3.5 font-mono text-slate-900 dark:text-slate-200 tabular-nums">
                        {car.specs.torque} lb-ft
                      </td>
                    ))}
                    {selectedCars.length < 4 && <td />}
                  </tr>

                  {/* 0-60 MPH */}
                  <tr className="bg-amber-500/5">
                    <td className="p-3.5 font-semibold text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-950/40">
                      0–60 MPH Time
                    </td>
                    {selectedCars.map((car) => {
                      const isLeader = highlightBest && car.specs.zeroToSixty === minZeroToSixty && selectedCars.length > 1;
                      return (
                        <td key={car.id} className="p-3.5">
                          <div className="flex items-center gap-1.5 font-mono text-sm font-bold tabular-nums text-amber-600 dark:text-amber-400">
                            <span>{car.specs.zeroToSixty}s</span>
                            {isLeader && (
                              <span className="text-[10px] font-sans px-1.5 py-0.2 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded font-semibold">
                                Quickest
                              </span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                    {selectedCars.length < 4 && <td />}
                  </tr>

                  {/* Top Speed */}
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/40">
                      Top Speed
                    </td>
                    {selectedCars.map((car) => {
                      const isLeader = highlightBest && car.specs.topSpeed === maxTopSpeed && selectedCars.length > 1;
                      return (
                        <td key={car.id} className="p-3.5">
                          <div className="flex items-center gap-1.5 font-mono text-sm font-bold tabular-nums text-slate-900 dark:text-white">
                            <span>{car.specs.topSpeed} MPH</span>
                            {isLeader && (
                              <span className="text-[10px] font-sans px-1.5 py-0.2 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded font-semibold">
                                Fastest
                              </span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                    {selectedCars.length < 4 && <td />}
                  </tr>

                  {/* Transmission */}
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/40">
                      Transmission
                    </td>
                    {selectedCars.map((car) => (
                      <td key={car.id} className="p-3.5 text-slate-900 dark:text-slate-200">
                        {car.specs.transmission}
                      </td>
                    ))}
                    {selectedCars.length < 4 && <td />}
                  </tr>

                  {/* Curb Weight */}
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/40">
                      Curb Weight
                    </td>
                    {selectedCars.map((car) => {
                      const isLightest = highlightBest && car.specs.curbWeight === minWeight && selectedCars.length > 1;
                      return (
                        <td key={car.id} className="p-3.5">
                          <div className="flex items-center gap-1.5 font-mono tabular-nums text-slate-900 dark:text-slate-200">
                            <span>{car.specs.curbWeight.toLocaleString()} lbs</span>
                            {isLightest && (
                              <span className="text-[10px] font-sans px-1.5 py-0.2 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded font-semibold">
                                Lightest
                              </span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                    {selectedCars.length < 4 && <td />}
                  </tr>

                  {/* Efficiency / Range */}
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/40">
                      Efficiency / Range
                    </td>
                    {selectedCars.map((car) => (
                      <td key={car.id} className="p-3.5 text-slate-900 dark:text-slate-200">
                        <div>{car.specs.efficiency}</div>
                        {car.specs.range && (
                          <div className="text-amber-500 font-mono font-medium">{car.specs.range}</div>
                        )}
                      </td>
                    ))}
                    {selectedCars.length < 4 && <td />}
                  </tr>

                  {/* Owner Rating */}
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/40">
                      Owner Rating
                    </td>
                    {selectedCars.map((car) => (
                      <td key={car.id} className="p-3.5 font-mono text-slate-900 dark:text-white font-bold">
                        ★ {car.rating?.toFixed(1) || '5.0'} / 5.0
                      </td>
                    ))}
                    {selectedCars.length < 4 && <td />}
                  </tr>

                  {/* Action Row */}
                  <tr>
                    <td className="p-3.5 bg-slate-50/50 dark:bg-slate-950/40">Full Profile</td>
                    {selectedCars.map((car) => (
                      <td key={car.id} className="p-3.5">
                        <button
                          onClick={() => onSelectCarDetail(car)}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-amber-400 hover:text-slate-950 dark:hover:bg-amber-400 dark:hover:text-slate-950 rounded-lg transition-colors cursor-pointer w-full text-center"
                        >
                          View Full Dossier
                        </button>
                      </td>
                    ))}
                    {selectedCars.length < 4 && <td />}
                  </tr>

                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div>
            Comparing <span className="font-bold text-slate-900 dark:text-white font-mono">{selectedCars.length}</span> of 4 allowed vehicles
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
          >
            Close Matrix
          </button>
        </div>

      </div>
    </div>
  );
};
