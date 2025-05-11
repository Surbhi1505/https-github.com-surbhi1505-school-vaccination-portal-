from flask import Blueprint, jsonify
from extensions import db
from models import Student, VaccinationStatus, VaccinationDrive
from datetime import datetime, timedelta
from collections import defaultdict

bp = Blueprint('dashboard', __name__, url_prefix='/dashboard')

@bp.route('/', methods=['GET'])
def dashboard_stats():
    total_students = Student.query.count()
    vaccinated = VaccinationStatus.query.distinct(VaccinationStatus.student_id).count()
    percent = (vaccinated / total_students) * 100 if total_students else 0
    upcoming = VaccinationDrive.query.filter(
        VaccinationDrive.date <= datetime.today().date() + timedelta(days=30)
    ).count()
    return jsonify({
        'total_students': total_students,
        'vaccinated': vaccinated,
        'vaccinated_percentage': round(percent, 2),
        'upcoming_drives': upcoming
    })

@bp.route('/activity', methods=['GET'])
def recent_activity():
    recent = VaccinationStatus.query.order_by(VaccinationStatus.vaccinated_on.desc()).limit(5).all()
    data = []
    for v in recent:
        student = Student.query.get(v.student_id)
        data.append({
            'student': student.name,
            'class': student.class_grade,
            'vaccine': v.vaccine_name,
            'date': v.vaccinated_on.strftime("%Y-%m-%d")
        })
    return jsonify(data)

@bp.route('/classwise', methods=['GET'])
def classwise_chart():
    data = defaultdict(int)
    results = db.session.query(Student.class_grade, VaccinationStatus.student_id) \
        .join(Student, Student.id == VaccinationStatus.student_id).all()
    for class_grade, _ in results:
        data[class_grade] += 1
    chart_data = [{'class': k, 'count': v} for k, v in data.items()]
    return jsonify(chart_data)

@bp.route('/dailywise', methods=['GET'])
def dailywise_chart():
    data = defaultdict(int)
    results = VaccinationStatus.query.all()
    for v in results:
        date = v.vaccinated_on.strftime("%Y-%m-%d")
        data[date] += 1
    chart_data = [{'date': k, 'count': v} for k, v in sorted(data.items())]
    return jsonify(chart_data)
