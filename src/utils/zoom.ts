import { point } from '../types/point';

export function zoom(
    factor: number,
    ctx: CanvasRenderingContext2D,
    mousePos: point
) {
    const transform = ctx.getTransform();

    ctx.translate(mousePos.x - transform.e, mousePos.y - transform.f);
    ctx.scale(factor, factor);

    // after scaling we need to go back 1/factor times as far to end up with the same canvasOrigin
    ctx.translate(transform.e - mousePos.x, transform.f - mousePos.y);
}
