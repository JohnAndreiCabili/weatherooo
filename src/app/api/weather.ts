import axios from 'axios';

// OpenWeatherMap API configuration
const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY; // Direct access without fallback
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Logging to help debug (will only show in server console, not client-side)
console.log('API Key status:', API_KEY ? 'Present (length: ' + API_KEY.length + ')' : 'Missing');

// Additional validation to check if API key is properly set
const validateApiKey = () => {
  if (!API_KEY) {
    throw new Error('OpenWeatherMap API key is not configured. Please add your API key to .env.local file.');
  }
};

// Fetch current weather data by city name
export const fetchWeatherByCity = async (city: string, units = 'metric') => {
  validateApiKey();
  
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city + ',ph', // Add 'ph' suffix to prioritize Philippines cities
        appid: API_KEY,
        units: units
      }
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      throw new Error(`City "${city}" not found. Please check the spelling or try another location.`);
    } else if (error.response && error.response.status === 401) {
      throw new Error('Invalid API key. Please check your OpenWeatherMap API key.');
    } else if (error.code === 'ECONNABORTED' || !error.response) {
      throw new Error('Network connection error. Please check your internet connection.');
    } else {
      console.error('Error fetching weather data:', error);
      throw new Error('Error fetching weather data. Please try again later.');
    }
  }
};

// Fetch weather data by coordinates
export const fetchWeatherByCoords = async (lat: number, lon: number, units = 'metric') => {
  validateApiKey();
  
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: units
      },
      timeout: 10000 // 10 second timeout
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      throw new Error('Invalid API key. Please check your OpenWeatherMap API key.');
    } else if (error.code === 'ECONNABORTED' || !error.response) {
      throw new Error('Network connection error. Please check your internet connection.');
    } else {
      console.error('Error fetching weather data by coordinates:', error);
      throw new Error('Error fetching weather data. Please try again later.');
    }
  }
};

// Fetch 5-day forecast by city name
export const fetchForecastByCity = async (city: string, units = 'metric') => {
  validateApiKey();
  
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: city + ',ph', // Add 'ph' suffix to prioritize Philippines cities
        appid: API_KEY,
        units: units
      },
      timeout: 10000 // 10 second timeout
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      throw new Error(`City "${city}" not found. Please check the spelling or try another location.`);
    } else if (error.response && error.response.status === 401) {
      throw new Error('Invalid API key. Please check your OpenWeatherMap API key.');
    } else if (error.code === 'ECONNABORTED' || !error.response) {
      throw new Error('Network connection error. Please check your internet connection.');
    } else {
      console.error('Error fetching forecast data:', error);
      throw new Error('Error fetching forecast data. Please try again later.');
    }
  }
};

// Fetch 5-day forecast by coordinates
export const fetchForecastByCoords = async (lat: number, lon: number, units = 'metric') => {
  validateApiKey();
  
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: units
      },
      timeout: 10000 // 10 second timeout
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      throw new Error('Invalid API key. Please check your OpenWeatherMap API key.');
    } else if (error.code === 'ECONNABORTED' || !error.response) {
      throw new Error('Network connection error. Please check your internet connection.');
    } else {
      console.error('Error fetching forecast data by coordinates:', error);
      throw new Error('Error fetching forecast data. Please try again later.');
    }
  }
};

// Function to get activity recommendations based on weather and location
export const getActivityRecommendations = (weatherCondition: string, temperature: number, location: string) => {
  // Convert location to lowercase for easier matching
  const locationLower = location.toLowerCase();
  console.log("Weather condition:", weatherCondition, "Temperature:", temperature, "Location:", locationLower);
  
  // Base recommendations array
  const recommendations = [];
  
  // Weather-based recommendations (generic)
  if (weatherCondition.includes('clear')) {
    recommendations.push('Outdoor dining', 'Photography');
  } else if (weatherCondition.includes('rain') || weatherCondition.includes('drizzle')) {
    recommendations.push('Museum visits', 'Shopping malls', 'Indoor restaurants');
  } else if (weatherCondition.includes('cloud')) {
    recommendations.push('Sightseeing', 'Park visits', 'City tours');
  } else if (weatherCondition.includes('thunderstorm')) {
    recommendations.push('Stay indoors', 'Visit local cafes', 'Spa day');
  }
  
  // Temperature-based recommendations
  if (temperature > 30) {
    recommendations.push('Swimming', 'Ice cream shops', 'Air-conditioned venues');
  } else if (temperature > 25 && temperature <= 30) {
    recommendations.push('Light hiking', 'Outdoor cafes');
  } else {
    recommendations.push('Hot beverages', 'Nature walks');
  }
  
  // Location-specific recommendations for Philippine cities
  // Always prioritize these recommendations
  const locationRecommendations = [];
  
  // Major city recommendations
  if (locationLower.includes('manila')) {
    locationRecommendations.push(
      'Visit Intramuros',
      'Manila Ocean Park',
      'National Museum visit',
      'Manila Bay sunset viewing',
      'Shop at SM Mall of Asia',
      'Binondo food tour',
      'Visit Rizal Park',
      'BGC art installations'
    );
  } else if (locationLower.includes('quezon')) {
    locationRecommendations.push(
      'Visit Quezon Memorial Circle',
      'Art in Island museum',
      'La Mesa Eco Park',
      'Maginhawa food trip',
      'Ninoy Aquino Parks & Wildlife',
      'UP Diliman campus tour',
      'Eastwood City nightlife'
    );
  } else if (locationLower.includes('makati')) {
    locationRecommendations.push(
      'Ayala Museum visit',
      'Greenbelt shopping',
      'Poblacion food crawl',
      'Salcedo weekend market',
      'Ayala Triangle Gardens',
      'Legazpi Sunday market',
      'Makati Circuit karting'
    );
  } else if (locationLower.includes('pasay')) {
    locationRecommendations.push(
      'SMX Convention Center',
      'Cultural Center visit',
      'Star City amusement park',
      'World Trade Center events',
      'DreamPlay by DreamWorks',
      'Mall of Asia ferris wheel'
    );
  } else if (locationLower.includes('taguig') || locationLower.includes('bgc')) {
    locationRecommendations.push(
      'Venice Grand Canal Mall',
      'Mind Museum visit',
      'BGC arts tour',
      'High Street shopping',
      'Track 30th dining',
      'Uptown Bonifacio nightlife'
    );
  } 
  
  // Popular tourist destinations
  else if (locationLower.includes('tagaytay')) {
    locationRecommendations.push(
      'Taal Volcano viewing',
      'Sky Ranch amusement park',
      'Picnic Grove visit',
      'Mahogany Market food trip',
      'People\'s Park in the Sky',
      'Sonya\'s Garden dining',
      'Bag of Beans coffee'
    );
  } else if (locationLower.includes('baguio')) {
    locationRecommendations.push(
      'Burnham Park visit',
      'Strawberry picking',
      'BenCab Museum tour',
      'Night market shopping',
      'Camp John Hay walk',
      'Mines View Park',
      'The Mansion visit',
      'Good Shepherd treats'
    );
  } else if (locationLower.includes('cebu')) {
    locationRecommendations.push(
      'Magellan\'s Cross visit',
      'Whale shark watching',
      'Fort San Pedro tour',
      'Temple of Leah',
      'Tops Lookout view',
      'Cebu food crawl',
      'Bantayan Island day trip',
      'Kawasan Falls canyoneering'
    );
  } else if (locationLower.includes('boracay')) {
    locationRecommendations.push(
      'White Beach relaxation',
      'Island hopping tour',
      'Parasailing adventure',
      'D\'Mall shopping',
      'Puka Shell Beach visit',
      'Sunset sailing',
      'Pub crawl in Station 2',
      'Cliff diving at Ariel\'s Point'
    );
  } else if (locationLower.includes('palawan') || locationLower.includes('puerto')) {
    locationRecommendations.push(
      'Underground River tour',
      'Island hopping',
      'Honda Bay visit',
      'Firefly watching',
      'Iwahig River cruise',
      'El Nido island tours',
      'Coron lagoon hopping',
      'Calauit Safari tour'
    );
  } 
  
  // Other popular destinations
  else if (locationLower.includes('batangas')) {
    locationRecommendations.push(
      'Anilao diving spots',
      'Taal Heritage Town',
      'Masasa Beach visit',
      'Fortune Island day trip',
      'Caleruega Church visit',
      'Laiya beach resorts',
      'Verde Island diving'
    );
  } else if (locationLower.includes('davao')) {
    locationRecommendations.push(
      'Philippine Eagle Center',
      'Eden Nature Park visit',
      'D\'Bone Collector Museum',
      'Davao Crocodile Park',
      'Jack\'s Ridge viewpoint',
      'Samal Island day trip',
      'Durian sampling tour',
      'Mt. Apo trekking base'
    );
  } else if (locationLower.includes('iloilo')) {
    locationRecommendations.push(
      'Miagao Church visit',
      'Garin Farm pilgrimage',
      'Islas de Gigantes tour',
      'Guimaras Island trip',
      'Molo Mansion visit',
      'Iloilo River Esplanade',
      'La Paz Batchoy tasting'
    );
  } else if (locationLower.includes('bacolod')) {
    locationRecommendations.push(
      'The Ruins visit',
      'Lakawon Island trip',
      'Campuestohan Highland Resort',
      'Mambukal Mountain Resort',
      'Balay Negrense Museum',
      'Capitol Park and Lagoon',
      'Local chicken inasal tour'
    );
  } else if (locationLower.includes('siargao')) {
    locationRecommendations.push(
      'Cloud 9 surfing',
      'Magpupungko rock pools',
      'Sugba Lagoon trip',
      'Sohoton Cove tour',
      'Island hopping adventure',
      'Coconut Road bike ride',
      'Kermit surf lessons'
    );
  } else if (locationLower.includes('bohol')) {
    locationRecommendations.push(
      'Chocolate Hills viewing',
      'Tarsier Sanctuary visit',
      'Loboc River cruise',
      'Panglao Island beaches',
      'Balicasag Island diving',
      'Hinagdanan Cave tour',
      'Man-made forest drive'
    );
  } else if (locationLower.includes('vigan')) {
    locationRecommendations.push(
      'Calle Crisologo walk',
      'Bantay Bell Tower visit',
      'Heritage village tour',
      'Kalesa ride',
      'Hidden Garden visit',
      'Vigan empanada tasting',
      'Pottery making demonstration'
    );
  } else if (locationLower.includes('zambales')) {
    locationRecommendations.push(
      'Anawangin Cove camping',
      'Capones Island visit',
      'Nagsasa Cove hike',
      'Potipot Island swimming',
      'Pundaquit beach surfing',
      'Mount Pinatubo trekking',
      'Crystal Beach resort'
    );
  } else if (locationLower.includes('coron')) {
    locationRecommendations.push(
      'Kayangan Lake visit',
      'Twin Lagoon tour',
      'Shipwreck diving',
      'Maquinit Hot Springs',
      'Mt. Tapyas hiking',
      'Barracuda Lake diving',
      'Malcapuya Island hopping'
    );
  } else if (locationLower.includes('el nido')) {
    locationRecommendations.push(
      'Big Lagoon kayaking',
      'Small Lagoon swimming',
      'Nacpan Beach visit',
      'Island hopping Tour A',
      'Secret Beach snorkeling',
      'Las Cabañas Beach sunset',
      'Taraw Cliff climbing'
    );
  } else if (locationLower.includes('la union') || locationLower.includes('elyu')) {
    locationRecommendations.push(
      'San Juan surfing lessons',
      'Tangadan Falls hike',
      'Grape farm tour',
      'Poro Point Lighthouse',
      'Flotsam & Jetsam visit',
      'Ma-Cho Temple tour',
      'Urbiztondo beach walk'
    );
  } else if (locationLower.includes('dumaguete')) {
    locationRecommendations.push(
      'Rizal Boulevard stroll',
      'Apo Island diving',
      'Casaroro Falls hike',
      'Twin Lakes tour',
      'Silliman University visit',
      'Sans Rival Bistro treats',
      'Manjuyod Sandbar trip'
    );
  } else if (locationLower.includes('sagada')) {
    locationRecommendations.push(
      'Hanging Coffins tour',
      'Sumaguing Cave exploring',
      'Kiltepan Peak sunrise',
      'Echo Valley hiking',
      'Bokong Falls swim',
      'Sagada pottery shopping',
      'Blue Soil Hills visit'
    );
  }
  
  // Prioritize location-specific recommendations, then fill with weather/temp based ones
  const finalRecommendations = [...locationRecommendations];
  
  // If we don't have enough location-specific recommendations, add some general ones
  if (finalRecommendations.length < 5) {
    const remainingSlots = 5 - finalRecommendations.length;
    const generalRecs = recommendations.filter(rec => !finalRecommendations.includes(rec));
    finalRecommendations.push(...generalRecs.slice(0, remainingSlots));
  }
  
  // Return unique recommendations (max 5)
  console.log("Final recommendations:", finalRecommendations.slice(0, 5));
  return [...new Set(finalRecommendations)].slice(0, 5);
}; 