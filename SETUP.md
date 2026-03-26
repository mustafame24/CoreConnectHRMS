# CoreConnect HRMS - Setup & Installation Guide

This guide provides step-by-step instructions for cloning and running the CoreConnect HRMS project locally.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Python**: 3.9 or higher (verify with `python --version`)
- **Node.js & npm**: 16.0 or higher (verify with `node --version` and `npm --version`)
- **Git**: For cloning the repository
- **A terminal/command prompt**: PowerShell, Command Prompt, or similar

### Verify Prerequisites

```bash
python --version
node --version
npm --version
git --version
```

---

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd CoreConnectHRMS
```

### 2. Backend Setup (Django)

#### Step 2.1: Create a Virtual Environment

```bash
# Windows Command Prompt
python -m venv venv

# Windows PowerShell
python -m venv venv
```

#### Step 2.2: Activate the Virtual Environment

```bash
# Windows Command Prompt
venv_fixed\Scripts\activate

# Windows PowerShell
.\venv_fixed\Scripts\Activate.ps1
```

**Note**: On PowerShell, you may need to allow script execution. If you get an error, run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### Step 2.3: Install Backend Dependencies

With the virtual environment activated:

```bash
pip install Django==6.0.3
pip install djangorestframework==3.17.1
pip install django-cors-headers==4.9.0
pip install PyJWT==2.12.1
```

Or install all at once:

```bash
pip install Django==6.0.3 djangorestframework==3.17.1 django-cors-headers==4.9.0 PyJWT==2.12.1
```

#### Step 2.4: Apply Database Migrations

```bash
python manage.py migrate
```

This creates the SQLite database (`db.sqlite3`) and sets up all required tables.

#### Step 2.5: Create an Admin User (Optional but Recommended)

```bash
python manage.py createsuperuser
```

Follow the prompts to create an admin account. You'll use these credentials to access the Django admin panel at `http://localhost:8000/admin`.

Alternatively, use the provided script:
```bash
python create_admin_user.py
```

#### Step 2.6: Start the Backend Server

```bash
python manage.py runserver
```

The API will be available at **http://localhost:8000**

---

### 3. Frontend Setup (React + Vite)

#### Step 3.1: Navigate to Frontend Directory

Open a **new terminal window** (keep the backend running in the original terminal):

```bash
cd coreconnect-frontend
```

#### Step 3.2: Install JavaScript Dependencies

```bash
npm install
```

This installs all required packages including:
- React 19.2.0
- Vite 7.2.4
- React Router DOM 7.9.6
- Axios 1.13.2
- Lucide React 0.554.0

#### Step 3.3: Start the Development Server

```bash
npm run dev
```

The frontend will be available at **http://localhost:5173**

---

## Running the Complete Application

To run the full application, keep **both servers running**:

1. **Terminal 1 (Backend)**
   ```bash
   cd CoreConnectHRMS
   .\venv_fixed\Scripts\Activate.ps1  # or: venv_fixed\Scripts\activate (cmd)
   python manage.py runserver
   ```

2. **Terminal 2 (Frontend)**
   ```bash
   cd CoreConnectHRMS\coreconnect-frontend
   npm run dev
   ```

3. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - Django Admin: http://localhost:8000/admin

---

## Project Architecture

### Backend (Django REST Framework)
- **Location**: `./` (root)
- **Port**: 8000
- **Database**: SQLite (`db.sqlite3`)
- **API**: RESTful endpoints under `/api`

**Installed Packages**:
- Django 6.0.3
- Django REST Framework 3.17.1
- django-cors-headers 4.9.0
- PyJWT 2.12.1

### Frontend (React + Vite)
- **Location**: `./coreconnect-frontend`
- **Port**: 5173
- **Build Tool**: Vite
- **Package Manager**: npm

**Key Dependencies**:
- React 19.2.0
- React Router DOM 7.9.6
- Axios 1.13.2
- Lucide React 0.554.0 (for icons)

---

## Useful Commands

### Backend Commands
```bash
# Activate virtual environment
.\venv_fixed\Scripts\Activate.ps1

# Run development server
python manage.py runserver

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run shell
python manage.py shell

# Collect static files (for production)
python manage.py collectstatic
```

### Frontend Commands
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

## Troubleshooting

### Backend Issues

**1. Virtual Environment Activation Fails (PowerShell)**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\venv\Scripts\Activate.ps1
```

**2. Module Not Found Errors**
- Ensure virtual environment is activated
- Verify all packages installed: `pip list`
- Reinstall: `pip install -r requirements.txt` (if available)

**3. Database Errors**
```bash
# Reset database (WARNING: deletes all data)
rm db.sqlite3
python manage.py migrate
python manage.py createsuperuser
```

**4. CORS Issues**
- Ensure frontend URL is allowed in Django settings
- Default CORS is configured in `coreconnect_backend/settings.py`

### Frontend Issues

**1. npm install Fails**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock.json
rm -r node_modules
rm package-lock.json

# Reinstall
npm install
```

**2. Port Already in Use**
- Change Vite port in `vite.config.js`: `port: 5174`
- Or kill the process using the port

**3. API Connection Issues**
- Verify backend is running on http://localhost:8000
- Check API endpoint URLs in `.jsx` files
- Verify CORS configuration in `coreconnect_backend/settings.py`

---

## Environment Variables

Create a `.env` file in the frontend directory if needed:

```bash
cd coreconnect-frontend
touch .env
```

Add environment variables as needed (e.g., API base URL).

---

## Database Management

### View Database Content
```bash
# Use Django shell
python manage.py shell

# Example: View users
>>> from django.contrib.auth.models import User
>>> User.objects.all()
```

### Reset Database
```bash
# Remove database file
rm db.sqlite3

# Reapply migrations
python manage.py migrate

# Create new admin user
python manage.py createsuperuser
```

---

## Production Deployment

For production deployment, refer to Django and Vite documentation:
- Django: https://docs.djangoproject.com/en/6.0/howto/deployment/
- Vite: https://vitejs.dev/guide/build.html

---

## Support & Documentation

- **Django Documentation**: https://docs.djangoproject.com/
- **DRF Documentation**: https://www.django-rest-framework.org/
- **React Documentation**: https://react.dev/
- **Vite Documentation**: https://vitejs.dev/

---

## Next Steps

1. ✅ Follow the installation steps above
2. ✅ Verify both backend and frontend are running
3. ✅ Log in with admin credentials (if created)
4. ✅ Explore the HR management features
5. ✅ Check `[MUST READ]` documentation files for project details

---

**Last Updated**: March 26, 2026
