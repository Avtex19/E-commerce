from django.urls import path
from . import views
from .views import *


urlpatterns = [
    path('', views.getRoutes),
    path('register/', UserRegisterView.as_view(), name="register"),
    path('login/', UserLoginView.as_view(), name="login"),
    path('logout/', LogoutView.as_view(), name="logout"),
    path('product/', ProductView.as_view(), name="product"),
    path('category/',CategoriesView.as_view(), name="category"),

]