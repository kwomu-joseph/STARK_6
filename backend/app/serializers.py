from django.db import transaction
from rest_framework import serializers
from .models import CustomUser, Student, Supervisor, Admin, InternshipPlacement, WeeklyLog, Evaluation, EvaluationCriteria, Feedback, Notification, StatusHistory, StudentGrade

class CustomUserSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(required=False, write_only=True, allow_blank=True)
    university_name = serializers.CharField(required=False, write_only=True, allow_blank=True)
    year_of_study = serializers.IntegerField(required=False, write_only=True, allow_null=True)
    place_of_work = serializers.CharField(required=False, write_only=True, allow_blank=True)
    department = serializers.CharField(required=False, write_only=True, allow_blank=True)
    staff_ID = serializers.CharField(required=False, write_only=True, allow_blank=True)

    class Meta:
        model = CustomUser 
        fields = [
            'name',
            'role',
            'ID_number',
            'telephone_number',
            'username',
            'password',
            'course_title',
            'university_name',
            'year_of_study',
            'place_of_work',
            'department',
            'staff_ID',
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'role': {'required': True, 'allow_blank': False},
        }

    def validate(self, attrs):
        role = attrs.get("role")

        if role in (None, ""):
            raise serializers.ValidationError({"role": "Role is required."})

        if role == "student":
            required_fields = ["course_title", "university_name", "year_of_study"]
        elif role == "supervisor":
            required_fields = ["place_of_work", "department", "staff_ID"]
        elif role == "admin":
            required_fields = ["department"]
        else:
            raise serializers.ValidationError({"role": "Select a valid role."})

        errors = {}
        for field in required_fields:
            value = attrs.get(field)
            if value in (None, ""):
                errors[field] = "This field is required."

        if errors:
            raise serializers.ValidationError(errors)

        return attrs

    @transaction.atomic
    def create(self, validated_data):
        role = validated_data["role"]
        profile_data = {}

        if role == "student":
            profile_data = {
                "course_title": validated_data.pop("course_title", None),
                "university_name": validated_data.pop("university_name", None),
                "year_of_study": validated_data.pop("year_of_study", None),
            }
        elif role == "supervisor":
            profile_data = {
                "place_of_work": validated_data.pop("place_of_work", None),
                "department": validated_data.pop("department", None),
                "staff_ID": validated_data.pop("staff_ID", None),
            }
        elif role == "admin":
            profile_data = {
                "department": validated_data.pop("department", None),
            }

        user = CustomUser.objects.create_user(**validated_data)

        if role == "student":
            Student.objects.create(users=user, **profile_data)
        elif role == "supervisor":
            Supervisor.objects.create(users=user, **profile_data)
        elif role == "admin":
            Admin.objects.create(users=user, **profile_data)

        return user


class StudentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='users.username', read_only=True)
    name = serializers.CharField(source='users.name', read_only=True)
    ID_number = serializers.CharField(source='users.ID_number', read_only=True)
    telephone_number = serializers.CharField(source='users.telephone_number', read_only=True)
    student_user_id = serializers.IntegerField(source='users.id', read_only=True)
    supervisor_id = serializers.IntegerField(source='assigned_supervisor.id', read_only=True)
    supervisor_name = serializers.CharField(source='assigned_supervisor.users.name', read_only=True)
    placement = serializers.SerializerMethodField()

    def get_placement(self, obj):
        placement = InternshipPlacement.objects.filter(user=obj.users).order_by('-id').first()
        if not placement:
            return None

        return {
            'place_of_internship': placement.place_of_internship,
            'department': placement.department,
            'supervisor_name': placement.supervisor_name,
            'start_date': placement.start_date,
            'end_date': placement.end_date,
        }

    class Meta:
        model = Student 
        fields = [
            'id',
            'student_user_id',
            'users',
            'username',
            'name',
            'ID_number',
            'telephone_number',
            'course_title',
            'university_name',
            'year_of_study',
            'assigned_supervisor',
            'supervisor_id',
            'supervisor_name',
            'placement',
        ]


class SupervisorSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='users.username', read_only=True)
    name = serializers.CharField(source='users.name', read_only=True)
    supervisor_user_id = serializers.IntegerField(source='users.id', read_only=True)
    assigned_students_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Supervisor
        fields = [
            'id',
            'supervisor_user_id',
            'users',
            'username',
            'name',
            'place_of_work',
            'department',
            'staff_ID',
            'assigned_students_count',
        ]

class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = ['users', 'department']

class InternshipPlacementSerializer(serializers.ModelSerializer):
    class Meta:
        model = InternshipPlacement
        fields = '__all__'
        read_only_fields = ['user']

    def validate(self, attrs):
        start_date = attrs.get('start_date', getattr(self.instance, 'start_date', None))
        end_date = attrs.get('end_date', getattr(self.instance, 'end_date', None))

        if start_date and end_date and end_date < start_date:
            raise serializers.ValidationError({
                'end_date': 'End date must be on or after the start date.'
            })

        return attrs

class WeeklylogSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='user.name', read_only=True)
    student_user_id = serializers.IntegerField(source='user.id', read_only=True)
    supervisor_name = serializers.CharField(source='supervisor.users.name', read_only=True)

    class Meta:
        model = WeeklyLog
        fields = [
            'id',
            'user',
            'student_name',
            'student_user_id',
            'week_number',
            'description',
            'date_submitted',
            'supervisor',
            'supervisor_name',
            'supervisor_comment',
            'evaluation_score',
            'reviewed_at',
            'status',
        ]
        read_only_fields = [
            'user',
            'supervisor',
            'supervisor_comment',
            'evaluation_score',
            'reviewed_at',
            'status',
            'student_name',
            'student_user_id',
            'supervisor_name',
        ]

class EvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evaluation
        fields = '__all__'


class FeedbackSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.name', read_only=True)

    class Meta:
        model = Feedback
        fields = ['id', 'user', 'user_name', 'subject', 'message', 'rating', 'created_at']
        read_only_fields = ['user', 'user_name', 'created_at']


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'title', 'message', 'is_read', 'created_at']
        read_only_fields = ['id', 'title', 'message', 'created_at']

class StatusHistorySerializer(serializers.ModelSerializer):
    # Retrieve the username instead of just the ID for the 'changed_by' field
    changed_by_name = serializers.CharField(source='changed_by.username', read_only=True)
    
    # Format the date to be more readable (e.g., "Oct 24, 2023, 10:30 AM")
    changed_at = serializers.DateTimeField(format="%b %d, %Y, %I:%M %p", read_only=True) #type: ignore

    class Meta:
        model = StatusHistory
        fields = [
            'id', 
            'log', 
            'old_status', 
            'new_status', 
            'changed_by_name', 
            'changed_at'
        ]
        # Ensure the log ID is visible but cannot be tampered with via this serializer
        read_only_fields = ['id', 'changed_at']

    def to_representation(self, instance):
        """
        Optional: Customizing the output to make 'old_status' and 'new_status' 
        look cleaner (e.g., 'pending' -> 'Pending')
        """
        representation = super().to_representation(instance)
        representation['old_status'] = instance.old_status.capitalize()
        representation['new_status'] = instance.new_status.capitalize()
        return representation

class StudentGradeSerializer(serializers.ModelSerializer):

    total_score = serializers.FloatField(read_only=True)
    grade = serializers.CharField(read_only=True)

    class Meta:
        model = StudentGrade
        fields = [
            'id',
            'criteria',
            'efficiency',
            'time_management',
            'problem_solving',
            'professionalism',
            'total_score',
            'grade'
        ]

        read_only_fields = [
            'id',
            'total_score',
            'grade'
        ]

    def validate_efficiency(self, value):
        if value < 0 or value > 100:
            raise serializers.ValidationError(
                "Efficiency score must be between 0 and 100."
            )
        return value

    def validate_time_management(self, value):
        if value < 0 or value > 100:
            raise serializers.ValidationError(
                "Time management score must be between 0 and 100."
            )
        return value

    def validate_problem_solving(self, value):
        if value < 0 or value > 100:
            raise serializers.ValidationError(
                "Problem solving score must be between 0 and 100."
            )
        return value

    def validate_professionalism(self, value):
        if value < 0 or value > 100:
            raise serializers.ValidationError(
                "Professionalism score must be between 0 and 100."
            )
        return value

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        representation['grade'] = instance.grade.upper()

        return representation