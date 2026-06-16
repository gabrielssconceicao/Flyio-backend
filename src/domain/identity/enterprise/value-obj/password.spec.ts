import { InvalidPasswordError } from '../errors/invalid-password-error';
import { Password } from './password';

describe('Value Object: Password', () => {
  it.each(['myPassw@rd345', 'Tes7@'.repeat(3)])('%s should a valid password', (password) => {
    const result = Password.create(password);

    expect(result.isRight()).toBe(true);
  });

  it('should be normalized', () => {
    const result = Password.create('     myPassw@rd345     ');

    if (result.isRight()) {
      expect(result.value.value).toBe('myPassw@rd345');
    }
  });

  it.each(['myPassw@rd', 'myPassw@rd$', 'tR@34', 'tR@34'.repeat(10)])(
    '%s should be an invalid password',
    (password) => {
      const result = Password.create(password);

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(InvalidPasswordError);
    },
  );
});
