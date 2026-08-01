# HireNova X - Project Structure & File Organization

## 📦 Complete Directory Structure

```
hirenova-x/
│
├── 📄 Backend Files
├── index.html                 # Frontend React application (Single Page App)
├── server.js                  # Express.js backend server
├── package.json              # Node.js dependencies & scripts
├── .env.example              # Environment variables template
├── .env                      # Environment variables (create from example)
│
├── 📋 Database
├── hirenova.db              # SQLite database (auto-created)
├── database-schema.sql      # Database schema & seed data
│
├── 🐳 Docker
├── Dockerfile               # Docker container configuration
├── docker-compose.yml       # Docker Compose for local development
│
├── 📚 Documentation
├── README.md               # Complete project documentation
├── QUICKSTART.md          # Quick start guide (5 minutes)
├── PROJECT_STRUCTURE.md   # This file - project organization
│
├── 🧪 Testing & Integration
├── postman-collection.json # Postman API test collection
│
├── 📁 Data Directory (created at runtime)
└── data/
    └── hirenova.db        # SQLite database file
```

---

## 🎯 File Purposes & Relationships

### Core Application Files

#### **index.html** (Frontend)
- **Purpose**: React-based single-page application (SPA)
- **Size**: ~60KB
- **Tech**: React 18, HTML5, CSS3, JavaScript ES6+
- **Dependencies**: None (uses CDN for React)
- **Contains**:
  - User interface components
  - Navigation sidebar
  - Dashboard, Learning, Jobs, Insights, Applications pages
  - API client logic
  - Form handling and validation

#### **server.js** (Backend)
- **Purpose**: Express.js REST API server
- **Size**: ~10KB
- **Tech**: Node.js, Express, SQLite3, JWT
- **Dependencies**: All in package.json
- **Handles**:
  - Authentication (register/login with JWT)
  - RESTful endpoints for all features
  - Database operations
  - CORS and security
  - Error handling
  - Analytics endpoints

#### **package.json**
- **Purpose**: Node.js project configuration
- **Contains**:
  - Project metadata
  - All npm dependencies
  - NPM scripts (start, dev, test)
  - Version specifications
  - Engine requirements (Node 14+)

#### **.env** (Environment Configuration)
- **Purpose**: Store sensitive credentials and configuration
- **Created from**: .env.example
- **Contains**:
  - Port number
  - Database path
  - JWT secret key
  - CORS origins
  - API keys
  - Email credentials (optional)
- **Security**: Never commit to Git (added to .gitignore)

---

### Database Files

#### **database-schema.sql**
- **Purpose**: SQLite database structure definition
- **Contains**:
  - 11 table definitions
  - Indexes for performance
  - Sample data insertion
  - Relationships and constraints
- **Usage**: 
  ```bash
  sqlite3 hirenova.db < database-schema.sql
  ```
- **Tables**:
  - users, courses, userCourses
  - jobs, applications
  - skills, userSkills
  - assessments
  - learningPaths, pathCourses
  - notifications, salaryData, activityLogs

#### **hirenova.db** (Runtime Created)
- **Purpose**: SQLite database file
- **Created**: Automatically on first server start
- **Location**: Project root directory
- **Size**: Grows with data (~100KB initially)
- **Backup**: Regular backups recommended for production

---

### Docker & Deployment

#### **Dockerfile**
- **Purpose**: Container image definition
- **Multi-stage**: Builder stage + final stage
- **Features**:
  - Alpine Linux for small size
  - Non-root user for security
  - Health checks
  - Proper signal handling
- **Usage**:
  ```bash
  docker build -t hirenova-x .
  docker run -p 5000:5000 hirenova-x
  ```

#### **docker-compose.yml**
- **Purpose**: Local development environment orchestration
- **Services**:
  - API server on port 5000
  - SQLite database service
  - Frontend web server on port 8000
  - Adminer (optional database GUI)
- **Networks**: Custom bridge network
- **Volumes**: Persist database and share code
- **Usage**:
  ```bash
  docker-compose up
  ```

---

### Documentation Files

#### **README.md** (Main Documentation)
- **Purpose**: Complete project guide
- **Sections**:
  - Features overview
  - Tech stack
  - Installation & setup
  - Complete API documentation
  - Database schema explanation
  - Security features
  - Deployment guides
  - Troubleshooting
  - Roadmap

#### **QUICKSTART.md** (Fast Setup)
- **Purpose**: Get running in 5 minutes
- **Covers**:
  - Step-by-step setup
  - Environment configuration
  - Database initialization
  - Testing with curl/Postman
  - Common issues
  - Next steps

#### **PROJECT_STRUCTURE.md** (This File)
- **Purpose**: Understand file organization
- **Includes**:
  - Directory tree
  - File purposes
  - Inter-dependencies
  - Technology mapping
  - Usage examples

---

### Testing & Integration

#### **postman-collection.json**
- **Purpose**: API test suite for Postman
- **Contains**: 30+ pre-configured API requests
- **Categories**:
  - Authentication (register, login)
  - Courses (get, enroll, progress)
  - Jobs (list, filter, apply)
  - Assessments (submit, retrieve)
  - Analytics (salary, skills)
  - User management
- **Import**: Postman > Import > Select this file
- **Variables**: base_url, token, userId, etc.

---

## 🔄 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    USER BROWSER                          │
│              ┌──────────────────┐                       │
│              │  index.html      │                       │
│              │  React SPA       │                       │
│              └──────────────────┘                       │
└─────────────────────────────────────────────────────────┘
                         ↓ HTTP/REST
                    API Requests
                         ↓
┌─────────────────────────────────────────────────────────┐
│              BACKEND (Node.js/Express)                   │
│         ┌─────────────────────────┐                    │
│         │   server.js             │                    │
│         │  - Routes               │                    │
│         │  - Auth                 │                    │
│         │  - Business Logic       │                    │
│         │  - CORS & Security      │                    │
│         └─────────────────────────┘                    │
└─────────────────────────────────────────────────────────┘
                         ↓ SQL
                   Database Queries
                         ↓
┌─────────────────────────────────────────────────────────┐
│              DATABASE (SQLite)                           │
│         ┌─────────────────────────┐                    │
│         │   hirenova.db           │                    │
│         │  - Users                │                    │
│         │  - Courses              │                    │
│         │  - Jobs                 │                    │
│         │  - Skills               │                    │
│         │  - Analytics Data       │                    │
│         └─────────────────────────┘                    │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 Technology Stack by File

### index.html
```
├─ React 18 (via CDN)
├─ React DOM
├─ Babel (JSX compilation)
├─ Native CSS3 (no external framework)
└─ Fetch API (HTTP requests)
```

### server.js
```
├─ Node.js runtime
├─ Express 4.18 (web framework)
├─ SQLite3 (database driver)
├─ jsonwebtoken (JWT auth)
├─ bcryptjs (password hashing)
├─ cors (cross-origin requests)
└─ body-parser (JSON parsing)
```

### Database
```
└─ SQLite 3
   ├─ Lightweight
   ├─ File-based
   ├─ No server required
   └─ Perfect for development/small apps
```

### DevOps
```
├─ Docker (containerization)
├─ Docker Compose (orchestration)
├─ Alpine Linux (minimal OS)
└─ Node.js 18 (LTS runtime)
```

---

## 🔐 Security Architecture

### Authentication & Authorization
```
Frontend (index.html)
    ↓ (email, password)
server.js /auth/login
    ↓ (bcryptjs.compare)
Database (users table)
    ↓ (if valid)
JWT token generated
    ↓
Frontend stores token (localStorage)
    ↓ (subsequent requests)
Authorization header: "Bearer {token}"
    ↓
server.js verifyToken middleware
    ↓
Grant or deny access
```

### Data Protection
- Password hashing: bcryptjs (10 rounds)
- JWT expiration: Configurable (default 7 days)
- CORS validation: Whitelist specific origins
- SQL injection prevention: Parameterized queries
- Environment secrets: .env file (never committed)

---

## 📈 Scalability & Performance

### Current Architecture (Suitable for)
- Development and testing
- Small teams (< 100 users)
- Learning and prototyping
- Single server deployment

### Optimization Done
- SQLite indexes on frequently queried fields
- JWT for stateless authentication
- CORS enabled for parallel frontend/backend
- Database connection pooling ready
- Docker containerization

### Future Scalability Options
```
├─ PostgreSQL (replaces SQLite)
├─ Redis (session/cache layer)
├─ Load balancer (multiple servers)
├─ Microservices (separate concerns)
├─ Message queue (async processing)
└─ Cloud CDN (static assets)
```

---

## 🚀 Deployment Paths

### Local Development
```
npm install
npm run dev
→ http://localhost:5000 (API)
→ http://localhost:8000 (Frontend)
```

### Docker Local
```
docker-compose up
→ All services in containers
→ Automatic database initialization
```

### Production (Heroku)
```
Push to Heroku → Build → Deploy
Environment variables set in Heroku dashboard
```

### Production (AWS/GCP)
```
Push to Docker Registry → Deploy to container service
Configure RDS for database
```

---

## 📝 File Relationships Matrix

| File | Depends On | Used By | Purpose |
|------|-----------|---------|---------|
| index.html | server.js | Browser | UI/Frontend |
| server.js | database-schema.sql | index.html | API Backend |
| package.json | NPM Registry | server.js | Dependencies |
| .env | .env.example | server.js | Config |
| hirenova.db | database-schema.sql | server.js | Data Storage |
| Dockerfile | server.js, package.json | Docker | Containerization |
| docker-compose.yml | Dockerfile, index.html | Docker | Orchestration |
| postman-collection.json | server.js | Postman | API Testing |

---

## 🔄 Development Workflow

### 1. Setup Phase
```
├─ Clone/download project
├─ Run: npm install
├─ Copy: .env.example → .env
└─ Database auto-initializes on first run
```

### 2. Development Phase
```
├─ Backend: npm run dev
├─ Frontend: Open index.html
├─ Test: Use Postman collection
└─ Monitor: Check server logs
```

### 3. Testing Phase
```
├─ Manual: Test UI interactions
├─ API: Test endpoints with Postman
├─ Database: Verify data persistence
└─ Security: Test authentication
```

### 4. Deployment Phase
```
├─ Local Docker: docker-compose up
├─ Production: Push to cloud provider
├─ Monitoring: Setup logging/alerts
└─ Backup: Database snapshots
```

---

## 📊 Database Schema at a Glance

```
users (11 fields)
├─ Core: id, name, email, password
├─ Profile: avatar, careerPath
├─ Metrics: resumeScore, careerReadinessScore
└─ Timestamps: createdAt, updatedAt, lastLogin

courses (11 fields)
├─ Content: title, description, instructor
├─ Metadata: category, level, duration
├─ Metrics: rating, reviewCount
└─ Business: price, maxStudents, isActive

jobs (13 fields)
├─ Core: title, company, description
├─ Location: location, workModel
├─ Compensation: salary_min, salary_max, currency
├─ Requirements: requiredSkills, experience_level
└─ Analytics: matchScore, views, postedAt

skills (6 fields)
├─ Identity: name, category
├─ Demand: demandLevel, growthRate
└─ Market: averageSalary, jobPostings

[... 7 more tables for user enrollment, applications, etc.]
```

---

## 🎓 Learning Resources by Component

### Frontend (React/JavaScript)
- [React Documentation](https://react.dev)
- [MDN Web Docs](https://developer.mozilla.org)
- [JavaScript ES6+](https://es6.io)

### Backend (Node.js/Express)
- [Express.js Guide](https://expressjs.com)
- [Node.js API](https://nodejs.org/api)
- [RESTful API Design](https://restfulapi.net)

### Database (SQLite)
- [SQLite Documentation](https://www.sqlite.org)
- [SQL Basics](https://www.w3schools.com/sql)
- [Database Design](https://en.wikipedia.org/wiki/Database_design)

### DevOps (Docker)
- [Docker Documentation](https://docs.docker.com)
- [Docker Compose Guide](https://docs.docker.com/compose)
- [Container Best Practices](https://docs.docker.com/develop/dev-best-practices)

---

## 🆘 Troubleshooting by File

### Issues with index.html
- Check browser console (F12)
- Verify backend is running on port 5000
- Clear browser cache
- Check CORS errors

### Issues with server.js
- Check terminal for error logs
- Verify port 5000 is available
- Check .env file exists
- Verify dependencies installed

### Issues with database
- Delete hirenova.db and restart server
- Check file permissions
- Verify database-schema.sql is valid
- Use SQLite CLI to debug

### Issues with Docker
- Rebuild images: `docker-compose build --no-cache`
- Check logs: `docker-compose logs`
- Verify ports are not already in use
- Check Docker daemon is running

---

**Last Updated**: 2024-08-01
**Version**: 1.0.0
**Maintainer**: HireNova X Team
