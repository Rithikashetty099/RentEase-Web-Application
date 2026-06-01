import uuid

from django.contrib.auth.password_validation import validate_password
from django.utils.text import slugify
from rest_framework import serializers

from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    firstName = serializers.CharField(write_only=True, max_length=150, trim_whitespace=True)
    lastName = serializers.CharField(write_only=True, max_length=150, trim_whitespace=True)
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["firstName", "lastName", "email", "password"]

    def validate_email(self, value):
        normalized = value.strip().lower()
        if User.objects.filter(email__iexact=normalized).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return normalized

    def validate_firstName(self, value):
        cleaned = value.strip()
        if not cleaned:
            raise serializers.ValidationError("First name is required.")
        return cleaned

    def validate_lastName(self, value):
        cleaned = value.strip()
        if not cleaned:
            raise serializers.ValidationError("Last name is required.")
        return cleaned

    def validate(self, attrs):
        password = attrs["password"]
        email = attrs["email"]
        first = attrs["firstName"].strip()
        last = attrs["lastName"].strip()

        provisional = User(
            email=email,
            first_name=first,
            last_name=last,
            username=f"pv_{uuid.uuid4().hex}",
        )
        validate_password(password, user=provisional)
        return attrs

    def create(self, validated_data):
        first_name = validated_data.pop("firstName").strip()
        last_name = validated_data.pop("lastName").strip()
        password = validated_data.pop("password")
        email = validated_data.pop("email")

        base = slugify(f"{first_name}_{last_name}")[:120] or "user"
        username = base
        if User.objects.filter(username=username).exists():
            username = f"{base}_{uuid.uuid4().hex[:10]}"

        user = User(
            username=username,
            email=email,
            first_name=first_name,
            last_name=last_name,
        )
        user.set_password(password)
        user.save()
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "first_name", "last_name", "username", "is_staff"]
