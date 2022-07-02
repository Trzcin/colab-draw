import { point } from '../types/point';
import { shape } from '../types/shape';
import { findShapeCenter } from './findShapeCenter';
import { rotatePoint } from './rotatePoint';

export function scaleShape(
    _shape: shape,
    moveVector: point,
    fromCenter?: boolean
): shape {
    const shape = { ..._shape };

    if (shape.type == 'polygon') {
        let leftTop = { x: Infinity, y: Infinity };
        const rightBottom = { x: 0, y: 0 };

        shape.points.forEach((p) => {
            leftTop.x = Math.min(leftTop.x, p.x);
            leftTop.y = Math.min(leftTop.y, p.y);
            rightBottom.x = Math.max(rightBottom.x, p.x);
            rightBottom.y = Math.max(rightBottom.y, p.y);
        });
        const factor = {
            x: 1 + moveVector.x / (rightBottom.x - leftTop.x),
            y: 1 + moveVector.y / (rightBottom.y - leftTop.y),
        };

        shape.points = shape.points.map((p) => {
            const diff = {
                x: p.x - leftTop.x,
                y: p.y - leftTop.y,
            };

            return {
                x: Math.round(leftTop.x + diff.x * factor.x),
                y: Math.round(leftTop.y + diff.y * factor.y),
            };
        });
    } else if (shape.type == 'ellipse') {
        const factor = {
            x: 1 + moveVector.x / (2 * shape.radius.x),
            y: 1 + moveVector.y / (2 * shape.radius.y),
        };

        const newRadius = {
            x: shape.radius.x * factor.x,
            y: shape.radius.y * factor.y,
        };
        const diff = {
            x: Math.abs(newRadius.x) - shape.radius.x,
            y: Math.abs(newRadius.y) - shape.radius.y,
        };

        shape.radius = newRadius;
        shape.center = {
            x: shape.center.x + diff.x,
            y: shape.center.y + diff.y,
        };

        if (shape.radius.x < 0) {
            shape.radius.x *= -1;
            shape.center.x -= 2 * shape.radius.x;
        }
        if (shape.radius.y < 0) {
            shape.radius.y *= -1;
            shape.center.y -= 2 * shape.radius.y;
        }
    }

    return shape;
}
