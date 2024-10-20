import { useEffect, useState } from "react";
import ThresholdAlert from './ThresholdAlert';
import WeatherVisualizations from './WeatherVisualizations';

export type WeatherResponse = {
  base: string;
  clouds: {
    all: number;
  };
  cod: number;
  coord: {
    lon: number;
    lat: number;
  };
  dt: number;
  id: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity?: number;
  };
  name: string;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  visibility: number;
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
};



function Weather() {
  const [weather, setWeather] = useState<WeatherResponse[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dailySummaries, setDailySummaries] = useState<Array<{
    date: string;
    avgTemp: number;
    maxTemp: number;
    minTemp: number;
    dominantWeather: string;
  }>>([]);
  const [triggeredAlerts, setTriggeredAlerts] = useState<Array<{
    date: string;
    message: string;
  }>>([]);
  const cities = ["Delhi", "Mumbai", "Kolkata", "Chennai", "Bengaluru", "Hyderabad"];
  
  const API_KEY = import.meta.env.VITE_OPEN_WEATHER_API_KEY;

  useEffect(() => {
    const fetchWeather = async (city: string) => {
      try {
        setLoading(true);
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }
        const data = await response.json();
        return data;
      } catch (err) {
        setError('Error fetching weather data');
        return null;
      } finally {
        setLoading(false);
      }
    };

    // Fetch weather for all cities
    const fetchAllWeather = async () => {
      const weatherData = await Promise.all(cities.map(city => fetchWeather(city)));
      const validWeatherData = weatherData.filter((data): data is WeatherResponse => data !== null);
      console.log(validWeatherData);
      setWeather(validWeatherData);
    };

    fetchAllWeather();
  }, []);



  const calculateDailySummary = (data: WeatherResponse[]) => {
    const summary = data.reduce((acc, city) => {
      acc.avgTemp += city.main.temp;
      acc.maxTemp = Math.max(acc.maxTemp, city.main.temp_max);
      acc.minTemp = Math.min(acc.minTemp, city.main.temp_min);
      const weatherCondition = city.weather[0].main;
      acc.weatherCondition[weatherCondition] = (acc.weatherCondition[weatherCondition] || 0) + 1;
      return acc;
    }, {
      avgTemp: 0,
      maxTemp: -Infinity,
      minTemp: Infinity,
      weatherCondition: {} as Record<string, number>
    });
    summary.avgTemp /= data.length;
    const dominantWeather = Object.keys(summary.weatherCondition)
      .reduce((a, b) => summary.weatherCondition[a] > summary.weatherCondition[b] ? a : b);

    return {
      ...summary,
      dominantWeather
    };
  };


  const handleAlert = (message: string) => {
    setTriggeredAlerts(prevAlerts => [
      ...prevAlerts,
      { date: new Date().toLocaleDateString(), message }
    ]);
  };

  
  
  const saveDailySummary = async (summary: ReturnType<typeof calculateDailySummary>) => {
    try {
      const response = await fetch('/api/save-daily-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(summary),
      });
  
      if (!response.ok) {
        throw new Error('Failed to save daily summary');
      }
  
      console.log('Daily summary saved successfully');
    } catch (error) {
      console.error('Error saving daily summary:', error);
    }
  };

  useEffect(() => {
    const checkAndSaveDailySummary = async () => {
      if (weather && weather.length > 0) {
        const dailySummary = calculateDailySummary(weather);
        await saveDailySummary(dailySummary);
        setDailySummaries(prevSummaries => [
          ...prevSummaries,
          {
            date: new Date().toLocaleDateString(),
            avgTemp: dailySummary.avgTemp,
            maxTemp: dailySummary.maxTemp,
            minTemp: dailySummary.minTemp,
            dominantWeather: dailySummary.dominantWeather
          }
        ]);
      }
    };

    checkAndSaveDailySummary();
  }, [weather]);
  


  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  
  return (
    <div>
      {weather && 
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {weather.map((cityWeather, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">{cityWeather.name}</h2>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-semibold">Average Temperature:</span> {cityWeather.main.temp.toFixed(1)}°C
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Maximum Temperature:</span> {cityWeather.main.temp_max.toFixed(1)}°C
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Minimum Temperature:</span> {cityWeather.main.temp_min.toFixed(1)}°C
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Dominant Weather Condition:</span> {cityWeather.weather[0].main}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Reason: {cityWeather.weather[0].description} (based on OpenWeather API data)
                </p>
              </div>
            </div>
          ))}
           <ThresholdAlert weatherData={weather} onAlert={handleAlert} />
           <WeatherVisualizations 
              dailySummaries={dailySummaries}
              triggeredAlerts={triggeredAlerts}
            />
        </div>
      
      }
    </div>
  )
}

export default Weather;
