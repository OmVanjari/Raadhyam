# Raadhyam Portal - Quick Start Guide

Get your Raadhyam Portal up and running in minutes!

## 🚀 5-Minute Setup

### Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- MongoDB Atlas account ([Sign up free](https://www.mongodb.com/cloud/atlas))
- Git

### Step 1: Clone & Install

```bash
# Clone repository (if not already have it)
git clone <your-repo-url>
cd Raadhyam

# Backend setup
cd Backend
npm install

# Frontend setup
cd ../Frontend
npm install

cd ..
```

### Step 2: Configure Environment Variables

**Backend (.env)**

```bash
cp Backend/.env.example Backend/.env
```

Edit `Backend/.env` and update:

```
MONGODB_URL=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/raadhyam?retryWrites=true&w=majority
CLIENT_URL=http://localhost:5173
JWT_SECRET=<any-random-string-32-chars>
SESSION_SECRET=<any-random-string-32-chars>
```

**Frontend (.env.local)**

```bash
cp Frontend/.env.example Frontend/.env.local
```

Edit `Frontend/.env.local`:

```
VITE_API_URL=http://localhost:5000
```

### Step 3: Start Development Servers

**Terminal 1 - Backend:**

```bash
cd Backend
npm run dev
```

Expected output:

```
✅ All required environment variables are set
🔗 API Base URL: http://localhost:5000
✅ MongoDB connected successfully!
✅ Server is running on http://localhost:5000
```

**Terminal 2 - Frontend:**

```bash
cd Frontend
npm run dev
```

Expected output:

```
VITE v7.2.2  ready in 234 ms

➜  Local:   http://localhost:5173/
```

### Step 4: Create Admin User

```bash
cd Backend
npm run seed:admin
```

**Admin credentials:**

- Email: `admin@raadhyam.com`
- Password: `Admin@1234`

### Step 5: Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Admin Dashboard**: http://localhost:5173/dashboard/admin

Login with admin credentials above.

## ✅ Verification Checklist

```bash
# Run validation script
bash validate-production.sh
```

Or manually check:

- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:5173
- [ ] API health check: `curl http://localhost:5000/api/health`
- [ ] Admin login works
- [ ] Can create a course
- [ ] Can upload a file

## 📁 Project Structure

```
Raadhyam/
├── Backend/
│   ├── config/          # Database, Cloudinary, Passport
│   ├── controllers/     # Business logic
│   ├── middlewares/     # Auth, validation, error handling
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── utils/           # Helpers
│   ├── server.js        # Main server file
│   ├── seedAdmin.js     # Admin seeding
│   ├── package.json     # Dependencies
│   └── .env             # Environment variables
│
├── Frontend/
│   ├── src/
│   │   ├── AdminDashboard/   # Admin interface
│   │   ├── UserDashboard/    # User dashboard
│   │   ├── WelcomePages/     # Public pages
│   │   ├── Auth/             # Login/Register
│   │   ├── App.jsx           # Main app component
│   │   ├── main.jsx          # Entry point
│   │   └── axiosInterceptor.js
│   ├── package.json
│   ├── vite.config.js
│   └── .env.local
│
├── DEPLOYMENT.md         # Production deployment guide
├── PRODUCTION_SETUP.md   # Security & optimization
├── PROJECT_STATUS.md     # Detailed status report
└── validate-production.sh # Validation script
```

## 🔧 Common Tasks

### Create a New User

1. Go to http://localhost:5173/register
2. Fill in email, name, and password
3. Click Register

### Login

1. Go to http://localhost:5173/login
2. Use email and password
3. Or use Google Sign-In (if configured)

### Create a Course (Admin)

1. Login with admin credentials
2. Go to Courses in admin dashboard
3. Click "Add Course"
4. Fill in course details
5. Click Create

### Upload Media

1. In admin dashboard, go to the resource
2. Click upload button
3. Select file from computer
4. File uploads to Cloudinary automatically

## 🆘 Troubleshooting

### "MongoDB connection failed"

```bash
# Check MongoDB URL in Backend/.env
# Verify IP whitelist in MongoDB Atlas
# Test connection: npm run dev
```

### "Port already in use"

```bash
# Backend (5000)
lsof -i :5000
kill -9 <PID>

# Frontend (5173)
lsof -i :5173
kill -9 <PID>
```

### "CORS error"

```bash
# Make sure CLIENT_URL is set correctly in Backend/.env
# Should match frontend URL: http://localhost:5173
```

### "Module not found"

```bash
# Install missing dependencies
cd Backend && npm install
cd ../Frontend && npm install
```

### "Cannot find module 'axiosInterceptor'"

```bash
# Make sure main.jsx imports it
# File: Frontend/src/main.jsx line should have:
# import "./axiosInterceptor.js"
```

## 📚 API Examples

### Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "John Doe",
    "password": "SecurePass123"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
  }'
```

### Get All Courses

```bash
curl http://localhost:5000/api/courses
```

### Create Course (Admin)

```bash
curl -X POST http://localhost:5000/api/admin/courses \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Music Basics",
    "description": "Learn music fundamentals",
    "category": "Music",
    "level": "Beginner"
  }'
```

## 🔐 Security Notes

- Never commit `.env` files to git
- Change default admin password immediately
- Use strong JWT_SECRET (32+ random characters)
- Enable HTTPS in production
- Keep dependencies updated: `npm update`

## 📖 Additional Documentation

- **Deployment**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Production Setup**: See [PRODUCTION_SETUP.md](./PRODUCTION_SETUP.md)
- **Project Status**: See [PROJECT_STATUS.md](./PROJECT_STATUS.md)
- **Backend README**: See [Backend/README.md](./Backend/README.md) (if exists)
- **Frontend README**: See [Frontend/README.md](./Frontend/README.md) (if exists)

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the relevant documentation file
3. Check the console for error messages
4. Review MongoDB Atlas dashboard for connection issues
5. Check Cloudinary settings for file upload issues

## 🎓 Learning Resources

- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Atlas Guide](https://docs.atlas.mongodb.com/)
- [JWT Authentication](https://jwt.io/)
- [Cloudinary Upload Guide](https://cloudinary.com/documentation/upload_images)

## 📞 Next Steps

1. ✅ Complete this Quick Start
2. ✅ Run `bash validate-production.sh`
3. ✅ Customize branding and content
4. ✅ Add your own courses and content
5. ✅ Configure email service
6. ✅ Deploy to production (see DEPLOYMENT.md)

Happy coding! 🚀
