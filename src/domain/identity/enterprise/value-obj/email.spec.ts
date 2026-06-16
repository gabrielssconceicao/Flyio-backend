import { InvalidEmailError } from '../errors/invalid-email-error';
import { Email } from './email';

describe('Value Object: Email', () => {
  it.each([' jonh@doe.com ', ' jonh_2023@doe.com ', ' jonh+2034@doe.com '])('%s should a valid email', (email) => {
    const result = Email.create(email);

    expect(result.isRight()).toBe(true);
  });

  it('should be normalized', () => {
    const result = Email.create('     jonh@doe.com     ');

    if (result.isRight()) {
      expect(result.value.value).toBe('jonh@doe.com');
    }
  });

  it.each(['jonh$doe.com', 'j$oh@doe'])('%s should be an invalid email', (email) => {
    const result = Email.create(email);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidEmailError);
  });
});
