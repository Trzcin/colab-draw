import { point } from '../types/point';

export function canvasToScreenPoint(
    ctx: CanvasRenderingContext2D,
    point: point
) {
    const transform = ctx.getTransform();
    const newPoint = { ...point };
    newPoint.x = newPoint.x * transform.a + transform.e;
    newPoint.y = newPoint.y * transform.a + transform.f;
    return newPoint;
}
