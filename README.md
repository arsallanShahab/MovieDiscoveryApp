# Movie Discovery App

A clean mobile app for discovering trending movies and searching for your favorites. Built with React Native and TypeScript, powered by the TMDB API.

## Features

- **Trending Movies**: Browse what's hot right now with infinite scrolling.
- **Smart Search**: Find movies instantly with a debounced search bar.
- **Movie Details**: View ratings, release dates, and overviews.
- **Smooth Navigation**: Seamless transitions between screens.

## Quick Start

1. **Clone & Install**

   ```bash
   git clone https://github.com/yourusername/movie-discovery-app.git
   cd MovieDiscoveryApp
   npm install
   ```

2. **Environment Setup**
   Create a `.env` file in the root directory (or copy the example). You'll need a TMDB API key.

   ```bash
   cp .env.example .env
   ```

   Add your key to `.env`:

   ```
   API_KEY=your_tmdb_api_key_here
   API_URL=https://api.themoviedb.org/3
   IMAGE_BASE_URL=https://image.tmdb.org/t/p/w500
   ```

3. **Run It**
   Start the Metro bundler:

   ```bash
   npm start
   ```

   Run on Android:

   ```bash
   npm run android
   ```

   Run on iOS (Mac only):

   ```bash
   cd ios && pod install && cd ..
   npm run ios
   ```

## Tech Stack

- **React Native** (0.76+)
- **TypeScript**
- **React Navigation**
- **Axios**
- **HugeIcons**
