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
            flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg transition-all duration-200
            ${isInputFocused ? 'ring-2 ring-blue-500 dark:ring-blue-400' : 'ring-0'}
          `}>
            <MdOutlineSearch className="ml-3 text-gray-400 dark:text-gray-400 text-lg" />
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
              className="w-full py-2 px-2 bg-transparent border-none focus:outline-none text-sm font-medium text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
            />
            
            <AnimatePresence>
              {city && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  type="button"
                  onClick={handleClearSearch}
                  className="mr-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-full p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600"
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
                h-7 w-7 mr-1 flex items-center justify-center rounded-full transition-colors
                ${locationLoading 
                  ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed' 
                  : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500'}
              `}
              title="Use current location"
            >
              {locationLoading ? (
                <div className="w-3 h-3 border-2 border-gray-500 dark:border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <MdMyLocation className="text-sm text-gray-500 dark:text-gray-300" />
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
                className="absolute top-full left-0 right-0 mt-1 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-lg shadow-lg z-10 border border-gray-200 dark:border-gray-700 max-h-80 overflow-y-auto"
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