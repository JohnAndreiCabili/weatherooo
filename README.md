# Weather Website

A clean, minimalist weather website that provides current weather data, forecasts, and activity recommendations based on weather conditions.

## Features

- **Current Weather Display**: Temperature, condition, humidity, wind speed, pressure, and more
- **5-Day Forecast**: Overview of the weather for the next 5 days
- **Hourly Forecast**: Weather predictions hour by hour
- **Activity Recommendations**: Suggestions for things to do based on the weather
- **Search by City Name**: Look up weather in any city
- **Auto Location Detection**: Get weather for your current location
- **Dark Mode / Light Mode**: Toggle between dark and light themes
- **Unit Toggle**: Switch between Celsius and Fahrenheit
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Save Last Searched City**: Automatically remembers your last search
- **Auto-refresh**: Weather data updates every 10 minutes

## Technologies Used

- NextJS 14
- TypeScript
- TailwindCSS
- React Icons
- Framer Motion
- Weather API

## Getting Started

1. Clone the repository
2. Install dependencies
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory with your weather API key
4. Run the development server
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

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
