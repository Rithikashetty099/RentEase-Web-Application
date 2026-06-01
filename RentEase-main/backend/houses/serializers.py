from rest_framework import serializers

from authentication.models import User

from .models import Category, Listing, RentalRequest, Subscriber


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug", "is_active"]


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "email"]
        read_only_fields = ["id", "email"]


class ListingSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.id")
    owner_email = serializers.ReadOnlyField(source="owner.email")
    owner_name = serializers.SerializerMethodField()
    category_display = serializers.ReadOnlyField(source="get_category_display")
    availability_display = serializers.ReadOnlyField(source="get_availability_status_display")
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Listing
        fields = [
            "id",
            "title",
            "description",
            "price",
            "location",
            "category",
            "category_display",
            "image",
            "image_url",
            "availability_status",
            "availability_display",
            "owner",
            "owner_email",
            "owner_name",
            "created_at",
        ]

    def get_owner_name(self, obj):
        full_name = f"{obj.owner.first_name} {obj.owner.last_name}".strip()
        return full_name or obj.owner.username

    def get_image_url(self, obj):
        if not obj.image:
            return None
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url


class RentalRequestSerializer(serializers.ModelSerializer):
    requester_name = serializers.SerializerMethodField()
    owner_name = serializers.SerializerMethodField()
    listing_title = serializers.ReadOnlyField(source="listing.title")
    request_status_display = serializers.ReadOnlyField(source="get_request_status_display")

    class Meta:
        model = RentalRequest
        fields = [
            "id",
            "listing",
            "listing_title",
            "requester",
            "requester_name",
            "owner",
            "owner_name",
            "message",
            "phone_number",
            "request_status",
            "request_status_display",
            "created_at",
        ]
        read_only_fields = ["requester", "owner", "request_status"]

    def validate(self, attrs):
        request = self.context["request"]
        listing = attrs["listing"]
        if listing.owner == request.user:
            raise serializers.ValidationError("You cannot request your own listing.")
        if listing.availability_status != Listing.STATUS_AVAILABLE:
            raise serializers.ValidationError("This listing is not available right now.")
        if RentalRequest.objects.filter(listing=listing, requester=request.user).exists():
            raise serializers.ValidationError(
                "You already submitted a request for this listing."
            )
        return attrs

    def get_requester_name(self, obj):
        full_name = f"{obj.requester.first_name} {obj.requester.last_name}".strip()
        return full_name or obj.requester.username

    def get_owner_name(self, obj):
        full_name = f"{obj.owner.first_name} {obj.owner.last_name}".strip()
        return full_name or obj.owner.username


class RentalRequestStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = RentalRequest
        fields = ["request_status"]

    def validate_request_status(self, value):
        allowed = {RentalRequest.STATUS_APPROVED, RentalRequest.STATUS_REJECTED}
        if value not in allowed:
            raise serializers.ValidationError("Status must be approved or rejected.")
        return value


class SubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscriber
        fields = ["id", "email", "created_at"]

    def validate_email(self, value):
        if Subscriber.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("This email is already subscribed.")
        return value.lower()
