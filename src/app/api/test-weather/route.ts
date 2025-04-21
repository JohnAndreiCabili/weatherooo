import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json({ error: 'API key is missing' }, { status: 500 });
  }
  
  try {
    // Try a direct API call to OpenWeatherMap
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        q: 'Manila,ph',
        appid: apiKey,
        units: 'metric'
      },
      timeout: 5000
    });
    
    return NextResponse.json({
      status: 'success',
      data: response.data,
      apiKeyUsed: `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message,
      response: error.response?.data || 'No response data',
      apiKeyUsed: `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`
    }, { status: 500 });
  }
} 