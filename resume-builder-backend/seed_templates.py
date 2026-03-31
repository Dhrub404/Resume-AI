"""
Seed script to populate the Template table with the 8 frontend templates.
Run with: python manage.py shell < seed_templates.py
"""
import os, sys, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
sys.path.insert(0, os.path.dirname(__file__))
django.setup()

from resumes.models import Template

# Default sample data that appears when a user opens any template
SAMPLE_DATA = {
    "personalInfo": {
        "fullName": "John Doe",
        "jobTitle": "Senior Software Engineer",
        "email": "john.doe@example.com",
        "phone": "+1 (555) 000-1234",
        "city": "San Francisco, CA",
        "linkedin": "johndoe",
        "portfolio": "johndoe.dev"
    },
    "summary": "Results-driven Senior Software Engineer with 8+ years of experience in building scalable web applications. Proficient in React, Node.js, and cloud architecture. Proven track record of leading cross-functional teams and delivering high-impact technical solutions.",
    "experiences": [
        {
            "jobTitle": "Senior Software Engineer",
            "company": "Tech Solutions Inc.",
            "startDate": "Jan 2020",
            "endDate": "Present",
            "current": True,
            "description": "• Led the development of a high-traffic e-commerce platform using React and Node.js.\n• Optimized database queries, reducing API latency by 40%.\n• Mentored junior developers and implemented CI/CD best practices."
        },
        {
            "jobTitle": "Software Engineer",
            "company": "Creative Apps LLC",
            "startDate": "Jun 2016",
            "endDate": "Dec 2019",
            "current": False,
            "description": "• Developed and maintained multiple client-facing web applications.\n• Collaborated with designers to implement responsive and intuitive user interfaces.\n• Improved application performance by 25% through code refactor and caching strategies."
        }
    ],
    "education": [
        {
            "degree": "B.S. in Computer Science",
            "university": "State University",
            "startYear": "2012",
            "endYear": "2016",
            "details": "GPA: 3.8/4.0"
        }
    ],
    "skills": ["React", "JavaScript", "TypeScript", "Node.js", "Python", "AWS", "Docker", "SQL", "Git"],
    "languages": [
        {"name": "English", "proficiency": "Native / Bilingual"},
        {"name": "Spanish", "proficiency": "Professional Working"}
    ],
    "interests": ["Open Source", "Photography", "Hiking"]
}

TEMPLATES = [
    {
        "name": "Modern",
        "slug": "modern",
        "description": "Clean with blue accents",
        "category": "Professional",
        "style": {
            "primaryColor": "#4F6EF7",
            "secondaryColor": "#64748b",
            "fontFamily": "'Inter', sans-serif",
            "headingFont": "'Inter', sans-serif",
            "fontSize": 10,
            "layout": "single",
            "headerAlign": "centered",
            "sectionStyle": "default",
            "skillStyle": "tags",
            "dividerStyle": "solid"
        }
    },
    {
        "name": "Classic",
        "slug": "classic",
        "description": "Traditional & timeless",
        "category": "Professional",
        "style": {
            "primaryColor": "#1e293b",
            "secondaryColor": "#94a3b8",
            "fontFamily": "'Georgia', serif",
            "headingFont": "'Georgia', serif",
            "fontSize": 10,
            "layout": "single",
            "headerAlign": "left",
            "sectionStyle": "default",
            "skillStyle": "tags",
            "dividerStyle": "solid"
        }
    },
    {
        "name": "Executive",
        "slug": "executive",
        "description": "Two-column bold layout",
        "category": "Two-Column",
        "style": {
            "primaryColor": "#1e293b",
            "secondaryColor": "#475569",
            "fontFamily": "'Inter', sans-serif",
            "headingFont": "'Inter', sans-serif",
            "fontSize": 10,
            "layout": "left-sidebar",
            "headerAlign": "centered",
            "sectionStyle": "card",
            "skillStyle": "progress",
            "dividerStyle": "none"
        }
    },
    {
        "name": "Creative",
        "slug": "creative",
        "description": "Bold green accents",
        "category": "Creative",
        "style": {
            "primaryColor": "#059669",
            "secondaryColor": "#6ee7b7",
            "fontFamily": "'Inter', sans-serif",
            "headingFont": "'Inter', sans-serif",
            "fontSize": 10,
            "layout": "single",
            "headerAlign": "centered",
            "sectionStyle": "default",
            "skillStyle": "tags",
            "dividerStyle": "dashed",
            "headerBanner": True
        }
    },
    {
        "name": "Minimal",
        "slug": "minimal",
        "description": "Ultra clean, no color",
        "category": "Minimal",
        "style": {
            "primaryColor": "#334155",
            "secondaryColor": "#94a3b8",
            "fontFamily": "'Inter', sans-serif",
            "headingFont": "'Inter', sans-serif",
            "fontSize": 10,
            "layout": "single",
            "headerAlign": "left",
            "sectionStyle": "default",
            "skillStyle": "tags",
            "dividerStyle": "solid"
        }
    },
    {
        "name": "Tech",
        "slug": "tech",
        "description": "Dark sidebar, modern",
        "category": "Two-Column",
        "style": {
            "primaryColor": "#4F6EF7",
            "secondaryColor": "#1e293b",
            "fontFamily": "'JetBrains Mono', monospace",
            "headingFont": "'Inter', sans-serif",
            "fontSize": 9,
            "layout": "left-sidebar",
            "headerAlign": "left",
            "sectionStyle": "default",
            "skillStyle": "dots",
            "dividerStyle": "dotted"
        }
    },
    {
        "name": "Elegant",
        "slug": "elegant",
        "description": "Serif fonts, classic feel",
        "category": "Professional",
        "style": {
            "primaryColor": "#92400e",
            "secondaryColor": "#d97706",
            "fontFamily": "'Playfair Display', serif",
            "headingFont": "'Playfair Display', serif",
            "fontSize": 10,
            "layout": "single",
            "headerAlign": "centered",
            "sectionStyle": "default",
            "skillStyle": "tags",
            "dividerStyle": "solid",
            "bgColor": "#fffbf7"
        }
    },
    {
        "name": "Compact",
        "slug": "compact",
        "description": "Fits more in one page",
        "category": "Minimal",
        "style": {
            "primaryColor": "#7c3aed",
            "secondaryColor": "#a78bfa",
            "fontFamily": "'Inter', sans-serif",
            "headingFont": "'Inter', sans-serif",
            "fontSize": 9,
            "lineSpacing": 1.3,
            "layout": "single",
            "headerAlign": "left",
            "sectionStyle": "default",
            "skillStyle": "tags",
            "dividerStyle": "solid",
            "sectionSpacing": 8,
            "padding": 6
        }
    },
]

for t in TEMPLATES:
    # Merge the sample data with the template-specific style
    content = {**SAMPLE_DATA, "resumeStyle": t["style"]}
    
    Template.objects.update_or_create(
        slug=t["slug"],
        defaults={
            "name": t["name"],
            "description": t["description"],
            "category": t["category"],
            "content": content,
        }
    )
    print(f"✅ {t['name']} template ready (with sample data)")

print(f"\nDone! {Template.objects.count()} templates in database.")
