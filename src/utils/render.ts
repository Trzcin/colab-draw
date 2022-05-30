import { point } from '../types/point';
import { shape } from '../types/shape';

export function render(
    ctx: CanvasRenderingContext2D,
    shapes: shape[],
    CANVAS_COLOR: string,
    showPoints?: boolean
) {
    // clear canvas
    ctx.fillStyle = CANVAS_COLOR;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.restore();

    for (let shape of shapes) {
        ctx.strokeStyle = shape.color;
        ctx.moveTo(shape.points[0].x, shape.points[0].y);
        ctx.beginPath();

        if (shape.handDrawn && shape.points.length >= 3) {
            for (let i = 0; i < shape.points.length - 1; i++) {
                const xc = (shape.points[i].x + shape.points[i + 1].x) / 2;
                const yc = (shape.points[i].y + shape.points[i + 1].y) / 2;

                ctx.quadraticCurveTo(
                    shape.points[i].x,
                    shape.points[i].y,
                    xc,
                    yc
                );
            }
            ctx.lineTo(
                shape.points[shape.points.length - 1].x,
                shape.points[shape.points.length - 1].y
            );

            ctx.stroke();
        } else {
            for (let i = 1; i < shape.points.length; i++) {
                ctx.lineTo(shape.points[i].x, shape.points[i].y);
            }
            ctx.stroke();
        }

        if (showPoints) {
            ctx.fillStyle = 'red';
            for (let p of shape.points) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}
