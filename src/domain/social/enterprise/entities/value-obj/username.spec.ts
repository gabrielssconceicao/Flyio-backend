import { InvalidUsernameError } from './errors/invalid-username-error';
import { Username } from './username';

describe('Username Value Object', () => {
  it('should be able to create an username', () => {
    const username = Username.create('jonhDoe_23');

    expect(username.value).toBe('jonhDoe_23');
  });

  it('should not be able to create an invalid username', () => {
    expect(() => Username.create('invalid_username.com')).toThrow(
      InvalidUsernameError,
    );
    expect(() => Username.create('@invalid_username')).toThrow(
      InvalidUsernameError,
    );
    expect(() => Username.create('invalid username')).toThrow(
      InvalidUsernameError,
    );
    expect(() => Username.create('invalid@username')).toThrow(
      InvalidUsernameError,
    );
    expect(() => Username.create('invalid.username')).toThrow(
      InvalidUsernameError,
    );
  });
});
