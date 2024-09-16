from django.urls import path
from . import views
from .views import *
from rest_framework.authtoken.views import obtain_auth_token


urlpatterns = [
    path('', views.getRoutes),
    path('register/', views.userRegisterView, name="register"),
    path('logout/', LogoutView.as_view(), name="logout"),

]