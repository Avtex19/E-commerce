from django.utils import timezone

from django.contrib.auth.models import User
from drf_yasg.utils import swagger_auto_schema
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterUserSerializer, LoginUserSerializer, ProductSerializer, CategorySerializer, \
    UpdatePasswordSerializer, UpdateUsernameOrEmailSerializer
from rest_framework import status, generics, viewsets
from drf_yasg import openapi
from ..models import Product, Category
from rest_framework.permissions import IsAdminUser


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


class UpdateAccountView(generics.UpdateAPIView):
    permission_classes = (IsAuthenticated,)
    model = User
    serializer_class = UpdatePasswordSerializer

    @swagger_auto_schema(
        operation_description="Update the user's account information (username, email, or password).",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'username': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="New username",
                    example="new_username"
                ),
                'email': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="New email",
                    example="new_email@example.com"
                ),
                'old_password': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Old password (if updating password)",
                    example="old_password_value"
                ),
                'new_password': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="New password (if updating password)",
                    example="new_password_value"
                ),
            },
            required=['username', 'email', 'old_password', 'new_password'],
        ),
        responses={
            200: openapi.Response(
                description="Account updated successfully",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'detail': openapi.Schema(
                            type=openapi.TYPE_STRING,
                            example="Account updated successfully."
                        )
                    }
                )
            ),
            400: openapi.Response(
                description="Bad request (validation error or missing fields)",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'detail': openapi.Schema(
                            type=openapi.TYPE_STRING,
                            example="No valid fields provided."
                        )
                    }
                )
            ),
        }
    )
    def get_object(self, queryset=None):
        return self.request.user

    def update(self, request, *args, **kwargs):
        if 'username' in request.data or 'email' in request.data:
            serializer = UpdateUsernameOrEmailSerializer(data=request.data, context={'request': request})
        elif 'old_password' in request.data:
            serializer = UpdatePasswordSerializer(data=request.data, context={'request': request})
        else:
            return Response({"detail": "No valid fields provided."}, status=status.HTTP_400_BAD_REQUEST)

        if serializer.is_valid():
            self.perform_update(self.get_object(), serializer)
            return Response({"detail": "Account updated successfully."}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_update(self, user, serializer):
        validated_data = serializer.validated_data
        if 'new_password' in validated_data:
            user.set_password(validated_data['new_password'])
        if 'email' in validated_data:
            user.email = validated_data['email']
        if 'username' in validated_data:
            user.username = validated_data['username']
        user.save()

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    @swagger_auto_schema(request_body=openapi.Schema(type=openapi.TYPE_OBJECT, properties={
        'username': openapi.Schema(type=openapi.TYPE_STRING, description="New username", example="new_username"),
        'email': openapi.Schema(type=openapi.TYPE_STRING, description="New email", example="new_email@example.com"),
        'old_password': openapi.Schema(type=openapi.TYPE_STRING, description="Old password",
                                       example="old_password_value"),
        'new_password': openapi.Schema(type=openapi.TYPE_STRING, description="New password",
                                       example="new_password_value"),
    }))
    def patch(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)


class CategoriesView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_permissions(self):
        if self.action not in ['list', 'retrieve']:
            return [IsAdminUser()]
        return super().get_permissions()


