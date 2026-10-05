import { Car, UserReview } from '../types/car';
import { SEED_CARS, SEED_REVIEWS } from '../data/seedCars';

const CARS_STORAGE_KEY = 'apexmotiv_cars_v1';
const REVIEWS_STORAGE_KEY = 'apexmotiv_reviews_v1';

export function getStoredCars(): Car[] {
  try {
    const raw = localStorage.getItem(CARS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CARS_STORAGE_KEY, JSON.stringify(SEED_CARS));
      return SEED_CARS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_CARS;
  } catch (err) {
    console.error('Failed to load cars from localStorage', err);
    return SEED_CARS;
  }
}

export function saveStoredCars(cars: Car[]): void {
  try {
    localStorage.setItem(CARS_STORAGE_KEY, JSON.stringify(cars));
  } catch (err) {
    console.error('Failed to save cars to localStorage', err);
  }
}

export function getStoredReviews(): UserReview[] {
  try {
    const raw = localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(SEED_REVIEWS));
      return SEED_REVIEWS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SEED_REVIEWS;
  } catch (err) {
    console.error('Failed to load reviews from localStorage', err);
    return SEED_REVIEWS;
  }
}

export function saveStoredReviews(reviews: UserReview[]): void {
  try {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
  } catch (err) {
    console.error('Failed to save reviews to localStorage', err);
  }
}

export function resetDatabaseToDefaults(): { cars: Car[]; reviews: UserReview[] } {
  localStorage.setItem(CARS_STORAGE_KEY, JSON.stringify(SEED_CARS));
  localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(SEED_REVIEWS));
  return { cars: SEED_CARS, reviews: SEED_REVIEWS };
}

export function calculateAverageRating(reviews: UserReview[], carId: string): { rating: number; count: number } {
  const carReviews = reviews.filter((r) => r.carId === carId && r.status === 'approved');
  if (carReviews.length === 0) return { rating: 5.0, count: 0 };
  const sum = carReviews.reduce((acc, curr) => acc + curr.overallRating, 0);
  const rating = Number((sum / carReviews.length).toFixed(1));
  return { rating, count: carReviews.length };
}
