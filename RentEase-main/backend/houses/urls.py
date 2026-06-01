from django.urls import path

from .views import (
    CategoryListView,
    DashboardStatsView,
    ListingDetailView,
    ListingListCreateView,
    MySentRequestsView,
    ProfileView,
    SubscribeView,
    RentalRequestCreateView,
    RentalRequestStatusUpdateView,
    RequestsForMyListingsView,
    AdminStatsView,
    AdminUsersView,
    AdminListingsView,
    AdminRequestsView,
    AdminSubscribersView,
)

urlpatterns = [
    path("categories/", CategoryListView.as_view(), name="categories-list"),
    path("listings/", ListingListCreateView.as_view(), name="listings-list-create"),
    path("listings/<int:pk>/", ListingDetailView.as_view(), name="listings-detail"),
    path("requests/", RentalRequestCreateView.as_view(), name="rental-request-create"),
    path("requests/my/", MySentRequestsView.as_view(), name="rental-request-my"),
    path(
        "requests/for-my-listings/",
        RequestsForMyListingsView.as_view(),
        name="rental-request-received",
    ),
    path(
        "requests/<int:pk>/status/",
        RentalRequestStatusUpdateView.as_view(),
        name="rental-request-status",
    ),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("dashboard/stats/", DashboardStatsView.as_view(), name="dashboard-stats"),
    path("subscribe/", SubscribeView.as_view(), name="subscribe"),
    path("admin/stats/", AdminStatsView.as_view(), name="admin-stats"),
    path("admin/users/", AdminUsersView.as_view(), name="admin-users"),
    path("admin/listings/", AdminListingsView.as_view(), name="admin-listings"),
    path("admin/requests/", AdminRequestsView.as_view(), name="admin-requests"),
    path("admin/subscribers/", AdminSubscribersView.as_view(), name="admin-subscribers"),
]
