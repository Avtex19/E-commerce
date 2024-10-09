from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterUserSerializer
from rest_framework import status


@api_view(['GET'])
def getRoutes(request):
    routes = [
        '',
    ]
    return Response(routes)


@api_view(['POST'])
def userRegisterView(request):
    if request.method == 'POST':
        print(request)
        serializer = RegisterUserSerializer(data=request.data)
        data = {}
        if serializer.is_valid():
            account = serializer.save()
            data['response'] = 'Account has been created'
            data['username'] = account.username
            data['email'] = account.email

            # Generate JWT tokens
            refresh = RefreshToken.for_user(account)
            data['token'] = {
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            }

        else:
            data = serializer.errors
        return Response(data)


class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)
