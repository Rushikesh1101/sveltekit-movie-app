# MovieHub — SvelteKit Movie Discovery App

MovieHub is a modern movie discovery web application built using **SvelteKit**, **Tailwind CSS**, and the **TMDB API**.  
It delivers a fast, clean, and immersive experience for browsing movies, watching trailers, managing personal watchlists, and tracking recently viewed titles.

This project is frontend-focused and designed as a **production-quality UI demo** with client-side authentication and persistence.

---

## Features

- **Movie Search** with real-time results
- **Movie Detail Pages**
  - Trailers & videos
  - Image galleries
  - Cast & reviews
  - IMDb & official links
- **User-specific Watchlist**
  - Stored per logged-in user
  - Add / remove with animations & toast notifications
- **Recently Viewed Movies**
  - Tracks visited movie pages
  - Visible on login screen
- **Authentication (Demo)**
  - Login & Signup (client-side only)
  - Per-user local storage isolation
- **Dark-Themed Modern UI**
- **Fully Responsive** (desktop, tablet, mobile)
- Optimized with lazy loading & skeleton states

---

## Tech Stack

- **Framework:** SvelteKit
- **Styling:** Tailwind CSS
- **Icons:** lucide-svelte
- **State Management:** Svelte Stores
- **API:** The Movie Database (TMDB)
- **Notifications:** Toastify.js
- **Persistence:** localStorage (demo purpose)

---

## Project Structure

```txt
src/
├─ lib/
│  ├─ api/               # TMDB API handlers
│  ├─ components/        # Reusable UI components
│  ├─ stores/            # Auth, watchlist, recent-view stores
│  ├─ utils/             # Toasts, helpers
│
├─ routes/
│  ├─ +layout.svelte     # Global layout
│  ├─ +page.svelte       # Home page
│  ├─ login/             # Login page
│  ├─ signup/            # Signup page
│  ├─ movie/[id]/        # Movie details
│  └─ watchlist/         # User watchlist
│
├─ app.css
└─ app.html
```

---

## Getting Started

1. Clone the repository: `git clone https://github.com/Rushikesh1101/sveltekit-movie-app.git`
2. Install dependencies: `npm install --legacy-peer-deps`
3. Start the development server: `npm run dev`
4. Open a browser and navigate to `http://localhost:5173`

---

---

## .env File

VITE_TMDB_API_KEY=your_tmdb_api_key_here

VITE_TMDB_BASE_URL=https://api.themoviedb.org/3

---

---

## Enjoy Exploring Movies!

1. Home Page
   ![Home Page](https://github.com/Rushikesh1101/sveltekit-movie-app/blob/main/static/screenshots/MovieHub-Discover-Movies.png)

2. Movie Details Page
   ![Movie Details](https://github.com/Rushikesh1101/sveltekit-movie-app/blob/main/static/screenshots/MovieHub-Movie-Details.png)

3. Login Page
   ![Login Page](https://github.com/Rushikesh1101/sveltekit-movie-app/blob/main/static/screenshots/MovieHub-Login.png)

4. Signup Page
   ![Signup Page](https://github.com/Rushikesh1101/sveltekit-movie-app/blob/main/static/screenshots/MovieHub-Sign-Up.png)

5. Watchlist
   ![Watchlist](https://github.com/Rushikesh1101/sveltekit-movie-app/blob/main/static/screenshots/MovieHub-Watchlist.png)

---

---

## License

This project is licensed under the MIT License.

Copyright (c) new Date().getFullYear() Rushikesh1101

---

---

## Thanks for checking out MovieHub!

Rushikesh Medhe

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Rushikesh1101)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/rushikesh-m-87869b214/)

---
