from flask import Blueprint, request, jsonify
from models import db, VaccinationStatus, Student, VaccinationDrive
from utils import generate_csv_response
from datetime import datetime

bp = Blueprint('report', __name__, url_prefix='/reports')

@bp.route('/', methods=['GET'])
def report_data():
    query = VaccinationStatus.query.join(Student).join(VaccinationDrive)
    vaccine = request.args.get('vaccine')
    if vaccine:
        query = query.filter(VaccinationStatus.vaccine_name == vaccine)

    records = query.all()
    data = []
    for v in records:
        student = Student.query.get(v.student_id)
        drive = VaccinationDrive.query.get(v.drive_id)
        data.append({
            'student_id': student.id,
            'name': student.name,
            'class': student.class_grade,
            'vaccine': v.vaccine_name,
            'date': v.vaccinated_on.strftime("%Y-%m-%d")
        })
    return jsonify(data)

@bp.route('/export', methods=['GET'])
def export_csv():
    records = VaccinationStatus.query.all()
    rows = []
    for v in records:
        student = Student.query.get(v.student_id)
        rows.append({
            'Student ID': student.id,
            'Name': student.name,
            'Class': student.class_grade,
            'Vaccine': v.vaccine_name,
            'Date': v.vaccinated_on.strftime("%Y-%m-%d")
        })
    headers = ['Student ID', 'Name', 'Class', 'Vaccine', 'Date']
    return generate_csv_response(rows, headers)
