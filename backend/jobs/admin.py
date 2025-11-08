from django.contrib import admin
from .models import Job, SavedJob


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ['title', 'posted_by', 'category', 'location', 'job_type', 'status', 'created_at']
    list_filter = ['status', 'job_type', 'category', 'is_internship', 'remote', 'created_at']
    search_fields = ['title', 'description', 'posted_by__email', 'category', 'location']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(SavedJob)
class SavedJobAdmin(admin.ModelAdmin):
    list_display = ['user', 'job', 'saved_at']
    list_filter = ['saved_at']
    search_fields = ['user__email', 'job__title']

