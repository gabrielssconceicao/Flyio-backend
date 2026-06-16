import { InvalidUsernameError } from '../errors/invalid-username-error';
import { Username } from './username';

describe('Value Object: Username', () => {
  it.each(['j0nh', 'doe_john', 'johnD0e'])('%s should a valid username', (username) => {
    const result = Username.create(username);

    expect(result.isRight()).toBe(true);
  });

  it('should be normalized', () => {
    const result = Username.create('     j0nh     ');

    if (result.isRight()) {
      expect(result.value.value).toBe('j0nh');
    }
  });

  it.each(['jh', 'j$oh@', 'john'.repeat(10)])('%s should be an invalid username', (username) => {
    const result = Username.create(username);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidUsernameError);
  });
});
