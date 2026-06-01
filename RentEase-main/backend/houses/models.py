from django.conf import settings
from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Listing(models.Model):
    CATEGORY_PROPERTIES = "properties"
    CATEGORY_VEHICLES = "vehicles"
    CATEGORY_ELECTRONICS = "electronics"
    CATEGORY_FURNITURE = "furniture"
    CATEGORY_TOOLS_EQUIPMENT = "tools_equipment"
    CATEGORY_AGRI_EQUIPMENT = "agriculture_equipment"
    CATEGORY_SPORTS_RECREATION = "sports_recreation"

    CATEGORY_CHOICES = [
        (CATEGORY_PROPERTIES, "Properties"),
        (CATEGORY_VEHICLES, "Vehicles"),
        (CATEGORY_ELECTRONICS, "Electronics"),
        (CATEGORY_FURNITURE, "Furniture"),
        (CATEGORY_TOOLS_EQUIPMENT, "Tools & Equipment"),
        (CATEGORY_AGRI_EQUIPMENT, "Agriculture Equipment"),
        (CATEGORY_SPORTS_RECREATION, "Sports & Recreation"),
    ]

    STATUS_AVAILABLE = "available"
    STATUS_RENTED = "rented"
    STATUS_INACTIVE = "inactive"
    AVAILABILITY_CHOICES = [
        (STATUS_AVAILABLE, "Available"),
        (STATUS_RENTED, "Rented"),
        (STATUS_INACTIVE, "Inactive"),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    location = models.CharField(max_length=255)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, default=CATEGORY_ELECTRONICS)
    image = models.ImageField(upload_to="listings/", blank=True, null=True)
    availability_status = models.CharField(
        max_length=20,
        choices=AVAILABILITY_CHOICES,
        default=STATUS_AVAILABLE,
    )
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="listings",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} ({self.get_category_display()})"


class RentalRequest(models.Model):
    STATUS_PENDING = "pending"
    STATUS_APPROVED = "approved"
    STATUS_REJECTED = "rejected"
    STATUS_CHOICES = [
        (STATUS_PENDING, "Pending"),
        (STATUS_APPROVED, "Approved"),
        (STATUS_REJECTED, "Rejected"),
    ]

    listing = models.ForeignKey(
        Listing,
        on_delete=models.CASCADE,
        related_name="rental_requests",
    )
    requester = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="requests_sent",
    )
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="requests_received",
    )
    message = models.TextField()
    phone_number = models.CharField(max_length=20)
    request_status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=STATUS_PENDING,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["listing", "requester"],
                name="unique_request_per_listing_requester",
            ),
        ]

    def __str__(self):
        return f"{self.requester_id} -> {self.listing_id} ({self.request_status})"


class Subscriber(models.Model):
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.email
