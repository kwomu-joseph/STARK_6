from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MaxValueValidator, MinValueValidator

class CustomUser(AbstractUser):
    ROLE_CHOICES=[
           ('student', 'Student'),
           ('supervisor', 'Supervisor'),
           ('admin', 'Admin'),
         
    ]
    name=models.CharField(max_length=30,null=False,blank=False)
    role=models.CharField(max_length=50,choices=ROLE_CHOICES)
    phone_number=models.CharField(max_length=15,blank=True,null=True)
    ID_number = models.CharField(max_length=20, unique=True) 
    REQUIRED_FIELDS = ['ID_number'] 
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='customuser_set',
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name= 'customuser_permissions',
        blank=True
    )
    def __str__(self):
        name = self.name or "Anonymous"
        user_role = self.role or "No Role"
        return f"{name} ({user_role})"

class Student(models.Model):
    users = models.OneToOneField(CustomUser,on_delete=models.CASCADE)
    course_title = models.CharField(max_length=50)
    university_name = models.CharField(max_length=60)
    year_of_study = models.IntegerField()
    assigned_supervisor = models.ForeignKey(
     'Supervisor',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_students'
    )
    
    def __str__(self):
        return f"{self.users.name} -STUDENT"
    
class Supervisor(models.Model):
    users = models.OneToOneField(CustomUser,on_delete=models.CASCADE)
    place_of_work = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    staff_ID = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return f"{self.users.username} -SUPERVISOR"

class Admin(models.Model):
    users = models.OneToOneField(CustomUser,on_delete=models.CASCADE)
    department = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.users.username} -ADMIN"
        
class InternshipPlacement(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    place_of_internship = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    supervisor_name = models.CharField(max_length=50)
    start_date = models.DateField()
    end_date = models.DateField()

    def __str__(self):
        return f"{self.user.username} - {self.place_of_internship}"
        
class WeeklyLog(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected')
    ]

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='weekly_logs')
    week_number = models.IntegerField()
    description = models.TextField()
    date_submitted = models.DateTimeField(auto_now_add=True)
    supervisor = models.ForeignKey(
        Supervisor,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reviewed_logs'
    )
    supervisor_comment = models.TextField(blank=True)
    evaluation_score = models.PositiveIntegerField(null=True, blank=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')

    def __str__(self):
        return f"Week {self.week_number} - {self.user.username} - {self.status}"
    
class EvaluationCriteria(models.Model):
    CRITERIA_CHOICES =[
        ('technical', 'Technical Skills'),
        ('cognitive', 'Cognitive Skills'),
        ('soft', 'Soft Skills'),
        ('professional', 'Professionalism'),
        ('other', 'Others')
    ]
    criteria_name =  models.CharField(max_length=150)
    criteria = models.CharField(max_length=20, choices=CRITERIA_CHOICES, default='other')
    criteria_weight = models.FloatField(help_text="Enter the weight as a decimal: ")

    def __str__(self):
        return f"{self.criteria_name} - {self.criteria}"
class Evaluation(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    placement = models.ForeignKey(InternshipPlacement, on_delete=models.CASCADE)
    criteria = models.ForeignKey(EvaluationCriteria, on_delete=models.SET_NULL, null=True)
    score = models.PositiveIntegerField()
    comment = models.TextField(blank=True)
    evaluation_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        user_name = self.placement.user.name if self.placement and self.placement.user else "Unknown User"
        criteria_name = self.criteria.criteria_name if self.criteria else "No Criteria Assigned"
        return f"{user_name} - {criteria_name}: {self.score}"

class Feedback(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='feedback')
    subject = models.CharField(max_length=150)
    message = models.TextField()
    rating = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.subject} - {self.user.name}"
        
class SiteSetting(models.Model):
    site_name = models.CharField(max_length=100, default='ILES')
    admin_email = models.EmailField(blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.site_name


class Notification(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=150)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.user.username}"
        
class StatusHistory(models.Model):
    log=models.ForeignKey(WeeklyLog,on_delete=models.CASCADE,related_name='history')
    old_status=models.CharField(max_length=10)
    new_status=models.CharField(max_length=10)
    changed_by=models.ForeignKey(CustomUser,on_delete=models.SET_NULL, null=True)
    changed_at=models.DateTimeField(auto_now_add=True)
    def __str__(self):
         return f"{self.old_status} - {self.new_status}"

class StudentGrade(models.Model):
     criteria=models.ForeignKey(EvaluationCriteria, on_delete=models.CASCADE)
     efficiency=models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
     time_management=models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
     problemsolving=models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
     professionalism=models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])

     total_score=models.FloatField(default=0)
     grade=models.CharField(max_length=2, blank=True)

     def __str__(self):
         return f"Grade: {self.grade} ({self.total_score:.2f})"

     def save(self, *args, **kwargs):
         self.total_score=(
            (self.efficiency*0.25) + #type: ignore
            (self.time_management*0.250) + #type: ignore
            (self.problemsolving*0.25) + #type: ignore
            (self.professionalism*0.25) #type: ignore
             ) 

         if self.total_score>=80:
             self.grade='A'
         elif self.total_score>=70:
              self.grade='B'
         elif self.total_score>=60:
             self.grade='C'
         elif self.total_score>=50:
             self.grade='D'
         else :
             self.grade='F'
         super().save(*args, **kwargs)





