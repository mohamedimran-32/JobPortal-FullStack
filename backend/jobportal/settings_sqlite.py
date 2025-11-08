# Temporary SQLite Configuration
# Use this if MySQL is not set up yet
# To use: Copy this content to replace the DATABASES section in settings.py

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

