from flask import Blueprint, request, jsonify

bp = Blueprint('auth', __name__, url_prefix='/auth')

# Simulated login
@bp.route('/login', methods=['POST'])
def login():
    data = request.json
    if data['username'] == 'admin' and data['password'] == 'admin':
        return jsonify({'token': 'dummy-token', 'user': 'admin'}), 200
    return jsonify({'error': 'Invalid credentials'}), 401
