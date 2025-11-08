from django.urls import path
from .views import (
    JobListCreateView, JobDetailView, job_search,
    saved_job_toggle, saved_jobs_list
)

urlpatterns = [
    path('', JobListCreateView.as_view(), name='job-list-create'),
    path('<int:pk>/', JobDetailView.as_view(), name='job-detail'),
    path('search/', job_search, name='job-search'),
    path('<int:job_id>/save/', saved_job_toggle, name='save-job'),
    path('saved/', saved_jobs_list, name='saved-jobs'),
]

