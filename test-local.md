# Testing Backend Locally

## Quick Test Steps

1. **Start the backend locally:**

   ```bash
   cd backend
   npm run dev
   ```

2. **Test the health endpoint:**

   ```bash
   curl http://localhost:3002/health
   ```

3. **Test the database endpoint:**

   ```bash
   curl http://localhost:3002/db-test
   ```

4. **Test the products API:**
   ```bash
   curl http://localhost:3002/api/products
   ```

## Expected Results

- **Health endpoint**: Should return server status
- **Database endpoint**: Should return SQLite connection status
- **Products API**: Should return sample products (or empty array if no data)

## If Everything Works Locally

1. **Commit and push your changes:**

   ```bash
   git add .
   git commit -m "Fix database issues: use SQLite for production"
   git push
   ```

2. **Render will auto-deploy** (since autoDeploy: true)

3. **Test the deployed backend:**
   ```bash
   curl https://inforce-backend-pfhf.onrender.com/health
   curl https://inforce-backend-pfhf.onrender.com/api/products
   ```

## What We Fixed

- ✅ Removed PostgreSQL dependency
- ✅ Use SQLite for both development and production
- ✅ Fixed database initialization
- ✅ Updated models to work with SQLite only
- ✅ Simplified deployment configuration
