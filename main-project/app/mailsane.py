from email_validator import validate_email, EmailNotValidError

class NormalizedEmail:
    def __init__(self, text, error=False):
        self.text = text
        self.error = error
    def __str__(self):
        return self.text

def normalize(email):
    try:
        v = validate_email(email)
        return NormalizedEmail(v['email'])
    except EmailNotValidError as e:
        return NormalizedEmail(str(e), error=True)
