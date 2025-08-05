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
      className="p-2 rounded-xl bg-white/50 dark:bg-slate-700/50 hover:bg-white/70 dark:hover:bg-slate-600/50 transition-all duration-300 shadow-sm relative flex items-center justify-center"
      whileTap={{ scale: 0.95 }}
      aria-pressed={unit === 'imperial'}
      aria-label={`Switch to ${unit === 'metric' ? 'Fahrenheit' : 'Celsius'}`}
      title={`Switch to ${unit === 'metric' ? 'Fahrenheit' : 'Celsius'}`}
    >
      <motion.div 
        className="relative inline-flex h-7 w-12 items-center rounded-xl p-1
          bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 dark:from-blue-600 dark:via-indigo-600 dark:to-purple-600
          transition-all duration-300 ease-in-out shadow-lg
          border border-white/30 backdrop-blur-sm"
      >
        <motion.span 
          className="
            inline-flex items-center justify-center h-5 w-5 rounded-lg bg-white shadow-lg
            transition-all duration-300 ease-in-out
            text-slate-800 font-semibold text-xs
          "
          animate={{
            x: unit === 'metric' ? 0 : 20
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