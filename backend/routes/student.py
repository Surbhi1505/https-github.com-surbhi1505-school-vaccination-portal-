from flask import Blueprint, request, jsonify
from models import db, Student, VaccinationStatus
from utils import parse_csv_upload

bp = Blueprint('student', __name__, url_prefix='/students')

@bp.route('/', methods=['POST'])
def add_student():
    data = request.json
    student = Student(**data)
    db.session.add(student)
    db.session.commit()
    return jsonify({'message': 'Student added'}), 201

@bp.route('/', methods=['GET'])
def list_students():
    query = Student.query

    # Filter by ID
    if request.args.get('id'):
        query = query.filter(Student.id == request.args.get('id'))

    # Filter by name
    if request.args.get('name'):
        query = query.filter(Student.name.ilike(f"%{request.args['name']}%"))

    # Filter by class
    if request.args.get('class'):
        query = query.filter(Student.class_grade == request.args['class'])

    # Filter by vaccinated status (yes/no)
    vaccinated_param = request.args.get('vaccinated')
    if vaccinated_param in ['yes', 'no']:
        from models import VaccinationStatus
        vaccinated_ids = {v.student_id for v in VaccinationStatus.query.all()}
        if vaccinated_param == 'yes':
            query = query.filter(Student.id.in_(vaccinated_ids))
        else:
            query = query.filter(~Student.id.in_(vaccinated_ids))

    students = query.all()
    return jsonify([{
        'id': s.id,
        'name': s.name,
        'class_grade': s.class_grade
    } for s in students])

@bp.route('/upload', methods=['POST'])
def upload_csv():
    file = request.files['file']
    rows = parse_csv_upload(file)
    for row in rows:
        student = Student(name=row['name'], class_grade=row['class'])
        db.session.add(student)
    db.session.commit()
    return jsonify({'message': 'CSV uploaded'}), 201


@bp.route('/<int:student_id>', methods=['DELETE'])
def delete_student(student_id):
    student = Student.query.get_or_404(student_id)
    db.session.delete(student)
    db.session.commit()
    return jsonify({'message': 'Student deleted'}), 200
