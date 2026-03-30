from rest_framework.views import APIView
from rest_framework.response import Response

class RegisterView(APIView):
    def post(self, request):
        return Response({"message": "Register endpoint working!"})

class ProfileView(APIView):
    def get(self, request):
        return Response({"message": "Profile endpoint working!"})
