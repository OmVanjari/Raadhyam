# Frontend-Backend Connection Fix Checklist

## Critical Issues to Fix:
- [ ] 1. StudentPage.jsx - Replace dummy data with API calls
- [ ] 2. UsersPage.jsx - Replace placeholder rows with real data
- [ ] 3. WelcomePages/CoursesPage.jsx - Replace hardcoded courses
- [ ] 4. UserProfilePage.jsx - Fix logout token key mismatch
- [ ] 5. UserDashboardHome.jsx - Fix hardcoded stats

## Data Structure Fixes:
- [ ] 6. AdminMain.jsx - Fix music notes response handling (data vs notes)
- [ ] 7. Standardize response handling across all files

## Backend APIs to Use (Existing Only):
- GET /api/admin/users - Fetch all users
- GET /api/admin/users/:id - Fetch user by ID
- GET /api/courses - Fetch public courses
- GET /api/admin/courses - Fetch admin courses
