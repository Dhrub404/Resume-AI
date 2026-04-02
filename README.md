# 🚀 Resume AI: Intelligent Career Builder

Transform your professional narrative with **Resume AI**. A premium, AI-powered platform designed to help you craft, analyze, and optimize your resume with a modern, high-performance interactive experience.

---

## ✨ Features

- **three.js 3D UI**: A stunning, hardware-accelerated 3D login experience with a reactive starfield and magnetic card tilt.
- **AI Resume Analysis**: Get instant feedback on your resume using OpenAI to score your content and provide actionable improvement tips.
- **AI Writing Assistant**: Ask AI to rewrite bullet points, fix grammar, and enhance your professional impact directly in the builder.
- **Dynamic Template Selection**: Clone professional templates (Modern, Executive, Classic, etc.) to start your resume with a proven layout.
- **Live Interactive Preview**: Real-time visualization of your resume as you edit content and styles.
- **Glassmorphism Design**: A sleek, premium dashboard with modern blur effects, smooth transitions, and high-quality typography.

---

## 🛠 Tech Stack

### Frontend (React Ecosystem)
- **React 19 & Vite**: Ultra-fast development and optimized production builds.
- **Three.js & React Three Fiber**: Powers the interactive 3D Starfield background.
- **Framer Motion**: Handles all complex physics-based UI animations and transitions.
- **React Router 7**: Sophisticated client-side routing for seamless navigation.
- **Vanilla CSS**: Custom, high-performance styling with modern CSS variables.

### Backend (Django Ecosystem)
- **Django 6.0**: A robust, secure foundation for API development.
- **Django Rest Framework (DRF)**: Powers the RESTful API endpoints.
- **JWT Authentication**: Secure, stateless user authentication with SimpleJWT.
- **OpenAI API**: Integration of GPT-3.5/GPT-4 for intelligent resume optimization.
- **SQLite**: Local development database (easily portable to PostgreSQL).

---

## 📂 Project Structure

```text
C:\Resume AI\
├── resume-builder-backend/       # Django Backend Application
│   ├── core/                     # Project Settings & Root URLs
│   ├── resumes/                  # Main App (Models, Serializers, Views)
│   ├── accounts/                 # User Authentication & Profiles
│   ├── manage.py                 # Django Command-Line Utility
│   └── requirements.txt          # Python Dependency List
│
├── resumeai-frontend/            # React Frontend Application
│   ├── src/
│   │   ├── pages/                # Desktop Views (Login, Dashboard, Builder)
│   │   ├── components/           # UI Components (Layout, Sidebar, Modals)
│   │   ├── styles/               # Main Styling Logic (Auth, Dashboard)
│   │   ├── context/              # Global State (User, Theme)
│   │   ├── utils/                # Motion Variants & Constants
│   │   ├── api.js                # Integrated API Caller
│   │   └── App.jsx               # Root Application Router
│   ├── package.json              # Node.js Dependency List
│   └── vite.config.js            # Vite Environment Config
│
└── INSTALLATION.md               # Detailed Setup Guide
```

---

## 🚀 Getting Started

To get your local development environment running, please follow the detailed instructions in [INSTALLATION.md](./INSTALLATION.md).

---

## 🛠 Authors & Acknowledgments

- Built with ❤️ for developers and job seekers.
- Special thanks to the Three.js and Framer Motion communities for inspiration.
