# Bookmark Manager

A backend Bookmark Manager API built with **Bun, TypeScript, GraphQL, Prisma, and PostgreSQL**.

The project demonstrates a layered backend architecture with input validation, service-level business logic, repository-based database access, automated testing, Docker-based PostgreSQL, Prisma migrations, and GitHub Actions CI.

---

## 🚀 Tech Stack

- **Bun** — JavaScript/TypeScript runtime and package manager
- **TypeScript** — Type-safe application development
- **GraphQL** — API query and mutation layer
- **GraphQL Yoga** — GraphQL HTTP server
- **Prisma 7** — ORM and database access
- **PostgreSQL 17** — Relational database
- **Docker** — Local PostgreSQL environment
- **Bun Test** — Automated testing
- **ESLint** — Code quality and linting
- **GitHub Actions** — Continuous integration

---

## ✨ Features

### Folder Management

- Create folders
- Retrieve a folder by ID
- List folders
- Delete folders
- Automatically delete associated bookmarks when a folder is deleted

### Bookmark Management

- Create bookmarks
- Retrieve bookmarks by ID
- List bookmarks by folder
- Update bookmarks
- Delete bookmarks
- Assign bookmarks to folders
- Add tags to bookmarks

### Input Validation

- Folder names cannot be empty
- Bookmark titles cannot be empty
- Bookmark URLs must be valid
- Only HTTP and HTTPS URLs are accepted
- Folder IDs cannot be empty
- Bookmark update fields are validated
- Input values are normalized where appropriate

### Error Handling

- Application-level errors
- Domain-specific errors
- Folder-not-found errors
- Bookmark-not-found errors
- Validation errors
- Business rules handled in the service layer
- Database operations isolated in repositories

### Development & Quality

- TypeScript strict type checking
- ESLint
- Automated tests
- Prisma migrations
- Dockerized PostgreSQL
- GitHub Actions CI
- Layered backend architecture
- Incremental Git development history

---

# 🏗️ Architecture

The application follows a layered backend architecture:

```text
                    ┌─────────────────────┐
                    │    GraphQL API      │
                    │                     │
                    │  Queries/Mutations  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     Validation      │
                    │                     │
                    │ Input validation    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Services       │
                    │                     │
                    │ Business logic      │
                    │ Domain errors       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Repositories     │
                    │                     │
                    │ Database operations │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │       Prisma        │
                    │                     │
                    │ ORM / DB Client     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    PostgreSQL       │
                    │                     │
                    │ Persistent storage  │
                    └─────────────────────┘
```

### Layer Responsibilities

#### GraphQL Layer

Responsible for:

- GraphQL schema
- Queries
- Mutations
- GraphQL arguments
- API responses

#### Validation Layer

Responsible for:

- Input validation
- URL validation
- Required-field validation
- Input normalization
- Rejecting invalid values

#### Service Layer

Responsible for:

- Business rules
- Resource existence checks
- Domain errors
- Coordinating repository operations

#### Repository Layer

Responsible for:

- Database queries
- Prisma operations
- Database-specific logic

#### Prisma

Responsible for:

- ORM functionality
- Type-safe database queries
- Database migrations
- Generated database client

#### PostgreSQL

Responsible for:

- Persistent data storage
- Foreign-key relationships
- Indexes
- Cascading deletes

---

# 📁 Project Structure

```text
bookmark_manager/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── prisma/
│   ├── migrations/
│   │   └── 20260824054444_init/
│   │       └── migration.sql
│   │
│   └── schema.prisma
│
├── src/
│   │
│   ├── db/
│   │   └── prisma.ts
│   │
│   ├── errors/
│   │   ├── app-error.ts
│   │   └── domain-error.ts
│   │
│   ├── graphql/
│   │   ├── schema.ts
│   │   ├── schema.test.ts
│   │   └── server.ts
│   │
│   ├── repositories/
│   │   ├── bookmark.repository.ts
│   │   ├── bookmark.repository.test.ts
│   │   ├── folder.repository.ts
│   │   └── folder.repository.test.ts
│   │
│   ├── services/
│   │   ├── bookmark.service.ts
│   │   ├── folder.service.ts
│   │   └── service.test.ts
│   │
│   └── validation/
│       ├── bookmark.validation.ts
│       ├── folder.validation.ts
│       └── validation.test.ts
│
├── .env.example
├── .gitignore
├── docker-compose.yml
├── index.ts
├── package.json
├── prisma.config.ts
├── tsconfig.json
└── README.md
```

---

# 🗄️ Database Schema

The application uses two main entities:

```text
┌───────────────┐
│    Folder     │
├───────────────┤
│ id            │
│ name          │
│ createdAt     │
└───────┬───────┘
        │
        │ 1:N
        │
        ▼
┌───────────────┐
│   Bookmark    │
├───────────────┤
│ id            │
│ title         │
│ url           │
│ tags[]        │
│ folderId      │
│ createdAt     │
└───────────────┘
```

A folder can contain multiple bookmarks.

The relationship is enforced by PostgreSQL through a foreign key:

```text
Bookmark.folderId → Folder.id
```

Deleting a folder automatically deletes its associated bookmarks using:

```text
ON DELETE CASCADE
```

The database also contains indexes for commonly queried fields:

- `Folder.createdAt`
- `Bookmark.createdAt`
- `Bookmark.folderId + createdAt`

---

# 🛠️ Requirements

Before running the project, make sure you have:

- Bun
- Docker Desktop
- Git

Verify Bun:

```bash
bun --version
```

Verify Docker:

```bash
docker --version
```

---

# ⚙️ Installation

## 1. Clone the repository

```bash
git clone https://github.com/Bhargav-1729/Bookmark_manager.git
```

Navigate into the project:

```bash
cd Bookmark_manager
```

## 2. Install dependencies

```bash
bun install
```

---

# 🐘 PostgreSQL Setup

Start PostgreSQL:

```bash
docker compose up -d
```

Check the running container:

```bash
docker compose ps
```

Check PostgreSQL health:

```bash
docker exec bookmark-manager-db pg_isready -U postgres
```

---

# 🔐 Environment Variables

Create a `.env` file in the project root.

Example:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/bookmark_manager_dev?schema=public"
```

> The host port may be `5432` or `5433` depending on your local PostgreSQL setup. Use the port shown by `docker compose ps`.

---

# 🗃️ Prisma Setup

Generate Prisma Client:

```bash
bunx prisma generate
```

Check migration status:

```bash
bunx prisma migrate status
```

Apply existing migrations:

```bash
bunx prisma migrate deploy
```

---

# ▶️ Running the Application

Start the development server:

```bash
bun run dev
```

The GraphQL server runs at:

```text
http://localhost:4000/graphql
```

You can also start the application directly:

```bash
bun run index.ts
```

---

# 🔌 GraphQL API

The GraphQL endpoint is:

```text
http://localhost:4000/graphql
```

## List Folders

```graphql
query {
  folders {
    id
    name
    createdAt
  }
}
```

## Get a Folder With Its Bookmarks

```graphql
query {
  folder(id: "folder-id") {
    id
    name
    createdAt
    bookmarks {
      id
      title
      url
      tags
      folderId
      createdAt
    }
  }
}
```

## Create Folder

```graphql
mutation {
  createFolder(name: "Development") {
    id
    name
    createdAt
  }
}
```

## Delete Folder

```graphql
mutation {
  deleteFolder(id: "folder-id")
}
```

Deleting a folder also deletes its associated bookmarks.

## List Bookmarks in a Folder

```graphql
query {
  bookmarks(folderId: "folder-id") {
    id
    title
    url
    tags
    folderId
    createdAt
  }
}
```

## Get a Bookmark

```graphql
query {
  bookmark(id: "bookmark-id") {
    id
    title
    url
    tags
    folderId
    createdAt
  }
}
```

## Create Bookmark

```graphql
mutation {
  createBookmark(
    title: "Bun Documentation"
    url: "https://bun.sh/docs"
    tags: ["bun", "typescript"]
    folderId: "folder-id"
  ) {
    id
    title
    url
    tags
    folderId
    createdAt
  }
}
```

## Update Bookmark

```graphql
mutation {
  updateBookmark(
    id: "bookmark-id"
    title: "Bun Official Documentation"
    tags: ["bun", "docs"]
  ) {
    id
    title
    url
    tags
    folderId
  }
}
```

Supported update fields:

- `title`
- `url`
- `tags`
- `folderId`

## Delete Bookmark

```graphql
mutation {
  deleteBookmark(id: "bookmark-id")
}
```

---

# 🧪 Testing

Run the complete test suite:

```bash
bun test
```

Run GraphQL tests:

```bash
bun test src/graphql/schema.test.ts
```

Run repository tests:

```bash
bun test src/repositories/folder.repository.test.ts
bun test src/repositories/bookmark.repository.test.ts
```

Run validation tests:

```bash
bun test src/validation/validation.test.ts
```

Run service tests:

```bash
bun test src/services/service.test.ts
```

---

# 🔍 Type Checking

```bash
bun run typecheck
```

---

# 🧹 Linting

```bash
bun run lint
```

---

# ✅ Recommended Verification

Before committing changes:

```bash
bun test
bun run typecheck
bun run lint
```

All three checks should complete successfully.

---

# 🔄 Database Development Workflow

Create a development migration:

```bash
bunx prisma migrate dev --name migration_name
```

Generate Prisma Client:

```bash
bunx prisma generate
```

Check migrations:

```bash
bunx prisma migrate status
```

Apply migrations:

```bash
bunx prisma migrate deploy
```

---

# 🐳 Docker Commands

Start PostgreSQL:

```bash
docker compose up -d
```

Stop PostgreSQL:

```bash
docker compose down
```

Stop PostgreSQL and remove the database volume:

```bash
docker compose down -v
```

Check containers:

```bash
docker compose ps
```

Check PostgreSQL:

```bash
docker exec bookmark-manager-db pg_isready -U postgres
```

Open PostgreSQL:

```bash
docker exec -it bookmark-manager-db psql -U postgres -d bookmark_manager_dev
```

---

# 🧪 Manual API Testing

Example PowerShell request:

```powershell
$body = @'
{
  "query": "{ folders { id name createdAt } }"
}
'@

$response = Invoke-RestMethod `
  -Uri http://localhost:4000/graphql `
  -Method Post `
  -ContentType "application/json" `
  -Body $body

$response | ConvertTo-Json -Depth 10
```

Example bookmark mutation using GraphQL variables:

```powershell
$body = @'
{
  "query": "mutation CreateBookmark($title: String!, $url: String!, $tags: [String!], $folderId: ID!) { createBookmark(title: $title, url: $url, tags: $tags, folderId: $folderId) { id title url tags folderId createdAt } }",
  "variables": {
    "title": "Bun Documentation",
    "url": "https://bun.sh/docs",
    "tags": ["bun", "typescript"],
    "folderId": "folder-id"
  }
}
'@

$response = Invoke-RestMethod `
  -Uri http://localhost:4000/graphql `
  -Method Post `
  -ContentType "application/json" `
  -Body $body

$response | ConvertTo-Json -Depth 10
```

---

# 🛡️ Validation Rules

## Folder

- Name is required
- Name cannot be empty
- Whitespace-only names are rejected
- Leading/trailing whitespace is trimmed

## Bookmark Title

- Title is required
- Title cannot be empty
- Whitespace-only titles are rejected
- Leading/trailing whitespace is trimmed

## Bookmark URL

- URL is required
- URL must be valid
- HTTP is accepted
- HTTPS is accepted
- Unsupported protocols are rejected

Accepted:

```text
http://example.com
https://example.com
```

Rejected:

```text
not-a-url
javascript:alert(1)
ftp://example.com
```

## Folder ID

- Folder ID is required when creating a bookmark
- Empty folder IDs are rejected
- Referenced folders must exist

---

# ⚠️ Error Handling

The application uses domain-specific errors instead of exposing raw database errors.

Examples:

```text
Folder not found: <folder-id>
```

```text
Bookmark not found: <bookmark-id>
```

```text
Folder name cannot be empty.
```

```text
Bookmark title cannot be empty.
```

```text
Bookmark URL must be a valid URL.
```

```text
Bookmark URL must use HTTP or HTTPS.
```

The service layer converts missing database records into meaningful application-level errors.

---

# 🧱 Testing Strategy

The project uses multiple levels of automated testing:

```text
                         Test Suite
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
          ▼                  ▼                  ▼
     Repository           Service           GraphQL
       Tests               Tests              Tests
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
                             ▼
                     Validation Tests
```

Tests cover:

### Repository Tests

- Folder creation
- Folder retrieval
- Folder listing
- Folder deletion
- Bookmark creation
- Bookmark retrieval
- Bookmark listing
- Bookmark updates
- Bookmark deletion
- Cascade deletion

### Service Tests

- Missing folder handling
- Missing bookmark handling
- Bookmark creation with missing folder
- Bookmark updates with missing folder
- Missing resource deletion
- Missing resource retrieval

### GraphQL Tests

- Folder creation
- Folder retrieval
- Folder listing
- Bookmark creation
- Bookmark retrieval
- Bookmark listing
- Bookmark updates
- Bookmark deletion

### Validation Tests

- Empty folder names
- Whitespace-only folder names
- Empty bookmark titles
- Invalid URLs
- Unsupported URL protocols
- Empty folder IDs
- Input trimming

---

# 🔄 Continuous Integration

The project uses GitHub Actions for continuous integration.

Workflow:

```text
Checkout repository
        ↓
Install Bun
        ↓
Install dependencies
        ↓
Start PostgreSQL
        ↓
Generate Prisma Client
        ↓
Apply migrations
        ↓
TypeScript check
        ↓
ESLint
        ↓
Run tests
```

Workflow file:

```text
.github/workflows/ci.yml
```

---

# 📊 Current Project Status

```text
Project Setup              ✅
TypeScript                 ✅
Bun                        ✅
Docker                     ✅
PostgreSQL                 ✅
Prisma                     ✅
Database Migrations        ✅
Repository Layer           ✅
Service Layer              ✅
GraphQL API                ✅
Input Validation           ✅
Error Handling             ✅
Automated Tests            ✅
ESLint                     ✅
Type Checking              ✅
GitHub Actions CI          ✅
Documentation              ✅
```

---

# 📈 Future Improvements

Potential future enhancements:

- Pagination
- Bookmark search
- Filtering by tags
- Sorting options
- GraphQL input objects
- Authentication
- Authorization
- User accounts
- Per-user bookmark collections
- Rate limiting
- Structured logging
- Health check endpoint
- Production Docker image
- Deployment configuration
- Redis caching
- Monitoring
- Frontend application
- End-to-end testing
- Performance testing

---

# 🎯 Project Goals

This project demonstrates practical backend engineering skills including:

- TypeScript development
- Bun runtime
- GraphQL API design
- GraphQL Yoga
- PostgreSQL
- Prisma ORM
- Database schema design
- Database migrations
- Docker
- Repository pattern
- Service layer architecture
- Input validation
- Domain error handling
- Automated testing
- Static type checking
- ESLint
- CI/CD
- Git-based development workflow

---

# 🔨 Development Approach

The project was developed incrementally rather than as one large implementation.

Major milestones:

```text
1. Project setup
        ↓
2. Bun + TypeScript configuration
        ↓
3. PostgreSQL + Docker
        ↓
4. Prisma configuration
        ↓
5. Database schema
        ↓
6. Prisma migrations
        ↓
7. Repository layer
        ↓
8. Repository tests
        ↓
9. GraphQL API
        ↓
10. GraphQL tests
        ↓
11. HTTP API verification
        ↓
12. Input validation
        ↓
13. Validation tests
        ↓
14. Service layer
        ↓
15. Domain error handling
        ↓
16. CI and documentation
```

Each major stage is maintained through incremental Git commits.

---

# 📌 API Design Principles

### Separation of Concerns

GraphQL, validation, business logic, and database access are separated into different layers.

### Repository Pattern

Database operations are isolated from API and business logic.

### Service Layer

Business rules are handled independently from GraphQL resolvers.

### Type Safety

TypeScript and Prisma provide compile-time safety across the application.

### Database Integrity

PostgreSQL foreign keys and cascading deletes enforce relational consistency.

### Automated Verification

Tests, TypeScript checks, and ESLint are run locally and through CI.

---

# 🔒 Security Considerations

The current project focuses on core backend functionality.

Production security features that can be added later include:

- Authentication
- Authorization
- Rate limiting
- Request logging
- Security headers
- CORS configuration
- Input size limits
- Abuse prevention
- Secrets management

The application validates bookmark URLs and rejects unsupported protocols such as `javascript:`.

---

# 📦 Useful Commands

Install dependencies:

```bash
bun install
```

Start development server:

```bash
bun run dev
```

Run application:

```bash
bun run index.ts
```

Run all tests:

```bash
bun test
```

Run TypeScript:

```bash
bun run typecheck
```

Run ESLint:

```bash
bun run lint
```

Generate Prisma Client:

```bash
bunx prisma generate
```

Check Prisma migrations:

```bash
bunx prisma migrate status
```

Apply migrations:

```bash
bunx prisma migrate deploy
```

Create a development migration:

```bash
bunx prisma migrate dev --name migration_name
```

Start PostgreSQL:

```bash
docker compose up -d
```

Stop PostgreSQL:

```bash
docker compose down
```

---

# 👨‍💻 Author

**Bhargav Reddy**

GitHub:

https://github.com/Bhargav-1729

---

# 📄 License

This project is intended for educational and portfolio purposes.
