import { left, right } from './either';

describe('Either', () => {
  it('should create a right value', () => {
    const result = right('success');

    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
  });

  it('should create a left value', () => {
    const result = left('error');

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
  });

  it('should store left value', () => {
    const result = left('error');

    expect(result.value).toBe('error');
  });

  it('should store right value', () => {
    const result = right('success');

    expect(result.value).toBe('success');
  });
});
