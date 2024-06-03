FROM kong:2.5

# Switch to root to install packages
USER root

# Update apk repository and install Node.js and npm
RUN apk update && apk add --no-cache nodejs npm

# Install Kong Plugin Development Kit globally using npm
RUN npm install -g kong-pdk

# Prepare directory for custom authentication plugins
RUN mkdir -p /usr/local/kong/js-plugins
COPY ./plugins /usr/local/kong/js-plugins

# Install dependencies for the custom plugins
RUN cd /usr/local/kong/js-plugins && npm install

# Revert to the non-root user for better security
USER kong
