from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User, JobSeekerProfile, EmployerProfile


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'role', 'phone_number', 'is_verified', 'date_joined']
        read_only_fields = ['id', 'is_verified', 'date_joined']


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    
    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'role', 'phone_number']
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        
        # Create profile based on role
        if user.role == 'job_seeker':
            JobSeekerProfile.objects.create(user=user)
        elif user.role == 'employer':
            EmployerProfile.objects.create(user=user, company_name=validated_data.get('username', ''))
        
        return user


class JobSeekerProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    skills_list = serializers.SerializerMethodField()
    
    class Meta:
        model = JobSeekerProfile
        fields = [
            'id', 'user', 'resume', 'skills', 'skills_list', 'education', 
            'experience', 'bio', 'location', 'profile_picture', 
            'linkedin_url', 'github_url', 'portfolio_url', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_skills_list(self, obj):
        return obj.get_skills_list()


class EmployerProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = EmployerProfile
        fields = [
            'id', 'user', 'company_name', 'company_description', 'company_logo',
            'company_website', 'company_size', 'industry', 'location',
            'founded_year', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

