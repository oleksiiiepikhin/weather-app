# Angular Weather App

Demo application built as part of the interview task.

## Tech Stack
- **Angular (latest stable)** – standalone components
- **NGXS** state management (+ logger & storage plugins)
- **TypeScript**
- **SCSS/CSS** (responsive design)
- **OpenWeather API** (Geocoding, Current Weather, Forecast)

---

## Implemented Features

### Core
- **Location Detection**
  - Detects user location on app load via browser Geolocation API
  - Fallback to **Berlin** if location not available
- **Search Bar**
  - Search for cities by name with **live suggestions** (geocoding API)
  - Select city → fetch weather
- **Weather Display**
  - Shows **Today & Tomorrow** weather
  - Temperature, condition, humidity, wind speed, min/max values
  - Weather icons/images included
- **Error Handling**
  - Gracefully handles:
    - City not found
    - Location denied
    - API/network issues
  - User-friendly error messages
- **Accessibility (WCAG)**
  - Full **tab navigation**
  - Semantic HTML: `<header>`, `<main>`, `<footer>`
  - Proper ARIA roles (`combobox`, `listbox`, `status`, `alert`, `aria-pressed`)
  - Screen reader compatibility (tested with VoiceOver/NVDA)
- **NGXS Plugins**
  - `NgxsLoggerPluginModule` – development logging
  - `NgxsStoragePluginModule` – persistence of favorites & settings
- **Responsive Design**
  - Mobile-friendly layout
  - Adaptive cards and pill-style favorites

### Optional
- **Metric Settings**
  - Toggle between **Celsius (°C)** and **Fahrenheit (°F)**
  - Setting persisted in local storage
- **Favorite Cities**
  - Add/remove favorite cities
  - Persist favorites between sessions
  - Quick switch between favorite cities

---

## Setup & Run

### Clone the repository
- git clone https://github.com/oleksiiiepikhin/weather-app.git
- cd weather-app

### Install dependencies
- npm install

### Add your OpenWeather API key
Edit the following files:
- src/environments/environment.development.ts
- src/environments/environment.production.ts

### Start the dev server
- npm start

### Open in your browser
- http://localhost:4200

## Features Preview
- Search bar with live suggestions
- Favorites bar (add/remove cities)
- Today & Tomorrow weather cards
- °C/°F toggle
- Fully keyboard- and screen-reader-accessible

## Notes
- Built with a focus on clean architecture, accessibility, and responsive UI.
- Uses standalone Angular components (no NgModules).
- Error handling covers API, geolocation, and user input edge cases.