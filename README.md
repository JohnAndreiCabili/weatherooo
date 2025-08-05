# Weather Website

A clean, minimalist weather website that provides current weather data, forecasts, and activity recommendations based on weather conditions.

## Features

- **Modern Liquid Glass Design**: Beautiful frosted glass effect with rounded corners
- **Current Weather Display**: Temperature, condition, humidity, wind speed, pressure, and more
- **5-Day Forecast**: Overview of the weather for the next 5 days
- **Hourly Forecast**: Weather predictions hour by hour
- **Activity Recommendations**: Location-specific suggestions based on weather conditions
- **Search by City Name**: Look up weather in any city with autocomplete
- **Auto Location Detection**: Get weather for your current location
- **Dark Mode / Light Mode**: Toggle between dark and light themes
- **Unit Toggle**: Switch between Celsius and Fahrenheit
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Save Last Searched City**: Automatically remembers your last search
- **Auto-refresh**: Weather data updates every 10 minutes
- **Optimized Performance**: Fast loading with Next.js 15 optimizations

## Technologies Used

- NextJS 15.2.4
- TypeScript
- TailwindCSS
- React Icons
- Framer Motion
- OpenWeatherMap API
- Liquid Glass Design System

## Getting Started

1. Clone the repository
2. Install dependencies
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory with your weather API key:
   ```
   NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
   ```
4. Run the development server
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

### Vercel Deployment

This project is optimized for deployment on Vercel:

1. **Connect to GitHub**: Link your GitHub repository to Vercel
2. **Environment Variables**: Add your `NEXT_PUBLIC_OPENWEATHER_API_KEY` in Vercel's environment variables
3. **Deploy**: Vercel will automatically build and deploy your application

### Manual Deployment

1. Build the project:
   ```bash
   npm run build
   ```
2. Start the production server:
   ```bash
   npm start
   ```

## Troubleshooting

### "City not found" Error
- Make sure you're entering a valid city name
- Check your API key is correctly set up
- Try searching for major cities
- Verify your internet connection is working

### Location Detection Not Working
- Make sure you've allowed location access in your browser
- Some browsers require HTTPS for location services to work

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgements

- OpenWeatherMap for providing the weather data API
- TailwindCSS for the styling framework
- React Icons for the icon library
