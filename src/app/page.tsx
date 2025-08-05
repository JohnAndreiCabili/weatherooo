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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950 transition-all duration-500 flex flex-col w-full relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Modern frosted glass toolbar */}
      <div className="relative z-10 backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 border-b border-white/20 dark:border-slate-700/50 h-16 flex items-center px-6 shadow-md">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="mr-6 p-2 rounded-xl bg-white/50 dark:bg-slate-700/50 hover:bg-white/70 dark:hover:bg-slate-600/50 transition-all duration-300 shadow-sm"
            aria-label="Toggle sidebar"
          >
            <MdSearch className="text-xl text-slate-700 dark:text-slate-300" />
          </button>
          <BloomText darkMode={darkMode} />
        </div>
        <div className="flex-grow"></div>
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-xl bg-white/50 dark:bg-slate-700/50 hover:bg-white/70 dark:hover:bg-slate-600/50 transition-all duration-300 shadow-sm"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <MdLightMode className="text-xl text-slate-300" /> : <MdDarkMode className="text-xl text-slate-700" />}
          </button>
          <UnitToggle unit={unit} onToggle={toggleUnit} />
          <button 
            onClick={handleRefresh}
            className="p-2 rounded-xl bg-white/50 dark:bg-slate-700/50 hover:bg-white/70 dark:hover:bg-slate-600/50 transition-all duration-300 shadow-sm"
            aria-label="Refresh weather data"
            disabled={loading}
          >
            <MdRefresh className={`text-xl text-slate-700 dark:text-slate-300 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      
      {/* Main content with optional sidebar */}
      <div className="flex flex-1 relative z-10 p-4">
                  {/* Modern frosted glass sidebar */}
          {sidebarOpen && (
            <div className="w-72 backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 rounded-3xl shadow-lg border border-white/20 dark:border-slate-700/50 h-full flex flex-col mr-4">
            <div className="p-6">
              <SearchBar onSearch={fetchWeatherData} onUseLocation={handleUseLocation} locationLoading={locationLoading} />
            </div>
            <div className="p-6 flex-1 overflow-auto">
              <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-4">Popular Cities</h2>
              <div className="space-y-2">
                {popularCities.map((city) => (
                  <button
                    key={city}
                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/50 dark:hover:bg-slate-700/50 text-sm font-medium transition-all duration-300 text-slate-700 dark:text-slate-300 hover:shadow-md"
                    onClick={() => fetchWeatherData(city)}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
            {lastUpdated && (
              <div className="p-4 text-xs text-slate-500 dark:text-slate-400 border-t border-white/20 dark:border-slate-700/50 bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm rounded-b-3xl">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            )}
          </div>
        )}
        
        {/* Main content area */}
        <div className="flex-1 overflow-auto pb-8">
          {/* Current weather */}
          <div className="mb-8 px-2">
            <WeatherDisplay 
              weatherData={weatherData} 
              isLoading={loading} 
              error={error} 
              unit={unit} 
            />
          </div>
          
          {/* Hourly forecast */}
          <div className="mb-8 backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 rounded-3xl p-6 shadow-lg border border-white/20 dark:border-slate-700/50 mx-2">
            <h2 className="text-xl font-semibold mb-6 px-2 text-slate-800 dark:text-slate-200">Hourly Forecast</h2>
            <HourlyForecast 
              forecastData={forecastData} 
              isLoading={loading} 
              error={error} 
              unit={unit} 
            />
          </div>
          
          {/* 5-day forecast */}
          <div className="backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 rounded-3xl p-6 shadow-lg border border-white/20 dark:border-slate-700/50 mx-2">
            <h2 className="text-xl font-semibold mb-6 px-2 text-slate-800 dark:text-slate-200">5-Day Forecast</h2>
            <ForecastDisplay 
              forecastData={forecastData} 
              isLoading={loading} 
              error={error} 
              unit={unit} 
            />
          </div>
          
          {/* Attribution footer */}
          <div className="mt-8 pt-6 border-t border-white/20 dark:border-slate-700/50 text-center text-sm text-slate-500 dark:text-slate-400">
            <p>Weather data provided by GoWeather API</p>
            <p className="mt-1">© {new Date().getFullYear()} weather<span className="text-orange-400">ooo</span> - Built for demonstration purposes only</p>
          </div>
        </div>
      </div>
    </main>
  );
}
