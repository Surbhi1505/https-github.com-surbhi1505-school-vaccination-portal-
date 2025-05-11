# backend/models.py
from extensions import db
from datetime import datetime

class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    class_grade = db.Column(db.String(10), nullable=False)
    dob = db.Column(db.String(20))
    gender = db.Column(db.String(10))

class VaccinationDrive(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    vaccine_name = db.Column(db.String(50), nullable=False)
    date = db.Column(db.Date, nullable=False)
    doses_available = db.Column(db.Integer, nullable=False)
    applicable_classes = db.Column(db.String(100), nullable=False)

class VaccinationStatus(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'))
    drive_id = db.Column(db.Integer, db.ForeignKey('vaccination_drive.id'))
    vaccine_name = db.Column(db.String(50))
    vaccinated_on = db.Column(db.Date, default=datetime.utcnow)
