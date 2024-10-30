from django.urls import path
from . import views
from .views import *
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register('products', ProductViewSet)

urlpatterns = [
    path('categories/',CategoriesView.as_view(), name="category"),
    *router.urls,
]