from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


def validate_file_size(file):
    """Validate file size (max 5MB)"""
    max_size = 5 * 1024 * 1024  # 5MB in bytes
    if file.size > max_size:
        raise ValidationError(
            _('File size cannot exceed 5MB. Current size: %(size)sMB'),
            params={'size': round(file.size / (1024 * 1024), 2)},
        )

