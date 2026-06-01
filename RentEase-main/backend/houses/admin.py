from django.contrib import admin

from .models import Category, Listing, RentalRequest, Subscriber


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "is_active", "created_at")
    list_filter = ("is_active",)
    search_fields = ("name", "slug")


@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "category",
        "availability_status",
        "price",
        "location",
        "owner",
        "created_at",
    )
    list_filter = ("category", "availability_status", "created_at")
    search_fields = ("title", "description", "location", "owner__email")


@admin.register(RentalRequest)
class RentalRequestAdmin(admin.ModelAdmin):
    list_display = (
        "listing",
        "requester",
        "owner",
        "request_status",
        "phone_number",
        "created_at",
    )
    list_filter = ("request_status", "created_at")
    search_fields = (
        "listing__title",
        "requester__email",
        "owner__email",
        "phone_number",
    )


@admin.register(Subscriber)
class SubscriberAdmin(admin.ModelAdmin):
    list_display = ("email", "created_at")
    search_fields = ("email",)
