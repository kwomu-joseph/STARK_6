import pytest
from app.models import StudentGrade, EvaluationCriteria

@pytest.mark.django_db
def test_student_grade_calculation():
    criteria = EvaluationCriteria.objects.create(
        criteria_name="General Performance", 
        criteria_weight=1.0
    )
    
    grade_entry = StudentGrade.objects.create(
        criteria=criteria,
        efficiency=80,
        time_management=80,
        problemsolving=80,
        professionalism=80
    )
    
    assert grade_entry.total_score == 80
    assert grade_entry.grade == 'A'