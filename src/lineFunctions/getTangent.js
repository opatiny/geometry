'use strict';

const getMediator = require('./getMediator');
const getLineFromPoints = require('./getLineFromPoints');
const linesIntersection = require('./getLinesIntersection');
const getPerpendicular = require('./getPerpendicular');

/**
 * Returns a line tangent to a point when three points are given
 * @param {object} [previousPoint] - Point before in the format { x: 42, y:5 }
 * @param {object} [point] - Point to which the tangent is desired in the format { x: 42, y:5 }
 * @param {object} [nextPoint] - Point after in the format { x: 42, y:5 }
 * @param {object} [options={}]
 * @param {number} [options.threshold = 1e-14] - Over this uncertainty in %, returns an error message
 * @return {object} tangent
 */
function getTangent(previousPoint, point, nextPoint, options = {}) {
  const { threshold = 1e-14 } = options;

  var checkX = Math.abs(nextPoint.x - point.x - (point.x - previousPoint.x));
  var checkY = Math.abs(nextPoint.y - point.y - (point.y - previousPoint.y));

  if (checkX < 1e-14 && checkY < 1e-14) {
    var tangent = getLineFromPoints(point, nextPoint);
  } else {
    var mediator1 = getMediator(previousPoint, point, { threshold: threshold });
    var mediator2 = getMediator(point, nextPoint, { threshold: threshold });
    var mediator3 = getMediator(previousPoint, nextPoint, {
      threshold: threshold
    });

    var centerPoint1 = linesIntersection(mediator1, mediator2);
    var centerPoint2 = linesIntersection(mediator2, mediator3);

    var diffX =
      Math.abs(centerPoint1.x - centerPoint2.x) /
      (centerPoint1.x + centerPoint2.x) /
      2; // expressing the uncertainty proportionally to the component
    var diffY =
      Math.abs(centerPoint1.y - centerPoint2.y) /
      (centerPoint1.y + centerPoint2.y) /
      2; // expressing the uncertainty proportionally to the component;

    if (diffX > threshold || diffY > threshold) {
      throw new Error(
        `The three mediators do not intercept in a unique point. differences: x ${diffX}  y ${diffY}  VS threshold ${threshold}`
      );
    } else {
      var centerPoint = centerPoint1;
    }

    var radiusLine = getLineFromPoints(centerPoint, point);
    tangent = getPerpendicular(radiusLine, point, { threshold: threshold });
  }
  return tangent;
}

module.exports = getTangent;
