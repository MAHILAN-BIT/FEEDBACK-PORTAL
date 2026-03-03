# Industry Survey Portal

A full-stack modern feedback system for engineering colleges and industry partners.

## Features
- Glassmorphism UI
- Node.js/Express Backend
- Persistent JSON Storage
- Multi-user Authentication

## 🚀 Deployment (Using Render)

1. **Connect to GitHub**: Log in to [Render.com](https://render.com) and click **"New +"** -> **"Web Service"**.
2. **Select Repository**: Search for and select `FEEDBACK-PORTAL`.
3. **Configure Settings**:
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. **Environment Variables**: Add `PORT` = `3000` (optional, Render handles this).
5. **JSON Storage Warning**: Since this project uses JSON files for a database, data will reset on every deployment or server restart. For permanent storage, consider migrating to a real database like MongoDB.

## Local Setup
1. Clone the repo: `git clone https://github.com/MAHILAN-BIT/FEEDBACK-PORTAL.git`
2. Install dependencies: `npm install`
3. Start the server: `node server.js`
4. Visit: `http://localhost:3000`
