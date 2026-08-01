# HireNova X - Quick Start Guide

Get up and running in 5 minutes! 🚀

## Step 1: Install Dependencies

```bash
npm install
```

This installs all required packages for the backend server.

## Step 2: Setup Environment

```bash
cp .env.example .env
```

The `.env` file is pre-configured with default values. For production, update:
- `JWT_SECRET` - Change to a strong random string
- `CORS_ORIGIN` - Update to your frontend URL
- `NODE_ENV` - Set to 'production'

## Step 3: Initialize Database

The database automatically initializes on first server start. To manually create:

```bash
sqlite3 hirenova.db < database-schema.sql
```

## Step 4: Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

You should see:
```
HireNova X Backend Server running on http://localhost:5000
```

## Step 5: Open Frontend

In another terminal, serve the HTML file:

```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server

# Or open index.html directly in your browser
```

Visit: `http://localhost:8000`

---

## First-Time Setup Checklist

- [ ] Node.js installed (v14+)
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created
- [ ] Backend running on port 5000
- [ ] Frontend accessible in browser
- [ ] Sample data loaded in database

---

## Testing the API

### 1. Register a User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alex Sterling",
    "email": "alex@hirenova.com",
    "password": "password123"
  }'
```

Response:
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "name": "Alex Sterling",
    "email": "alex@hirenova.com"
  }
}
```

**Save the token for subsequent requests!**

### 2. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alex@hirenova.com",
    "password": "password123"
  }'
```

### 3. Get All Courses

```bash
curl http://localhost:5000/api/courses
```

### 4. Get All Jobs

```bash
curl "http://localhost:5000/api/jobs?workModel=Remote"
```

### 5. Enroll in a Course (Requires Authentication)

```bash
curl -X POST http://localhost:5000/api/users/1/courses/1/enroll \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

### 6. Apply for a Job

```bash
curl -X POST http://localhost:5000/api/users/1/applications \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": 1
  }'
```

### 7. Get User Applications

```bash
curl http://localhost:5000/api/users/1/applications \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 8. Get Analytics

```bash
curl http://localhost:5000/api/analytics/salary-by-role

curl http://localhost:5000/api/analytics/skills-demand
```

---

## Using Postman

1. **Import Endpoints**: Create a new Postman collection
2. **Set Variables**: 
   - `base_url`: `http://localhost:5000/api`
   - `token`: Paste token after login
   - `userId`: `1`

3. **Example Request**:
   ```
   GET {{base_url}}/users/{{userId}}/applications
   Headers:
     Authorization: Bearer {{token}}
   ```

---

## Common Issues & Solutions

### "Port 5000 already in use"
```bash
# Kill process on port 5000
lsof -i :5000
kill -9 <PID>

# Or change PORT in .env
PORT=5001
```

### "Cannot find module sqlite3"
```bash
npm install sqlite3
```

### "CORS error in browser"
Check that:
1. Backend is running on port 5000
2. `CORS_ORIGIN` in `.env` includes your frontend URL
3. Frontend is sending requests to `http://localhost:5000/api`

### "Database is locked"
Close any other database connections and restart the server.

### "JWT token expired"
Register/login again to get a new token.

---

## Database Management

### View Database Contents

```bash
sqlite3 hirenova.db

# View all users
SELECT * FROM users;

# View all courses
SELECT * FROM courses;

# View all jobs
SELECT * FROM jobs;

# Exit
.quit
```

### Reset Database

```bash
rm hirenova.db
# Restart server - database will auto-initialize
npm run dev
```

---

## Development Workflow

### 1. Make Code Changes
Edit `server.js` for backend changes

### 2. With Nodemon (Auto-reload)
```bash
npm run dev
```

### 3. Test Your Changes
Use curl or Postman to test API endpoints

### 4. Check Database
Use `sqlite3` CLI or view logs

### 5. Commit Changes
```bash
git add .
git commit -m "Feature: Description"
```

---

## Next Steps

1. **Customize Frontend**: Edit styles in `index.html` `<style>` tag
2. **Add More Routes**: Add endpoints to `server.js`
3. **Expand Database**: Modify `database-schema.sql`
4. **Deploy**: Follow deployment guide in README.md

---

## Documentation

- **Full API Docs**: See `README.md`
- **Database Schema**: See `database-schema.sql`
- **Frontend Components**: See React code in `index.html`

---

## Get Help

- Check server logs for error messages
- Use browser DevTools (F12) to check frontend errors
- Review API response status codes
- Ensure all JSON is properly formatted

---

Happy coding! 🎉

For detailed information, see the full README.md file.
