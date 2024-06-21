# Use the official Node.js 18 Alpine image as a parent image
FROM node:18-alpine3.14

# Set the working directory in the container
WORKDIR /hotel

# Copy the package.json and yarn.lock files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the Prisma schema files
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of your application code
COPY . .

# Set the environment variable for the port
ENV PORT 5004

# Expose port 5004 to the outside once the container has launched
EXPOSE 5004


# Copy the startup script into the container at /usr/local/bin
COPY startup.sh /usr/local/bin/startup.sh

# Make sure the script is executable
RUN chmod +x /usr/local/bin/startup.sh

# Set the command to run the startup script
CMD ["/usr/local/bin/startup.sh"]
