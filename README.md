# Learning Management System (LMS) - Microservices Architecture

A full-stack Learning Management System built with Next.js (frontend) and NestJS (backend microservices), demonstrating modern clean architecture principles, microservices communication, and comprehensive testing.

## TL;DR - Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd lms-platform

# Start all services with Docker
docker compose up --build

# Access the application
# Frontend: http://localhost:3000
# API Gateway: http://localhost:8000
# LMS Service: http://localhost:8001
# Similar Courses Service: http://localhost:8002
```

## Architecture Overview

This LMS platform consists of:
- **Frontend**: Next.js 14+ with Server-Side Rendering
- **API Gateway**: Central entry point for all client requests
- **LMS Service**: Core learning functionality (courses, lessons, completions)
- **Similar Courses Service**: Recommendation engine based on tags
- **Shared Package**: One package for prisma module and DTOs
- **PostgreSQL**: Shared database with Prisma ORM

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                      │
│                         Port: 3000                              │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTP/REST
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API GATEWAY (NestJS)                         │
│                         Port: 8000                              │
│  ┌──────────────┐  ┌───────────────┐  ┌──────────────────┐   │
│  │ Auth Routes  │  │ Course Routes │  │  Lesson Routes   │   │
│  └──────────────┘  └───────────────┘  └──────────────────┘   │
└───────────┬────────────────────┬────────────────────────────────┘
            │ TCP/RPC            │ TCP/RPC
            ▼                    ▼
┌───────────────────────┐  ┌────────────────────────────┐
│   LMS SERVICE         │  │ SIMILAR COURSES SERVICE    │
│   (NestJS)            │  │ (NestJS)                   │
│   Port: 8001          │  │ Port: 8002                 │
│                       │  │                            │
│  ┌───────────────┐   │  │  ┌──────────────────────┐ │
│  │ Courses       │   │  │  │ Recommendation       │ │
│  │ Lessons       │   │  │  │ Engine (Tag-based)   │ │
│  │ Auth          │   │  │  └──────────────────────┘ │
│  │ Stats         │   │  │                            │
│  └───────────────┘   │  └────────────────────────────┘
└───────────┬───────────┘            │
            │                        │
            └────────────┬───────────┘
                         ▼
            ┌────────────────────────┐
            │   PostgreSQL 15        │
            │   Port: 5432           │
            │                        │
            │  ┌──────────────────┐ │
            │  │ Users            │ │
            │  │ Courses          │ │
            │  │ Lessons          │ │
            │  │ LessonCompletion │ │
            │  └──────────────────┘ │
            └────────────────────────┘
```

## Features

### Core Features (Must-Have)
- User authentication with JWT
- Course and lesson CRUD operations
- Mark lessons as complete
- Course completion percentage calculation
- User learning statistics
- Similar course recommendations (tag-based)
- Pagination and filtering for courses
- Server-Side Rendering for course listing

### Technical Features
- Microservices architecture with NestJS
- TCP-based inter-service communication
- Clean architecture with SOLID principles
- Comprehensive error handling with global exception filters
- PostgreSQL with Prisma ORM
- Docker containerization
- Health checks for all services
- Comprehensive unit and e2e testing

## Project Structure

```
lms-monorepo/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # Next.js App Router
│   ├── components/          # React components
│   ├── lib/                # Utilities and API clients
│   ├── types/              # TypeScript type definitions
│   └── Dockerfile
├── services/
│   ├── api-gateway/        # HTTP REST API Gateway
│   │   ├── src/
│   │   ├── test/
│   │   └── Dockerfile
│   ├── lms/                # Core LMS microservice
│   │   ├── src/
│   │   ├── test/
│   │   └── Dockerfile
│   ├── similar-courses/    # Recommendation microservice
│   │   ├── src/
│   │   └── Dockerfile
│   └── shared/             # Shared package (DTOs, Prisma)
│       ├── prisma/
│       └── src/
├── docs/                   # Documentation
├── docker-compose.yml      # Orchestration
└── README.md
```

## Prerequisites

- Node.js >= 18
- Docker & Docker Compose
- npm or yarn

## Setup Instructions

### Option 1: Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lms-monorepo
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and set your JWT_SECRET
   ```

3. **Start all services**
   ```bash
   docker-compose up --build
   ```

4. **Access the applications**
   - Frontend: http://localhost:3000
   - API Gateway: http://localhost:8000
   - Swagger API Docs: http://localhost:8000/api

### Option 2: Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up database**
   ```bash
   docker-compose up postgres -d
   cd services/shared
   npx prisma migrate dev
   npx prisma db seed
   ```

3. **Start microservices**
   ```bash
   # Terminal 1 - LMS Service
   cd services/lms
   npm run start:dev

   # Terminal 2 - Similar Courses Service
   cd services/similar-courses
   npm run start:dev

   # Terminal 3 - API Gateway
   cd services/api-gateway
   npm run start:dev

   # Terminal 4 - Frontend
   cd frontend
   npm run dev
   ```

## API Documentation

### Authentication

#### Register
```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

#### Login
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Courses

#### List Courses (with pagination and filtering)
```bash
# Basic listing
curl http://localhost:8000/courses

# With pagination
curl "http://localhost:8000/courses?page=1&limit=10"

# With search
curl "http://localhost:8000/courses?search=javascript"

# With tag filter
curl "http://localhost:8000/courses?tag=web-development"
```

#### Get Course Details
```bash
curl http://localhost:8000/courses/{courseId}
```

#### Create Course (requires auth)
```bash
curl -X POST http://localhost:8000/courses \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Introduction to TypeScript",
    "description": "Learn TypeScript from scratch",
    "tags": ["typescript", "programming"]
  }'
```

#### Get Similar Courses
```bash
curl http://localhost:8000/courses/{courseId}/similar
```

### Lessons

#### Get Lessons for Course
```bash
curl http://localhost:8000/lessons?courseId={courseId}
```

#### Mark Lesson as Complete (requires auth)
```bash
curl -X POST http://localhost:8000/lessons/{lessonId}/complete \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### User Statistics

#### Get User Learning Stats (requires auth)
```bash
curl http://localhost:8000/users/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Design Decisions

### Microservices Architecture
- **Separation of Concerns**: Each service has a single responsibility
- **Scalability**: Services can be scaled independently
- **Technology Flexibility**: Different services can use different tech stacks if needed

### TCP-Based Communication
- **Performance**: Faster than HTTP for inter-service communication
- **Type Safety**: Strong typing with NestJS microservices patterns
- **Reliability**: Built-in retry mechanisms and error handling

### Shared Package
- **Code Reuse**: DTOs and Prisma client shared across services
- **Consistency**: Single source of truth for data models
- **Maintainability**: Changes propagate automatically

### Tag-Based Similarity
- **Simplicity**: Easy to understand and maintain
- **Effectiveness**: Works well for course recommendations
- **Extensibility**: Can be enhanced with ML algorithms later

## Trade-offs and Future Work

### Current Limitations
1. **Single Database**: All services share one database (simpler for assignment)
2. **No Caching**: Redis could improve performance
4. **No File Uploads**: Courses/lessons could have media content

### Future Enhancements
1. **Database per Service**: True microservices pattern
5. **Admin Dashboard**: Content management interface
6. **Analytics**: Detailed learning analytics and reporting

## Deployment Suggestions

### Cloud Platforms
- **Vercel**: Frontend (automatic from Git)
- **Railway/Render**: Backend services
- **AWS ECS/EKS**: Container orchestration
- **Google Cloud Run**: Serverless containers

### Database
- **Supabase**: Managed PostgreSQL
- **AWS RDS**: Production-grade PostgreSQL
- **Neon**: Serverless PostgreSQL


## Author

Built as a technical assessment to demonstrate:
- Full-stack development skills
- Microservices architecture
- Clean code principles
- Modern TypeScript/JavaScript ecosystem
