#!/bin/bash

# Load environment variables from .netlify.env
if [ -f .netlify.env ]; then
  export $(grep -v '^#' .netlify.env | xargs)
  echo "Loaded environment variables from .netlify.env"
else
  echo "Warning: .netlify.env file not found"
fi

# Start Django server in the background
echo "Starting Django development server..."
python3 manage.py runserver --settings=config.settings.minimal &
DJANGO_PID=$!

# Start Netlify Functions server in the background
echo "Starting Netlify Functions server..."
npx netlify-cli functions:serve &
FUNCTIONS_PID=$!

# Function to kill processes on exit
function cleanup {
  echo "Shutting down servers..."
  kill $DJANGO_PID
  kill $FUNCTIONS_PID
  exit
}

# Trap SIGINT (Ctrl+C) and call cleanup
trap cleanup SIGINT

echo "Development environment running!"
echo "Django server: http://localhost:8000"
echo "Functions server: http://localhost:9999"
echo "Press Ctrl+C to stop all servers"

# Keep script running
wait 