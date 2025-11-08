from django.urls import path
from .views import (
    RegisterView, login_view, logout_view, current_user_view,
    JobSeekerProfileView, EmployerProfileView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('user/', current_user_view, name='current-user'),
    path('jobseeker/', JobSeekerProfileView.as_view(), name='jobseeker-profile'),
    path('employer/', EmployerProfileView.as_view(), name='employer-profile'),
]

