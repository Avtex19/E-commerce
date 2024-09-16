from django.urls import path
from . import views
from .views import *


urlpatterns = [
    path('', views.getRoutes),
    path('register/', views.userRegisterView, name="register"),
]