export interface WeatherData {
  coord: {
    lon: number;
    lat: number;
  };
  weather: WeatherCondition[];
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  name: string;
  dt: number;
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface ForecastData {
  list: ForecastItem[];
  city: {
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    sunrise: number;
    sunset: number;
  };
}

export interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: WeatherCondition[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  dt_txt: string;
}

export interface ActivityRecommendation {
  activity: string;
  category: 'outdoor' | 'indoor' | 'cultural' | 'relaxation' | 'adventure';
}

export interface GeocodingResult {
  name: string;
  lat: number;
  lon: number;
  country: string;
}

export type TemperatureUnit = 'metric' | 'imperial'; 