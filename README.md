# Weather App

This project is a weather application with a React frontend and Node.js backend. It displays weather information for multiple cities and provides daily weather summaries.

## Project Structure

- `Client/`: React frontend application
- `Server/`: Node.js backend application

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- MongoDB account and cluster

## Setup

### 1. Clone the repository


### 2. Set up environment variables

#### Client

Create a `Client/.env` file with the following content:

`VITE_OPEN_WEATHER_API_KEY=your_openweather_api_key`
`VITE_API_BASE_URL=http://localhost:3000`


Replace `your_openweather_api_key` with your actual OpenWeather API key.

#### Server

Create a `Server/.env` file with the following content:

`MONGODB_URI=your_mongodb_connection_string`
`PORT=3000`


Replace `your_mongodb_connection_string` with your actual MongoDB connection string.

### 3. Install dependencies

### Install client dependencies
`cd Client`
`npm install`
### Install server dependencies
`cd ../Server`
`npm install`


## Running the Application

### Start the server
`cd Server`
`npm run dev`


The server will start on `http://localhost:3000`.

### Start the client

In a new terminal:

`cd Client`
`npm run dev`


The client will start on `http://localhost:5173` (or another port if 5173 is in use).

## Features

- Display weather information for multiple cities
- Calculate and store daily weather summaries
- Visualize weather data
- Set weather alerts based on thresholds

## Technologies Used

- Frontend: React, Vite, TypeScript
- Backend: Node.js, Express
- Database: MongoDB
- API: OpenWeather API
