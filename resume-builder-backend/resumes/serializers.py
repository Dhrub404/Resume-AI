from rest_framework import serializers
from .models import Resume, Template

class TemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Template
        fields = '__all__'

class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = ('id', 'title', 'template', 'content', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

    def create(self, validated_data):
        # Automatically attach the user logged in
        request = self.context.get("request")
        validated_data['user'] = request.user
        return super().create(validated_data)
