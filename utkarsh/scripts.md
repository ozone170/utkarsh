# Useful Scripts

## Development

### Start Everything (Docker)
```bash
# Start backend + MongoDB
docker-compose up --build

# In new terminal: Seed admin
docker exec -it utkarsh-backend npm run seed

# In new terminal: Start frontend
cd frontend && npm run dev
```

### Start Without Docker
```bash
# Terminal 1: MongoDB
mongod

# Terminal 2: Backend
cd backend
npm install
npm run seed
npm run dev

# Terminal 3: Frontend
cd frontend
npm install
npm run dev
```

## Docker Commands

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f mongo
```

### Restart Services
```bash
docker-compose restart
```

### Stop Services
```bash
docker-compose down
```

### Clean Database
```bash
# Stop and remove volumes
docker-compose down -v

# Start fresh
docker-compose up --build
docker exec -it utkarsh-backend npm run seed
```

### Access MongoDB Shell
```bash
docker exec -it utkarsh-mongo mongosh utkarsh
```

### Access Backend Shell
```bash
docker exec -it utkarsh-backend sh
```

## Database Operations

### View Collections (in mongo shell)
```javascript
show collections
db.users.find().pretty()
db.halls.find().pretty()
db.halllogs.find().pretty()
db.foodlogs.find().pretty()
db.adminusers.find().pretty()
```

### Clear Specific Collection
```javascript
db.users.deleteMany({})
db.halllogs.deleteMany({})
db.foodlogs.deleteMany({})
```

### Find User by EventId
```javascript
db.users.findOne({ eventId: "YOUR_EVENT_ID" })
```

### Check Today's Food Logs
```javascript
const today = new Date().toISOString().split('T')[0]
db.foodlogs.find({ date: today })
```

### Check Active Hall Logs
```javascript
db.halllogs.find({ exitTime: null }).pretty()
```

## Git Commands

### Initial Commit
```bash
git add .
git commit -m "Initial commit: Utkarsh Fresher Manager"
git branch -M main
git remote add origin https://github.com/yourusername/utkarsh-fresher-manager.git
git push -u origin main
```

### Update .gitignore
Already configured to ignore:
- node_modules/
- .env files
- dist/
- build/

## Deployment

### Deploy Backend to Render
1. Push code to GitHub
2. Connect Render to repository
3. Set environment variables in Render dashboard
4. Deploy
5. Run seed via Render shell: `npm run seed`

### Deploy Frontend to Vercel
1. Push code to GitHub
2. Import project in Vercel
3. Set VITE_API_BASE_URL in Vercel dashboard
4. Deploy

## Maintenance

### Update Dependencies
```bash
# Backend
cd backend
npm update

# Frontend
cd frontend
npm update
```

### Check for Vulnerabilities
```bash
npm audit
npm audit fix
```

### Build for Production
```bash
# Backend (test build)
cd backend
npm install --production

# Frontend
cd frontend
npm run build
```
