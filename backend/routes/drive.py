from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify
from models import db, VaccinationDrive, VaccinationStatus

bp = Blueprint('drives', __name__, url_prefix='/drives')

@bp.route('/', methods=['POST'])
def create_drive():
    data = request.json
    try:
        data['date'] = datetime.strptime(data['date'], '%Y-%m-%d').date()
        data['doses_available'] = int(data['doses_available'])
    except Exception:
        return jsonify({'error': 'Invalid date or dose format'}), 400

    if data['date'] <= datetime.today().date() + timedelta(days=14):
        return jsonify({'error': 'Drives must be scheduled at least 15 days in advance'}), 400

    existing = VaccinationDrive.query.filter_by(vaccine_name=data['vaccine_name'], date=data['date']).first()
    if existing:
        return jsonify({'error': 'Drive already exists for this vaccine on this date'}), 400

    drive = VaccinationDrive(**data)
    db.session.add(drive)
    db.session.commit()
    return jsonify({'message': 'Drive created'}), 201


@bp.route('/', methods=['GET'])
def list_drives():
    drives = VaccinationDrive.query.order_by(VaccinationDrive.date.asc()).all()
    result = []

    for d in drives:
        used = VaccinationStatus.query.filter_by(drive_id=d.id).count()
        remaining = max(0, d.doses_available - used)
        result.append({
            'id': d.id,
            'vaccine_name': d.vaccine_name,
            'date': d.date.strftime('%Y-%m-%d'),
            'doses_available': d.doses_available,
            'remaining_doses': remaining,
            'applicable_classes': d.applicable_classes
        })

    return jsonify(result)


@bp.route('/<int:id>', methods=['PUT'])
def update_drive(id):
    drive = VaccinationDrive.query.get_or_404(id)
    if drive.date <= datetime.today().date():
        return jsonify({'error': 'Cannot edit past drives'}), 400

    data = request.json
    if 'date' in data:
        try:
            new_date = datetime.strptime(data['date'], '%Y-%m-%d').date()
            if new_date <= datetime.today().date() + timedelta(days=14):
                return jsonify({'error': 'Date must be at least 15 days in the future'}), 400
            data['date'] = new_date
        except ValueError:
            return jsonify({'error': 'Invalid date format'}), 400

    if 'doses_available' in data:
        try:
            data['doses_available'] = int(data['doses_available'])
        except ValueError:
            return jsonify({'error': 'Doses must be a number'}), 400

    for key in ['vaccine_name', 'date', 'doses_available', 'applicable_classes']:
        if key in data:
            setattr(drive, key, data[key])

    db.session.commit()
    return jsonify({'message': 'Drive updated'}), 200

@bp.route('/<int:id>', methods=['DELETE'])
def delete_drive(id):
    drive = VaccinationDrive.query.get_or_404(id)
    if drive.date <= datetime.today().date():
        return jsonify({'error': 'Cannot delete past drives'}), 400
    db.session.delete(drive)
    db.session.commit()
    return jsonify({'message': 'Drive deleted'}), 200
