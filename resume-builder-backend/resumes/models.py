from django.db import models
from django.contrib.auth.models import User

class Template(models.Model):
    # Depending on how the frontend tracks templates, usually it's just an ID or string. 
    # For simplicity, we just store it as a choice or a simple model if there are image previews.
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    slug = models.SlugField(unique=True)
    
    def __str__(self):
        return self.name

class Resume(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='resumes')
    title = models.CharField(max_length=200, default='Untitled Resume')
    template = models.ForeignKey(Template, on_delete=models.SET_NULL, null=True, blank=True)
    content = models.JSONField(default=dict, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} ({self.user.username})"
