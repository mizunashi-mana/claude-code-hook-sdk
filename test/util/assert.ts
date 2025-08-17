import { type Newable } from 'inversify';
import { expect } from 'vitest';

export function assertStrictEqual<T>(actual: unknown, expectVal: T): asserts actual is T {
  expect(actual).toStrictEqual(expectVal);
}

export function assertInstanceOf<T>(actual: unknown, expectClass: Newable<T>): asserts actual is T {
  expect(actual).toBeInstanceOf(expectClass);
}
