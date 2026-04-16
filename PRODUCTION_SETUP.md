# Production Setup & Optimization Guide

This guide covers making Raadhyam Portal production-ready with security, performance, and best practices.

## 🔒 Security Hardening

### 1. Environment Variables Security

**Never commit `.env` file to git:**

```bash
# Add to .gitignore
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
```

**Use strong secrets:**

```bash
# Generate secure JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate secure session secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. CORS Configuration

Already configured in `server.js`, but verify in production:

```javascript
// Only allow your frontend domain
const corsOptions = {
  origin: "https://yourdomain.com", // NOT '*'
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
};
```

### 3. Rate Limiting

Already configured in `server.js` with:

- 100 requests per 15 minutes (global)
- 5 requests per 15 minutes for auth endpoints

Adjust in `.env`:

```env
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. HTTPS/TLS

**For production, always use HTTPS:**

- Let's Encrypt (free): Use Certbot
- Commercial: AWS Certificate Manager, DigiCert, etc.

```bash
# Certbot (Let's Encrypt) on Ubuntu
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d api.yourdomain.com
```

### 5. Database Security

**MongoDB Security:**

- Enable authentication
- Use VPC/network access controls
- Whitelist IP addresses
- Enable encryption at rest
- Regular backups

```env
# Secure connection string includes credentials
MONGODB_URL=mongodb+srv://username:password@cluster-name.mongodb.net/database_name?ssl=true&authSource=admin
```

### 6. API Keys Protection

**For Cloudinary, Brevo, Google OAuth:**

- Never expose in frontend
- Only use in backend
- Rotate keys periodically
- Monitor usage for suspicious activity

### 7. Session Security

Already configured with:

- HTTP-only cookies (can't be accessed by JavaScript)
- Secure flag (only sent over HTTPS)
- SameSite strict (prevents CSRF)

```javascript
cookie: {
  secure: true,        // HTTPS only
  httpOnly: true,      // No JS access
  sameSite: 'strict',  // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
}
```

## ⚡ Performance Optimization

### 1. Frontend Optimization

**Already included:**

- Vite for fast development and optimized builds
- Code splitting (automatic)
- Tree shaking
- Minification and compression

**Additional steps:**

```bash
# Build analysis
npm install -g vite-plugin-visualizer
# Add to vite.config.js:
// import { visualizer } from "rollup-plugin-visualizer";
// plugins: [visualizer()]
```

**Nginx compression:**

```nginx
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss;
```

### 2. Backend Optimization

**Node.js cluster mode:**

```bash
# Install cluster package
npm install node:cluster

# Or use PM2 cluster mode
pm2 start server.js -i max --name "raadhyam-api"
```

**Database indexing:**

```javascript
// Add indexes to frequently queried fields
userSchema.index({ email: 1 });
courseSchema.index({ category: 1, status: 1 });
```

**Caching strategy:**

```javascript
// Redis caching (optional)
npm install redis

// Cache course list (30 minutes)
const cachedCourses = await redis.get('courses_list');
```

### 3. Image Optimization

Cloudinary automatically handles:

- Format conversion (WebP, AVIF)
- Responsive sizes
- Lazy loading
- CDN distribution

Use responsive images:

```html
<img src="image.jpg?w=800&q=auto,f_auto" alt="Description" />
```

### 4. Database Query Optimization

**Use lean() for read-only queries:**

```javascript
// Faster - no Mongoose overhead
const courses = await Course.find().lean();
```

**Use select() to limit fields:**

```javascript
// Only get necessary fields
const users = await User.find().select("name email role");
```

**Use indexes:**

```javascript
userSchema.index({ email: 1 });
courseSchema.index({ "instructor._id": 1, status: 1 });
```

## 📊 Monitoring & Alerts

### 1. Error Tracking (Sentry)

```bash
npm install @sentry/node
```

```javascript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### 2. Logging (Winston)

```bash
npm install winston
```

```javascript
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});
```

### 3. Health Checks

Already configured at `/api/health`:

```json
{
  "success": true,
  "message": "Server is healthy",
  "timestamp": "2024-01-15T10:30:45.123Z",
  "environment": "production",
  "uptime": 86400
}
```

Set up monitoring:

```bash
# Uptime monitoring service (uptime robot, etc.)
# Check endpoint every 5 minutes
curl https://api.yourdomain.com/api/health
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "18"

      - name: Backend Tests & Build
        run: |
          cd Backend
          npm install
          npm run build 2>/dev/null || true

      - name: Frontend Tests & Build
        run: |
          cd Frontend
          npm install
          npm run build

      - name: Deploy Backend
        run: |
          # Add deployment script here
          echo "Deploying backend..."

      - name: Deploy Frontend
        run: |
          # Add deployment script here
          echo "Deploying frontend..."
```

## 📋 Pre-Launch Checklist

### Code Quality

- [ ] No console.log statements in production code
- [ ] Error handling on all endpoints
- [ ] Input validation on all routes
- [ ] No hardcoded secrets
- [ ] ESLint passing without warnings

### Security

- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Rate limiting active
- [ ] Security headers enabled
- [ ] Database credentials secure
- [ ] API keys rotated
- [ ] Admin password changed

### Performance

- [ ] Frontend builds successfully
- [ ] Bundle size analyzed
- [ ] Database indexes created
- [ ] CDN configured (for static files)
- [ ] Compression enabled
- [ ] Caching headers set

### Testing

- [ ] User signup flow working
- [ ] Login with email/password working
- [ ] Google OAuth working
- [ ] File uploads working
- [ ] Admin dashboard functional
- [ ] All routes tested
- [ ] Error pages display properly

### Monitoring

- [ ] Logging configured
- [ ] Error tracking setup
- [ ] Health check endpoint working
- [ ] Uptime monitoring configured
- [ ] Alerts configured

## 🆘 Incident Response

### API Down

1. Check process: `pm2 status`
2. Check logs: `pm2 logs raadhyam-api`
3. Check database: `mongo <connection-string>`
4. Restart: `pm2 restart raadhyam-api`

### High CPU Usage

1. Check what's running: `top`
2. Check Node process: `ps aux | grep node`
3. Check database connections: `db.currentOp()`
4. Restart if needed: `pm2 restart raadhyam-api`

### Database Connection Failed

1. Check MongoDB Atlas status
2. Verify connection string
3. Check IP whitelist
4. Test connection: `mongo <connection-string>`

### Out of Storage

1. Check disk usage: `df -h`
2. Check log sizes: `du -sh /home/logs/*`
3. Rotate logs: Configure logrotate
4. Move old files to archive

## 📞 Support Contacts

- **MongoDB Support**: https://support.mongodb.com
- **Cloudinary Support**: https://support.cloudinary.com
- **Brevo Support**: https://www.brevo.com/support/
- **Node.js**: https://nodejs.org/en/download/
- **Your Hosting Provider**: Check documentation
