# Learning Management System

Microservices-based LMS platform with Next.js frontend and NestJS backend services.

## Architecture

┌─────────────────┐
│   Frontend      │  Next.js
│   Port 3000     │
└────────┬────────┘
│ HTTP
▼
┌─────────────────┐
│   API Gateway   │  NestJS 
│   Port 8000     │
└────────┬────────┘
│ TCP
┬────┴────┬
▼         ▼
┌────────┐ ┌──────────┐
│  LMS   │ │ Similar  │
│ Service│ │ Courses  │
│TCP:8001│ │ TCP:8002 │
└───┬────┘ └────┬─────┘
└───────┬───┘
▼
┌──────────────┐
│  PostgreSQL  │
│   Port 5432  │
└──────────────┘


## Services

- **API Gateway**: HTTP entry point, routes to microservices
- **LMS Service**: Course and lesson management
- **Similar Courses Service**: Recommendation engine
- **Frontend**: Next.js application

## Quick Start

```bash
# Start all services
docker compose up -d

# Access
Frontend: http://localhost:3000
API Gateway: http://localhost:8000

## Tech Stack

- NestJS 10+
- Next.js 14+
- PostgreSQL 15
- Prisma ORM
- Docker


## Requirements

- Node.js 18+
- Docker & Docker Compose
- npm or yarn


## Development

See individual service READMEs in `/services/*` and `/frontend`

### Error Handling Pattern: Global Exception Filters

All error handling is centralized using NestJS exception filters. No try-catch blocks in controllers.