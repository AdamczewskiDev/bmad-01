import { IsStrongPassword } from './strong-password.validator';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

class TestDto {
  @IsStrongPassword()
  password: string;
}

describe('IsStrongPassword', () => {
  it('powinien zaakceptować silne hasło', async () => {
    const dto = plainToInstance(TestDto, {
      password: 'SecurePassword123!',
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('powinien odrzucić hasło krótsze niż 8 znaków', async () => {
    const dto = plainToInstance(TestDto, {
      password: 'Short1!',
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('password');
    expect(errors[0].constraints).toHaveProperty('isStrongPassword');
    expect(errors[0].constraints.isStrongPassword).toContain('minimum 8 znaków');
  });

  it('powinien odrzucić hasło bez wielkiej litery', async () => {
    const dto = plainToInstance(TestDto, {
      password: 'securepassword123!',
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('password');
  });

  it('powinien odrzucić hasło bez małej litery', async () => {
    const dto = plainToInstance(TestDto, {
      password: 'SECUREPASSWORD123!',
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('password');
  });

  it('powinien odrzucić hasło bez cyfry', async () => {
    const dto = plainToInstance(TestDto, {
      password: 'SecurePassword!',
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('password');
  });

  it('powinien odrzucić hasło bez znaku specjalnego', async () => {
    const dto = plainToInstance(TestDto, {
      password: 'SecurePassword123',
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('password');
  });

  it('powinien odrzucić pusty string', async () => {
    const dto = plainToInstance(TestDto, {
      password: '',
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('password');
  });

  it('powinien odrzucić null', async () => {
    const dto = plainToInstance(TestDto, {
      password: null,
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('password');
  });
});

