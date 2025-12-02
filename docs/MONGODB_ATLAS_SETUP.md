# 🍃 MongoDB Atlas Setup - Quick Reference

## Step-by-Step Guide

### 1️⃣ Create Account
- Go to: https://www.mongodb.com/cloud/atlas
- Click **"Try Free"**
- Sign up with email or Google
- Verify your email

### 2️⃣ Create Cluster
- Click **"Build a Database"**
- Select **"M0 FREE"** (512 MB storage)
- Choose **AWS** as provider
- Select region closest to your users
- Cluster Name: `utkarsh-cluster`
- Click **"Create"**
- Wait 3-5 minutes for cluster creation

### 3️⃣ Create Database User
- Left sidebar → **"Database Access"**
- Click **"Add New Database User"**
- Authentication: **Password**
- Username: `utkarsh_admin`
- Password: Click **"Autogenerate Secure Password"**
- **COPY AND SAVE THIS PASSWORD!**
- Or use: `FMPsdvN58kbvgap5` (example)
- Privileges: **"Read and write to any database"**
- Click **"Add User"**

### 4️⃣ Configure Network Access
- Left sidebar → **"Network Access"**
- Click **"Add IP Address"**
- Click **"Allow Access from Anywhere"**
- IP: `0.0.0.0/0`
- Description: `Allow all (for development)`
- Click **"Confirm"**

**⚠️ For Production**: Add specific IPs instead of 0.0.0.0/0

### 5️⃣ Get Connection String
- Left sidebar → **"Database"**
- Click **"Connect"** button on your cluster
- Choose **"Connect your application"**
- Driver: **Node.js**
- Version: **5.5 or later**
- Copy the connection string

### 6️⃣ Format Connection String

**Template**:
```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

**Example**:
```
mongodb+srv://utkarsh_admin:FMPsdvN58kbvgap5@utkarsh-cluster.a2ftmaf.mongodb.net/utkarsh?retryWrites=true&w=majority
```

**Replace**:
- `<username>` → `utkarsh_admin`
- `<password>` → Your actual password
- `<cluster>` → Your cluster address (e.g., `utkarsh-cluster.a2ftmaf`)
- `<database>` → `utkarsh`

### 7️⃣ Update Backend Configuration

**Local Development** (`backend/.env`):
```env
MONGODB_URI=mongodb+srv://utkarsh_admin:YOUR_PASSWORD@utkarsh-cluster.a2ftmaf.mongodb.net/utkarsh?retryWrites=true&w=majority
```

**Production** (Render/Heroku):
Add as environment variable in platform dashboard

### 8️⃣ Test Connection

```bash
cd backend
npm start
```

**Success Message**:
```
MongoDB Connected: utkarsh-cluster-shard-00-00.a2ftmaf.mongodb.net
```

### 9️⃣ Seed Database (Optional)

```bash
cd backend
npm run seed
```

**Creates**:
- Admin: `admin@utkarsh.com` / `admin123`
- Scanner: `scanner@utkarsh.com` / `scanner123`

---

## Common Issues & Solutions

### ❌ "Authentication failed"
**Solution**: 
- Check username and password
- Ensure password doesn't have special characters (or URL encode them)
- Verify user has correct permissions

### ❌ "Connection timeout"
**Solution**:
- Check Network Access settings
- Ensure 0.0.0.0/0 is whitelisted
- Wait a few minutes after adding IP

### ❌ "MongoServerError: bad auth"
**Solution**:
- Regenerate password
- Update connection string
- Restart application

### ❌ "Could not connect to any servers"
**Solution**:
- Check internet connection
- Verify cluster is active
- Check if cluster is paused (free tier auto-pauses after 60 days inactivity)

---

## Connection String Special Characters

If your password contains special characters, URL encode them:

| Character | Encoded |
|-----------|---------|
| @ | %40 |
| : | %3A |
| / | %2F |
| ? | %3F |
| # | %23 |
| [ | %5B |
| ] | %5D |
| % | %25 |

**Example**:
- Password: `P@ss:word#123`
- Encoded: `P%40ss%3Aword%23123`

---

## MongoDB Atlas Dashboard

### Database Tab
- View collections
- Browse documents
- Run queries
- View indexes

### Metrics Tab
- Connection count
- Operations per second
- Network traffic
- Storage usage

### Alerts Tab
- Set up email alerts
- Monitor usage
- Get notified of issues

### Backup Tab (Paid)
- Configure backups
- Restore from backup
- Point-in-time recovery

---

## Free Tier Limits (M0)

| Resource | Limit |
|----------|-------|
| Storage | 512 MB |
| RAM | Shared |
| vCPU | Shared |
| Connections | 500 |
| Databases | Unlimited |
| Collections | Unlimited |

**Good for**: 500-1000 students with moderate usage

**Upgrade when**:
- Storage > 400 MB
- Frequent connection errors
- Slow query performance

---

## Security Best Practices

### ✅ Do
- Use strong passwords (20+ characters)
- Rotate passwords regularly
- Use specific IP whitelisting in production
- Enable 2FA on MongoDB Atlas account
- Monitor access logs
- Use read-only users for analytics

### ❌ Don't
- Commit connection strings to Git
- Share passwords in plain text
- Use default passwords
- Allow 0.0.0.0/0 in production
- Use same password for all environments

---

## Monitoring & Maintenance

### Daily
- Check connection count
- Monitor error logs
- Review slow queries

### Weekly
- Check storage usage
- Review metrics
- Update indexes if needed

### Monthly
- Rotate passwords
- Review access logs
- Update IP whitelist
- Check for MongoDB updates

---

## Upgrade Path

### When to Upgrade

**M10 Cluster** ($0.08/hour = ~$57/month):
- 2 GB RAM
- 10 GB storage
- Dedicated cluster
- Automated backups
- Better performance

**M20 Cluster** ($0.20/hour = ~$144/month):
- 4 GB RAM
- 20 GB storage
- Even better performance
- More connections

### How to Upgrade
1. Go to cluster
2. Click **"Edit Configuration"**
3. Select new tier
4. Click **"Apply Changes"**
5. Wait for migration (no downtime)

---

## Support Resources

### Documentation
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Connection String Format](https://docs.mongodb.com/manual/reference/connection-string/)
- [Security Checklist](https://docs.atlas.mongodb.com/security-checklist/)

### Community
- [MongoDB Community Forums](https://www.mongodb.com/community/forums/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/mongodb-atlas)

### Support
- Free tier: Community support only
- Paid tiers: Email and chat support

---

## Quick Commands

### Test Connection (Node.js)
```javascript
const mongoose = require('mongoose');
mongoose.connect('your-connection-string')
  .then(() => console.log('Connected!'))
  .catch(err => console.error('Error:', err));
```

### View Collections
```javascript
const collections = await mongoose.connection.db.listCollections().toArray();
console.log(collections.map(c => c.name));
```

### Count Documents
```javascript
const count = await User.countDocuments();
console.log('Total users:', count);
```

---

## Checklist

- [ ] MongoDB Atlas account created
- [ ] Email verified
- [ ] M0 Free cluster created
- [ ] Cluster name: `utkarsh-cluster`
- [ ] Database user created: `utkarsh_admin`
- [ ] Password saved securely
- [ ] Network access: 0.0.0.0/0 added
- [ ] Connection string copied
- [ ] Connection string formatted correctly
- [ ] Backend `.env` updated
- [ ] Connection tested successfully
- [ ] Database seeded (optional)
- [ ] Admin login works

---

**Your Connection String**:
```
mongodb+srv://utkarsh_admin:YOUR_PASSWORD@utkarsh-cluster.XXXXX.mongodb.net/utkarsh?retryWrites=true&w=majority
```

**Save this securely!** 🔒
