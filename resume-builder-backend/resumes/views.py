import json
from django.http import HttpResponse
from django.template.loader import render_to_string
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

    @action(detail=True, methods=['post'])
    def ask_ai(self, request, pk=None):
        """
        Accepts a user prompt and the current resume content,
        returns an array of AI suggestions in the frontend's expected format.
        """
        resume = self.get_object()
        content = resume.content
        user_prompt = request.data.get("prompt", "")
        api_key = os.getenv("OPENAI_API_KEY")

        if not api_key:
            return Response({"error": "OpenAI API key missing."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        if not user_prompt:
            return Response({"error": "Please provide a prompt."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            client = openai.OpenAI(api_key=api_key)
            system_prompt = (
                "You are a professional resume writing assistant. "
                "The user will give you their resume data as JSON and an instruction. "
                "Return ONLY a valid JSON array of suggestion objects. Each object must have: "
                "'type' (one of 'improve', 'fix', or 'good'), "
                "'typeLabel' (one of 'Improve', 'Fix Grammar', or 'Strong'), "
                "'original' (the original text being improved, or null if type is 'good'), "
                "'improved' (the improved text or positive feedback). "
                "Return 2-4 suggestions. Do NOT include any markdown or explanation, only the JSON array."
            )

            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Resume Data: {json.dumps(content)}\n\nInstruction: {user_prompt}"}
                ],
                max_tokens=600
            )

            raw = response.choices[0].message.content
            # Try to parse the response as JSON
            try:
                suggestions = json.loads(raw)
            except json.JSONDecodeError:
                suggestions = [{"type": "improve", "typeLabel": "Improve", "original": None, "improved": raw}]

            return Response({"suggestions": suggestions}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['get'])
    def export_pdf(self, request, pk=None):
        """
        Renders the resume content into an HTML template and converts it
        to a downloadable PDF using WeasyPrint.
        """
        resume = self.get_object()
        content = resume.content or {}

        # Parse skills into a list
        skills_raw = content.get('skills', '')
        skills_list = [s.strip() for s in skills_raw.split(',') if s.strip()] if isinstance(skills_raw, str) else skills_raw

        context = {
            'name': content.get('name', 'Untitled'),
            'role': content.get('role', ''),
            'email': content.get('email', ''),
            'phone': content.get('phone', ''),
            'city': content.get('city', ''),
            'linkedin': content.get('linkedin', ''),
            'jobTitle': content.get('jobTitle', ''),
            'company': content.get('company', ''),
            'duration': content.get('duration', ''),
            'description': content.get('description', ''),
            'skills': skills_list,
            'resume_title': resume.title,
        }

        html_string = render_to_string('resumes/pdf_base.html', context)

        try:
            from weasyprint import HTML
            pdf_bytes = HTML(string=html_string).write_pdf()
        except Exception as e:
            return Response({"error": f"PDF generation failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        response = HttpResponse(pdf_bytes, content_type='application/pdf')
        safe_title = resume.title.replace(' ', '_')
        response['Content-Disposition'] = f'attachment; filename="{safe_title}.pdf"'
        return response
