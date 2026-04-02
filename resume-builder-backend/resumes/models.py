from django.db import models
from django.contrib.auth.models import User

class Template(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    slug = models.SlugField(unique=True)
    category = models.CharField(max_length=50, default='Professional')
    # The blueprint content — this NEVER gets modified by users
    content = models.JSONField(default=dict, blank=True)
    
    def __str__(self):
        return self.name

class Resume(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='resumes')
    title = models.CharField(max_length=200, default='Untitled Resume')
    template = models.ForeignKey(Template, on_delete=models.SET_NULL, null=True, blank=True)
    content = models.JSONField(default=dict, blank=True)
    score = models.IntegerField(default=0)
    status = models.CharField(
        max_length=10,
        choices=[('TEMP', 'Temporary'), ('DRAFT', 'Draft'), ('PUBLISHED', 'Published')],
        default='TEMP'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} ({self.user.username})"
