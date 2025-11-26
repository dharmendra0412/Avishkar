
export enum UserRole {
  ADMIN = 'ADMIN',
  VILLAGER = 'VILLAGER'
}

export type Language = 'en' | 'hi' | 'mr';

export interface DashboardStat {
  label: string;
  value: string | number;
  change: number; // percentage
  trend: 'up' | 'down' | 'neutral';
}

export interface GovService {
  id: string;
  name: string;
  category: string;
  description: string;
  eligibility: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // 0-based index
}

export interface WeatherData {
  temp: string;
  condition: string;
  icon: string;
  humidity: string;
  advice: string;
}

export interface ForecastDay {
  day: string;
  date: string;
  icon: string;
  tempHigh: string;
  tempLow: string;
  rainProb: string;
  condition: string;
}

export interface MarketItem {
  crop: string;
  price: string;
  change: 'up' | 'down' | 'stable';
}

export interface AgriDashboardData {
  weather: WeatherData;
  forecast: ForecastDay[];
  prices: MarketItem[];
}