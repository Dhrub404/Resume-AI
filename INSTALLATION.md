# Project Installation Guide

This guide provides step-by-step instructions for setting up both the **Backend** (Django) and **Frontend** (React/Vite) applications.

---

## 🐍 Backend Setup (Django)

The backend is located in the `resume-builder-backend/` directory.

### 1. Create a Virtual Environment
```bash
cd resume-builder-backend
python -m venv venv
```

### 2. Activate the Virtual Environment
- **Windows:**
  ```powershell
  .\venv\Scripts\activate
  ```
- **macOS/Linux:**
  ```bash
  source venv/bin/activate
  ```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Database Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Seed Initial Data (Optional)
```bash
# Only run this if the database is empty or needs template data
python seed_templates.py
```

### 6. Run the Server
```bash
python manage.py runserver
```
The backend will be available at `http://127.0.0.1:8000/`.

---

## ⚛️ Frontend Setup (React + Vite)

The frontend is located in the `resumeai-frontend/` directory.

### 1. Navigate to Frontend Directory
```bash
cd resumeai-frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Development Server
```bash
npm run dev
```
The frontend will be available at `http://localhost:5173/`.

---

## 🛠 Troubleshooting

- **Environment Variables**: Ensure you have a `.env` file in the `resume-builder-backend/` directory with your `OPENAI_API_KEY` and other necessary configurations.
- **Node Version**: Ensure you are using a modern version of Node.js (v18+ recommended).
- **Python Version**: Python 3.10+ is recommended.
