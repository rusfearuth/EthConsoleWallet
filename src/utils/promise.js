// @flow

export const delay = (time: number): (any => Promise<*>) => (
  result,
): Promise<*> =>
  new Promise(resolve => setTimeout(() => resolve(result), time));
