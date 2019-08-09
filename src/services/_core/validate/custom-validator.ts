export class CustomValidator {
  // Validates numbers
  static numberValidator(number): any {
    if (number.pristine) {
      return null;
    }
    const NUMBER_REGEXP = /^-?[\d.]+(?:e-?\d+)?$/;
    number.markAsTouched();
    if (NUMBER_REGEXP.test(number.value)) {
      return null;
    }
    return {
      invalidNumber: true
    };
  }

  // Validates phone numbers
  static phoneValidator(phone): any {
    if (phone.pristine) {
      return null;
    }
    const PHONE_REGEXP = /^[0-9]{10}$/;
    phone.markAsTouched();
    if (PHONE_REGEXP.test(phone.value)) {
      return null;
    }
    return {
      invalidPhone: true
    };
  }

  // validates email
  static emailValidator(email): any {
    if (email.pristine) {
      return null;
    }
    const EMAIL_REGEXP = /^[A-Za-z0-9.]+@[A-Za-z0-9.]+$/;
    email.markAsTouched();
    if (EMAIL_REGEXP.test(email.value)) {
      return null;
    }
    return {
      invalidEmail: true
    };
  }

  // validates password
  static passwordValidator(password): any {
    if (password.pristine) {
      return null;
    }
    password.markAsTouched();
    if (password.value.toString().localeCompare('') !== 0) {
      return null;
    }
    return {
      invalidPassword: true
    };
  }

}
