'use client';

import React from 'react';
import { TemperatureUnit } from '../types';
import { motion } from 'framer-motion';

interface UnitToggleProps {
  unit: TemperatureUnit;
  onToggle: () => void;
}

const UnitToggle: React.FC<UnitToggleProps> = ({ unit, onToggle }) => {
  return (
    <motion.button
      onClick={onToggle}
      className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors relative flex items-center justify-center"
      whileTap={{ scale: 0.95 }}
      aria-pressed={unit === 'imperial'}
      aria-label={`Switch to ${unit === 'metric' ? 'Fahrenheit' : 'Celsius'}`}
      title={`Switch to ${unit === 'metric' ? 'Fahrenheit' : 'Celsius'}`}
    >
      <motion.div 
        className="relative inline-flex h-6 w-10 items-center rounded-full p-1
          bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700
          transition-colors duration-300 ease-in-out shadow-lg
          border border-white/20"
      >
        <motion.span 
          className="
            inline-flex items-center justify-center h-4 w-4 rounded-full bg-white shadow-md
            transition-transform duration-300 ease-in-out
            text-gray-800 font-medium text-xs
          "
          animate={{
            x: unit === 'metric' ? 0 : 16
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          {unit === 'metric' ? 'C' : 'F'}
        </motion.span>
      </motion.div>
    </motion.button>
  );
};

export default UnitToggle; 