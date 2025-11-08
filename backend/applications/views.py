from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from .models import Application
from .serializers import ApplicationSerializer, ApplicationCreateSerializer
from jobs.models import Job


class ApplicationCreateView(generics.CreateAPIView):
    serializer_class = ApplicationCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        application = serializer.save()
        
        # Send email notification
        try:
            send_mail(
                subject=f'Application Submitted: {application.job.title}',
                message=f'Your application for {application.job.title} has been submitted successfully.',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[application.applicant.email],
                fail_silently=True,
            )
        except Exception as e:
            print(f"Email sending failed: {e}")
        
        return Response(
            ApplicationSerializer(application).data,
            status=status.HTTP_201_CREATED
        )


class ApplicationListView(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_job_seeker:
            # Job seeker sees their own applications
            return Application.objects.filter(applicant=user)
        elif user.is_employer:
            # Employer sees applications for their jobs
            return Application.objects.filter(job__posted_by=user)
        elif user.is_admin:
            # Admin sees all applications
            return Application.objects.all()
        return Application.objects.none()


class ApplicationDetailView(generics.RetrieveAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_job_seeker:
            return Application.objects.filter(applicant=user)
        elif user.is_employer:
            return Application.objects.filter(job__posted_by=user)
        elif user.is_admin:
            return Application.objects.all()
        return Application.objects.none()


@api_view(['PUT'])
@permission_classes([permissions.IsAuthenticated])
def update_application_status(request, application_id):
    """Update application status (for employers)"""
    try:
        application = Application.objects.get(id=application_id)
    except Application.DoesNotExist:
        return Response({'error': 'Application not found'}, status=404)
    
    # Check permissions
    if not (request.user.is_employer and application.job.posted_by == request.user) and not request.user.is_admin:
        return Response(
            {'error': 'You do not have permission to update this application'},
            status=403
        )
    
    new_status = request.data.get('status')
    if new_status not in dict(Application.STATUS_CHOICES):
        return Response({'error': 'Invalid status'}, status=400)
    
    old_status = application.status
    application.status = new_status
    application.notes = request.data.get('notes', application.notes)
    application.save()
    
    # Send email notification
    try:
        send_mail(
            subject=f'Application Status Updated: {application.job.title}',
            message=f'Your application status for {application.job.title} has been updated from {old_status} to {new_status}.',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[application.applicant.email],
            fail_silently=True,
        )
    except Exception as e:
        print(f"Email sending failed: {e}")
    
    return Response(ApplicationSerializer(application).data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def job_applications(request, job_id):
    """Get all applications for a specific job (for employers)"""
    try:
        job = Job.objects.get(id=job_id)
    except Job.DoesNotExist:
        return Response({'error': 'Job not found'}, status=404)
    
    # Check permissions
    if not (request.user.is_employer and job.posted_by == request.user) and not request.user.is_admin:
        return Response(
            {'error': 'You do not have permission to view these applications'},
            status=403
        )
    
    applications = Application.objects.filter(job=job).order_by('-applied_date')
    serializer = ApplicationSerializer(applications, many=True)
    return Response(serializer.data)

