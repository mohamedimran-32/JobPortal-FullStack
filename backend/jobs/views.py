from rest_framework import generics, permissions, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import Job, SavedJob
from .serializers import JobSerializer, JobCreateSerializer, SavedJobSerializer


class JobListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'location', 'job_type', 'is_internship', 'remote', 'status']
    search_fields = ['title', 'description', 'category', 'location', 'requirements']
    ordering_fields = ['created_at', 'salary_min', 'salary_max']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = Job.objects.filter(status='active')
        
        # Filter by salary range if provided
        salary_min = self.request.query_params.get('salary_min', None)
        salary_max = self.request.query_params.get('salary_max', None)
        
        if salary_min:
            queryset = queryset.filter(salary_max__gte=salary_min)
        if salary_max:
            queryset = queryset.filter(salary_min__lte=salary_max)
        
        return queryset
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return JobCreateSerializer
        return JobSerializer
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Job.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return JobCreateSerializer
        return JobSerializer
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]
    
    def perform_update(self, serializer):
        job = self.get_object()
        if job.posted_by != self.request.user and not self.request.user.is_admin:
            raise permissions.PermissionDenied("You can only edit your own jobs.")
        serializer.save()
    
    def perform_destroy(self, instance):
        if instance.posted_by != self.request.user and not self.request.user.is_admin:
            raise permissions.PermissionDenied("You can only delete your own jobs.")
        instance.delete()


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def job_search(request):
    """Advanced job search endpoint"""
    queryset = Job.objects.filter(status='active')
    
    # Text search
    search = request.query_params.get('search', '')
    if search:
        queryset = queryset.filter(
            Q(title__icontains=search) |
            Q(description__icontains=search) |
            Q(category__icontains=search)
        )
    
    # Filters
    category = request.query_params.get('category')
    if category:
        queryset = queryset.filter(category=category)
    
    location = request.query_params.get('location')
    if location:
        queryset = queryset.filter(location__icontains=location)
    
    job_type = request.query_params.get('job_type')
    if job_type:
        queryset = queryset.filter(job_type=job_type)
    
    is_internship = request.query_params.get('is_internship')
    if is_internship:
        queryset = queryset.filter(is_internship=is_internship.lower() == 'true')
    
    remote = request.query_params.get('remote')
    if remote:
        queryset = queryset.filter(remote=remote.lower() == 'true')
    
    # Salary range
    salary_min = request.query_params.get('salary_min')
    salary_max = request.query_params.get('salary_max')
    if salary_min:
        queryset = queryset.filter(salary_max__gte=salary_min)
    if salary_max:
        queryset = queryset.filter(salary_min__lte=salary_max)
    
    serializer = JobSerializer(queryset, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['POST', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def saved_job_toggle(request, job_id):
    """Save or unsave a job"""
    try:
        job = Job.objects.get(id=job_id)
    except Job.DoesNotExist:
        return Response({'error': 'Job not found'}, status=404)
    
    if request.method == 'POST':
        saved_job, created = SavedJob.objects.get_or_create(
            user=request.user,
            job=job
        )
        if created:
            return Response({'message': 'Job saved successfully'}, status=201)
        return Response({'message': 'Job already saved'}, status=200)
    
    elif request.method == 'DELETE':
        try:
            saved_job = SavedJob.objects.get(user=request.user, job=job)
            saved_job.delete()
            return Response({'message': 'Job unsaved successfully'}, status=200)
        except SavedJob.DoesNotExist:
            return Response({'error': 'Job not saved'}, status=404)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def saved_jobs_list(request):
    """Get all saved jobs for the current user"""
    saved_jobs = SavedJob.objects.filter(user=request.user).order_by('-saved_at')
    serializer = SavedJobSerializer(saved_jobs, many=True)
    return Response(serializer.data)
