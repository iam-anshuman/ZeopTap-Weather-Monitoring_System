import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

interface WeatherVisualizationsProps {
  dailySummaries: Array<{
    date: string;
    avgTemp: number;
    maxTemp: number;
    minTemp: number;
    dominantWeather: string;
  }>;
  triggeredAlerts: Array<{
    date: string;
    message: string;
  }>;
}

const WeatherVisualizations: React.FC<WeatherVisualizationsProps> = ({ dailySummaries, triggeredAlerts }) => {
  const temperatureData = {
    labels: dailySummaries.map(summary => summary.date),
    datasets: [
      {
        label: 'Average Temperature',
        data: dailySummaries.map(summary => summary.avgTemp),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Max Temperature',
        data: dailySummaries.map(summary => summary.maxTemp),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
      {
        label: 'Min Temperature',
        data: dailySummaries.map(summary => summary.minTemp),
        borderColor: 'rgb(54, 162, 235)',
        tension: 0.1,
      },
    ],
  };

  const weatherConditionData = {
    labels: dailySummaries.map(summary => summary.date),
    datasets: [
      {
        label: 'Dominant Weather Condition',
        data: dailySummaries.map(summary => 1),
        backgroundColor: dailySummaries.map(summary => {
          switch (summary.dominantWeather) {
            case 'Clear': return 'rgba(255, 206, 86, 0.5)';
            case 'Clouds': return 'rgba(75, 192, 192, 0.5)';
            case 'Rain': return 'rgba(54, 162, 235, 0.5)';
            default: return 'rgba(153, 102, 255, 0.5)';
          }
        }),
      },
    ],
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Temperature Trends</h2>
        <Line data={temperatureData} options={{ responsive: true }} />
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4">Dominant Weather Conditions</h2>
        <Bar data={weatherConditionData} options={{ responsive: true }} />
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4">Triggered Alerts</h2>
        <ul className="list-disc pl-5">
          {triggeredAlerts.map((alert, index) => (
            <li key={index} className="mb-2">
              <span className="font-semibold">{alert.date}:</span> {alert.message}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WeatherVisualizations;