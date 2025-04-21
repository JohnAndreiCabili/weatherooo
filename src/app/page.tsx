'use client';

import React, { useState, useEffect } from 'react';
import { 
  fetchWeatherByCity, 
  fetchWeatherByCoords, 
  fetchForecastByCity, 
  fetchForecastByCoords 
} from './api/weather';
import { WeatherData, ForecastData, TemperatureUnit } from './types';
import SearchBar from './components/SearchBar';
import WeatherDisplay from './components/WeatherDisplay';
import ForecastDisplay from './components/ForecastDisplay';
import HourlyForecast from './components/HourlyForecast';
import UnitToggle from './components/UnitToggle';
import BloomText from './components/BloomText';
import { MdRefresh, MdDarkMode, MdLightMode, MdLocationOn, MdSearch } from 'react-icons/md';
import { FaCloudSunRain } from 'react-icons/fa';

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<TemperatureUnit>('metric');
  const [darkMode, setDarkMode] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Check for dark mode preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);
    
    // Apply dark mode class to body
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Check for last searched city
    const lastCity = localStorage.getItem('lastCity');
    if (lastCity) {
      fetchWeatherData(lastCity);
    } else {
      // Default to Manila if no city is saved
      fetchWeatherData('Manila');
    }
    
    // Check for preferred unit
    const savedUnit = localStorage.getItem('temperatureUnit');
    if (savedUnit && (savedUnit === 'metric' || savedUnit === 'imperial')) {
      setUnit(savedUnit as TemperatureUnit);
    }
    
    // Set up auto-refresh every 10 minutes
    const refreshInterval = setInterval(() => {
      if (weatherData?.name) {
        fetchWeatherData(weatherData.name, false);
      }
    }, 600000); // 10 minutes
    
    // Listen for search-city events from the error component
    const handleSearchCity = (event: CustomEvent) => {
      if (event.detail) {
        fetchWeatherData(event.detail);
      }
    };
    
    window.addEventListener('search-city', handleSearchCity as EventListener);
    
    return () => {
      clearInterval(refreshInterval);
      window.removeEventListener('search-city', handleSearchCity as EventListener);
    };
  }, []);
  
  // Effect to update when unit changes
  useEffect(() => {
    if (weatherData?.name) {
      fetchWeatherData(weatherData.name, false);
    }
    localStorage.setItem('temperatureUnit', unit);
  }, [unit]);

  const fetchWeatherData = async (city: string, saveToLocalStorage = true) => {
    try {
      setLoading(true);
      setError(null);
      
      // Use our server-side API instead of direct client-side calls
      const response = await fetch(`/api/direct-weather?city=${encodeURIComponent(city)}&units=${unit}`);
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch weather data');
      }
      
      setWeatherData(data.weatherData);
      setForecastData(data.forecastData);
      
      if (saveToLocalStorage) {
        localStorage.setItem('lastCity', city);
      }
      
      setLastUpdated(new Date());
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'City not found. Please try another location.');
      console.error('Error fetching weather data:', err);
    }
  };

  const handleUseLocation = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    try {
      setLoading(true);
      setLocationLoading(true);
      setError(null);
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            console.log('Location detected:', latitude, longitude);
            
            // Use our server-side API endpoint for geolocation-based weather
            const response = await fetch(
              `/api/direct-weather-geo?lat=${latitude}&lon=${longitude}&units=${unit}`
            );
            const data = await response.json();
            
            if (!response.ok || !data.success) {
              throw new Error(data.error || 'Failed to fetch weather data for your location');
            }
            
            setWeatherData(data.weatherData);
            setForecastData(data.forecastData);
            
            localStorage.setItem('lastCity', data.weatherData.name);
            setLastUpdated(new Date());
            setLoading(false);
            setLocationLoading(false);
          } catch (err: any) {
            console.error('Error fetching weather data by coords:', err);
            setLoading(false);
            setLocationLoading(false);
            setError(err.message || 'Failed to fetch weather data for your location. Please try searching for a city instead.');
          }
        }, 
        (err) => {
          console.error('Geolocation error:', err);
          setLoading(false);
          setLocationLoading(false);
          
          // More specific error messages
          if (err.code === 1) {
            setError('Location access denied. Please allow location access in your browser settings or search for a city.');
          } else if (err.code === 2) {
            setError('Unable to determine your location. Please try searching for a city.');
          } else if (err.code === 3) {
            setError('Location request timed out. Please try again or search for a city.');
          } else {
            setError('Unable to retrieve your location. Please try searching for a city.');
          }
        },
        { 
          enableHighAccuracy: true, 
          timeout: 10000, 
          maximumAge: 0 
        }
      );
    } catch (err: any) {
      console.error('Geolocation error:', err);
      setLoading(false);
      setLocationLoading(false);
      setError(err.message || 'An error occurred while trying to get your location. Please search for a city instead.');
    }
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleUnit = () => {
    setUnit(prev => prev === 'metric' ? 'imperial' : 'metric');
  };

  const handleRefresh = () => {
    if (weatherData?.name) {
      fetchWeatherData(weatherData.name, false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Generate a list of popular cities in the Philippines
  const popularCities = [
    'Manila', 'Quezon City', 'Cebu', 'Davao', 'Baguio', 
    'Iloilo', 'Boracay', 'Palawan', 'Tagaytay', 'Makati'
  ];

  return (
    <main className="min-h-screen transition-colors dark:bg-gray-900 dark:text-white flex flex-col w-full">
      {/* macOS style toolbar */}
      <div className="app-toolbar backdrop-blur-md bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 h-12 flex items-center px-4 z-10">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="mr-4 rounded-full p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle sidebar"
          >
            <MdSearch className="text-xl" />
          </button>
          <BloomText darkMode={darkMode} />
        </div>
        <div className="flex-grow"></div>
        <div className="flex items-center gap-1">
          <button 
            onClick={toggleDarkMode}
            className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <MdLightMode className="text-xl" /> : <MdDarkMode className="text-xl" />}
          </button>
          <UnitToggle unit={unit} onToggle={toggleUnit} />
          <button 
            onClick={handleRefresh}
            className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Refresh weather data"
            disabled={loading}
          >
            <MdRefresh className={`text-xl ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      
      {/* Main content with optional sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* macOS style sidebar */}
        {sidebarOpen && (
          <div className="w-64 bg-gray-100/90 dark:bg-gray-800/90 backdrop-blur-md border-r border-gray-200 dark:border-gray-700 h-full flex flex-col">
            <div className="p-4">
              <SearchBar onSearch={fetchWeatherData} onUseLocation={handleUseLocation} locationLoading={locationLoading} />
            </div>
            <div className="p-4 flex-1 overflow-auto">
              <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Popular Cities</h2>
              <div className="space-y-1">
                {popularCities.map((city) => (
                  <button
                    key={city}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-medium transition-colors"
                    onClick={() => fetchWeatherData(city)}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
            {lastUpdated && (
              <div className="p-3 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            )}
          </div>
        )}
        
        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Current weather */}
            <div className="mb-8">
              <WeatherDisplay 
                weatherData={weatherData} 
                isLoading={loading} 
                error={error} 
                unit={unit} 
              />
            </div>
            
            {/* Hourly forecast */}
            <div className="mb-8 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl p-4 shadow-lg">
              <h2 className="text-lg font-medium mb-4 px-2">Hourly Forecast</h2>
              <HourlyForecast 
                forecastData={forecastData} 
                isLoading={loading} 
                error={error} 
                unit={unit} 
              />
            </div>
            
            {/* 5-day forecast */}
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl p-4 shadow-lg">
              <h2 className="text-lg font-medium mb-4 px-2">5-Day Forecast</h2>
              <ForecastDisplay 
                forecastData={forecastData} 
                isLoading={loading} 
                error={error} 
                unit={unit} 
              />
            </div>
            
            {/* Attribution footer */}
            <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 text-center text-xs text-gray-500 dark:text-gray-400">
              <p>Weather data provided by GoWeather API</p>
              <p className="mt-1">© {new Date().getFullYear()} weather<span className="text-orange-400">ooo</span> - Built for demonstration purposes only</p>
            </div>
          </div>
        </div>
    </div>
    </main>
  );
}
