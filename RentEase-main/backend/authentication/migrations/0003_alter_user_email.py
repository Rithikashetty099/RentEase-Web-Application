from collections import defaultdict

from django.db import migrations, models


def dedupe_user_emails(apps, schema_editor):
    User = apps.get_model("authentication", "User")
    groups = defaultdict(list)

    for user in User.objects.all():
        key = (user.email or "").strip().lower()
        groups[key].append(user)

    for email_key, users in groups.items():
        if not email_key:
            for u in users:
                u.email = f"legacy_{u.pk}@migrate.rentease.local"
                u.save(update_fields=["email"])
            continue

        if len(users) <= 1:
            continue

        for u in users[1:]:
            local, sep, domain = email_key.partition("@")
            if sep:
                u.email = f"{local}+uid{u.pk}@{domain}"
            else:
                u.email = f"{email_key}+uid{u.pk}@migrate.rentease.local"
            u.save(update_fields=["email"])


class Migration(migrations.Migration):

    dependencies = [
        ("authentication", "0002_alter_user_username"),
    ]

    operations = [
        migrations.RunPython(dedupe_user_emails, migrations.RunPython.noop),
        migrations.AlterField(
            model_name="user",
            name="email",
            field=models.EmailField(max_length=254, unique=True, verbose_name="email address"),
        ),
    ]
