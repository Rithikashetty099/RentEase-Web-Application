from django.urls import path

from .views import login, logout, register

urlpatterns = [
    path("register/", register),
    path("login/", login),
    path("logout/", logout),
]
