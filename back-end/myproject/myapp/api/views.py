from django.utils import timezone
from drf_yasg.utils import swagger_auto_schema
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import RegisterUserSerializer, LoginUserSerializer, UserSerializer, AccountUpdateSerializer
from rest_framework import status, generics, viewsets, filters
from drf_yasg import openapi


@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/register',
        '/login',
        '/logout',
        '/password/reset',
        '/category',
        '/category/product',
        '/products',

    ]
    return Response(routes)


class UserRegisterView(APIView):
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'username': openapi.Schema(type=openapi.TYPE_STRING, description='Username'),
                'email': openapi.Schema(type=openapi.TYPE_STRING, description='Email'),
                'password': openapi.Schema(type=openapi.TYPE_STRING, description='Password', format='password'),
                'password2': openapi.Schema(type=openapi.TYPE_STRING, description='Password', format='password'),

            },
            required=['username', 'email', 'password', 'password2'],
        ),
        responses={
            201: openapi.Response('Account has been created, JWT token included', openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'response': openapi.Schema(type=openapi.TYPE_STRING),
                    'username': openapi.Schema(type=openapi.TYPE_STRING),
                    'email': openapi.Schema(type=openapi.TYPE_STRING),
                    'token': openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'refresh': openapi.Schema(type=openapi.TYPE_STRING),
                            'access': openapi.Schema(type=openapi.TYPE_STRING),
                        }
                    ),
                }
            )),
            400: 'Invalid input data'
        }
    )
    def post(self, request):
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

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'refresh_token': openapi.Schema(type=openapi.TYPE_STRING, description='JWT refresh token'),
            },
            required=['refresh_token'],
        ),
        responses={
            205: 'Token successfully blacklisted (Reset Content)',
            400: 'Bad request (Invalid or missing refresh token)',
        }
    )
    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(APIView):
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'username': openapi.Schema(type=openapi.TYPE_STRING, description='Username'),
                'password': openapi.Schema(type=openapi.TYPE_STRING, description='Password', format='password'),
            },
            required=['username', 'password']
        ),
        responses={
            200: openapi.Response(
                description="Tokens returned",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'refresh': openapi.Schema(type=openapi.TYPE_STRING, description='Refresh Token'),
                        'access': openapi.Schema(type=openapi.TYPE_STRING, description='Access Token'),
                        'last_login': openapi.Schema(type=openapi.TYPE_STRING, description='Last Login Time'),
                    }
                )
            ),
            401: 'Invalid credentials'
        }
    )
    def post(self, request):
        serializer = LoginUserSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token
            user.last_login = timezone.now()
            user.save(update_fields=['last_login'])

            return Response({
                'refresh': str(refresh),
                'access': str(access_token),
                'last_login': user.last_login
            }, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AccountUpdateView(generics.UpdateAPIView):
    serializer_class = AccountUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    http_method_names = ['patch']

    @swagger_auto_schema(
        operation_summary="Update User Account Information",
        operation_description="Allows the user to update their account details such as username, email, and password.",
        request_body=AccountUpdateSerializer,
        responses={
            200: openapi.Response(
                description="Successful update",
                examples={
                    "application/json": {
                        "success": [
                            "Username successfully updated.",
                            "Email successfully updated.",
                            "Password successfully updated."
                        ]
                    }
                }
            ),
            400: openapi.Response(
                description="Bad Request",
                examples={
                    "application/json": {
                        "old_password": ["Old password is required to update password."],
                        "non_field_errors": ["At least one of 'username', 'email', or 'new_password' must be provided."]
                    }
                }
            )
        }
    )
    def patch(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            success_messages = []

            if 'username' in serializer.validated_data:
                success_messages.append("Username successfully updated.")
            if 'email' in serializer.validated_data:
                success_messages.append("Email successfully updated.")
            if 'new_password' in serializer.validated_data:
                success_messages.append("Password successfully updated.")

            return Response({
                "success": success_messages,
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserViewSet(viewsets.ViewSet):
    permission_classes = (IsAuthenticated,)

    @swagger_auto_schema(
        operation_description="Retrieve the authenticated user's information.",
        responses={
            200: openapi.Response(
                description="User information retrieved successfully.",
                schema=UserSerializer,
            ),
            401: "Unauthorized (Token is invalid or missing)",
        }
    )
    def retrieve(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)
