# Subdomain Setup Guide

This project is configured to use subdomains instead of different ports for a cleaner development and production experience.

## 🏗️ Architecture

- **Marketing App**: `localhost:5173` (dev) → `yourdomain.com` (prod)
- **Dashboard App**: `dash.localhost:5173` (dev) → `dash.yourdomain.com` (prod)

## 🚀 Quick Start

### 1. Setup Local Development

```bash
# Install dependencies
npm install

# Setup local subdomains (adds entries to /etc/hosts)
npm run setup:dev

# Start all apps at once
npm run dev:all
```

### 2. Individual App Development

```bash
# Marketing app (main site)
npm run dev:marketing
# → http://localhost:5173

# Dashboard app
npm run dev:dash  
# → http://dash.localhost:5173
```

## 🌐 Production Deployment

### Option 1: Separate Vercel Projects (Recommended)

Deploy each app as a separate Vercel project with custom domains:

```bash
# Deploy marketing app
npm run deploy:marketing
# Configure domain: yourdomain.com

# Deploy dashboard app  
npm run deploy:dash
# Configure domain: dash.yourdomain.com
```

### Option 2: Single Vercel Project

If you prefer a single deployment, you can use the main `vercel.json` which routes everything to the marketing app, then set up custom domains in Vercel dashboard.

## 🔧 Configuration Details

### Vite Configuration

Each app's `vite.config.ts` is configured with:
- `envDir: resolve(__dirname, '../..')` - Points to project root for `.env` file
- `host: 'dash.localhost'` (for dash app) - Sets up local subdomain
- `port: 5173` - Same port for all apps (different subdomains)

### Environment Variables

All apps share the same `.env` file in the project root:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
# ... other Firebase config
```

### Vercel Configuration

Each app has its own `vercel.json` for independent deployment:
- `apps/marketing/vercel.json`
- `apps/dash/vercel.json`

## 🛠️ Development Workflow

1. **Setup once**: Run `npm run setup:dev` to configure local subdomains
2. **Daily development**: Run `npm run dev:all` to start all apps
3. **Individual testing**: Use specific `npm run dev:app` commands
4. **Production**: Deploy each app separately with custom domains

## 🔍 Troubleshooting

### Local Subdomains Not Working

If `dash.localhost` doesn't work:

1. Check `/etc/hosts` has the entry:
   ```
   127.0.0.1 dash.localhost
   ```

2. Run the setup script again:
   ```bash
   npm run setup:dev
   ```

3. Clear browser cache and restart dev servers

### Port Conflicts

All apps use port 5173 but with different hosts:
- `localhost:5173` → Marketing
- `dash.localhost:5173` → Dashboard

If you get port conflicts, make sure only one app is running per subdomain.

### Environment Variables Not Loading

Make sure the `.env` file is in the project root and contains all required `VITE_` prefixed variables.

## 📁 File Structure

```
/
├── .env                          # Shared environment variables
├── vercel.json                   # Main project config (marketing app)
├── setup-dev.sh                  # Local subdomain setup script
├── apps/
│   ├── marketing/
│   │   ├── vercel.json          # Marketing app deployment config
│   │   └── vite.config.ts       # Vite config with localhost host
│   └── dash/
│       ├── vercel.json          # Dashboard app deployment config  
│       └── vite.config.ts       # Vite config with dash.localhost host
└── packages/
    └── firebase/                 # Shared Firebase configuration
```

## 🎯 Benefits

✅ **Clean URLs**: No more `/login` or `/game` paths  
✅ **Independent Deployments**: Each app can be deployed separately  
✅ **Better Caching**: Each subdomain can have its own cache strategy  
✅ **Scalability**: Easy to scale individual apps  
✅ **Domain Management**: Each app can have its own domain/subdomain  
✅ **Development Experience**: Cleaner local development with subdomains
