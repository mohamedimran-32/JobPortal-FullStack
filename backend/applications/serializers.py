from rest_framework import serializers
from .models import Application
from jobs.serializers import JobSerializer
from accounts.serializers import UserSerializer, JobSeekerProfileSerializer


class ApplicationSerializer(serializers.ModelSerializer):
    job = JobSerializer(read_only=True)
    applicant = UserSerializer(read_only=True)
    applicant_profile = serializers.SerializerMethodField()
    status_display_class = serializers.ReadOnlyField()
    
    class Meta:
        model = Application
        fields = [
            'id', 'job', 'applicant', 'applicant_profile', 'cover_letter',
            'status', 'status_display_class', 'applied_date', 'updated_at', 'notes'
        ]
        read_only_fields = ['id', 'applied_date', 'updated_at']
    
    def get_applicant_profile(self, obj):
        if hasattr(obj.applicant, 'jobseeker_profile'):
            return JobSeekerProfileSerializer(obj.applicant.jobseeker_profile).data
        return None


class ApplicationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ['job', 'cover_letter']
    
    def validate(self, attrs):
        job = attrs['job']
        user = self.context['request'].user
        
        # Check if user already applied
        if Application.objects.filter(job=job, applicant=user).exists():
            raise serializers.ValidationError("You have already applied for this job.")
        
        # Check if user is a job seeker
        if not user.is_job_seeker:
            raise serializers.ValidationError("Only job seekers can apply for jobs.")
        
        # Check if job is active
        if job.status != 'active':
            raise serializers.ValidationError("This job is not currently accepting applications.")
        
        return attrs
    
    def create(self, validated_data):
        validated_data['applicant'] = self.context['request'].user
        return super().create(validated_data)

