import { Either, left, right } from './either';

function doSomething(shouldSuccess: boolean): Either<string, number> {
  if (shouldSuccess) {
    return right(10);
  } else {
    return left('error');
  }
}

test('success result', () => {
  const result = doSomething(true);

  expect(result.isRight()).toBe(true);
  expect(result.isLeft()).toBe(false);
  expect(result.value).toBe(10);
});
test('success result', () => {
  const result = doSomething(false);

  expect(result.isLeft()).toBe(true);
  expect(result.isRight()).toBe(false);
  expect(result.value).toBe('error');
});
