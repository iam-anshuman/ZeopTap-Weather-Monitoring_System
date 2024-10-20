import React, { useState, useEffect } from 'react';
import { WeatherResponse } from './Weather';

interface ThresholdAlertProps {
  weatherData: WeatherResponse;
  onAlert: (message: string) => void;
}

interface Threshold {
  type: 'temperature' | 'condition';
  value: number | string;
  operator: '>' | '<' | '=';
  consecutiveUpdates: number;
}

const ThresholdAlert: React.FC<ThresholdAlertProps> = ({ weatherData, onAlert }) => {
  const [thresholds, setThresholds] = useState<Threshold[]>([]);
  const [consecutiveBreaches, setConsecutiveBreaches] = useState<{ [key: string]: number }>({});
  const [showModal, setShowModal] = useState(false);
  const [newThreshold, setNewThreshold] = useState<Threshold>({
    type: 'temperature',
    operator: '>',
    value: 0,
    consecutiveUpdates: 1
  });

  useEffect(() => {
    checkThresholds();
  }, [weatherData]);

  const addThreshold = (newThreshold: Threshold) => {
    setThresholds([...thresholds, newThreshold]);
  };

  const checkThresholds = () => {
    thresholds.forEach((threshold, index) => {
      let isBreached = false;

      if (threshold.type === 'temperature') {
        const currentTemp = weatherData.main.temp;
        isBreached = evaluateThreshold(currentTemp, threshold.value, threshold.operator);
      } else if (threshold.type === 'condition') {
        const currentCondition = weatherData.weather[0].main;
        isBreached = currentCondition.toLowerCase() === threshold.value.toLowerCase();
      }

      updateConsecutiveBreaches(index, isBreached);
    });
  };

  const evaluateThreshold = (current: number, threshold: number , operator: '>' | '<' | '=') => {
    switch (operator) {
      case '>': return current > threshold;
      case '<': return current < threshold;
      case '=': return current === threshold;
      default: return false;
    }
  };

  const updateConsecutiveBreaches = (index: number, isBreached: boolean) => {
    setConsecutiveBreaches(prev => {
      const newBreaches = { ...prev };
      if (isBreached) {
        newBreaches[index] = (newBreaches[index] || 0) + 1;
        if (newBreaches[index] >= thresholds[index].consecutiveUpdates) {
          triggerAlert(thresholds[index]);
          newBreaches[index] = 0; // Reset after alerting
        }
      } else {
        newBreaches[index] = 0; // Reset if not breached
      }
      return newBreaches;
    });
  };

  const triggerAlert = (threshold: Threshold) => {
    const message = `Alert: ${threshold.type} ${threshold.operator} ${threshold.value} for ${threshold.consecutiveUpdates} consecutive updates`;
    onAlert(message);
  };

  // Render method and UI for setting thresholds would go here


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setThresholds([...thresholds, newThreshold]);
    setShowModal(false);
    setNewThreshold({
      type: 'temperature',
      operator: '>',
      value: 0,
      consecutiveUpdates: 1
    });
  };


  return (
    <div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Threshold Alerts</h3>
        {thresholds.map((threshold, index) => (
          <div key={index} className="mb-2 p-2 border rounded">
            <p>
              {threshold.type} {threshold.operator} {threshold.value}
              {threshold.type === 'temperature' && '°C'}
            </p>
            <p className="text-sm text-gray-600">
              Consecutive updates: {threshold.consecutiveUpdates}
            </p>
          </div>
        ))}
        <button
          className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setShowModal(true)}
        >
          Add New Threshold
        </button>

        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <h3 className="text-lg font-bold mb-4">Add New Threshold</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
                    Type
                  </label>
                  <select
                    id="type"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={newThreshold.type}
                    onChange={(e) => setNewThreshold({...newThreshold, type: e.target.value as 'temperature' | 'humidity'})}
                  >
                    <option value="temperature">Temperature</option>
                    <option value="humidity">Humidity</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="operator">
                    Operator
                  </label>
                  <select
                    id="operator"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={newThreshold.operator}
                    onChange={(e) => setNewThreshold({...newThreshold, operator: e.target.value as '>' | '<' | '='})}
                  >
                    <option value=">">Greater than</option>
                    <option value="<">Less than</option>
                    <option value="=">Equal to</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="value">
                    Value
                  </label>
                  <input
                    type="number"
                    id="value"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={newThreshold.value}
                    onChange={(e) => setNewThreshold({...newThreshold, value: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="consecutiveUpdates">
                    Consecutive Updates
                  </label>
                  <input
                    type="number"
                    id="consecutiveUpdates"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={newThreshold.consecutiveUpdates}
                    onChange={(e) => setNewThreshold({...newThreshold, consecutiveUpdates: parseInt(e.target.value)})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                  >
                    Add Threshold
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThresholdAlert;