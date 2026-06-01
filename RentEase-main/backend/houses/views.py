from django.db.models import Q
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from authentication.models import User

from .models import Category, Listing, RentalRequest, Subscriber
from .permissions import IsOwnerOrReadOnly
from .serializers import (
    ListingSerializer,
    ProfileSerializer,
    CategorySerializer,
    RentalRequestSerializer,
    RentalRequestStatusSerializer,
    SubscriberSerializer,
)


class CategoryListView(generics.ListAPIView):
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Category.objects.filter(is_active=True)


class ListingListCreateView(generics.ListCreateAPIView):
    serializer_class = ListingSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        queryset = Listing.objects.all()

        category = self.request.query_params.get("category")
        min_price = self.request.query_params.get("min_price")
        max_price = self.request.query_params.get("max_price")
        search = self.request.query_params.get("search")
        owner = self.request.query_params.get("owner")
        location = self.request.query_params.get("location")
        availability_status = self.request.query_params.get("availability_status")

        if category:
            # Backward compatibility for legacy categories
            category_map = {
                "vehicles": ["vehicles", "car", "bike"],
                "properties": ["properties", "house"],
                "tools_equipment": ["tools_equipment", "tools"],
                "sports_recreation": ["sports_recreation", "sports"],
                "agriculture_equipment": ["agriculture_equipment"],
                "electronics": ["electronics"],
                "furniture": ["furniture"],
            }
            mapped_categories = category_map.get(category.lower(), [category.lower()])
            queryset = queryset.filter(category__in=mapped_categories)
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | Q(description__icontains=search)
            )
        if owner:
            queryset = queryset.filter(owner_id=owner)
        if location:
            queryset = queryset.filter(location__icontains=location)
        if availability_status:
            queryset = queryset.filter(availability_status=availability_status)

        return queryset

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ListingDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsOwnerOrReadOnly()]


class RentalRequestCreateView(generics.CreateAPIView):
    serializer_class = RentalRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        listing = serializer.validated_data["listing"]
        serializer.save(requester=self.request.user, owner=listing.owner)


class MySentRequestsView(generics.ListAPIView):
    serializer_class = RentalRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return RentalRequest.objects.filter(requester=self.request.user).select_related(
            "listing", "owner", "requester"
        )


class RequestsForMyListingsView(generics.ListAPIView):
    serializer_class = RentalRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return RentalRequest.objects.filter(owner=self.request.user).select_related(
            "listing", "owner", "requester"
        )


class RentalRequestStatusUpdateView(generics.UpdateAPIView):
    serializer_class = RentalRequestStatusSerializer
    queryset = RentalRequest.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return RentalRequest.objects.filter(owner=self.request.user)

    def perform_update(self, serializer):
        rental_request = serializer.save()
        if rental_request.request_status == RentalRequest.STATUS_APPROVED:
            listing = rental_request.listing
            listing.availability_status = Listing.STATUS_RENTED
            listing.save(update_fields=["availability_status"])
            RentalRequest.objects.filter(
                listing=listing, request_status=RentalRequest.STATUS_PENDING
            ).exclude(id=rental_request.id).update(
                request_status=RentalRequest.STATUS_REJECTED
            )


class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = ProfileSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = ProfileSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        total_listings = Listing.objects.filter(owner=user).count()
        active_rentals = Listing.objects.filter(
            owner=user, availability_status=Listing.STATUS_AVAILABLE
        ).count()
        requests_received = RentalRequest.objects.filter(owner=user).count()
        requests_sent = RentalRequest.objects.filter(requester=user).count()
        return Response(
            {
                "total_listings": total_listings,
                "active_rentals": active_rentals,
                "requests_received": requests_received,
                "requests_sent": requests_sent,
            }
        )


class SubscribeView(generics.CreateAPIView):
    serializer_class = SubscriberSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Subscriber.objects.all()


class AdminStatsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        return Response(
            {
                "users": User.objects.count(),
                "listings": Listing.objects.count(),
                "requests": RentalRequest.objects.count(),
                "subscribers": Subscriber.objects.count(),
            }
        )


class AdminUsersView(generics.ListAPIView):
    permission_classes = [permissions.IsAdminUser]
    serializer_class = ProfileSerializer
    queryset = User.objects.all().order_by("-date_joined")


class AdminListingsView(generics.ListAPIView):
    permission_classes = [permissions.IsAdminUser]
    serializer_class = ListingSerializer
    queryset = Listing.objects.select_related("owner").all()


class AdminRequestsView(generics.ListAPIView):
    permission_classes = [permissions.IsAdminUser]
    serializer_class = RentalRequestSerializer
    queryset = RentalRequest.objects.select_related("listing", "requester", "owner").all()


class AdminSubscribersView(generics.ListAPIView):
    permission_classes = [permissions.IsAdminUser]
    serializer_class = SubscriberSerializer
    queryset = Subscriber.objects.all()
