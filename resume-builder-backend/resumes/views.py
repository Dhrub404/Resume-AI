from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Resume, Template
from .serializers import ResumeSerializer, TemplateSerializer
import openai
import os

class TemplateViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Template.objects.all()
    serializer_class = TemplateSerializer
    permission_classes = [IsAuthenticated]

class ResumeViewSet(viewsets.ModelViewSet):
    serializer_class = ResumeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Users should only see their own resumes
        return Resume.objects.filter(user=self.request.user)

    @action(detail=True, methods=['post'])
    def analyze(self, request, pk=None):
        resume = self.get_object()
        content = resume.content
        api_key = os.getenv("OPENAI_API_KEY")
        
        if not api_key:
            return Response({"error": "OpenAI API key missing."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        try:
            client = openai.OpenAI(api_key=api_key)
            prompt = f"Analyze the following resume JSON and provide a score out of 100 and 3 actionable tips for improvement. Structure output as JSON containing 'score' and 'tips' (array of strings).\n\nResume Data: {content}"
            
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=300
            )
            
            analysis = response.choices[0].message.content
            return Response({"analysis": analysis}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
