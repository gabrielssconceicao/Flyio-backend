import { Email } from './email';
import { InvalidEmailError } from './errors/invalid-email-error';

describe('Email Value Object', () => {
  it('should be able to create an email', () => {
    expect(Email.create('teste@example.com').value).toBe('teste@example.com');
    expect(Email.create('teste.user@example.com').value).toBe(
      'teste.user@example.com',
    );
    expect(Email.create('user.name+tag@example.com').value).toBe(
      'user.name+tag@example.com',
    );
  });

  it('should not be able to create an invalid email', () => {
    expect(() => Email.create('')).toThrow(InvalidEmailError);
    expect(() => Email.create('test@example')).toThrow(InvalidEmailError);
    expect(() => Email.create('test@.com')).toThrow(InvalidEmailError);
    expect(() => Email.create('test@.com.')).toThrow(InvalidEmailError);
  });
});
