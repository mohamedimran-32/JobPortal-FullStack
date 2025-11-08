from django.db import models
from accounts.models import User
from jobs.models import Job


class Application(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('reviewing', 'Reviewing'),
        ('shortlisted', 'Shortlisted'),
        ('interview', 'Interview'),
        ('rejected', 'Rejected'),
        ('accepted', 'Accepted'),
    ]
    
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    applicant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='job_applications')
    cover_letter = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    applied_date = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    notes = models.TextField(blank=True, help_text="Internal notes for employer")
    
    class Meta:
        unique_together = ['job', 'applicant']
        ordering = ['-applied_date']
        indexes = [
            models.Index(fields=['-applied_date']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return f"{self.applicant.email} applied for {self.job.title}"
    
    @property
    def status_display_class(self):
        """Return CSS class for status badge"""
        status_classes = {
            'pending': 'status-pending',
            'reviewing': 'status-reviewing',
            'shortlisted': 'status-shortlisted',
            'interview': 'status-interview',
            'rejected': 'status-rejected',
            'accepted': 'status-accepted',
        }
        return status_classes.get(self.status, '')

