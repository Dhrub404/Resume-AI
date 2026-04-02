from django.core.management.base import BaseCommand
from resumes.models import Template

class Command(BaseCommand):
    help = 'Seed initial professional resume templates'

    def handle(self, *args, **kwargs):
        if Template.objects.exists():
            self.stdout.write(self.style.WARNING('Templates already exist in database. Skipping seeding.'))
            return

        templates = [
            {
                "name": "Modern Minimalist",
                "slug": "modern",
                "category": "Minimal",
                "description": "A clean, high-contrast design focusing on readability and modern typography.",
                "content": {
                    "resumeStyle": {
                        "layout": "single",
                        "primaryColor": "#4F6EF7",
                        "fontFamily": "'Inter', sans-serif"
                    }
                }
            },
            {
                "name": "Classic Corporate",
                "slug": "classic",
                "category": "Professional",
                "description": "The traditional gold standard for finance, law, and corporate roles.",
                "content": {
                    "resumeStyle": {
                        "layout": "single",
                        "primaryColor": "#1e293b",
                        "fontFamily": "'Merriweather', serif"
                    }
                }
            },
            {
                "name": "Executive Leadership",
                "slug": "executive",
                "category": "Professional",
                "description": "A sophisticated two-column layout tailored for senior management and leaders.",
                "content": {
                    "resumeStyle": {
                        "layout": "right-sidebar",
                        "primaryColor": "#1e293b",
                        "fontFamily": "'Inter', sans-serif"
                    }
                }
            },
            {
                "name": "Creative Portfolio",
                "slug": "creative",
                "category": "Creative",
                "description": "A vibrant and bold layout for designers, marketer, and creative professionals.",
                "content": {
                    "resumeStyle": {
                        "layout": "left-sidebar",
                        "primaryColor": "#059669",
                        "fontFamily": "'Outfit', sans-serif"
                    }
                }
            }
        ]

        for t_data in templates:
            Template.objects.create(**t_data)
        
        self.stdout.write(self.style.SUCCESS(f'Successfully seeded {len(templates)} templates.'))
