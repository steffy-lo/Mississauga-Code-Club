from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.lib.styles import getSampleStyleSheet
import datetime

def hours(user_id, hrs, paid_hrs):
    '''
    Generate an hours report for user. This report could reflect the amount of time they volunteered,
    or worked for MCC.

    user_id: The user's email who's volunteer/work hours have been requested
    hrs: A list of floats representing hours associated with user_id

    :return: File name of created report as a string
    '''

    date = datetime.date.today().strftime('%d/%m/%y')
    total_hrs = 0

    for h in hrs:
        total_hrs += h

    hrs_type = 'paid' if paid_hrs else 'volunteer'

    file_name = "report_{}_hours_{}.pdf".format(hrs_type, user_id)

    #dev/production path: "app/" + file_name
    #test path: file_name
    doc = SimpleDocTemplate(file_name,
                            pagesize=letter,
                            rightMargin=72,
                            leftMargin=72,
                            topMargin=124,
                            bottomMargin=18
                            )

    #TODO: Consider better folder structure for reports. At the moment they're stored in app/ folder of container.

    styles = getSampleStyleSheet()

    flowables = [
        Paragraph("<img src='static/mcc-logo.png' width='2.40in' height='1.15in' />", style=styles["Normal"]),
        Paragraph("3195 Erindale Station Rd unit 204, Mississauga, ON L5C 1Y5", style=styles["BodyText"]),
        Paragraph("(416) 992-3281", style=styles["Normal"]),
        Paragraph("info@mcode.club", style=styles["Normal"]),
        Paragraph("{}".format(date), style=styles["BodyText"]),
        Paragraph("", style=styles["BodyText"]),
        Paragraph("", style=styles["BodyText"]),
        Paragraph("This serves as notice that MCC member <b>{}</b> \
                    has accumulated <u>{}</u> hours of {} time.".format(user_id, total_hrs, hrs_type),
                  style=styles["BodyText"]),
        Paragraph("", style=styles["BodyText"]),
        Paragraph("", style=styles["BodyText"]),
        Paragraph("If you have any questions or concerns regarding the information in this document, please \
                    contact info@mcode.club.", style=styles["BodyText"])
    ]

    doc.build(flowables)

    return file_name


if __name__ == "__main__":
    # For testing purposes
    user_id = "test@volunteer.com"
    hrs = [1, 2, 3, 4, 5]
    paid_hrs = False
    hours(user_id, hrs, paid_hrs)
