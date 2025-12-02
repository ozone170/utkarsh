# 📋 Production Deployment Checklist

## Pre-Deployment

### Code Preparation
- [ ] All features tested locally
- [ ] No console.log statements in production code
- [ ] Error handling implemented
- [ ] Input validation on all forms
- [ ] API endpoints secured with authentication
- [ ] CORS configured properly
- [ ] Environment variables documented

### Security
- [ ] `.env` file in `.gitignore`
- [ ] Strong JWT secret generated
- [ ] Default admin passwords documented for change
- [ ] SQL injection prevention (using Mongoose)
- [ ] XSS prevention implemented
- [ ] Rate limiting considered

### Database
- [ ] MongoDB Atlas account created
- [ ] Cluster created (M0 Free tier)
- [ ] Database user created
- [ ] Network access configured
- [ ] Connection string tested
- [ ] Indexes optimized

---

## MongoDB Atlas Setup

### Account & Cluster
- [ ] Signed up for MongoDB Atlas
- [ ] Email verified
- [ ] Free M0 cluster created
- [ ] Cluster name: `utkarsh-cluster`
- [ ] Region selected (closest to users)

### Database User
- [ ] Username: `utkarsh_admin`
- [ ] Strong password generated
- [ ] Password saved securely
- [ ] User privileges: Read and write to any database

### Network Access
- [ ] IP whitelist configured
- [ ] 0.0.0.0/0 added (or specific IPs)
- [ ] Access confirmed

### Connection String
- [ ] Connection string copied
- [ ] Format verified:
  ```
  mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
  ```
- [ ] Tested locally
- [ ] MongoDB Connected message seen

### Database Seeding
- [ ] Seed script run: `npm run seed`
- [ ] Admin user created: `admin@utkarsh.com`
- [ ] Scanner user created: `scanner@utkarsh.com`
- [ ] Default passwords documented

---

## Backend Deployment (Render)

### Repository
- [ ] Code pushed to GitHub/GitLab
- [ ] `.gitignore` includes `.env`
- [ ] `.env.example` created
- [ ] README.md updated

### Render Account
- [ ] Signed up for Render
- [ ] GitHub/GitLab connected
- [ ] Repository authorized

### Web Service Configuration
- [ ] Service name: `utkarsh-backend`
- [ ] Region selected
- [ ] Branch: `main` or `master`
- [ ] Root directory: `backend`
- [ ] Runtime: Node
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] Instance type: Free

### Environment Variables (Render)
- [ ] `PORT=5000`
- [ ] `NODE_ENV=production`
- [ ] `MONGODB_URI=[Atlas connection string]`
- [ ] `JWT_SECRET=[production secret]`

### Deployment
- [ ] Service created
- [ ] Build successful
- [ ] Deployment successful
- [ ] Backend URL accessible
- [ ] API root returns: `{"message":"Utkarsh API is running"}`

### API Testing
- [ ] GET `/` - Returns welcome message
- [ ] POST `/api/users/register` - Creates user
- [ ] POST `/api/auth/login` - Returns JWT token
- [ ] GET `/api/halls` - Returns halls list
- [ ] Protected routes require authentication

---

## Frontend Deployment (Vercel)

### Environment Configuration
- [ ] `frontend/.env` updated with production backend URL
- [ ] `VITE_API_BASE_URL=https://utkarsh-backend.onrender.com`

### Vercel Account
- [ ] Signed up for Vercel
- [ ] GitHub/GitLab connected
- [ ] Repository authorized

### Project Configuration
- [ ] Project imported
- [ ] Framework preset: Vite
- [ ] Root directory: `frontend`
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`

### Environment Variables (Vercel)
- [ ] `VITE_API_BASE_URL=[backend URL]`

### Deployment
- [ ] Project deployed
- [ ] Build successful
- [ ] Frontend URL accessible
- [ ] Landing page loads

### Frontend Testing
- [ ] Landing page loads
- [ ] Registration form works
- [ ] Login form works
- [ ] Admin dashboard accessible
- [ ] Student ID cards generate
- [ ] QR codes display correctly
- [ ] Download functionality works
- [ ] Scanner pages work
- [ ] All navigation works

---

## CORS Configuration

### Backend Update
- [ ] `server.js` updated with frontend URL
- [ ] CORS origin includes:
  - `http://localhost:5173` (development)
  - `https://[your-frontend].vercel.app` (production)
- [ ] Backend redeployed
- [ ] CORS errors resolved

---

## Post-Deployment Testing

### User Flows

**Student Registration**
- [ ] Navigate to registration page
- [ ] Fill in all fields
- [ ] Submit form
- [ ] ID card displays
- [ ] QR code visible
- [ ] Download works
- [ ] Data saved to database

**Admin Login**
- [ ] Navigate to login page
- [ ] Enter admin credentials
- [ ] Login successful
- [ ] Dashboard displays
- [ ] Statistics show correct data

**Student Management**
- [ ] View all students
- [ ] Card view displays
- [ ] Download student ID card
- [ ] Edit student details
- [ ] Delete student (test only)

**Hall Management**
- [ ] Create new hall
- [ ] View all halls
- [ ] Edit hall details
- [ ] Delete hall (test only)

**Hall Scanning**
- [ ] Scanner login
- [ ] Select hall
- [ ] Scan QR code (test)
- [ ] Entry recorded
- [ ] Exit recorded

**Food Scanning**
- [ ] Scanner login
- [ ] Scan QR code
- [ ] Food claim recorded
- [ ] Duplicate prevention works

**Hall Occupancy**
- [ ] View current occupancy
- [ ] Filter by hall
- [ ] Toggle card/table view
- [ ] Data displays correctly

**Food Claims**
- [ ] View food claims
- [ ] Filter by date
- [ ] Toggle card/table view
- [ ] Data displays correctly

### Mobile Testing
- [ ] Test on mobile device
- [ ] Responsive layout works
- [ ] Touch targets adequate
- [ ] Forms work on mobile
- [ ] QR scanner works
- [ ] Downloads work

### Performance
- [ ] Page load time < 3 seconds
- [ ] API response time < 1 second
- [ ] Images load quickly
- [ ] No console errors
- [ ] No network errors

---

## Security Verification

### Authentication
- [ ] JWT tokens expire (24h)
- [ ] Protected routes require auth
- [ ] Invalid tokens rejected
- [ ] Role-based access works

### Data Validation
- [ ] Email validation works
- [ ] Phone validation works
- [ ] Required fields enforced
- [ ] SQL injection prevented
- [ ] XSS prevention works

### Passwords
- [ ] Default admin password changed
- [ ] Default scanner password changed
- [ ] Passwords hashed (bcrypt)
- [ ] Strong password policy

---

## Monitoring Setup

### Render
- [ ] Logs accessible
- [ ] Metrics visible
- [ ] Alerts configured (optional)

### Vercel
- [ ] Analytics enabled
- [ ] Build logs accessible
- [ ] Deployment history visible

### MongoDB Atlas
- [ ] Metrics dashboard reviewed
- [ ] Alerts configured (optional)
- [ ] Backup enabled (optional)

---

## Documentation

### User Documentation
- [ ] Admin guide created
- [ ] Scanner guide created
- [ ] Student guide created
- [ ] FAQ documented

### Technical Documentation
- [ ] README.md complete
- [ ] API documentation updated
- [ ] Deployment guide created
- [ ] Environment variables documented

### Credentials
- [ ] Admin credentials documented
- [ ] Database credentials saved securely
- [ ] API keys saved securely
- [ ] Shared with team securely

---

## Backup & Recovery

### Database Backup
- [ ] MongoDB Atlas backup enabled
- [ ] Backup schedule configured
- [ ] Recovery process tested

### Code Backup
- [ ] Code in version control
- [ ] Multiple branches maintained
- [ ] Tags for releases

---

## Performance Optimization

### Backend
- [ ] Database indexes created
- [ ] Query optimization done
- [ ] Caching considered
- [ ] Compression enabled

### Frontend
- [ ] Images optimized
- [ ] Code minified (Vite default)
- [ ] Lazy loading implemented
- [ ] Bundle size optimized

---

## Final Checks

### URLs
- [ ] Frontend URL documented
- [ ] Backend URL documented
- [ ] Database URL documented
- [ ] All URLs accessible

### Credentials
- [ ] Admin email/password
- [ ] Scanner email/password
- [ ] Database username/password
- [ ] JWT secret

### Communication
- [ ] Team notified of deployment
- [ ] Users notified (if applicable)
- [ ] Support channels ready
- [ ] Feedback mechanism in place

---

## Launch Day

### Pre-Launch
- [ ] Final testing complete
- [ ] All checklist items done
- [ ] Team briefed
- [ ] Support ready

### Launch
- [ ] Application live
- [ ] Monitoring active
- [ ] Team available
- [ ] Users can access

### Post-Launch
- [ ] Monitor for errors
- [ ] Check user feedback
- [ ] Fix critical issues
- [ ] Document lessons learned

---

## Maintenance Schedule

### Daily
- [ ] Check error logs
- [ ] Monitor performance
- [ ] Review user feedback

### Weekly
- [ ] Review analytics
- [ ] Check database size
- [ ] Update documentation

### Monthly
- [ ] Security updates
- [ ] Dependency updates
- [ ] Performance review
- [ ] Backup verification

---

## Emergency Contacts

### Technical Support
- MongoDB Atlas: [support link]
- Render: [support link]
- Vercel: [support link]

### Team Contacts
- Lead Developer: [contact]
- Database Admin: [contact]
- Project Manager: [contact]

---

## Success Criteria

- [ ] Application accessible 24/7
- [ ] All features working
- [ ] No critical errors
- [ ] Users can register
- [ ] Admins can manage
- [ ] Scanners can scan
- [ ] Data persists correctly
- [ ] Performance acceptable
- [ ] Security measures in place
- [ ] Documentation complete

---

**Deployment Status**: ⏳ In Progress / ✅ Complete

**Deployed By**: _________________

**Deployment Date**: _________________

**Production URLs**:
- Frontend: _________________
- Backend: _________________
- Database: _________________

---

**Notes**:
_________________
_________________
_________________
