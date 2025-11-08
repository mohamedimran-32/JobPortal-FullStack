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

## Tech Stack

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

## Project Structure

```
job-portal/
├── backend/                 # Django backend
│   ├── jobportal/          # Main Django project
│   ├── accounts/           # User authentication & profiles
│   ├── jobs/               # Job/internship management
│   ├── applications/       # Application handling
│   ├── manage.py
│   └── requirements.txt
├── frontend/               # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── context/       # Auth context
│   │   └── utils/         # Utilities
│   ├── package.json
│   └── package-lock.json
└── README.md
```

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create and activate virtual environment:
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create MySQL database:
```sql
CREATE DATABASE jobportal_db;
```

5. Create `.env` file in backend directory (copy from `.env.example`):
```
SECRET_KEY=your-secret-key-here
DEBUG=True
DB_NAME=jobportal_db
DB_USER=root
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=3306

# Social Auth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=noreply@jobportal.com
```

6. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

7. Create superuser:
```bash
python manage.py createsuperuser
```

8. Run development server:
```bash
python manage.py runserver
```

Backend will run on `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login user
- `POST /api/auth/logout/` - Logout user
- `GET /api/auth/user/` - Get current user

### Profiles
- `GET /api/profiles/jobseeker/` - Get job seeker profile
- `PATCH /api/profiles/jobseeker/` - Update job seeker profile
- `GET /api/profiles/employer/` - Get employer profile
- `PATCH /api/profiles/employer/` - Update employer profile

### Jobs
- `GET /api/jobs/` - List all jobs
- `POST /api/jobs/` - Create new job
- `GET /api/jobs/{id}/` - Get job details
- `PUT /api/jobs/{id}/` - Update job
- `DELETE /api/jobs/{id}/` - Delete job
- `GET /api/jobs/search/` - Search jobs with filters
- `POST /api/jobs/{id}/save/` - Save job
- `GET /api/jobs/saved/` - Get saved jobs

### Applications
- `GET /api/applications/` - List applications
- `POST /api/applications/create/` - Create application
- `GET /api/applications/{id}/` - Get application details
- `PUT /api/applications/{id}/update-status/` - Update application status
- `GET /api/applications/job/{job_id}/` - Get applications for a job

### Admin
- `GET /api/admin/stats/` - Get dashboard statistics
- `GET /api/admin/users/` - Get all users
- `PUT /api/admin/jobs/{id}/moderate/` - Moderate job

## Usage

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

## Notes

- Make sure MySQL server is running before starting the backend
- Configure social auth credentials in `.env` for Google/Facebook login
- Configure email settings in `.env` for email notifications
- Media files (resumes, logos) are stored in `backend/media/` directory

## License

This project is open source and available for educational purposes.

