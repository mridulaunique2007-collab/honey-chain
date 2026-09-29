from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)


def get_db_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
        port=int(os.getenv("DB_PORT", 3306))
    )


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "success",
        "message": "Honey Chain backend is running"
    })


@app.route("/api/db-test", methods=["GET"])
def db_test():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute("SELECT DATABASE();")
        database = cursor.fetchone()[0]

        cursor.close()
        connection.close()

        return jsonify({
            "status": "success",
            "message": "MySQL connection successful",
            "database": database
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
@app.route("/api/hives", methods=["GET"])
def get_hives():
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("SELECT * FROM hives")
        hives = cursor.fetchall()

        cursor.close()
        connection.close()

        return jsonify({
            "status": "success",
            "hives": hives
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
@app.route("/api/honey-batches", methods=["GET"])
def get_honey_batches():
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("SELECT * FROM honey_batches")
        batches = cursor.fetchall()

        cursor.close()
        connection.close()

        return jsonify({
            "status": "success",
            "batches": batches
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
@app.route("/api/sensor-data", methods=["GET"])
def get_sensor_data():
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("SELECT * FROM sensor_data ORDER BY id DESC")
        sensor_data = cursor.fetchall()

        cursor.close()
        connection.close()

        return jsonify({
            "status": "success",
            "sensor_data": sensor_data
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
@app.route("/api/quality-tests", methods=["GET"])
def get_quality_tests():
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                id,
                batch_code,
                moisture_percent,
                quality_grade,
                test_result,
                tested_date,
                created_at
            FROM quality_tests
            ORDER BY id DESC
        """)

        quality_tests = cursor.fetchall()

        cursor.close()
        connection.close()

        return jsonify({
            "status": "success",
            "quality_tests": quality_tests
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)