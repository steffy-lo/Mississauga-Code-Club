from email_validator import validate_email, EmailNotValidError

class NormalizedEmail:
    """
    self.text is either the error message from normalization or
    the normalized email (if self.error == False)
    """
    def __init__(self, text, error=False):
        self.text = text
        self.error = error
    def __str__(self):
        return self.text

def normalize(email):
    """
    Returns a NormalizedEmail with the appropriate contents
    """
    try:
        v = validate_email(email)
        return NormalizedEmail(v['email'])
    except EmailNotValidError as e:
        return NormalizedEmail(str(e), error=True)

if __name__ == "__main__":
    print("This file should not be executed directly.")
