
# Hotel Booking Microservices Project

Welcome to the Hotel Booking Microservices Project! This project is built using Docker and Docker Compose to orchestrate multiple microservices including Postgres, PgAdmin, API Gateway, and more.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Clone the Repository](#clone-the-repository)
  - [Environment Setup](#environment-setup)
  - [Building and Running the Services](#building-and-running-the-services)
- [Services Overview](#services-overview)
- [Managing the Application](#managing-the-application)
- [Contributing](#contributing)
- [License](#license)

## Overview

This project consists of several microservices for managing a hotel booking system. Each service is containerized and orchestrated using Docker Compose. The services include:
- Authentication
- User Management
- Hotel Management
- Room Management
- Booking Management
- Email Service
- API Gateway
- Database Services (Postgres)
- Message Brokers (RabbitMQ)
- Caching (Redis)
- Monitoring and Administration (PgAdmin, Kong, Konga)

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

## Getting Started

### Clone the Repository

First, clone the repository to your local machine using Git:

\`\`\`bash
git clone https://github.com/your-username/hotel-booking-microservices.git
cd hotel-booking-microservices
\`\`\`

### Environment Setup

Create a \`.env\` file in the root directory based on the provided \`example.env\`. You can do this by copying \`example.env\` to \`.env\` and filling in your actual configuration values.

\`\`\`bash
cp example.env .env
\`\`\`

**Example \`example.env\` file:**

\`\`\`dotenv
# Database Configuration for PostgreSQL
POSTGRES_USER= "your_postgres_user"
POSTGRES_PASSWORD= "your_postgres_password"
POSTGRES_DB= "your_database_name"

# PGAdmin Configuration
PGADMIN_DEFAULT_EMAIL= "your_email@example.com"
PGADMIN_DEFAULT_PASSWORD= "your_pgadmin_password"

# Service Ports and Database URLs
PORT_AUTH=5001
DATABASE_URL_AUTH="postgresql://your_postgres_user:your_postgres_password@your_postgres_host:5432/auth?schema=public"

PORT_USER=5002
DATABASE_URL_USER="postgresql://your_postgres_user:your_postgres_password@your_postgres_host:5432/user?schema=public"

PORT_HOTEL=5004
DATABASE_URL_HOTEL="postgresql://your_postgres_user:your_postgres_password@your_postgres_host:5432/hotel?schema=public"

PORT_ROOM=5005
DATABASE_URL_ROOM="postgresql://your_postgres_user:your_postgres_password@your_postgres_host:5432/room?schema=public"

PORT_BOOKING=5006
DATABASE_URL_BOOKING="postgresql://your_postgres_user:your_postgres_password@your_postgres_host:5432/booking-management?schema=public"

PORT_EMAIL=5003
DATABASE_URL_EMAIL="postgresql://your_postgres_user:your_postgres_password@your_postgres_host:5432/email?schema=public"

# Kong Configuration
KONG_DATABASE="postgres"
KONG_PG_HOST= "your_postgres_host"
KONG_PG_USER= "your_postgres_user"
KONG_PG_PASSWORD= "your_postgres_password"
KONG_PG_DATABASE= "your_kong_database"

# Konga Configuration
KONGA_PG_PASSWORD= "your_konga_postgres_password"
KONGA_DB_DATABASE= "your_konga_database"
KONGA_DB_USER= "your_konga_user"

# Keycloak Configuration
KEY_DB_USER= "your_keycloak_db_user"
KEY_DB_PASSWORD= "your_keycloak_db_password"
KEYCLOAK_ADMIN_USER= "your_keycloak_admin_user"
KEYCLOAK_ADMIN_PASSWORD= "your_keycloak_admin_password"
\`\`\`

### Building and Running the Services

Build and start the services defined in the \`docker-compose.yml\` file with the following command:

\`\`\`bash
docker-compose up --build
\`\`\`

This command will:
- Build the Docker images (if they are not already built).
- Start all the containers defined in the \`docker-compose.yml\` file.

To run the services in detached mode (in the background), use:

\`\`\`bash
docker-compose up --build -d
\`\`\`

## Services Overview

Here is a brief overview of the main services included in this project:

- **Postgres**: Database service for all microservices.
- **PgAdmin**: Web-based PostgreSQL database administration tool.
- **Auth Service**: Manages authentication and authorization.
- **User Service**: Handles user data and operations.
- **Hotel Service**: Manages hotel information and operations.
- **Room Service**: Manages room details and availability.
- **Booking Management Service**: Handles bookings and reservations.
- **Email Service**: Manages email communications.
- **API Gateway**: Routes requests to the appropriate services.
- **Kong**: API gateway and microservices management layer.
- **Konga**: Dashboard for managing Kong.
- **RabbitMQ**: Message broker for inter-service communication.
- **Redis**: In-memory data store for caching.

## Managing the Application

### Stopping Services

To stop the running services, execute:

\`\`\`bash
docker-compose down
\`\`\`

This command stops and removes all the containers defined in \`docker-compose.yml\`.

### Viewing Logs

To view the logs for all services, use:

\`\`\`bash
docker-compose logs -f
\`\`\`

To view the logs for a specific service (e.g., \`auth_service\`), use:

\`\`\`bash
docker-compose logs -f auth_service
\`\`\`

### Accessing PgAdmin

PgAdmin can be accessed via your browser at \`http://localhost:5050\` with the credentials specified in your \`.env\` file (\`PGADMIN_DEFAULT_EMAIL\` and \`PGADMIN_DEFAULT_PASSWORD\`).

### Accessing Konga

Konga can be accessed via your browser at \`http://localhost:1337\` with the credentials specified during setup.

## Contributing

We welcome contributions! To contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch (\`git checkout -b feature-branch\`).
3. Make your changes.
4. Commit your changes (\`git commit -m 'Add new feature'\`).
5. Push to the branch (\`git push origin feature-branch\`).
6. Open a Pull Request.

Please ensure your code follows our coding standards and include appropriate tests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
