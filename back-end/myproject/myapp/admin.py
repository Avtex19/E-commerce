from django.contrib import admin
from .models import Product, Category


# Register your models here.


class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'quantity', 'category')


admin.site.register(Product, ProductAdmin)
admin.site.register(Category)
