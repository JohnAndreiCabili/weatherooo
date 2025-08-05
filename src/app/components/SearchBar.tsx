'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MdSearch, MdMyLocation, MdHistory, MdClose, MdOutlineSearch } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  onSearch: (city: string) => void;
  onUseLocation: () => void;
  locationLoading?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onUseLocation, locationLoading = false }) => {
  const [city, setCity] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const popularPhilippineCities = [
    'Manila', 'Quezon City', 'Cebu', 'Davao', 'Baguio', 
    'Boracay', 'Palawan', 'Makati', 'Tagaytay', 'Iloilo'
  ];

  useEffect(() => {
    // Load recent searches from localStorage
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city);
      addToRecentSearches(city);
      setCity('');
      setShowDropdown(false);
    }
  };

  const addToRecentSearches = (searchTerm: string) => {
    const formattedTerm = searchTerm.trim();
    // Create a new array with the most recent search at the beginning
    const updatedSearches = [
      formattedTerm,
      ...recentSearches.filter(term => term.toLowerCase() !== formattedTerm.toLowerCase())
    ].slice(0, 5); // Keep only the most recent 5 searches
    
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  const handleRecentSearch = (searchTerm: string) => {
    onSearch(searchTerm);
    setShowDropdown(false);
    setCity(searchTerm); // Update input field with the search term
  };

  const handleClearSearch = () => {
    setCity('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleClearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="relative">
          <div className={`
            flex items-center backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 rounded-2xl transition-all duration-300 border border-white/20 dark:border-slate-700/50 shadow-lg
            ${isInputFocused ? 'ring-2 ring-blue-500/50 dark:ring-blue-400/50 shadow-xl' : 'ring-0'}
          `}>
            <MdOutlineSearch className="ml-4 text-slate-500 dark:text-slate-400 text-lg" />
            <input
              ref={inputRef}
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onFocus={() => {
                setIsInputFocused(true);
                setShowDropdown(true);
              }}
              onBlur={() => setIsInputFocused(false)}
              placeholder="Search city"
              className="w-full py-3 px-3 bg-transparent border-none focus:outline-none text-sm font-medium text-slate-700 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400"
            />
            
            <AnimatePresence>
              {city && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  type="button"
                  onClick={handleClearSearch}
                  className="mr-3 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 rounded-full p-1 hover:bg-white/20 dark:hover:bg-slate-700/50 transition-all duration-200"
                >
                  <MdClose className="text-sm" />
                </motion.button>
              )}
            </AnimatePresence>
            
            <button
              type="button"
              onClick={onUseLocation}
              disabled={locationLoading}
              className={`
                h-8 w-8 mr-3 flex items-center justify-center rounded-xl transition-all duration-300
                ${locationLoading 
                  ? 'bg-slate-300/50 dark:bg-slate-600/50 cursor-not-allowed' 
                  : 'bg-white/30 dark:bg-slate-700/50 hover:bg-white/50 dark:hover:bg-slate-600/50 hover:shadow-md'}
              `}
              title="Use current location"
            >
              {locationLoading ? (
                <div className="w-3 h-3 border-2 border-slate-500 dark:border-slate-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <MdMyLocation className="text-sm text-slate-600 dark:text-slate-300" />
              )}
            </button>
          </div>
          
          <AnimatePresence>
            {showDropdown && (
              <motion.div 
                ref={dropdownRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-2 backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 rounded-2xl shadow-2xl z-10 border border-white/20 dark:border-slate-700/50 max-h-80 overflow-y-auto"
              >
                {recentSearches.length > 0 && (
                  <div>
                    <div className="px-3 py-1.5 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center">
                        <MdHistory className="mr-1 text-xs" /> Recent Searches
                      </div>
                      <button 
                        onClick={handleClearRecentSearches}
                        className="text-xs text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                      >
                        Clear
                      </button>
                    </div>
                    {recentSearches.map((term, index) => (
                      <motion.div 
                        key={`recent-${index}`}
                        className="px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex justify-between items-center"
                        onClick={() => handleRecentSearch(term)}
                        whileHover={{ x: 2 }}
                      >
                        <span className="text-sm font-medium">{term}</span>
                        <MdSearch className="text-gray-400 dark:text-gray-500 text-sm" />
                      </motion.div>
                    ))}
                  </div>
                )}
                
                {/* Show popular cities if there's no input or the input matches some cities */}
                {(!city || popularPhilippineCities.some(popularCity => 
                  popularCity.toLowerCase().includes(city.toLowerCase())
                )) && (
                  <div>
                    <div className="px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide border-b border-gray-200 dark:border-gray-700">
                      Popular Cities
                    </div>
                    {popularPhilippineCities
                      .filter(popularCity => 
                        !city || popularCity.toLowerCase().includes(city.toLowerCase())
                      )
                      .map((popularCity, index) => (
                        <motion.div 
                          key={`popular-${index}`}
                          className="px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                          onClick={() => handleRecentSearch(popularCity)}
                          whileHover={{ x: 2 }}
                        >
                          <span className="text-sm font-medium">{popularCity}</span>
                        </motion.div>
                      ))
                    }
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>
    </div>
  );
};

export default SearchBar; 