export type CarCategory = 
  | 'Supercar' 
  | 'Hypercar' 
  | 'Electric EV' 
  | 'Luxury Sedan' 
  | 'Sports Coupe' 
  | 'Performance SUV' 
  | 'Grand Tourer';

export type PowertrainType = 'Gasoline' | 'Electric' | 'Hybrid' | 'Plug-in Hybrid';

export type DrivetrainType = 'RWD' | 'AWD' | 'FWD';

export interface CarSpecs {
  // Engine & Powertrain
  engineType: string;
  displacement?: string;
  horsepower: number; // HP
  torque: number; // lb-ft
  redline?: string;
  transmission: string;
  drivetrain: DrivetrainType;
  
  // Performance Dynamics
  zeroToSixty: number; // seconds
  topSpeed: number; // mph
  quarterMile?: string;
  braking60To0?: string;
  lateralGrip?: string; // e.g. "1.25 g"
  
  // Dimensions & Weight
  curbWeight: number; // lbs
  length: number; // inches
  width: number; // inches
  height: number; // inches
  wheelbase: number; // inches
  cargoVolume?: string;
  
  // Efficiency & Range
  efficiency: string; // e.g., "15 City / 18 Hwy mpg" or "105 MPGe"
  range?: string; // e.g., "427 miles"
  batteryCapacity?: string; // e.g., "118 kWh"
  chargingSpeed?: string; // e.g., "300 kW DC fast charging"
  fuelCapacity?: string; // e.g., "16.9 gal"
  
  // Key Highlights
  features: string[];
}

export interface UserReview {
  id: string;
  carId: string;
  author: string;
  location?: string;
  date: string;
  verifiedOwner: boolean;
  ownershipDuration: string;
  overallRating: number; // 1-5
  ratings: {
    performance: number;
    comfort: number;
    value: number;
    styling: number;
    tech: number;
  };
  title: string;
  comment: string;
  pros: string[];
  cons: string[];
  helpfulVotes: number;
  status: 'approved' | 'pending';
}

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  tagline: string;
  category: CarCategory;
  powertrain: PowertrainType;
  price: number; // MSRP USD
  images: string[];
  specs: CarSpecs;
  description: string;
  featured?: boolean;
  rating?: number;
  reviewsCount?: number;
  createdAt?: string;
}

export type SortOption = 
  | 'featured' 
  | 'price-asc' 
  | 'price-desc' 
  | 'hp-desc' 
  | 'acceleration-asc' 
  | 'topspeed-desc' 
  | 'rating-desc';

export interface FilterState {
  search: string;
  category: string;
  powertrain: string;
  drivetrain: string;
  minPrice: number;
  maxPrice: number;
  minHp: number;
  sortBy: SortOption;
}
