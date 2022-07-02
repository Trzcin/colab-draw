import { point } from '../types/point';
import { shape } from '../types/shape';

export function findShapeCenter(shape: shape): point {
    if (shape.type == 'ellipse') {
        return shape.center;
    }

    const leftTop = { x: Infinity, y: Infinity };
    const rightBottom = { x: 0, y: 0 };
    for (let p of shape.points) {
        leftTop.x = Math.min(leftTop.x, p.x);
        leftTop.y = Math.min(leftTop.y, p.y);
        rightBottom.x = Math.max(rightBottom.x, p.x);
        rightBottom.y = Math.max(rightBottom.y, p.y);
    }
    const center = {
        x: Math.round((leftTop.x + rightBottom.x) / 2),
        y: Math.round((leftTop.y + rightBottom.y) / 2),
    };

    return center;
}
