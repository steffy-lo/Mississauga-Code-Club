from reportlab.pdfgen import canvas


def hours(user_id, hrs, paid_hrs):
    '''
    Generate an hours report for user. This report could reflect the amount of time they volunteered,
    or worked for MCC.

    user_id: The user's email who's volunteer/work hours have been requested
    hrs: A list of floats representing hours associated with user_id

    :return: File name of created report as a string
    '''

    total_hrs = 0

    for h in hrs:
        total_hrs += h

    #TODO: Consider better folder structure for reports. At the moment they're stored in app/ folder of container.
    c = canvas.Canvas("app/report_hours_{}.pdf".format(user_id))

    c.drawString(100, 750, "{} hours for MCC member: {}".format('Paid' if paid_hrs else 'Volunteer', user_id))
    c.drawString(100, 700, "Total hours: {}".format(total_hrs))
    c.showPage()
    c.save()

    return "report_hours_{}.pdf".format(user_id)

