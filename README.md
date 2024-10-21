# Real-Time Sports Event Crawler

This project is a real-time sports event crawler that fetches live data from a simulated sports API. The crawler collects event data, such as scores, teams, and competition details, and stores this information in a PostgreSQL database. It exposes an API endpoint to retrieve the current state of the events, including odds and status updates.

## Features

- Fetches live sports event data from a simulated API.
- Processes event data including scores, teams, and odds.
- Stores event information in a PostgreSQL database using Prisma ORM.
- Exposes a `/state` endpoint to get the current formatted state of events.
- Handles removed events by marking them as such in the database.

## Technologies Used

- **Node.js**: JavaScript runtime environment.
- **TypeScript**: Superset of JavaScript for static typing.
- **Fastify**: Web framework for building the API.
- **Prisma**: ORM (Object-Relational Mapping) tool for PostgreSQL.
- **PostgreSQL**: Relational database for storing event data.
- **Docker**: Containerization platform to run the application and database.

## Prerequisites

Make sure you have the following installed:

- **Node.js** (v20 or higher)
- **Docker** (for running PostgreSQL and the API simulation)
- **npm** (Node Package Manager)

## Project Setup

### 1. Clone the repository

```bash
git clone https://github.com/Michal-Rozga/Crawler.git
cd Crawler
```
### 2. Install dependencies
```
npm install
```
### 3. Set up environment variables
Move the exisitng .env.sample file and adjust accordingly.

### 4. Run Docker containers
```
docker-compose up
```

### 5. Apply database migration
```
docker compose exec app npx prisma migrate dev --schema=./src/prisma/schema.prisma
```

Please make sure you run the command from step 5, otherwise the application will not work properly.

## Additional information

### Prisma Studio
To interact with the database using a visual tool, you can launch Prisma Studio:
```
npx prisma studio
```