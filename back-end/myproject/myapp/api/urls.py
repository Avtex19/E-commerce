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
    path('category/',CategoriesView.as_view(), name="category"),
    # path('products/', ProductWithoutCategoryView.as_view(), name="productWithoutCategory"),
    path('account/update', UpdateAccountView.as_view()),
    path('user/info/', UserViewSet.as_view({'get': 'retrieve'}), name='user_info'),
    *router.urls,
]