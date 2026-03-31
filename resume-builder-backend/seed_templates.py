import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from resumes.models import Template

def seed_templates():
    templates = [
        {
            'name': 'Modern Sidebar',
            'slug': 'modern',
            'category': 'Professional',
            'description': 'A clean, two-column layout with a left sidebar for contact & skills.',
            'content': {}
        },
        {
            'name': 'Classic Corporate',
            'slug': 'classic',
            'category': 'Professional',
            'description': 'Traditional single-column layout suitable for conservative industries.',
            'content': {}
        },
        {
            'name': 'Executive Suite',
            'slug': 'executive',
            'category': 'Two-Column',
            'description': 'Balanced two-column design with a focus on experience and impact.',
            'content': {}
        },
        {
            'name': 'Creative Edge',
            'slug': 'creative',
            'category': 'Creative',
            'description': 'Bold colors and unique typography for creative roles.',
            'content': {}
        },
        {
            'name': 'Minimalist',
            'slug': 'minimal',
            'category': 'Minimal',
            'description': 'Stripped back design that lets your accomplishments speak for themselves.',
            'content': {}
        },
        {
            'name': 'Tech Stack',
            'slug': 'tech',
            'category': 'Professional',
            'description': 'Designed specifically for software engineers and data scientists.',
            'content': {}
        },
        {
            'name': 'Elegant Serif',
            'slug': 'elegant',
            'category': 'Minimal',
            'description': 'Sophisticated serif typography for a high-end, polished look.',
            'content': {}
        },
        {
            'name': 'Compact One-Page',
            'slug': 'compact',
            'category': 'Minimal',
            'description': 'Ideal for early-career professionals needing to fit everything on one page.',
            'content': {}
        }
    ]

    for t_data in templates:
        template, created = Template.objects.update_or_create(
            slug=t_data['slug'],
            defaults=t_data
        )
        if created:
            print(f"Created template: {template.name}")
        else:
            print(f"Updated template: {template.name}")

if __name__ == '__main__':
    seed_templates()
