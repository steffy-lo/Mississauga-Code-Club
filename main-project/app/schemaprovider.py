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
            "mark": {"type": "object"},
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

    # schema for route: /api/setmarkingsection
    set_marking = {
        "type": "object",
        "properties": {
            "classId": {"type": "string"},
            "sectionTitle": {"type": "string"},
            "weightInfo": {"type": "object",
                           "properties": {
                              "weight": {"type": "number"},
                               "index": {"type": "number"}
                            },
                           "required": ["weight", "index"]
                           }
        },
        "required": ["classID", "sectionTitle", "weightInfo"]
    }

    set_mark = {
        "type": "object",
        "properties": {
            "classId": {"type": "string"},
            "studentEmail": {"type": "string"},
            "sectionTitle": {"type": "string"},
            "mark": {"type": "number"}
        },
        "required": ["classID", "sectionTitle", "studentEmail", "mark"]
    }

    update_CI = {
        "type": "object",
        "properties": {
            "classId": {"type": "string"},
            "status": {"type": "boolean"},
            "newTitle": {"type": "string"}
        },
        "required": ["classId", "status", "newTitle"]
    }

    get_class = {
        "type": "object",
        "properties": {
            "_id": {"type": "string"}
        },
        "required": ["_id"]
    }




if __name__ == "__main__":
    print("This file should not be executed directly.")
