# Blogify Frontend - Setup & Configuration Guide

## Overview
The Blogify frontend is a modern React + Vite application that provides blogging functionality with Google Sign-In integration.

## Features
- ✅ User authentication (Email/Password and Google Sign-In)
- ✅ Create, edit, and delete blog posts
- ✅ View all blogs and specific blog details
- ✅ User dashboard with statistics
- ✅ Account management (change password, switch accounts, delete account)
- ✅ Responsive design with dark theme
- ✅ Real-time loading states

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend API running (see backend README)

## Installation

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the frontend directory with the following configuration:

```env
# Backend API URL
VITE_API_URL=http://localhost:8000
```

For production:
```env
VITE_API_URL=https://your-backend-domain.com
```

**Important:** Make sure the `VITE_API_URL` matches your backend server URL.

### 3. Start Development Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Build for Production
```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

## Google Sign-In Configuration

### Frontend Side (Already Configured)
The frontend is already set up to handle Google Sign-In through redirect-based OAuth flow:

1. **Signup Page** - Click "Sign up with Google" button
2. **Login Page** - Click "Continue with Google" button
3. User is redirected to backend's Google OAuth handler
4. Backend handles authentication with Google
5. User is redirected back with JWT token

### Backend Prerequisites
Ensure your backend has:

1. **Google OAuth Credentials**
   - Client ID
   - Client Secret
   - Set up in Google Cloud Console

2. **Environment Variables Set**
   - `GOOGLE_CLIENT_ID` - Your Google OAuth client ID
   - `GOOGLE_CLIENT_SECRET` - Your Google OAuth client secret
   - `BACKEND_URL` - Your backend URL (e.g., `http://localhost:8000`)
   - `FRONTEND_URL` - Your frontend URL (e.g., `http://localhost:5173`)
   - `JWT_SECRET` - Secret key for JWT signing

## Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable React components
│   ├── context/          # React Context for state management
│   ├── pages/            # Page components
│   ├── utils/            # Utility functions and API configuration
│   ├── App.jsx           # Main app component with routing
│   └── main.jsx          # Entry point
├── public/               # Static assets
├── .env                  # Environment variables (local)
├── .env.example          # Environment variables template
├── vite.config.js        # Vite configuration
└── package.json          # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint for code quality
- `npm run preview` - Preview production build locally

## API Integration

The frontend communicates with the backend through these main endpoints:

### Authentication
- `POST /api/signup` - Create new account
- `POST /api/login` - Login with credentials
- `GET /auth/google` - Initiate Google OAuth flow
- `GET /auth/google/callback` - Handle Google OAuth callback

### Blog Posts
- `GET /api/myposts` - Get user's posts
- `POST /api/createpost` - Create new post
- `PUT /api/myposts/:id` - Update post
- `DELETE /api/myposts/:id` - Delete post
- `GET /api/readblogs` - Get all public blogs
- `GET /api/readblogs/:id` - Get specific blog

### User Management
- `POST /api/user/change-password` - Change password
- `POST /api/user/switch-account` - Switch to another account
- `DELETE /api/user` - Delete account

### Interactions
- `POST /api/likes` - Like a post
- `POST /api/subscribe` - Subscribe to blogger
- `DELETE /api/subscribe` - Unsubscribe

## Storage & Authentication

The frontend stores authentication data in `localStorage`:
- `blogifyToken` - JWT token for API requests
- `isLoggedIn` - Boolean flag for login state
- `blogifyUsername` - Current user's username

**Note:** Tokens are sent with all authenticated requests via the `Authorization` header.

## Troubleshooting

### Environment Variables Not Loading
- Ensure `.env` file is in the `frontend/` directory (not root)
- Restart the dev server after changing `.env`
- Use `VITE_` prefix for variables (Vite requirement)

### Google Sign-In Not Working
1. Verify backend is running
2. Check `VITE_API_URL` is correct in `.env`
3. Ensure backend has `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
4. Verify redirect URLs in Google Cloud Console match your deployment URLs

### API Errors
- Check browser console for error messages
- Verify backend server is running
- Check CORS configuration on backend
- Ensure JWT tokens haven't expired

### Build Issues
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf .vite`
- Try: `npm run build -- --force`

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
1. Connect your Git repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

### Manual Deployment
```bash
npm run build
# Deploy the 'dist' folder to your hosting service
```

## Performance Tips

1. **Use Production Build** - Always build before deploying
2. **Enable GZIP** - Configure on your web server
3. **CDN** - Use a CDN for static assets
4. **Lazy Loading** - Components are already optimized

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## Support

For issues or questions, please contact the development team or create an issue in the repository.

---

**Last Updated:** 2026-06-10
