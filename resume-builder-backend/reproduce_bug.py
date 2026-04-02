import os
import django
import copy

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from resumes.models import Template, Resume
from django.contrib.auth.models import User
from resumes.serializers import ResumeSerializer

def reproduce():
    try:
        user = User.objects.first()
        if not user:
            user = User.objects.create_user(username='testrepro', password='password123')
            
        template = Template.objects.first()
        if not template:
            print("No templates found in DB. Please seed them.")
            return

        print(f"Testing with Template: {template.name} (ID: {template.id})")
        
        cloned_content = copy.deepcopy(template.content) if template.content else {}
        
        print("Attempting to create Resume...")
        resume = Resume.objects.create(
            user=user,
            title=f"{template.name} Resume",
            template=template,
            content=cloned_content,
        )
        print(f"Successfully created Resume ID: {resume.id}")
        
        print("Attempting to serialize...")
        data = ResumeSerializer(resume).data
        print("Serialized data successfully.")
        
    except Exception as e:
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    reproduce()
