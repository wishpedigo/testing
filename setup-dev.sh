#!/bin/bash

# Setup local development with subdomains
echo "Setting up local development with subdomains..."

# Add entries to /etc/hosts for local subdomains
echo "Adding subdomain entries to /etc/hosts..."

# Check if entries already exist
if ! grep -q "127.0.0.1 dash.localhost" /etc/hosts; then
    echo "127.0.0.1 dash.localhost" | sudo tee -a /etc/hosts
    echo "Added dash.localhost to /etc/hosts"
else
    echo "dash.localhost already exists in /etc/hosts"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Now you can run:"
echo "  npm run dev:marketing  # http://localhost:5173"
echo "  npm run dev:dash       # http://dash.localhost:5173"
echo ""
echo "For production deployment:"
echo "  Deploy each app separately to Vercel with custom domains:"
echo "  - marketing: yourdomain.com"
echo "  - dash: dash.yourdomain.com"
