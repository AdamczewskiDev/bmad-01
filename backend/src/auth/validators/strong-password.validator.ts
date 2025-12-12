import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isStrongPassword', async: false })
export class IsStrongPasswordConstraint implements ValidatorConstraintInterface {
  validate(password: string, args: ValidationArguments) {
    if (!password || typeof password !== 'string') {
      return false;
    }

    // Minimum 8 znaków
    if (password.length < 8) {
      return false;
    }

    // Co najmniej jedna wielka litera
    if (!/[A-Z]/.test(password)) {
      return false;
    }

    // Co najmniej jedna mała litera
    if (!/[a-z]/.test(password)) {
      return false;
    }

    // Co najmniej jedna cyfra
    if (!/[0-9]/.test(password)) {
      return false;
    }

    // Co najmniej jeden znak specjalny
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Hasło musi zawierać minimum 8 znaków, w tym co najmniej jedną wielką literę, jedną małą literę, jedną cyfrę i jeden znak specjalny';
  }
}

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsStrongPasswordConstraint,
    });
  };
}

