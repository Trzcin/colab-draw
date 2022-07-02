import { point } from '../types/point';

export function rotatePoint(point: point, around: point, radians: number) {
    const newPoint = {
        x: point.x - around.x,
        y: point.y - around.y,
    };

    newPoint.x =
        newPoint.x * Math.cos(radians) - newPoint.y * Math.sin(radians);
    newPoint.y =
        newPoint.y * Math.cos(radians) + newPoint.x * Math.sin(radians);

    newPoint.x += around.x;
    newPoint.y += around.y;
    newPoint.x = Math.round(newPoint.x);
    newPoint.y = Math.round(newPoint.y);
    return newPoint;
}
