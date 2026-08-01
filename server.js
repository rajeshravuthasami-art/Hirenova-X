const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database setup
const db = new sqlite3.Database('./hirenova.db', (err) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

// Initialize database tables
function initializeDatabase() {
    db.serialize(() => {
        // Users table
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                avatar TEXT,
                careerPath TEXT,
                resumeScore INTEGER DEFAULT 0,
                careerReadinessScore INTEGER DEFAULT 0,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Courses table
        db.run(`
            CREATE TABLE IF NOT EXISTS courses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                instructor TEXT,
                category TEXT,
                level TEXT,
                duration TEXT,
                rating REAL,
                thumbnail TEXT,
                price REAL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // User Courses (enrollment)
        db.run(`
            CREATE TABLE IF NOT EXISTS userCourses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER NOT NULL,
                courseId INTEGER NOT NULL,
                progress INTEGER DEFAULT 0,
                enrolledAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                completedAt DATETIME,
                FOREIGN KEY (userId) REFERENCES users(id),
                FOREIGN KEY (courseId) REFERENCES courses(id)
            )
        `);

        // Jobs table
        db.run(`
            CREATE TABLE IF NOT EXISTS jobs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                company TEXT NOT NULL,
                description TEXT,
                location TEXT,
                salary_min INTEGER,
                salary_max INTEGER,
                workModel TEXT,
                requiredSkills TEXT,
                matchScore INTEGER,
                postedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                expiresAt DATETIME
            )
        `);

        // Job Applications
        db.run(`
            CREATE TABLE IF NOT EXISTS applications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER NOT NULL,
                jobId INTEGER NOT NULL,
                status TEXT DEFAULT 'Applied',
                appliedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (userId) REFERENCES users(id),
                FOREIGN KEY (jobId) REFERENCES jobs(id)
            )
        `);

        // Skill Assessments
        db.run(`
            CREATE TABLE IF NOT EXISTS assessments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER NOT NULL,
                skillName TEXT NOT NULL,
                score INTEGER,
                level TEXT,
                passedAt DATETIME,
                FOREIGN KEY (userId) REFERENCES users(id)
            )
        `);

        // Skills table
        db.run(`
            CREATE TABLE IF NOT EXISTS skills (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE NOT NULL,
                category TEXT,
                demandLevel TEXT,
                growthRate REAL,
                averageSalary INTEGER
            )
        `);

        // User Skills
        db.run(`
            CREATE TABLE IF NOT EXISTS userSkills (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER NOT NULL,
                skillId INTEGER NOT NULL,
                proficiency TEXT,
                yearsOfExperience REAL,
                FOREIGN KEY (userId) REFERENCES users(id),
                FOREIGN KEY (skillId) REFERENCES skills(id)
            )
        `);

        console.log('Database tables initialized');
        insertSampleData();
    });
}

// Insert sample data
function insertSampleData() {
    // Check if data already exists
    db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
        if (row && row.count === 0) {
            // Insert sample courses
            const courses = [
                {
                    title: 'Advanced LLM Orchestration & RAG Systems',
                    instructor: 'Dr. Sarah Chen',
                    category: 'AI',
                    level: 'Advanced',
                    duration: '18h 45m',
                    rating: 4.9,
                    price: 99.99
                },
                {
                    title: 'Generative AI for Developers',
                    instructor: 'James Wilson',
                    category: 'AI',
                    level: 'Intermediate',
                    duration: '12h 20m',
                    rating: 4.8,
                    price: 79.99
                },
                {
                    title: 'Full-Stack Cloud Architecture',
                    instructor: 'Alex Kumar',
                    category: 'Cloud',
                    level: 'Intermediate',
                    duration: '20h 00m',
                    rating: 4.7,
                    price: 89.99
                },
                {
                    title: 'Mastering Design Systems',
                    instructor: 'Elena Rodriguez',
                    category: 'Design',
                    level: 'Beginner',
                    duration: '24h 00m',
                    rating: 4.6,
                    price: 69.99
                }
            ];

            courses.forEach(course => {
                db.run(
                    'INSERT INTO courses (title, instructor, category, level, duration, rating, price) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [course.title, course.instructor, course.category, course.level, course.duration, course.rating, course.price]
                );
            });

            // Insert sample jobs
            const jobs = [
                {
                    title: 'Senior Product Designer',
                    company: 'Sentient AI',
                    location: 'San Francisco, CA',
                    workModel: 'Remote',
                    salary_min: 160000,
                    salary_max: 220000,
                    requiredSkills: 'Figma, React, AI-First UX'
                },
                {
                    title: 'AI Lead Engineer',
                    company: 'Flux Robotics',
                    location: 'Austin, TX',
                    workModel: 'Hybrid',
                    salary_min: 180000,
                    salary_max: 250000,
                    requiredSkills: 'Python, PyTorch, LLMs'
                },
                {
                    title: 'Cloud Architect',
                    company: 'CloudTech Inc',
                    location: 'New York, NY',
                    workModel: 'On-site',
                    salary_min: 170000,
                    salary_max: 240000,
                    requiredSkills: 'AWS, Kubernetes, System Design'
                }
            ];

            jobs.forEach(job => {
                db.run(
                    'INSERT INTO jobs (title, company, location, workModel, salary_min, salary_max, requiredSkills) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [job.title, job.company, job.location, job.workModel, job.salary_min, job.salary_max, job.requiredSkills]
                );
            });

            // Insert sample skills
            const skills = [
                { name: 'Generative AI', category: 'AI', demandLevel: 'Critical', growthRate: 125 },
                { name: 'Python', category: 'Programming', demandLevel: 'High', growthRate: 45 },
                { name: 'LangChain', category: 'AI', demandLevel: 'Critical', growthRate: 230 },
                { name: 'TypeScript', category: 'Programming', demandLevel: 'High', growthRate: 34 },
                { name: 'Kubernetes', category: 'DevOps', demandLevel: 'High', growthRate: 56 },
                { name: 'React', category: 'Frontend', demandLevel: 'High', growthRate: 28 }
            ];

            skills.forEach(skill => {
                db.run(
                    'INSERT INTO skills (name, category, demandLevel, growthRate) VALUES (?, ?, ?, ?)',
                    [skill.name, skill.category, skill.demandLevel, skill.growthRate]
                );
            });

            console.log('Sample data inserted');
        }
    });
}

// Authentication Routes
app.post('/api/auth/register', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    db.run(
        'INSERT INTO users (name, email, password, avatar, careerPath) VALUES (?, ?, ?, ?, ?)',
        [name, email, hashedPassword, name.substring(0, 2).toUpperCase(), 'AI Career Path: Active'],
        function(err) {
            if (err) {
                return res.status(400).json({ error: 'User already exists' });
            }

            const token = jwt.sign({ id: this.lastID, email }, JWT_SECRET);
            res.status(201).json({
                message: 'User registered successfully',
                token,
                user: { id: this.lastID, name, email }
            });
        }
    );
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Missing email or password' });
    }

    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
        if (err || !user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                resumeScore: user.resumeScore,
                careerReadinessScore: user.careerReadinessScore
            }
        });
    });
});

// Middleware to verify token
function verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        req.userId = decoded.id;
        next();
    });
}

// User Routes
app.get('/api/users/:id', verifyToken, (req, res) => {
    db.get('SELECT id, name, email, avatar, careerPath, resumeScore, careerReadinessScore FROM users WHERE id = ?', 
        [req.params.id], 
        (err, user) => {
            if (err || !user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        }
    );
});

app.put('/api/users/:id', verifyToken, (req, res) => {
    const { name, careerPath, resumeScore, careerReadinessScore } = req.body;

    db.run(
        'UPDATE users SET name = ?, careerPath = ?, resumeScore = ?, careerReadinessScore = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
        [name, careerPath, resumeScore, careerReadinessScore, req.params.id],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to update user' });
            }
            res.json({ message: 'User updated successfully' });
        }
    );
});

// Courses Routes
app.get('/api/courses', (req, res) => {
    db.all('SELECT * FROM courses', (err, courses) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch courses' });
        }
        res.json(courses);
    });
});

app.get('/api/courses/:id', (req, res) => {
    db.get('SELECT * FROM courses WHERE id = ?', [req.params.id], (err, course) => {
        if (err || !course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.json(course);
    });
});

// User Courses (Enrollment)
app.get('/api/users/:userId/courses', verifyToken, (req, res) => {
    db.all(`
        SELECT c.*, uc.progress, uc.enrolledAt, uc.completedAt 
        FROM courses c 
        JOIN userCourses uc ON c.id = uc.courseId 
        WHERE uc.userId = ?
    `, [req.params.userId], (err, courses) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch courses' });
        }
        res.json(courses);
    });
});

app.post('/api/users/:userId/courses/:courseId/enroll', verifyToken, (req, res) => {
    db.run(
        'INSERT OR IGNORE INTO userCourses (userId, courseId) VALUES (?, ?)',
        [req.params.userId, req.params.courseId],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to enroll in course' });
            }
            res.status(201).json({ message: 'Enrolled in course successfully' });
        }
    );
});

app.put('/api/users/:userId/courses/:courseId/progress', verifyToken, (req, res) => {
    const { progress } = req.body;

    db.run(
        'UPDATE userCourses SET progress = ? WHERE userId = ? AND courseId = ?',
        [progress, req.params.userId, req.params.courseId],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to update progress' });
            }
            res.json({ message: 'Progress updated successfully' });
        }
    );
});

// Jobs Routes
app.get('/api/jobs', (req, res) => {
    const { location, minSalary, maxSalary, workModel } = req.query;
    let query = 'SELECT * FROM jobs WHERE 1=1';
    const params = [];

    if (location) {
        query += ' AND location LIKE ?';
        params.push(`%${location}%`);
    }
    if (minSalary) {
        query += ' AND salary_max >= ?';
        params.push(minSalary);
    }
    if (maxSalary) {
        query += ' AND salary_min <= ?';
        params.push(maxSalary);
    }
    if (workModel) {
        query += ' AND workModel = ?';
        params.push(workModel);
    }

    db.all(query, params, (err, jobs) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch jobs' });
        }
        res.json(jobs);
    });
});

app.get('/api/jobs/:id', (req, res) => {
    db.get('SELECT * FROM jobs WHERE id = ?', [req.params.id], (err, job) => {
        if (err || !job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        res.json(job);
    });
});

// Applications Routes
app.post('/api/users/:userId/applications', verifyToken, (req, res) => {
    const { jobId } = req.body;

    db.run(
        'INSERT INTO applications (userId, jobId) VALUES (?, ?)',
        [req.params.userId, jobId],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to submit application' });
            }
            res.status(201).json({ message: 'Application submitted successfully' });
        }
    );
});

app.get('/api/users/:userId/applications', verifyToken, (req, res) => {
    db.all(`
        SELECT a.id, a.status, a.appliedAt, j.title, j.company, j.location 
        FROM applications a 
        JOIN jobs j ON a.jobId = j.id 
        WHERE a.userId = ?
        ORDER BY a.appliedAt DESC
    `, [req.params.userId], (err, applications) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch applications' });
        }
        res.json(applications);
    });
});

// Skills Routes
app.get('/api/skills', (req, res) => {
    db.all('SELECT * FROM skills ORDER BY growthRate DESC', (err, skills) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch skills' });
        }
        res.json(skills);
    });
});

app.get('/api/skills/trending', (req, res) => {
    db.all(
        'SELECT * FROM skills WHERE demandLevel = "Critical" ORDER BY growthRate DESC LIMIT 10',
        (err, skills) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to fetch trending skills' });
            }
            res.json(skills);
        }
    );
});

// Assessments Routes
app.post('/api/users/:userId/assessments', verifyToken, (req, res) => {
    const { skillName, score, level } = req.body;

    db.run(
        'INSERT INTO assessments (userId, skillName, score, level, passedAt) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)',
        [req.params.userId, skillName, score, level],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to save assessment' });
            }
            res.status(201).json({ message: 'Assessment saved successfully', assessmentId: this.lastID });
        }
    );
});

app.get('/api/users/:userId/assessments', verifyToken, (req, res) => {
    db.all(
        'SELECT * FROM assessments WHERE userId = ? ORDER BY passedAt DESC',
        [req.params.userId],
        (err, assessments) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to fetch assessments' });
            }
            res.json(assessments);
        }
    );
});

// Analytics Routes
app.get('/api/analytics/salary-by-role', (req, res) => {
    db.all(`
        SELECT 
            COUNT(*) as count,
            CASE 
                WHEN title LIKE '%Engineer%' THEN 'Engineer'
                WHEN title LIKE '%Designer%' THEN 'Designer'
                WHEN title LIKE '%Manager%' THEN 'Manager'
                ELSE 'Other'
            END as role,
            ROUND(AVG((salary_min + salary_max) / 2)) as averageSalary
        FROM jobs
        GROUP BY role
    `, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch analytics' });
        }
        res.json(results);
    });
});

app.get('/api/analytics/skills-demand', (req, res) => {
    db.all(
        'SELECT name, demandLevel, growthRate, averageSalary FROM skills ORDER BY growthRate DESC LIMIT 10',
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to fetch skills demand' });
            }
            res.json(results);
        }
    );
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`HireNova X Backend Server running on http://localhost:${PORT}`);
    console.log('API Documentation:');
    console.log('  POST   /api/
