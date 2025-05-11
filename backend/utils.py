import csv
from io import StringIO
from flask import Response

def parse_csv_upload(file_stream):
    file = StringIO(file_stream.read().decode())
    reader = csv.DictReader(file)
    return [row for row in reader]

def generate_csv_response(rows, headers, filename='report.csv'):
    output = StringIO()
    writer = csv.DictWriter(output, fieldnames=headers)
    writer.writeheader()
    writer.writerows(rows)
    response = Response(output.getvalue(), mimetype='text/csv')
    response.headers["Content-Disposition"] = f"attachment; filename={filename}"
    return response
