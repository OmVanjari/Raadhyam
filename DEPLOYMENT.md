# Raadhyam Portal - Production Deployment Guide

This guide covers setting up and deploying the Raadhyam Portal to production.

## ✅ Pre-Deployment Checklist

- [ ] All environment variables configured in `.env`
- [ ] MongoDB connection string verified and database exists
- [ ] Google OAuth credentials configured (if using Google Sign-In)
- [ ] Cloudinary account configured with API keys
- [ ] Brevo/SendinBlue email service configured
- [ ] Backend building successfully
- [ ] Frontend building successfully
- [ ] All routes tested and working
- [ ] Database connection tested
- [ ] File uploads tested with Cloudinary

## 🔧 Backend Setup

### 1. Install Dependencies

```bash
cd Backend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update all values:

```bash
cp .env.example .env
```

**Critical variables to set:**

```env
NODE_ENV=production
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
JWT_SECRET=<generate-random-32-char-string>
SESSION_SECRET=<generate-random-32-char-string>
CLIENT_URL=https://your-frontend-domain.com
```

### 3. Verify Database Connection

```bash
npm run seed:admin
```

This will:

- Test MongoDB connection
- Create default admin user (if not exists)
- Email: `admin@raadhyam.com`
- Password: `Admin@1234`

### 4. Start Backend Server

**Development:**

```bash
npm run dev
```

**Production:**

```bash
npm run prod
```

Or with PM2 (recommended for production):

```bash
npm install -g pm2
pm2 start server.js --name "raadhyam-api"
pm2 save
```

## 🎨 Frontend Setup

### 1. Install Dependencies

```bash
cd Frontend
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.example .env.local
```

Update `.env.local`:

```env
VITE_API_URL=https://api.your-domain.com
```

### 3. Build for Production

```bash
npm run build
```

This generates optimized static files in `dist/` folder.

### 4. Deploy Static Files

Options:

- **Vercel**: `npm install -g vercel && vercel`
- **Netlify**: Drag and drop `dist/` folder
- **Traditional Host**: Upload `dist/` folder to web server
- **Docker**: Use with Nginx

## 🚀 Production Deployment Options

### Option 1: Traditional VPS (Linux/Ubuntu)

#### Backend Deployment

```bash
# SSH into your server
ssh user@your-server.com

# Clone repository
git clone <your-repo-url>
cd Raadhyam/Backend

# Install Node.js (if not installed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install dependencies
npm install

# Create .env file with production values
nano .env

# Install PM2 globally
sudo npm install -g pm2

# Start application
pm2 start server.js --name "raadhyam-api"
pm2 startup
pm2 save

# Setup Nginx as reverse proxy
sudo apt-get install nginx
sudo nano /etc/nginx/sites-available/default
```

Nginx configuration:

```nginx
upstream backend {
    server 127.0.0.1:5000;
}

server {
    listen 80;
    server_name api.your-domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.your-domain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    location / {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Increase timeout for file uploads
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
        send_timeout 300s;
    }
}
```

### Option 2: Docker Deployment

Create `Backend/Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000
ENV NODE_ENV=production

CMD ["node", "server.js"]
```

Create `Frontend/Dockerfile`:

```dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Option 3: Heroku / Railway / Render

**For Heroku:**

```bash
# Login
heroku login

# Create app
heroku create raadhyam-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URL="<your-mongodb-uri>"
# ... set other env vars

# Deploy
git push heroku main
```

## 🔒 Security Checklist

- [ ] **HTTPS/SSL**: All endpoints use HTTPS in production
- [ ] **Environment Variables**: All secrets in `.env`, never committed to git
- [ ] **JWT Secrets**: Generate strong random secrets (32+ characters)
- [ ] **CORS**: Restricted to frontend domain only
- [ ] **Rate Limiting**: Enabled on auth endpoints
- [ ] **Headers Security**: Helmet middleware enabled
- [ ] **Data Validation**: All inputs validated with express-validator
- [ ] **SQL Injection**: Using Mongoose (protected by default)
- [ ] **XSS Protection**: React automatically escapes JSX
- [ ] **CSRF Protection**: Session secure HTTP-only cookies
- [ ] **Admin Credentials**: Change default admin password immediately

## 📊 Monitoring & Maintenance

### Logs

**View backend logs:**

```bash
pm2 logs raadhyam-api
```

**View Nginx logs:**

```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Backups

**MongoDB backup:**

```bash
mongodump --uri="mongodb+srv://username:password@cluster.mongodb.net/database" --out ./backup
```

**Restore backup:**

```bash
mongorestore ./backup
```

### Monitoring Tools

- **PM2 Plus**: `pm2 plus` for monitoring and alerts
- **Sentry**: Error tracking and performance monitoring
- **New Relic**: Application performance monitoring
- **DataDog**: Infrastructure and application monitoring

## 🐛 Troubleshooting

### Backend won't start

```bash
# Check if port is in use
lsof -i :5000

# Check logs
npm run dev
```

### MongoDB connection fails

```bash
# Verify connection string
# Check IP whitelist in MongoDB Atlas
# Ensure database name exists
```

### File uploads not working

```bash
# Check Cloudinary credentials in .env
# Test with: curl -F "file=@test.jpg" http://localhost:5000/api/upload
# Check file size limits
```

### Frontend API calls failing

```bash
# Check CORS configuration
# Verify API_URL in frontend .env
# Check browser console for errors
# Test backend health: curl http://localhost:5000/api/health
```

## 📝 Deployment Verification

After deployment, verify:

1. **Health Check**

   ```bash
   curl https://api.your-domain.com/api/health
   ```

2. **User Registration**
   - Test user registration on frontend
   - Check database for new user

3. **Login**
   - Test email/password login
   - Test Google OAuth (if configured)

4. **Admin Dashboard**
   - Login as admin
   - Test course creation
   - Test file upload to Cloudinary

5. **Public Pages**
   - Test all public pages load
   - Test music notes display

## 🆘 Getting Help

- Check logs: `pm2 logs`
- Check MongoDB Atlas console
- Check Cloudinary dashboard
- Check Google OAuth settings
- Review error messages in browser console

## 📚 Additional Resources

- [MongoDB Atlas Setup](https://docs.atlas.mongodb.com/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Express Production Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [React Production Build](https://react.dev/learn/production-grade-react-apps)
- [Nginx Documentation](https://nginx.org/en/docs/)
