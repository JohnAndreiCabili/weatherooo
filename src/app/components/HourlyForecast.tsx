'use client';

import React from 'react';
import { ForecastData } from '../types';
import { WiHumidity, WiStrongWind } from 'react-icons/wi';
import { motion } from 'framer-motion';

interface HourlyForecastProps {
  forecastData: ForecastData | null;
  isLoading: boolean;
  error: string | null;
  unit: 'metric' | 'imperial';
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({ 
  forecastData, 
  isLoading, 
  error, 
  unit 
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[150px]">
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

  // Get next 12 hours of hourly data
  const hourlyData = forecastData.list.slice(0, 12);

  const getWeatherIcon = (icon: string) => {
    return `https://openweathermap.org/img/wn/${icon}.png`;
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const isToday = date.getDate() === now.getDate() && 
                    date.getMonth() === now.getMonth() && 
                    date.getFullYear() === now.getFullYear();
    
    if (isToday && date.getHours() === now.getHours()) {
      return 'Now';
    }
    
    return date.toLocaleTimeString([], { 
      hour: 'numeric', 
      hour12: true
    });
  };
  
  // Format wind speed to exactly 2 decimal places
  const formatWindSpeed = (speed: number): string => {
    return speed.toFixed(2);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden"
    >
      <div className="overflow-x-auto px-1 py-2 no-scrollbar">
        <div className="flex gap-3 min-w-max">
          {hourlyData.map((hourData, index) => (
            <motion.div 
              key={index} 
              className="flex flex-col items-center py-2 px-4 rounded-xl min-w-[80px] transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <p className="text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">
                {formatTime(hourData.dt)}
              </p>
              <img 
                src={getWeatherIcon(hourData.weather[0].icon)} 
                alt={hourData.weather[0].description}
                className="w-10 h-10 my-1" 
              />
              <p className="text-2xl font-light mt-1">
                {Math.round(hourData.main.temp)}°
              </p>
              
              <div className="flex justify-center w-full mt-2 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center mr-2" title="Humidity">
                  <WiHumidity className="text-base mr-0.5" />
                  <span>{hourData.main.humidity}%</span>
                </div>
                <div className="flex items-center" title="Wind Speed">
                  <WiStrongWind className="text-base mr-0.5" />
                  <span>{formatWindSpeed(hourData.wind.speed)}{unit === 'metric' ? 'm/s' : 'mph'}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default HourlyForecast; 