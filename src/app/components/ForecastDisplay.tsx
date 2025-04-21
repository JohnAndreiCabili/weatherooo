'use client';

import React from 'react';
import { ForecastData, ForecastItem } from '../types';
import { WiHumidity, WiStrongWind } from 'react-icons/wi';
import { motion } from 'framer-motion';

interface ForecastDisplayProps {
  forecastData: ForecastData | null;
  isLoading: boolean;
  error: string | null;
  unit: 'metric' | 'imperial';
}

const ForecastDisplay: React.FC<ForecastDisplayProps> = ({ 
  forecastData, 
  isLoading, 
  error, 
  unit 
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return null; // Hide this component on error
  }

  if (!forecastData || !forecastData.list) {
    return null;
  }

  // Group forecast data by day
  const groupedForecast = forecastData.list.reduce((acc: Record<string, ForecastItem[]>, item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric' });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});

  // Get one forecast item per day (around noon)
  const dailyForecast = Object.keys(groupedForecast).map(date => {
    const dayForecasts = groupedForecast[date];
    // Get forecast closest to noon
    const noonForecast = dayForecasts.reduce((closest, current) => {
      const currentHour = new Date(current.dt * 1000).getHours();
      const closestHour = new Date(closest.dt * 1000).getHours();
      return Math.abs(currentHour - 12) < Math.abs(closestHour - 12) ? current : closest;
    });
    
    // Calculate min and max temps for the day
    const minTemp = Math.min(...dayForecasts.map(f => f.main.temp_min));
    const maxTemp = Math.max(...dayForecasts.map(f => f.main.temp_max));
    
    return { 
      date, 
      forecast: noonForecast,
      minTemp,
      maxTemp
    };
  }).slice(0, 5); // Limit to 5 days

  const getWeatherIcon = (icon: string) => {
    return `https://openweathermap.org/img/wn/${icon}.png`;
  };
  
  const getTodayDate = () => {
    return new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric' });
  };
  
  const isToday = (date: string) => {
    return date === getTodayDate();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-1">
        {dailyForecast.map(({ date, forecast, minTemp, maxTemp }, index) => (
          <motion.div 
            key={index}
            className="flex items-center justify-between py-3 px-2 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
          >
            {/* Day */}
            <div className="w-28 font-medium">
              {isToday(date) ? 'Today' : date.split(',')[0]}
            </div>
            
            {/* Weather icon */}
            <div className="flex items-center justify-center w-10">
              <img 
                src={getWeatherIcon(forecast.weather[0].icon)} 
                alt={forecast.weather[0].description}
                className="w-8 h-8" 
              />
            </div>
            
            {/* Weather condition */}
            <div className="flex-grow text-sm text-gray-600 dark:text-gray-300 px-2 hidden md:block">
              {forecast.weather[0].description}
            </div>
            
            {/* Rain chance */}
            <div className="w-16 text-center text-sm text-blue-500 dark:text-blue-400 hidden md:block">
              <div className="flex items-center justify-center">
                <WiHumidity className="text-lg mr-1" />
                <span>{forecast.main.humidity}%</span>
              </div>
            </div>
            
            {/* Temperature range */}
            <div className="flex items-center w-28 justify-end">
              {/* Min temp */}
              <div className="text-sm text-gray-500 dark:text-gray-400 mr-4 w-8 text-right">
                {Math.round(minTemp)}°
              </div>
              
              {/* Temperature bar */}
              <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full relative hidden md:block">
                <motion.div 
                  className="absolute top-0 h-full bg-gradient-to-r from-blue-400 to-orange-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                />
              </div>
              
              {/* Max temp */}
              <div className="text-sm font-medium w-8 text-right ml-4">
                {Math.round(maxTemp)}°
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ForecastDisplay; 