from rest_framework import serializers
from .models import Job, SavedJob
from accounts.serializers import UserSerializer


class JobSerializer(serializers.ModelSerializer):
    posted_by = UserSerializer(read_only=True)
    salary_range = serializers.ReadOnlyField()
    application_count = serializers.SerializerMethodField()
    is_saved = serializers.SerializerMethodField()
    
    class Meta:
        model = Job
        fields = [
            'id', 'title', 'description', 'category', 'location', 'job_type',
            'salary_min', 'salary_max', 'salary_currency', 'salary_range',
            'requirements', 'posted_by', 'status', 'deadline', 'is_internship',
            'remote', 'created_at', 'updated_at', 'application_count', 'is_saved'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'application_count']
    
    def get_application_count(self, obj):
        return obj.applications.count()
    
    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return SavedJob.objects.filter(user=request.user, job=obj).exists()
        return False


class JobCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = [
            'title', 'description', 'category', 'location', 'job_type',
            'salary_min', 'salary_max', 'salary_currency', 'requirements',
            'deadline', 'is_internship', 'remote'
        ]
    
    def create(self, validated_data):
        validated_data['posted_by'] = self.context['request'].user
        validated_data['status'] = 'active'
        return super().create(validated_data)


class SavedJobSerializer(serializers.ModelSerializer):
    job = JobSerializer(read_only=True)
    
    class Meta:
        model = SavedJob
        fields = ['id', 'job', 'saved_at']
        read_only_fields = ['id', 'saved_at']

