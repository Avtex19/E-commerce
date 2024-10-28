from django.urls import path
from . import views
from .views import *
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register('products', ProductViewSet)

urlpatterns = [
    path('', views.getRoutes),
    path('register/', UserRegisterView.as_view(), name="register"),
    path('login/', UserLoginView.as_view(), name="login"),
    path('logout/', LogoutView.as_view(), name="logout"),
    path('categories/',CategoriesView.as_view(), name="category"),
    path('account/update/', AccountUpdateView.as_view(), name='account-update'),
    path('user/info/', UserViewSet.as_view({'get': 'retrieve'}), name='user_info'),
    *router.urls,
]