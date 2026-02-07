# 🛡️ Google OAuth Authentication Setup

This guide will help you set up Google OAuth authentication for Cosmic Watch.

## 📋 Prerequisites

- Google Account
- Node.js installed
- Both frontend and backend running

## 🔧 Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. Create OAuth 2.0 Credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Select "Web application"
   - Name it (e.g., "Cosmic Watch")

5. Configure OAuth consent screen:
   - Add authorized JavaScript origins:
     ```
     http://localhost:5173
     http://localhost:5000
     ```
   - Add authorized redirect URIs:
     ```
     http://localhost:5000/auth/google/callback
     ```

6. Copy your **Client ID** and **Client Secret**

## ⚙️ Step 2: Configure Backend Environment

1. Navigate to backend folder:
   ```powershell
   cd backend
   ```

2. Create `.env` file (copy from `.env.example`):
   ```powershell
   cp .env.example .env
   ```

3. Edit `.env` file with your credentials:
   ```env
   GOOGLE_CLIENT_ID=your_actual_client_id_here
   GOOGLE_CLIENT_SECRET=your_actual_client_secret_here
   SESSION_SECRET=create_a_random_string_here
   PORT=5000
   CLIENT_URL=http://localhost:5173
   GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
   ```

   **Generate a secure SESSION_SECRET:**
   ```powershell
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

## 🚀 Step 3: Start the Servers

### Terminal 1 - Backend Server:
```powershell
cd C:\Users\ASUS\OneDrive\Desktop\Cosmic_watch\backend
npm start
```

You should see:
```
🚀 Cosmic Watch Backend running on http://localhost:5000
🔐 Authentication enabled with Google OAuth
🌐 Client URL: http://localhost:5173
```

### Terminal 2 - Frontend Server:
```powershell
cd C:\Users\ASUS\OneDrive\Desktop\Cosmic_watch\frontend
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

## 🎯 Step 4: Test Authentication

1. Open browser and go to `http://localhost:5173`
2. You should see the Login page
3. Click "Continue with Google"
4. Sign in with your Google account
5. After successful authentication, you'll be redirected to the dashboard

## 🔐 How It Works

1. **Login Flow:**
   - User clicks "Continue with Google" on `/login`
   - Frontend redirects to backend `/auth/google`
   - Backend redirects to Google OAuth consent screen
   - User approves permissions
   - Google redirects back to `/auth/google/callback`
   - Backend creates session and redirects to frontend dashboard

2. **Protected Routes:**
   - Dashboard requires authentication
   - Unauthenticated users are redirected to `/login`
   - Session persists for 24 hours

3. **User Profile:**
   - User profile displayed in header with avatar
   - Dropdown shows user info and logout option

## 🛠️ API Endpoints

### Authentication Routes:

- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - OAuth callback handler
- `GET /auth/user` - Get current authenticated user
- `POST /auth/logout` - Logout user
- `GET /health` - Health check endpoint

## 🐛 Troubleshooting

### Issue: "Redirect URI mismatch"
**Solution:** Make sure the redirect URI in Google Console exactly matches:
```
http://localhost:5000/auth/google/callback
```

### Issue: "invalid_client"
**Solution:** Double-check your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`

### Issue: "CORS error"
**Solution:** Ensure backend is running on port 5000 and frontend on 5173

### Issue: Session not persisting
**Solution:** 
- Clear browser cookies
- Make sure `SESSION_SECRET` is set in `.env`
- Check that both servers are running

### Issue: "Cannot read properties of null"
**Solution:** Make sure backend server is running before accessing the app

## 📁 File Structure

```
Cosmic_watch/
├── backend/
│   ├── config/
│   │   └── passport.js          # Passport OAuth configuration
│   ├── routes/
│   │   └── auth.js              # Authentication routes
│   ├── middleware/
│   │   └── auth.js              # Auth middleware
│   ├── .env                     # Environment variables (create this)
│   ├── .env.example             # Environment template
│   ├── server.js                # Express server
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── Auth/
    │   │       ├── Login.jsx           # Login page component
    │   │       ├── ProtectedRoute.jsx  # Route protection wrapper
    │   │       └── UserProfile.jsx     # User profile dropdown
    │   ├── context/
    │   │   └── AuthContext.jsx         # Authentication state management
    │   └── App.jsx                     # Updated with routing
    └── package.json

```

## 🎨 Customization

### Change Session Duration:
Edit `backend/server.js`:
```javascript
cookie: {
  maxAge: 48 * 60 * 60 * 1000, // Change to 48 hours
}
```

### Add More OAuth Providers:
You can add Facebook, GitHub, etc. by installing additional Passport strategies.

### Customize Login Page:
Edit `frontend/src/components/Auth/Login.jsx` to change styling and layout.

## 🔒 Security Notes

- Never commit `.env` file to Git
- Use HTTPS in production
- Set `secure: true` for cookies in production
- Keep dependencies updated
- Use strong `SESSION_SECRET` (32+ characters)

## 📚 Additional Resources

- [Passport.js Documentation](http://www.passportjs.org/)
- [Google OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)
- [Express Session Documentation](https://github.com/expressjs/session)

## ✅ Success Checklist

- [ ] Google OAuth credentials created
- [ ] `.env` file configured with correct credentials
- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 5173
- [ ] Can access login page at `http://localhost:5173/login`
- [ ] Can sign in with Google account
- [ ] Redirected to dashboard after login
- [ ] User profile appears in header
- [ ] Can logout successfully

---

**Need help?** Check the troubleshooting section or verify all environment variables are set correctly.
