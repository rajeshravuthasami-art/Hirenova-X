-- HireNova X Database Schema
-- SQLite3 Database Structure

-- ==============================================================================
-- USERS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    avatar TEXT,
    careerPath TEXT DEFAULT 'Exploring',
    resumeScore INTEGER DEFAULT 0,
    careerReadinessScore INTEGER DEFAULT 0,
    lastLogin DATETIME,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for users table
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_createdAt ON users(createdAt);

-- ==============================================================================
-- COURSES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    instructor TEXT NOT NULL,
    category TEXT NOT NULL,
    level TEXT,
    duration TEXT,
    rating REAL DEFAULT 0,
    reviewCount INTEGER DEFAULT 0,
    thumbnail TEXT,
    price REAL DEFAULT 0,
    maxStudents INTEGER,
    studentsEnrolled INTEGER DEFAULT 0,
    isActive BOOLEAN DEFAULT 1,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for courses table
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_level ON courses(level);
CREATE INDEX IF NOT EXISTS idx_courses_isActive ON courses(isActive);

-- ==============================================================================
-- USER COURSES (Enrollment) TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS userCourses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    courseId INTEGER NOT NULL,
    progress INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Enrolled',
    enrolledAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    completedAt DATETIME,
    certificateIssued BOOLEAN DEFAULT 0,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE(userId, courseId)
);

-- Indexes for userCourses table
CREATE INDEX IF NOT EXISTS idx_userCourses_userId ON userCourses(userId);
CREATE INDEX IF NOT EXISTS idx_userCourses_courseId ON userCourses(courseId);
CREATE INDEX IF NOT EXISTS idx_userCourses_status ON userCourses(status);

-- ==============================================================================
-- JOBS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    description TEXT,
    location TEXT,
    salary_min INTEGER,
    salary_max INTEGER,
    currency TEXT DEFAULT 'USD',
    workModel TEXT,
    experience_level TEXT,
    requiredSkills TEXT,
    matchScore INTEGER DEFAULT 0,
    postedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    expiresAt DATETIME,
    isActive BOOLEAN DEFAULT 1,
    views INTEGER DEFAULT 0
);

-- Indexes for jobs table
CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs(company);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_workModel ON jobs(workModel);
CREATE INDEX IF NOT EXISTS idx_jobs_isActive ON jobs(isActive);
CREATE INDEX IF NOT EXISTS idx_jobs_postedAt ON jobs(postedAt);

-- ==============================================================================
-- JOB APPLICATIONS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    jobId INTEGER NOT NULL,
    status TEXT DEFAULT 'Applied',
    coverLetter TEXT,
    appliedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    responseAt DATETIME,
    notes TEXT,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (jobId) REFERENCES jobs(id) ON DELETE CASCADE
);

-- Indexes for applications table
CREATE INDEX IF NOT EXISTS idx_applications_userId ON applications(userId);
CREATE INDEX IF NOT EXISTS idx_applications_jobId ON applications(jobId);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_appliedAt ON applications(appliedAt);

-- ==============================================================================
-- SKILLS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    demandLevel TEXT,
    growthRate REAL DEFAULT 0,
    averageSalary INTEGER DEFAULT 0,
    jobPostings INTEGER DEFAULT 0,
    trendingScore REAL DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for skills table
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_demandLevel ON skills(demandLevel);
CREATE INDEX IF NOT EXISTS idx_skills_growthRate ON skills(growthRate);

-- ==============================================================================
-- USER SKILLS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS userSkills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    skillId INTEGER NOT NULL,
    skillName TEXT,
    proficiency TEXT,
    yearsOfExperience REAL DEFAULT 0,
    endorsements INTEGER DEFAULT 0,
    addedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (skillId) REFERENCES skills(id) ON DELETE SET NULL
);

-- Indexes for userSkills table
CREATE INDEX IF NOT EXISTS idx_userSkills_userId ON userSkills(userId);
CREATE INDEX IF NOT EXISTS idx_userSkills_skillId ON userSkills(skillId);

-- ==============================================================================
-- SKILL ASSESSMENTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS assessments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    skillName TEXT NOT NULL,
    score INTEGER,
    level TEXT,
    numberOfQuestions INTEGER,
    correctAnswers INTEGER,
    passedAt DATETIME,
    certificateUrl TEXT,
    validity_months INTEGER DEFAULT 12,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for assessments table
CREATE INDEX IF NOT EXISTS idx_assessments_userId ON assessments(userId);
CREATE INDEX IF NOT EXISTS idx_assessments_skillName ON assessments(skillName);
CREATE INDEX IF NOT EXISTS idx_assessments_passedAt ON assessments(passedAt);

-- ==============================================================================
-- LEARNING PATHS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS learningPaths (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    targetRole TEXT,
    difficulty TEXT,
    estimatedDays INTEGER,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- PATH COURSES TABLE (Many-to-Many relationship)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS pathCourses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pathId INTEGER NOT NULL,
    courseId INTEGER NOT NULL,
    sequence INTEGER,
    isRequired BOOLEAN DEFAULT 1,
    FOREIGN KEY (pathId) REFERENCES learningPaths(id) ON DELETE CASCADE,
    FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE
);

-- ==============================================================================
-- NOTIFICATIONS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    type TEXT,
    title TEXT NOT NULL,
    message TEXT,
    data TEXT,
    isRead BOOLEAN DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for notifications table
CREATE INDEX IF NOT EXISTS idx_notifications_userId ON notifications(userId);
CREATE INDEX IF NOT EXISTS idx_notifications_isRead ON notifications(isRead);

-- ==============================================================================
-- SALARY DATA TABLE (for analytics)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS salaryData (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role TEXT,
    company TEXT,
    location TEXT,
    baseSalary INTEGER,
    bonus INTEGER,
    equity REAL,
    yearsOfExperience INTEGER,
    level TEXT,
    dataDate DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for salaryData table
CREATE INDEX IF NOT EXISTS idx_salaryData_role ON salaryData(role);
CREATE INDEX IF NOT EXISTS idx_salaryData_location ON salaryData(location);
CREATE INDEX IF NOT EXISTS idx_salaryData_dataDate ON salaryData(dataDate);

-- ==============================================================================
-- USER ACTIVITY LOG TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS activityLogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    action TEXT NOT NULL,
    entityType TEXT,
    entityId INTEGER,
    metadata TEXT,
    ipAddress TEXT,
    userAgent TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for activityLogs table
CREATE INDEX IF NOT EXISTS idx_activityLogs_userId ON activityLogs(userId);
CREATE INDEX IF NOT EXISTS idx_activityLogs_action ON activityLogs(action);
CREATE INDEX IF NOT EXISTS idx_activityLogs_createdAt ON activityLogs(createdAt);

-- ==============================================================================
-- SAMPLE DATA INSERTION
-- ==============================================================================

-- Insert sample skills
INSERT OR IGNORE INTO skills (name, category, demandLevel, growthRate, averageSalary) VALUES
('Generative AI', 'AI/ML', 'Critical', 125, 185000),
('Python', 'Programming', 'High', 45, 155000),
('LangChain', 'AI/ML', 'Critical', 230, 175000),
('TypeScript', 'Programming', 'High', 34, 145000),
('Kubernetes', 'DevOps', 'High', 56, 165000),
('React', 'Frontend', 'High', 28, 140000),
('Rust', 'Programming', 'Medium', 68, 170000),
('AWS', 'Cloud', 'High', 52, 160000),
('PyTorch', 'AI/ML', 'High', 95, 180000),
('System Design', 'Architecture', 'High', 40, 175000);

-- Insert sample courses
INSERT OR IGNORE INTO courses (title, instructor, category, level, duration, rating, price) VALUES
('Advanced LLM Orchestration & RAG Systems', 'Dr. Sarah Chen', 'AI', 'Advanced', '18h 45m', 4.9, 99.99),
('Generative AI for Developers', 'James Wilson', 'AI', 'Intermediate', '12h 20m', 4.8, 79.99),
('Full-Stack Cloud Architecture', 'Alex Kumar', 'Cloud', 'Intermediate', '20h 00m', 4.7, 89.99),
('Mastering Design Systems', 'Elena Rodriguez', 'Design', 'Beginner', '24h 00m', 4.6, 69.99),
('System Design Fundamentals', 'Michael Chen', 'Backend', 'Intermediate', '16h 30m', 4.8, 79.99);

-- Insert sample jobs
INSERT OR IGNORE INTO jobs (title, company, description, location, salary_min, salary_max, workModel, experience_level, requiredSkills) VALUES
('Senior Product Designer', 'Sentient AI', 'Lead product design for AI applications', 'San Francisco, CA', 160000, 220000, 'Remote', 'Senior', 'Figma, React, AI-First UX'),
('AI Lead Engineer', 'Flux Robotics', 'Build AI systems for robotics', 'Austin, TX', 180000, 250000, 'Hybrid', 'Lead', 'Python, PyTorch, LLMs'),
('Cloud Architect', 'CloudTech Inc', 'Design cloud infrastructure', 'New York, NY', 170000, 240000, 'On-site', 'Senior', 'AWS, Kubernetes, System Design');
  
