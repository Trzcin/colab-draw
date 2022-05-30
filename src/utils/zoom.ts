import { point } from '../types/point';

export function zoom(
    factor: number,
    ctx: CanvasRenderingContext2D,
    canvasOrigin: point,
    mousePos: point,
    setCanvasScale: React.Dispatch<React.SetStateAction<number>>
) {
    setCanvasScale((prev) => prev * factor);

    ctx.translate(mousePos.x - canvasOrigin.x, mousePos.y - canvasOrigin.y);
    ctx.scale(factor, factor);

    // after scaling we need to go back 1/factor times as far to end up with the same canvasOrigin
    ctx.translate(canvasOrigin.x - mousePos.x, canvasOrigin.y - mousePos.y);
}
