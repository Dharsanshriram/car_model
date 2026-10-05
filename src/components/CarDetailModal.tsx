import React, { useState } from 'react';
import { 
  X, Scale, Check, Star, ChevronLeft, ChevronRight, Maximize2, 
  ThumbsUp, ShieldCheck, Gauge, Zap, Plus, Award, AlertCircle 
} from 'lucide-react';
import { Car, UserReview } from '../types/car';

interface CarDetailModalProps {
  car: Car | null;
  onClose: () => void;
  onToggleCompare: (car: Car) => void;
  isCompared: boolean;
  reviews: UserReview[];
  onAddReview: (review: UserReview) => void;
  onVoteHelpful: (reviewId: string) => void;
}

export const CarDetailModal: React.FC<CarDetailModalProps> = ({
  car,
  onClose,
  onToggleCompare,
  isCompared,
  reviews,
  onAddReview,
  onVoteHelpful
}) => {
  if (!car) return null;

  const [activeTab, setActiveTab] = useState<'specs' | 'reviews' | 'gallery'>('specs');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // New Review Form State
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewLocation, setReviewLocation] = useState('');
  const [reviewOwnership, setReviewOwnership] = useState('6 months');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [ratings, setRatings] = useState({
    performance: 5,
    comfort: 4,
    value: 4,
    styling: 5,
    tech: 4
  });
  const [newPro, setNewPro] = useState('');
  const [prosList, setProsList] = useState<string[]>([]);
  const [newCon, setNewCon] = useState('');
  const [consList, setConsList] = useState<string[]>([]);
  const [formError, setFormError] = useState('');

  const carReviews = reviews.filter((r) => r.carId === car.id && r.status === 'approved');

  // Compute category average scores
  const reviewCount = carReviews.length;
  const avgOverall = reviewCount > 0 
    ? (carReviews.reduce((sum, r) => sum + r.overallRating, 0) / reviewCount).toFixed(1)
    : '5.0';

  const avgPerf = reviewCount > 0 
    ? (carReviews.reduce((sum, r) => sum + r.ratings.performance, 0) / reviewCount).toFixed(1)
    : '5.0';
  const avgComfort = reviewCount > 0 
    ? (carReviews.reduce((sum, r) => sum + r.ratings.comfort, 0) / reviewCount).toFixed(1)
    : '4.5';
  const avgValue = reviewCount > 0 
    ? (carReviews.reduce((sum, r) => sum + r.ratings.value, 0) / reviewCount).toFixed(1)
    : '4.2';
  const avgStyling = reviewCount > 0 
    ? (carReviews.reduce((sum, r) => sum + r.ratings.styling, 0) / reviewCount).toFixed(1)
    : '4.9';
  const avgTech = reviewCount > 0 
    ? (carReviews.reduce((sum, r) => sum + r.ratings.tech, 0) / reviewCount).toFixed(1)
    : '4.8';

  const handleAddPro = () => {
    if (newPro.trim()) {
      setProsList([...prosList, newPro.trim()]);
      setNewPro('');
    }
  };

  const handleAddCon = () => {
    if (newCon.trim()) {
      setConsList([...consList, newCon.trim()]);
      setNewCon('');
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewTitle.trim() || !reviewComment.trim()) {
      setFormError('Please enter your name, a review headline, and detailed feedback.');
      return;
    }

    const overallRating = Math.round(
      (ratings.performance + ratings.comfort + ratings.value + ratings.styling + ratings.tech) / 5
    );

    const newRev: UserReview = {
      id: `rev-${Date.now()}`,
      carId: car.id,
      author: reviewAuthor.trim(),
      location: reviewLocation.trim() || 'Verified Driver',
      date: new Date().toISOString().split('T')[0],
      verifiedOwner: true,
      ownershipDuration: reviewOwnership,
      overallRating,
      ratings,
      title: reviewTitle.trim(),
      comment: reviewComment.trim(),
      pros: prosList.length > 0 ? prosList : ['Phenomenal throttle response'],
      cons: consList.length > 0 ? consList : ['High fuel/maintenance cost'],
      helpfulVotes: 0,
      status: 'approved'
    };

    onAddReview(newRev);
    setShowReviewForm(false);
    setReviewTitle('');
    setReviewComment('');
    setReviewAuthor('');
    setProsList([]);
    setConsList([]);
    setFormError('');
  };

  const images = car.images.length > 0 ? car.images : ['/src/assets/images/hero_porsche_gt3_1791195531411.jpg'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex justify-center p-2 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      
      {/* Modal Dialog Box */}
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Sticky Header Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
          <div className="min-w-0 pr-4">
            <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium truncate">
              {car.make} · {car.year} · {car.category}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white truncate font-display">
              {car.model} {car.trim && <span className="text-base sm:text-lg font-normal text-amber-500">({car.trim})</span>}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onToggleCompare(car)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                isCompared
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {isCompared ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Scale className="w-3.5 h-3.5" />}
              <span>{isCompared ? 'Compared' : 'Compare'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="overflow-y-auto flex-1">
          
          {/* Gallery Viewport Section */}
          <div className="relative bg-slate-950 aspect-16/9 sm:aspect-21/9 max-h-[420px] w-full overflow-hidden group select-none">
            <img
              src={images[activeImageIndex]}
              alt={`${car.make} ${car.model} view ${activeImageIndex + 1}`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transition-all duration-300"
            />
            
            {/* Gallery Navigation Controls */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-md transition-opacity cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-md transition-opacity cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Lightbox Mode Trigger */}
            <button
              onClick={() => setLightboxOpen(true)}
              className="absolute bottom-3 right-3 p-2 rounded-lg bg-slate-950/70 hover:bg-slate-950 text-white backdrop-blur-md text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Maximize2 className="w-4 h-4" />
              <span className="hidden sm:inline">Enlarge</span>
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-3 left-3 px-2 py-1 rounded bg-slate-950/70 text-[11px] font-mono tabular-nums text-slate-300 backdrop-blur-md">
              {activeImageIndex + 1} / {images.length}
            </div>
          </div>

          {/* Thumbnail Carousel */}
          {images.length > 1 && (
            <div className="flex items-center gap-2 p-3 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative shrink-0 w-20 h-12 rounded-md overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-amber-500 scale-102 shadow-sm'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Quick Stats Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-6 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="block text-xs uppercase tracking-wider text-slate-400 font-medium">Horsepower</span>
              <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                {car.specs.horsepower} <span className="text-xs font-sans text-slate-500 font-normal">HP</span>
              </span>
            </div>
            <div>
              <span className="block text-xs uppercase tracking-wider text-slate-400 font-medium">0–60 Acceleration</span>
              <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-amber-500">
                {car.specs.zeroToSixty} <span className="text-xs font-sans text-slate-500 font-normal">SEC</span>
              </span>
            </div>
            <div>
              <span className="block text-xs uppercase tracking-wider text-slate-400 font-medium">Top Speed</span>
              <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                {car.specs.topSpeed} <span className="text-xs font-sans text-slate-500 font-normal">MPH</span>
              </span>
            </div>
            <div>
              <span className="block text-xs uppercase tracking-wider text-slate-400 font-medium">MSRP Price</span>
              <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                ${car.price.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Tab Navigation (Segmented Functional Buttons) */}
          <div className="px-6 pt-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-3 text-sm font-semibold transition-colors border-b-2 cursor-pointer ${
                  activeTab === 'specs'
                    ? 'border-amber-500 text-slate-900 dark:text-white'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Technical Specifications
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-3 text-sm font-semibold transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'reviews'
                    ? 'border-amber-500 text-slate-900 dark:text-white'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <span>Owner Reviews</span>
                <span className="px-1.5 py-0.2 text-xs rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                  {carReviews.length}
                </span>
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-1 text-xs text-amber-500 pb-3">
              <Star className="w-4 h-4 fill-amber-500" />
              <span className="font-bold font-mono">{avgOverall}</span>
              <span className="text-slate-400 font-normal">({reviewCount} reviews)</span>
            </div>
          </div>

          {/* TAB 1: Technical Specifications */}
          {activeTab === 'specs' && (
            <div className="p-6 space-y-8">
              
              {/* Editorial Overview Prose */}
              <div>
                <h4 className="text-xs uppercase font-semibold text-slate-400 tracking-wider mb-2">Vehicle Overview</h4>
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  {car.description}
                </p>
              </div>

              {/* Engine & Powertrain Section */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>Engine & Powertrain</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200/60 dark:border-slate-800">
                    <span className="block text-xs text-slate-400">Architecture</span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{car.specs.engineType}</span>
                  </div>
                  {car.specs.displacement && (
                    <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200/60 dark:border-slate-800">
                      <span className="block text-xs text-slate-400">Displacement</span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white font-mono">{car.specs.displacement}</span>
                    </div>
                  )}
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200/60 dark:border-slate-800">
                    <span className="block text-xs text-slate-400">Transmission</span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{car.specs.transmission}</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200/60 dark:border-slate-800">
                    <span className="block text-xs text-slate-400">Torque</span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white font-mono">{car.specs.torque} lb-ft</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200/60 dark:border-slate-800">
                    <span className="block text-xs text-slate-400">Drivetrain</span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{car.specs.drivetrain} (All-Wheel / Rear-Wheel)</span>
                  </div>
                  {car.specs.redline && (
                    <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200/60 dark:border-slate-800">
                      <span className="block text-xs text-slate-400">Redline Max RPM</span>
                      <span className="text-sm font-semibold text-amber-500 font-mono">{car.specs.redline}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Performance Dynamics Section */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>Performance Dynamics</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200/60 dark:border-slate-800">
                    <span className="block text-xs text-slate-400">0–60 MPH</span>
                    <span className="text-base font-bold font-mono tabular-nums text-slate-900 dark:text-white">{car.specs.zeroToSixty}s</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200/60 dark:border-slate-800">
                    <span className="block text-xs text-slate-400">Top Speed</span>
                    <span className="text-base font-bold font-mono tabular-nums text-slate-900 dark:text-white">{car.specs.topSpeed} MPH</span>
                  </div>
                  {car.specs.quarterMile && (
                    <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200/60 dark:border-slate-800">
                      <span className="block text-xs text-slate-400">Quarter Mile</span>
                      <span className="text-base font-bold font-mono tabular-nums text-slate-900 dark:text-white">{car.specs.quarterMile}</span>
                    </div>
                  )}
                  {car.specs.lateralGrip && (
                    <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200/60 dark:border-slate-800">
                      <span className="block text-xs text-slate-400">Lateral Skidpad</span>
                      <span className="text-base font-bold font-mono tabular-nums text-slate-900 dark:text-white">{car.specs.lateralGrip}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Dimensions & Weight */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>Dimensions & Mass</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200/60 dark:border-slate-800">
                    <span className="block text-xs text-slate-400">Curb Weight</span>
                    <span className="text-sm font-bold font-mono tabular-nums text-slate-900 dark:text-white">{car.specs.curbWeight.toLocaleString()} lbs</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200/60 dark:border-slate-800">
                    <span className="block text-xs text-slate-400">Length</span>
                    <span className="text-sm font-bold font-mono tabular-nums text-slate-900 dark:text-white">{car.specs.length} in</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200/60 dark:border-slate-800">
                    <span className="block text-xs text-slate-400">Width</span>
                    <span className="text-sm font-bold font-mono tabular-nums text-slate-900 dark:text-white">{car.specs.width} in</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200/60 dark:border-slate-800">
                    <span className="block text-xs text-slate-400">Height</span>
                    <span className="text-sm font-bold font-mono tabular-nums text-slate-900 dark:text-white">{car.specs.height} in</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200/60 dark:border-slate-800">
                    <span className="block text-xs text-slate-400">Wheelbase</span>
                    <span className="text-sm font-bold font-mono tabular-nums text-slate-900 dark:text-white">{car.specs.wheelbase} in</span>
                  </div>
                  {car.specs.cargoVolume && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200/60 dark:border-slate-800">
                      <span className="block text-xs text-slate-400">Cargo Volume</span>
                      <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">{car.specs.cargoVolume}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Efficiency & Range */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>Efficiency & Energy</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200/60 dark:border-slate-800">
                    <span className="block text-xs text-slate-400">Efficiency Rating</span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{car.specs.efficiency}</span>
                  </div>
                  {car.specs.range && (
                    <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200/60 dark:border-slate-800">
                      <span className="block text-xs text-slate-400">Driving Range</span>
                      <span className="text-sm font-semibold text-amber-500 font-mono">{car.specs.range}</span>
                    </div>
                  )}
                  {car.specs.chargingSpeed && (
                    <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200/60 dark:border-slate-800">
                      <span className="block text-xs text-slate-400">Charging Velocity</span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">{car.specs.chargingSpeed}</span>
                    </div>
                  )}
                  {car.specs.fuelCapacity && (
                    <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200/60 dark:border-slate-800">
                      <span className="block text-xs text-slate-400">Fuel Tank Volume</span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white font-mono">{car.specs.fuelCapacity}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Standard Equipment Highlights */}
              {car.specs.features && car.specs.features.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span>Engineering & Chassis Highlights</span>
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {car.specs.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                        <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: User Reviews */}
          {activeTab === 'reviews' && (
            <div className="p-6 space-y-6">
              
              {/* Rating Summary Header Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800">
                
                {/* Overall Score */}
                <div className="flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800">
                  <div className="text-4xl sm:text-5xl font-extrabold font-mono text-slate-900 dark:text-white mb-1">
                    {avgOverall}
                  </div>
                  <div className="flex items-center gap-1 text-amber-400 mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs text-slate-500 font-mono">
                    Based on {reviewCount} verified reviews
                  </span>
                </div>

                {/* Subcategory Bars */}
                <div className="col-span-2 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Performance & Dynamics</span>
                    <span className="font-mono tabular-nums text-slate-900 dark:text-white font-bold">{avgPerf} / 5.0</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(Number(avgPerf) / 5) * 100}%` }} />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Comfort & Ride Quality</span>
                    <span className="font-mono tabular-nums text-slate-900 dark:text-white font-bold">{avgComfort} / 5.0</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(Number(avgComfort) / 5) * 100}%` }} />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Design & Craftsmanship</span>
                    <span className="font-mono tabular-nums text-slate-900 dark:text-white font-bold">{avgStyling} / 5.0</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(Number(avgStyling) / 5) * 100}%` }} />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Value for Money</span>
                    <span className="font-mono tabular-nums text-slate-900 dark:text-white font-bold">{avgValue} / 5.0</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(Number(avgValue) / 5) * 100}%` }} />
                  </div>
                </div>
              </div>

              {/* Action: Toggle Review Form */}
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Owner Experiences & Critiques
                </h3>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
                >
                  {showReviewForm ? 'Cancel Review' : '+ Write an Owner Review'}
                </button>
              </div>

              {/* Write Review Form */}
              {showReviewForm && (
                <form 
                  onSubmit={handleSubmitReview}
                  className="p-5 bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-amber-500/30 space-y-4 animate-in fade-in"
                >
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Submit Vehicle Critique
                  </h4>

                  {formError && (
                    <div className="p-3 text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-lg">
                      {formError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                        Your Name / Driver Handle
                      </label>
                      <input
                        type="text"
                        value={reviewAuthor}
                        onChange={(e) => setReviewAuthor(e.target.value)}
                        placeholder="e.g. Colin Chapman"
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                        Location / Region
                      </label>
                      <input
                        type="text"
                        value={reviewLocation}
                        onChange={(e) => setReviewLocation(e.target.value)}
                        placeholder="e.g. Silverstone, UK"
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                        Ownership Duration
                      </label>
                      <input
                        type="text"
                        value={reviewOwnership}
                        onChange={(e) => setReviewOwnership(e.target.value)}
                        placeholder="e.g. 1 year (10,000 miles)"
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Rating Pickers */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                    {(['performance', 'comfort', 'value', 'styling', 'tech'] as const).map((key) => (
                      <div key={key}>
                        <label className="block text-[11px] font-medium text-slate-500 capitalize mb-1">
                          {key}
                        </label>
                        <select
                          value={ratings[key]}
                          onChange={(e) => setRatings({ ...ratings, [key]: Number(e.target.value) })}
                          className="w-full px-2 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md font-mono"
                        >
                          <option value={5}>5 - Exceptional</option>
                          <option value={4}>4 - Great</option>
                          <option value={3}>3 - Average</option>
                          <option value={2}>2 - Disappointing</option>
                          <option value={1}>1 - Poor</option>
                        </select>
                      </div>
                    ))}
                  </div>

                  {/* Headline & Comment */}
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                      Headline
                    </label>
                    <input
                      type="text"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      placeholder="Summary of your driving impressions..."
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                      Detailed Driving Experience
                    </label>
                    <textarea
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Describe steering feel, braking, transmission behavior, comfort, and real-world ownership..."
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                      required
                    />
                  </div>

                  {/* Pros & Cons Tag Builder */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1">
                        Vehicle Pros / Strengths
                      </label>
                      <div className="flex gap-1.5 mb-2">
                        <input
                          type="text"
                          value={newPro}
                          onChange={(e) => setNewPro(e.target.value)}
                          placeholder="e.g. Telepathic front turn-in"
                          className="flex-1 px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={handleAddPro}
                          className="px-2.5 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-500/20"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {prosList.map((p, idx) => (
                          <span key={idx} className="text-[11px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                            + {p}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-rose-600 dark:text-rose-400 mb-1">
                        Vehicle Cons / Compromises
                      </label>
                      <div className="flex gap-1.5 mb-2">
                        <input
                          type="text"
                          value={newCon}
                          onChange={(e) => setNewCon(e.target.value)}
                          placeholder="e.g. Harsh low-speed ride"
                          className="flex-1 px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={handleAddCon}
                          className="px-2.5 py-1 text-xs font-medium bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-lg hover:bg-rose-500/20"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {consList.map((c, idx) => (
                          <span key={idx} className="text-[11px] text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800">
                            - {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg"
                    >
                      Publish Review
                    </button>
                  </div>
                </form>
              )}

              {/* Reviews Feed */}
              <div className="space-y-4">
                {carReviews.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 text-sm">
                    No verified reviews yet for this vehicle. Be the first to share your driving impressions!
                  </div>
                ) : (
                  carReviews.map((rev) => (
                    <div 
                      key={rev.id}
                      className="p-5 bg-white dark:bg-slate-950/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3"
                    >
                      {/* Reviewer Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900 dark:text-white">
                              {rev.author}
                            </span>
                            {rev.verifiedOwner && (
                              <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span>Verified Owner</span>
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 font-mono mt-0.5">
                            {rev.location && `${rev.location} · `}{rev.ownershipDuration} · {rev.date}
                          </div>
                        </div>

                        {/* Stars */}
                        <div className="flex items-center gap-1 text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < rev.overallRating ? 'fill-amber-400' : 'text-slate-300 dark:text-slate-700'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Title & Comment */}
                      <div>
                        <h5 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                          {rev.title}
                        </h5>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          {rev.comment}
                        </p>
                      </div>

                      {/* Pros & Cons Pills */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {rev.pros.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                              Highlights
                            </span>
                            <ul className="text-xs space-y-0.5 text-slate-600 dark:text-slate-400">
                              {rev.pros.map((p, i) => (
                                <li key={i} className="flex items-center gap-1.5">
                                  <span className="text-emerald-500 font-bold">+</span>
                                  <span>{p}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {rev.cons.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">
                              Compromises
                            </span>
                            <ul className="text-xs space-y-0.5 text-slate-600 dark:text-slate-400">
                              {rev.cons.map((c, i) => (
                                <li key={i} className="flex items-center gap-1.5">
                                  <span className="text-rose-500 font-bold">-</span>
                                  <span>{c}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Helpful Button */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-400">
                        <span>Was this critique insightful?</span>
                        <button
                          onClick={() => onVoteHelpful(rev.id)}
                          className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 transition-colors cursor-pointer"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span className="font-mono tabular-nums">{rev.helpfulVotes}</span>
                        </button>
                      </div>

                    </div>
                  ))
                )}
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer Bar */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950/90 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            <span>Base MSRP: </span>
            <span className="font-bold font-mono text-slate-900 dark:text-white">${car.price.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleCompare(car)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                isCompared
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-900 text-white dark:bg-slate-800 dark:text-white hover:bg-slate-800'
              }`}
            >
              {isCompared ? '✓ Remove from Comparison' : '+ Compare with Other Models'}
            </button>
          </div>
        </div>

      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-60 bg-black/95 flex flex-col items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={images[activeImageIndex]}
            alt="Enlarged car view"
            referrerPolicy="no-referrer"
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
          />
          <div className="mt-4 text-xs font-mono text-white/70">
            {car.make} {car.model} · Image {activeImageIndex + 1} of {images.length}
          </div>
        </div>
      )}

    </div>
  );
};
