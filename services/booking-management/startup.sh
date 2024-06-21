#!/bin/sh
# Run database migrations
echo "Running database migrations..."
yarn migrate:dev

# Check if the migration was successful
if [ $? -eq 0 ]; then
    echo "Migrations completed successfully."
    # Start your Node.js application
    echo "Starting Node.js application..."
    yarn dev  # This is equivalent to running 'yarn dev' directly in CMD
else
    echo "Migrations failed. Exiting..."
    exit 1
fi
