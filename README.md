# Job Portal / Internship Finder - Full Stack Application

A comprehensive job portal and internship finder built with React.js frontend and Django backend, using MySQL database.

## Features

### User Roles
- **Job Seekers**: Browse jobs, apply, save jobs, track applications
- **Employers**: Post jobs, manage applications, view statistics
- **Admin**: User management, job moderation, platform statistics

### Key Features
- User authentication (Email/Password + Social Login with Google/Facebook)
- Job/Internship posting and search with advanced filters
- Application management with status tracking
- Resume upload for job seekers
- Company profiles for employers
- Email notifications for applications
- Responsive design for mobile and desktop

### Frontend
- React.js 18
- React Router DOM
- Axios for API calls
- Context API for state management
- CSS3 for styling

### Backend
- Python 3.x
- Django 4.2
- Django REST Framework
- JWT Authentication
- Django Allauth for social authentication
- MySQL Database


1. **Job Seekers**:
   - Register/Login
   - Complete profile and upload resume
   - Browse and search jobs
   - Save jobs and apply
   - Track application status

2. **Employers**:
   - Register/Login
   - Complete company profile
   - Post jobs/internships
   - View and manage applications
   - Update application status

3. **Admin**:
   - Access admin dashboard
   - Manage users
   - Moderate job postings
   - View platform statistics
- Configure email settings in `.env` for email notifications
- Media files (resumes, logos) are stored in `backend/media/` directory
