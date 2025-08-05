'use client';

import React from 'react';
import { WeatherData } from '../types';
import { WiHumidity, WiStrongWind, WiBarometer, WiSunrise, WiSunset } from 'react-icons/wi';
import { TbUvIndex, TbTemperature } from 'react-icons/tb';
import { MdVisibility, MdOutlineWaterDrop } from 'react-icons/md';
import { FaRegCompass, FaWind } from 'react-icons/fa';
import { BiCloud } from 'react-icons/bi';
import ActivityRecommendations from './ActivityRecommendations';
import { motion } from 'framer-motion';
import styles from './WeatherDisplay.module.css';

interface WeatherDisplayProps {
  weatherData: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  unit: 'metric' | 'imperial';
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 10
    }
  }
};

const detailsVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ weatherData, isLoading, error, unit }) => {
  if (isLoading) {
    return (
      <div className="backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 rounded-3xl p-8 flex justify-center items-center min-h-[400px] shadow-2xl border border-white/20 dark:border-slate-700/50">
        <motion.div 
          className={`loading-spinner ${styles.loadingSpinner}`}
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
          }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="backdrop-blur-xl bg-red-50/80 dark:bg-red-900/20 border border-red-200/50 dark:border-red-800/50 text-red-700 dark:text-red-300 rounded-3xl p-8 shadow-2xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center mb-6">
          <svg className="w-6 h-6 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
          </svg>
          <p className="text-xl font-semibold">{error}</p>
        </div>
        <motion.div 
          className="grid md:grid-cols-2 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="backdrop-blur-sm bg-white/20 p-6 rounded-2xl">
            <h3 className="text-lg font-semibold mb-4">Suggestions:</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>Check the spelling of the city name</li>
              <li>Try searching for a major city in the Philippines</li>
              <li>Verify your internet connection</li>
              <li>Try using your current location instead</li>
            </ul>
          </div>
          <div className="backdrop-blur-sm bg-white/20 p-6 rounded-2xl">
            <h3 className="text-lg font-semibold mb-4">Popular cities:</h3>
            <div className="grid grid-cols-2 gap-3">
              <motion.button 
                onClick={() => window.dispatchEvent(new CustomEvent('search-city', { detail: 'Manila' }))}
                className="py-2 px-3 bg-white/30 rounded-xl hover:bg-white/40 transition-all duration-300 text-left text-sm font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Manila
              </motion.button>
              <motion.button 
                onClick={() => window.dispatchEvent(new CustomEvent('search-city', { detail: 'Cebu' }))}
                className="py-2 px-3 bg-white/30 rounded-xl hover:bg-white/40 transition-all duration-300 text-left text-sm font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cebu
              </motion.button>
              <motion.button 
                onClick={() => window.dispatchEvent(new CustomEvent('search-city', { detail: 'Davao' }))}
                className="py-2 px-3 bg-white/30 rounded-xl hover:bg-white/40 transition-all duration-300 text-left text-sm font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Davao
              </motion.button>
              <motion.button 
                onClick={() => window.dispatchEvent(new CustomEvent('search-city', { detail: 'Baguio' }))}
                className="py-2 px-3 bg-white/30 rounded-xl hover:bg-white/40 transition-all duration-300 text-left text-sm font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Baguio
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  if (!weatherData) {
    return (
      <motion.div 
        className="backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 rounded-3xl p-8 text-center text-slate-700 dark:text-slate-300 min-h-[400px] flex flex-col justify-center items-center shadow-2xl border border-white/20 dark:border-slate-700/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.svg 
          className="w-20 h-20 mb-6 opacity-50" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, 10, 0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </motion.svg>
        <motion.p 
          className="text-2xl font-semibold mb-3"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Search for a city to see weather information
        </motion.p>
        <motion.p 
          className="text-lg text-slate-600 dark:text-slate-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Try searching for Manila, Cebu, Davao, or any city in the Philippines
        </motion.p>
      </motion.div>
    );
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getWeatherIcon = (icon: string) => {
    return `https://openweathermap.org/img/wn/${icon}@4x.png`;
  };
  
  // Format numbers to 2 decimal places when needed
  const formatNumber = (value: number, decimals: number = 2) => {
    return Number(value.toFixed(decimals));
  };
  
  // Format wind speed to exactly 2 decimal places (as a string to preserve trailing zeros)
  const formatWindSpeed = (speed: number): string => {
    return speed.toFixed(2);
  };
  
  const getMacOSBackgroundClass = () => {
    const weatherCondition = weatherData.weather[0].main.toLowerCase();
    const isDay = weatherData.weather[0].icon.includes('d');
    
    if (weatherCondition.includes('clear')) {
      return isDay ? 'bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700' : 'bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-950';
    } else if (weatherCondition.includes('cloud')) {
      return isDay ? 'bg-gradient-to-br from-slate-400 via-blue-500 to-indigo-600' : 'bg-gradient-to-br from-slate-600 via-slate-700 to-blue-900';
    } else if (weatherCondition.includes('rain') || weatherCondition.includes('drizzle')) {
      return 'bg-gradient-to-br from-slate-500 via-blue-600 to-indigo-700';
    } else if (weatherCondition.includes('thunderstorm')) {
      return 'bg-gradient-to-br from-slate-700 via-purple-800 to-indigo-900';
    } else if (weatherCondition.includes('snow')) {
      return 'bg-gradient-to-br from-blue-200 via-slate-300 to-gray-400';
    } else if (weatherCondition.includes('mist') || weatherCondition.includes('fog')) {
      return 'bg-gradient-to-br from-slate-400 via-gray-500 to-slate-600';
    } else {
      return 'bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700';
    }
  };

           return (
           <motion.div 
             className={`rounded-3xl shadow-lg overflow-hidden backdrop-blur-xl ${getMacOSBackgroundClass()} ${styles.weatherContainer} relative`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Frosted glass overlay */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm pointer-events-none"></div>
      
      {/* Main weather info - modern design */}
      <motion.div className="p-8 text-white relative z-10" variants={containerVariants}>
        {/* Location and date */}
        <motion.div className="text-center mb-6" variants={itemVariants}>
          <h2 className="text-3xl font-light tracking-tight text-white drop-shadow-2xl mb-1">{weatherData.name}</h2>
          <p className="text-lg font-light text-white/90 drop-shadow-lg">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </p>
        </motion.div>

        {/* Temperature and weather icon - centered like macOS */}
        <motion.div className="flex flex-col items-center justify-center mb-8" variants={itemVariants}>
          <motion.div 
            className="text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <img 
              src={getWeatherIcon(weatherData.weather[0].icon)} 
              alt={weatherData.weather[0].description}
              width="120"
              height="120"
              className="mx-auto drop-shadow-2xl mb-2 filter brightness-110"
            />
            <p className="text-xl capitalize text-white drop-shadow-xl font-light mb-1">{weatherData.weather[0].description}</p>
            <div className="text-6xl font-light text-white drop-shadow-2xl mb-1">
              {Math.round(weatherData.main.temp)}°
            </div>
            <div className="text-lg font-light text-white/95 drop-shadow-lg">
              <span>H: {Math.round(weatherData.main.temp_max)}° </span>
              <span className="mx-2">|</span>
              <span>L: {Math.round(weatherData.main.temp_min)}°</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Weather details - modern frosted glass cards */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          variants={detailsVariants}
        >
          {/* Row 1 */}
          <motion.div 
            className="backdrop-blur-xl bg-white/20 p-4 rounded-2xl border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-white/25"
            variants={itemVariants}
          >
            <div className="flex items-center mb-2">
              <TbUvIndex className="text-lg mr-2 text-white/90" />
              <p className="text-xs font-semibold text-white/90 drop-shadow-sm tracking-wide">UV INDEX</p>
            </div>
            <p className="text-xl font-light text-white drop-shadow-lg mb-1">Moderate</p>
            <p className="text-xs text-white/80 drop-shadow-sm">4 of 10</p>
          </motion.div>
          
          <motion.div 
            className="backdrop-blur-xl bg-white/20 p-4 rounded-2xl border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-white/25"
            variants={itemVariants}
          >
            <div className="flex items-center mb-2">
              <WiSunrise className="text-lg mr-2 text-white/90" />
              <p className="text-xs font-semibold text-white/90 drop-shadow-sm tracking-wide">SUNRISE</p>
            </div>
            <p className="text-xl font-light text-white drop-shadow-lg mb-1">{formatTime(weatherData.sys.sunrise)}</p>
            <p className="text-xs text-white/80 drop-shadow-sm">Sunset: {formatTime(weatherData.sys.sunset)}</p>
          </motion.div>
          
          <motion.div 
            className="backdrop-blur-xl bg-white/20 p-4 rounded-2xl border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-white/25"
            variants={itemVariants}
          >
            <div className="flex items-center mb-2">
              <WiStrongWind className="text-lg mr-2 text-white/90" />
              <p className="text-xs font-semibold text-white/90 drop-shadow-sm tracking-wide">WIND</p>
            </div>
            <p className="text-xl font-light text-white drop-shadow-lg mb-1">{formatWindSpeed(weatherData.wind.speed)} {unit === 'metric' ? 'm/s' : 'mph'}</p>
            <p className="text-xs text-white/80 drop-shadow-sm">Direction: {weatherData.wind.deg}°</p>
          </motion.div>
          
          <motion.div 
            className="backdrop-blur-xl bg-white/20 p-4 rounded-2xl border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-white/25"
            variants={itemVariants}
          >
            <div className="flex items-center mb-2">
              <TbTemperature className="text-lg mr-2 text-white/90" />
              <p className="text-xs font-semibold text-white/90 drop-shadow-sm tracking-wide">FEELS LIKE</p>
            </div>
            <p className="text-xl font-light text-white drop-shadow-lg mb-1">{Math.round(weatherData.main.feels_like)}°</p>
            <p className="text-xs text-white/80 drop-shadow-sm">Similar to actual temperature</p>
          </motion.div>
          
          {/* Row 2 */}
          <motion.div 
            className="backdrop-blur-xl bg-white/20 p-4 rounded-2xl border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-white/25"
            variants={itemVariants}
          >
            <div className="flex items-center mb-2">
              <WiHumidity className="text-lg mr-2 text-white/90" />
              <p className="text-xs font-semibold text-white/90 drop-shadow-sm tracking-wide">HUMIDITY</p>
            </div>
            <p className="text-xl font-light text-white drop-shadow-lg mb-1">{weatherData.main.humidity}%</p>
            <p className="text-xs text-white/80 drop-shadow-sm">Dew point: {(weatherData.main.temp - (100 - weatherData.main.humidity) / 5).toFixed(1)}°</p>
          </motion.div>
          
          <motion.div 
            className="backdrop-blur-xl bg-white/20 p-4 rounded-2xl border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-white/25"
            variants={itemVariants}
          >
            <div className="flex items-center mb-2">
              <MdVisibility className="text-lg mr-2 text-white/90" />
              <p className="text-xs font-semibold text-white/90 drop-shadow-sm tracking-wide">VISIBILITY</p>
            </div>
            <p className="text-xl font-light text-white drop-shadow-lg mb-1">{formatNumber(weatherData.visibility / 1000)} km</p>
            <p className="text-xs text-white/80 drop-shadow-sm">{weatherData.visibility >= 10000 ? 'Clear conditions' : 'Reduced visibility'}</p>
          </motion.div>
          
          <motion.div 
            className="backdrop-blur-xl bg-white/20 p-4 rounded-2xl border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-white/25"
            variants={itemVariants}
          >
            <div className="flex items-center mb-2">
              <WiBarometer className="text-lg mr-2 text-white/90" />
              <p className="text-xs font-semibold text-white/90 drop-shadow-sm tracking-wide">PRESSURE</p>
            </div>
            <p className="text-xl font-light text-white drop-shadow-lg mb-1">{weatherData.main.pressure}</p>
            <p className="text-xs text-white/80 drop-shadow-sm">hPa</p>
          </motion.div>
          
          <motion.div 
            className="backdrop-blur-xl bg-white/20 p-4 rounded-2xl border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-white/25"
            variants={itemVariants}
          >
            <div className="flex items-center mb-2">
              <BiCloud className="text-lg mr-2 text-white/90" />
              <p className="text-xs font-semibold text-white/90 drop-shadow-sm tracking-wide">CLOUD COVER</p>
            </div>
            <p className="text-xl font-light text-white drop-shadow-lg mb-1">{weatherData.clouds?.all || 0}%</p>
            <p className="text-xs text-white/80 drop-shadow-sm">{weatherData.clouds?.all > 50 ? 'Mostly cloudy' : 'Partly cloudy'}</p>
          </motion.div>
        </motion.div>
      </motion.div>
      
      {/* Activity recommendations section */}
      <ActivityRecommendations 
        weatherCondition={weatherData.weather[0].main.toLowerCase()} 
        temperature={weatherData.main.temp} 
        location={weatherData.name}
      />
    </motion.div>
  );
};

export default WeatherDisplay; 