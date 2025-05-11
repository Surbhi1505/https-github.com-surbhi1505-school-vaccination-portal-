from flask import Blueprint, request, jsonify
from models import db, VaccinationStatus, Student, VaccinationDrive
from datetime import datetime

bp = Blueprint('vaccination', __name__, url_prefix='/vaccination')

@bp.route('/mark', methods=['POST'])
def mark_vaccination():
    from models import Student, VaccinationStatus, VaccinationDrive

    data = request.json
    student_id = data.get('student_id')
    drive_id = data.get('drive_id')

    if not student_id or not drive_id:
        return jsonify({'error': 'student_id and drive_id are required'}), 400

    # Checking whether  drive exists
    drive = VaccinationDrive.query.get(drive_id)
    if not drive:
        return jsonify({'error': 'Drive not found'}), 404

    # Checking whether student exists
    student = Student.query.get(student_id)
    if not student:
        return jsonify({'error': 'Student not found'}), 404

    # Checking whether student class is eligible
    start, end = map(int, drive.applicable_classes.split('-'))
    allowed_classes = list(map(str, range(start, end + 1)))
    print(allowed_classes)
    if student.class_grade not in allowed_classes:
        return jsonify({'error': 'Student not eligible for this drive'}), 400

    # Check if already vaccinated
    exists = VaccinationStatus.query.filter_by(student_id=student_id, drive_id=drive_id).first()
    if exists:
        return jsonify({'error': 'Student already vaccinated for this drive'}), 400

    # Check remaining doses
    used = VaccinationStatus.query.filter_by(drive_id=drive_id).count()
    if used >= drive.doses_available:
        return jsonify({'error': 'No doses left for this drive'}), 400

    # All good — mark vaccination
    status = VaccinationStatus(student_id=student_id, drive_id=drive_id,vaccine_name=drive.vaccine_name)
    db.session.add(status)
    db.session.commit()

    return jsonify({'message': 'Vaccination recorded'}), 201