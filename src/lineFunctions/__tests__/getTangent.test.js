'use strict';

const getTangent = require('../getTangent');

test('getTangent', () => {
  let result1 = getTangent({ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 });
  expect(result1).toEqual({ offset: 0, slope: 1 });
  let result2 = getTangent({ x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 });
  expect(result2).toEqual({ offset: 2, slope: 0 });
  let result3 = getTangent({ x: 4, y: 2 }, { x: 5, y: 1 }, { x: 6, y: 2 });
  expect(result3).toEqual({ offset: 1, slope: 0 });
});
