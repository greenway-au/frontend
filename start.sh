#!/bin/bash
# Start script for NDIS platforms - runs dashboard frontend and backend server

set -e

echo "🚀 Starting NDIS Platform (Dashboard + Backend)"
echo "------------------------------------------------"

# Function to cleanup background processes on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down services..."
    kill $(jobs -p) 2>/dev/null || true
    exit 0
}

trap cleanup SIGINT SIGTERM

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVICES_DIR="$SCRIPT_DIR/../ndis-services/apps/core"
DASHBOARD_DIR="$SCRIPT_DIR/apps/dashboard"

# Check if directories exist
if [ ! -d "$SERVICES_DIR" ]; then
    echo "❌ Error: Backend service directory not found at $SERVICES_DIR"
    exit 1
fi

if [ ! -d "$DASHBOARD_DIR" ]; then
    echo "❌ Error: Dashboard directory not found at $DASHBOARD_DIR"
    exit 1
fi

# Start backend server
echo "📦 Starting backend server on http://localhost:8080..."
cd "$SERVICES_DIR"
make run &
BACKEND_PID=$!

# Wait for backend to initialize
sleep 2

# Start dashboard frontend
echo "🎨 Starting dashboard on http://localhost:3000..."
cd "$DASHBOARD_DIR"
pnpm dev &
FRONTEND_PID=$!

echo ""
echo "✅ Services started successfully!"
echo "   - Backend:   http://localhost:8080"
echo "   - Dashboard: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for background processes
wait
