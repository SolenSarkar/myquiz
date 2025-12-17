# Quiz Client

A simple React (Vite) landing page for a quiz app.

Run in PowerShell:

1. npm install
2. npm run dev

This project includes a landing page and a placeholder quiz page implemented with React Router.

Backend integration
 - The frontend can optionally send quiz scores and fetch quizzes from a backend API.
 - Configure the backend base URL in a `.env` file using `VITE_API_BASE` (see `.env.example`).
 - Expected endpoints used by the client:
	 - `POST /scores` — accepts JSON payload: `{ email, quizTitle, score, total, date }` to persist a score.
	 - `GET /quizzes` — returns a list of quizzes (used by `src/api.js`).

Behavior
 - If `VITE_API_BASE` is not set or a request fails, the client falls back to saving scores in `localStorage` so existing behavior remains.

Next steps
 - Ensure your backend enables CORS for the frontend origin and supports the above endpoints.
 - I can help scaffold a minimal Express/Firebase Function backend that implements these endpoints if you want.
