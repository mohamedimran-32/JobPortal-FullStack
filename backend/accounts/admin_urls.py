from django.urls import path
from rest_framework import permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Count, Q
from datetime import datetime, timedelta
from accounts.models import User
from jobs.models import Job
from applications.models import Application


@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def admin_stats(request):
    """Get admin dashboard statistics"""
    total_users = User.objects.count()
    job_seekers = User.objects.filter(role='job_seeker').count()
    employers = User.objects.filter(role='employer').count()
    
    total_jobs = Job.objects.count()
    active_jobs = Job.objects.filter(status='active').count()
    internships = Job.objects.filter(is_internship=True).count()
    
    total_applications = Application.objects.count()
    pending_applications = Application.objects.filter(status='pending').count()
    
    # Recent activity (last 7 days)
    week_ago = datetime.now() - timedelta(days=7)
    recent_users = User.objects.filter(created_at__gte=week_ago).count()
    recent_jobs = Job.objects.filter(created_at__gte=week_ago).count()
    recent_applications = Application.objects.filter(applied_date__gte=week_ago).count()
    
    # Top categories
    top_categories = Job.objects.values('category').annotate(
        count=Count('id')
    ).order_by('-count')[:5]
    
    return Response({
        'users': {
            'total': total_users,
            'job_seekers': job_seekers,
            'employers': employers,
            'recent': recent_users,
        },
        'jobs': {
            'total': total_jobs,
            'active': active_jobs,
            'internships': internships,
            'recent': recent_jobs,
        },
        'applications': {
            'total': total_applications,
            'pending': pending_applications,
            'recent': recent_applications,
        },
        'top_categories': list(top_categories),
    })


@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def admin_users(request):
    """Get all users for admin"""
    from accounts.serializers import UserSerializer
    users = User.objects.all().order_by('-date_joined')
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAdminUser])
def admin_user_detail(request, user_id):
    """Get, update, or delete a specific user"""
    from accounts.serializers import UserSerializer
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)
    
    if request.method == 'GET':
        serializer = UserSerializer(user)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    elif request.method == 'DELETE':
        user.delete()
        return Response({'message': 'User deleted successfully'}, status=200)


@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def admin_jobs(request):
    """Get all jobs for admin"""
    from jobs.serializers import JobSerializer
    jobs = Job.objects.all().order_by('-created_at')
    serializer = JobSerializer(jobs, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([permissions.IsAdminUser])
def admin_job_moderate(request, job_id):
    """Approve or reject a job"""
    try:
        job = Job.objects.get(id=job_id)
    except Job.DoesNotExist:
        return Response({'error': 'Job not found'}, status=404)
    
    action = request.data.get('action')  # 'approve' or 'reject'
    if action == 'approve':
        job.status = 'active'
        job.save()
        return Response({'message': 'Job approved'}, status=200)
    elif action == 'reject':
        job.status = 'closed'
        job.save()
        return Response({'message': 'Job rejected'}, status=200)
    else:
        return Response({'error': 'Invalid action'}, status=400)


urlpatterns = [
    path('stats/', admin_stats, name='admin-stats'),
    path('users/', admin_users, name='admin-users'),
    path('users/<int:user_id>/', admin_user_detail, name='admin-user-detail'),
    path('jobs/', admin_jobs, name='admin-jobs'),
    path('jobs/<int:job_id>/moderate/', admin_job_moderate, name='admin-job-moderate'),
]

