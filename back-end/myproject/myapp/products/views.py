from .serializers import  ProductSerializer, CategorySerializer
from rest_framework import status, generics, viewsets, filters
from ..models import Product, Category
from rest_framework.permissions import IsAdminUser




class CategoriesView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

    def get_permissions(self):
        if self.action not in ['list', 'retrieve']:
            return [IsAdminUser()]
        return super().get_permissions()
