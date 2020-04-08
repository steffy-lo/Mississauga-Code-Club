"""
SchemaFactory will provide schemas for database
validation.

The benefits include only having to generate the schemas once
as well as decluttering main.py
"""


class SchemaFactory:

    example = {'field': {'type': 'number'}}

    #schema for route: /api/report/
    report_hours = {
        "type": "object",
        "properties": {
            "email": {"type": "string"},
            "paid": {"type": "number"},
            "startRange": {"type": "string"},
            "endRange": {"type": "string"}
        }
    }

    report_update = {
        "type": "object",
        "properties": {
            "classId": {"type": "string"},
            "email": {"type": "string"},
            "mark": {"type": "number"},
            "comments": {"type": "string"},
            "nextCourse": {"type": "string"}
        },
        "required": ["classId", "email"]
    }

    # schema for route: /api/report/, method name getStudentReport()
    report_student = {
        "type": "object",
        "properties": {
            "classId": {"type": "string"},
            "email": {"type": "string"},
        },
        "required": ["classId", "email"]
    }


if __name__ == "__main__":
    print("This file should not be executed directly.")
