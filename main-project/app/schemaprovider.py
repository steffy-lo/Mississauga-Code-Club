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
        "required": ["classId", "sectionTitle", "weightInfo"]
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

    edit_hours = {
        "type": "object",
        "properties": {
            "currentId":{"type": "string"},
            "newAttributes": {"type": "object",
                              "properties": {
                                  "dateTime": {"type": "string"},
                                  "hours": {"type": "string"},
                                  "paid": {"type": "boolean"},
                                  "purpose": {"type": "string"}
                                },
                              }

        },
        "required": ["currentId", "newAttributes"]
    }

    edit_user = {
        "type": "object",
        "properties": {
            "currentEmail": {"type": "string"},
            "newAttributes": {"type": "object",
                              "properties": {
                                  "birthday": {"type": "string"},
                                  "firstName": {"type": "string"},
                                  "lastName": {"type": "string"},
                                  "parentEmail": {"type": "string"},
                                  "parentName": {"type": "string"},
                                  "phoneNumber": {"type": "string"}
                                }
                              }

        },
        "required": ["currentEmail", "newAttributes"]
    }

    move_user = {
        "type": "object",
        "properties": {
            "email": {"type": "string"},
            "classId":  {"type": "string"}
        },
        "required": ["email", "classId"]
    }

    create_user = {
        "type": "object",
        "properties": {
            "email": {"type":"string"},
            "password": {"type":"string"},
            "userType": {"type": "number"},
            "firstName": {"type":"string"},
            "lastName": {"type":"string"},
            "phoneNumber": {"type":"string"},
            "birthday": {"type":"string"},
            "parentEmail": {"type":"string"},
            "parentName": {"type":"string"}
        },
        "required": ["email", "password", "userType", "firstName", "lastName", "phoneNumber", "birthday",
                     "parentEmail", "parentName"]
    }




if __name__ == "__main__":
    print("This file should not be executed directly.")
