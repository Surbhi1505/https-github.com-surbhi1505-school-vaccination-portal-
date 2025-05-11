# backend/app.py

from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import db

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    CORS(app)

    with app.app_context():
        from models import Student, VaccinationDrive, VaccinationStatus
        db.create_all()

        from routes import auth, student, drive, vaccination, report, dashboard
        app.register_blueprint(auth.bp)
        app.register_blueprint(student.bp)
        app.register_blueprint(drive.bp)
        app.register_blueprint(vaccination.bp)
        app.register_blueprint(report.bp)
        app.register_blueprint(dashboard.bp)

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host="0.0.0.0")
