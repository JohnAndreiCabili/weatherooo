'use client';

import React from 'react';
import { getActivityRecommendations } from '../api/weather';
import { 
  MdOutlineLocalActivity, 
  MdLocalCafe, 
  MdBeachAccess, 
  MdLandscape, 
  MdMuseum, 
  MdRestaurant,
  MdPhoto,
  MdPark,
  MdDirectionsBoat,
  MdFoodBank,
  MdOutlinePark,
  MdStore,
  MdNaturePeople,
  MdOutlineTempleHindu,
  MdAttractions,
  MdLocationOn
} from 'react-icons/md';
import { 
  FaHiking, 
  FaSwimmer, 
  FaShoppingBag, 
  FaUmbrella,
  FaIceCream,
  FaBuilding,
  FaTree,
  FaWater,
  FaChurch,
  FaHistory,
  FaMountain,
  FaBinoculars,
  FaHorse,
  FaShip
} from 'react-icons/fa';
import { FaRegCompass } from 'react-icons/fa';
import { motion } from 'framer-motion';
import styles from './ActivityRecommendations.module.css';

interface ActivityRecommendationsProps {
  weatherCondition: string;
  temperature: number;
  location: string;
}

// Map of activities to icons
const activityIcons: Record<string, React.ReactNode> = {
  // Weather-based activities
  'Photography': <MdPhoto className="text-indigo-500" />,
  'Outdoor dining': <MdRestaurant className="text-orange-500" />,
  'Museum visits': <MdMuseum className="text-amber-600" />,
  'Shopping malls': <FaShoppingBag className="text-pink-500" />,
  'Indoor restaurants': <MdRestaurant className="text-red-500" />,
  'Sightseeing': <MdLandscape className="text-indigo-500" />,
  'Park visits': <MdPark className="text-emerald-500" />,
  'City tours': <FaBuilding className="text-blue-600" />,
  'Stay indoors': <FaUmbrella className="text-gray-500" />,
  'Visit local cafes': <MdLocalCafe className="text-amber-800" />,
  'Spa day': <MdLocalCafe className="text-purple-500" />,
  'Swimming': <FaSwimmer className="text-blue-400" />,
  'Ice cream shops': <FaIceCream className="text-pink-400" />,
  'Air-conditioned venues': <FaUmbrella className="text-teal-500" />,
  'Light hiking': <FaHiking className="text-green-500" />,
  'Outdoor cafes': <MdLocalCafe className="text-green-600" />,
  'Hot beverages': <MdLocalCafe className="text-red-600" />,
  'Nature walks': <FaTree className="text-green-700" />,
  
  // Manila
  'Visit Intramuros': <FaHistory className="text-amber-700" />,
  'Manila Ocean Park': <FaSwimmer className="text-blue-600" />,
  'National Museum visit': <MdMuseum className="text-blue-700" />,
  'Manila Bay sunset viewing': <MdLandscape className="text-orange-500" />,
  'Shop at SM Mall of Asia': <FaShoppingBag className="text-blue-500" />,
  'Binondo food tour': <MdFoodBank className="text-red-500" />,
  'Visit Rizal Park': <MdPark className="text-green-600" />,
  
  // Quezon City
  'Visit Quezon Memorial Circle': <MdOutlinePark className="text-green-600" />,
  'Art in Island museum': <MdMuseum className="text-purple-600" />,
  'La Mesa Eco Park': <FaTree className="text-green-700" />,
  'Maginhawa food trip': <MdFoodBank className="text-yellow-600" />,
  'Ninoy Aquino Parks & Wildlife': <MdNaturePeople className="text-green-700" />,
  
  // Tagaytay
  'Taal Volcano viewing': <FaMountain className="text-gray-700" />,
  'Sky Ranch amusement park': <MdAttractions className="text-blue-500" />,
  'Picnic Grove visit': <MdOutlinePark className="text-green-500" />,
  'Mahogany Market food trip': <MdStore className="text-amber-700" />,
  'People\'s Park in the Sky': <MdOutlinePark className="text-blue-600" />,
  'Sonya\'s Garden dining': <MdRestaurant className="text-green-600" />,
  
  // Cebu
  'Magellan\'s Cross visit': <FaChurch className="text-red-700" />,
  'Whale shark watching': <FaSwimmer className="text-blue-700" />,
  'Fort San Pedro tour': <FaHistory className="text-amber-800" />,
  'Temple of Leah': <MdOutlineTempleHindu className="text-amber-600" />,
  'Tops Lookout view': <FaBinoculars className="text-blue-600" />,
  'Cebu food crawl': <MdFoodBank className="text-orange-500" />,
  
  // Baguio
  'Burnham Park visit': <MdPark className="text-green-600" />,
  'Strawberry picking': <MdLocalCafe className="text-red-500" />,
  'BenCab Museum tour': <MdMuseum className="text-indigo-600" />,
  'Night market shopping': <FaShoppingBag className="text-indigo-500" />,
  'Camp John Hay walk': <FaTree className="text-green-800" />,
  'Mines View Park': <MdLandscape className="text-green-600" />,
  
  // Boracay
  'White Beach relaxation': <MdBeachAccess className="text-yellow-500" />,
  'Island hopping tour': <MdDirectionsBoat className="text-blue-500" />,
  'Parasailing adventure': <FaWater className="text-sky-500" />,
  'D\'Mall shopping': <FaShoppingBag className="text-pink-500" />,
  'Puka Shell Beach visit': <MdBeachAccess className="text-amber-200" />,
  'Sunset sailing': <FaShip className="text-orange-500" />,
  
  // Palawan
  'Underground River tour': <FaWater className="text-emerald-700" />,
  'Island hopping': <MdDirectionsBoat className="text-cyan-500" />,
  'Honda Bay visit': <MdBeachAccess className="text-blue-400" />,
  'Firefly watching': <MdNaturePeople className="text-amber-400" />,
  'Iwahig River cruise': <MdDirectionsBoat className="text-blue-600" />,
  'El Nido island tours': <MdBeachAccess className="text-emerald-500" />,
  
  // Other cities
  'Philippine Eagle Center': <MdNaturePeople className="text-amber-800" />,
  'Eden Nature Park visit': <FaTree className="text-green-700" />,
  'D\'Bone Collector Museum': <MdMuseum className="text-gray-700" />,
  'Davao Crocodile Park': <MdNaturePeople className="text-green-700" />,
  'Jack\'s Ridge viewpoint': <MdLandscape className="text-amber-700" />,
  'Samal Island day trip': <MdBeachAccess className="text-blue-400" />,
  'Miagao Church visit': <FaChurch className="text-amber-700" />,
  'Garin Farm pilgrimage': <FaTree className="text-green-600" />,
  'Islas de Gigantes tour': <MdDirectionsBoat className="text-blue-500" />,
  'Guimaras Island trip': <MdBeachAccess className="text-green-500" />,
  'Molo Mansion visit': <FaHistory className="text-amber-800" />,
  'Calle Crisologo walk': <FaHistory className="text-amber-700" />,
  'Bantay Bell Tower visit': <FaChurch className="text-red-700" />,
  'Heritage village tour': <FaHistory className="text-amber-600" />,
  'Kalesa ride': <FaHorse className="text-amber-800" />,
  'Hidden Garden visit': <MdPark className="text-green-600" />,
  'Kayangan Lake visit': <FaWater className="text-blue-600" />,
  'Twin Lagoon tour': <MdDirectionsBoat className="text-blue-500" />,
  'Shipwreck diving': <FaSwimmer className="text-blue-800" />,
  'Maquinit Hot Springs': <FaWater className="text-red-500" />,
  'Mt. Tapyas hiking': <FaMountain className="text-amber-800" />,
  'Anilao diving spots': <FaSwimmer className="text-blue-600" />,
  'Taal Heritage Town': <FaHistory className="text-amber-700" />,
  'Masasa Beach visit': <MdBeachAccess className="text-yellow-400" />,
  'Fortune Island day trip': <MdBeachAccess className="text-amber-400" />,
  'Caleruega Church visit': <FaChurch className="text-red-800" />,
  
  // Generic backup
  'Beach swimming': <MdBeachAccess className="text-blue-500" />,
  'Hiking': <FaHiking className="text-green-600" />,
  'Water activities': <FaSwimmer className="text-blue-500" />,
  'City exploration': <MdLandscape className="text-indigo-600" />,
  'Hot springs': <MdLocalCafe className="text-red-600" />,
  'Coffee shops': <MdLocalCafe className="text-amber-700" />,
  'Trekking': <FaHiking className="text-green-700" />,
  'Water sports': <FaSwimmer className="text-blue-400" />,
  'Cliff diving': <FaSwimmer className="text-blue-800" />,
  'Snorkeling': <FaSwimmer className="text-cyan-600" />,
};

// List of location-specific activities for detecting what's specific vs. generic
const locationSpecificActivities = [
  'Visit Intramuros', 'Manila Ocean Park', 'National Museum visit', 'Manila Bay sunset viewing',
  'Shop at SM Mall of Asia', 'Binondo food tour', 'Visit Rizal Park',
  'Visit Quezon Memorial Circle', 'Art in Island museum', 'La Mesa Eco Park',
  'Maginhawa food trip', 'Ninoy Aquino Parks & Wildlife',
  'Taal Volcano viewing', 'Sky Ranch amusement park', 'Picnic Grove visit',
  'Mahogany Market food trip', 'People\'s Park in the Sky', 'Sonya\'s Garden dining',
  'Magellan\'s Cross visit', 'Whale shark watching', 'Fort San Pedro tour',
  'Temple of Leah', 'Tops Lookout view', 'Cebu food crawl',
  'Burnham Park visit', 'Strawberry picking', 'BenCab Museum tour',
  'Night market shopping', 'Camp John Hay walk', 'Mines View Park',
  'White Beach relaxation', 'Island hopping tour', 'Parasailing adventure',
  'D\'Mall shopping', 'Puka Shell Beach visit', 'Sunset sailing',
  'Underground River tour', 'Honda Bay visit', 'Firefly watching',
  'Iwahig River cruise', 'El Nido island tours',
  'Philippine Eagle Center', 'Eden Nature Park visit', 'D\'Bone Collector Museum',
  'Davao Crocodile Park', 'Jack\'s Ridge viewpoint', 'Samal Island day trip',
  'Miagao Church visit', 'Garin Farm pilgrimage', 'Islas de Gigantes tour',
  'Guimaras Island trip', 'Molo Mansion visit',
  'Calle Crisologo walk', 'Bantay Bell Tower visit', 'Heritage village tour',
  'Kalesa ride', 'Hidden Garden visit',
  'Kayangan Lake visit', 'Twin Lagoon tour', 'Shipwreck diving',
  'Maquinit Hot Springs', 'Mt. Tapyas hiking',
  'Anilao diving spots', 'Taal Heritage Town', 'Masasa Beach visit',
  'Fortune Island day trip', 'Caleruega Church visit'
];

// Default icon for activities without a specific icon
const defaultIcon = <MdOutlineLocalActivity className="text-gray-500" />;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
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
  },
  hover: {
    scale: 1.05,
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
};

const titleVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      delay: 0.2,
      duration: 0.5
    }
  }
};

const ActivityRecommendations: React.FC<ActivityRecommendationsProps> = ({ 
  weatherCondition, 
  temperature, 
  location 
}) => {
  const recommendations = getActivityRecommendations(weatherCondition, temperature, location);
  
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  // Check if we have location-specific activities
  const hasLocationSpecific = recommendations.some(activity => 
    locationSpecificActivities.includes(activity)
  );
  
  return (
    <motion.div 
      className={`p-6 bg-white/95 dark:bg-gray-800/95 text-gray-800 dark:text-gray-100 rounded-b-xl backdrop-blur-md ${styles.recommendationsContainer}`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="flex items-center justify-between mb-6">
        <motion.h3 
          className={`text-xl font-bold text-center md:text-left ${styles.title}`}
          variants={titleVariants}
        >
          {hasLocationSpecific ? (
            <>
              <MdLocationOn className="inline-block mr-1 text-red-500" />
              Top Activities in {location}
            </>
          ) : (
            <>Recommended Activities</>
          )}
        </motion.h3>
        
        {hasLocationSpecific && (
          <motion.span 
            className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            Location-specific
          </motion.span>
        )}
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
        variants={containerVariants}
      >
        {recommendations.map((activity, index) => {
          const activityIcon = activityIcons[activity] || defaultIcon;
          const isLocationSpecific = locationSpecificActivities.includes(activity);
          
          return (
            <motion.div 
              key={index} 
              className={`bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-4 rounded-lg shadow-sm hover:shadow-lg transition-all flex flex-col items-center text-center ${styles.activityCard} ${isLocationSpecific ? 'ring-1 ring-blue-300 dark:ring-blue-700' : ''}`}
              variants={itemVariants}
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
            >
              <motion.div 
                className={`text-3xl mb-3 rounded-full p-3 ${isLocationSpecific ? 'bg-blue-50/80 dark:bg-blue-900/50' : 'bg-white/80 dark:bg-gray-600/50'} shadow-inner ${styles.activityIcon}`}
                initial={{ rotate: -5 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 0.5 }}
              >
                {activityIcon}
              </motion.div>
              <span className="font-medium text-base">{activity}</span>
              
              {isLocationSpecific && (
                <motion.span 
                  className="text-xs mt-1 text-blue-600 dark:text-blue-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <MdLocationOn className="inline-block mr-1" />
                  Local highlight
                </motion.span>
              )}
            </motion.div>
          );
        })}
      </motion.div>
      
      <motion.p 
        className={`mt-6 text-sm text-center text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 ${styles.disclaimer}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <FaRegCompass className="inline-block mr-2 text-blue-500" />
        Activities are based on current weather conditions and location. Please check local advisories before planning.
      </motion.p>
    </motion.div>
  );
};

export default ActivityRecommendations; 