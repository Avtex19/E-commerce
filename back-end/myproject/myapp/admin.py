from django.contrib import admin
from .models import Product, Category, SubCategory


# Register your models here.
class SubCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'category')


class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'quantity', 'subcategory', 'get_category_name')

    def get_category_name(self, obj):
        return obj.subcategory.category.name

    get_category_name.short_description = 'category'


admin.site.register(Product, ProductAdmin)
admin.site.register(Category)
admin.site.register(SubCategory, SubCategoryAdmin)
