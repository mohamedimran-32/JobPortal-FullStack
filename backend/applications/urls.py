from django.urls import path
from .views import (
    ApplicationCreateView, ApplicationListView, ApplicationDetailView,
    update_application_status, job_applications
)

urlpatterns = [
    path('', ApplicationListView.as_view(), name='application-list'),
    path('create/', ApplicationCreateView.as_view(), name='application-create'),
    path('<int:pk>/', ApplicationDetailView.as_view(), name='application-detail'),
    path('<int:application_id>/update-status/', update_application_status, name='update-application-status'),
    path('job/<int:job_id>/', job_applications, name='job-applications'),
]

