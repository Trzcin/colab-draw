import { shape } from '../types/shape';
import { findShapeCenter } from './findShapeCenter';

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
        ctx.lineWidth = shape.lineWidth;

        if (shape.type == 'polygon') {
            ctx.save();
            const center = findShapeCenter(shape);

            const transform = ctx.getTransform();
            const translate = {
                x: center.x - transform.e,
                y: center.y - transform.f,
            };
            ctx.translate(translate.x, translate.y);
            ctx.rotate(shape.rotation ?? 0);

            ctx.moveTo(
                shape.points[0].x - translate.x,
                shape.points[0].y - translate.y
            );
            ctx.beginPath();

            if (shape.handDrawn && shape.points.length >= 3) {
                for (let i = 0; i < shape.points.length - 1; i++) {
                    const xc =
                        (shape.points[i].x + shape.points[i + 1].x) / 2 -
                        translate.x;
                    const yc =
                        (shape.points[i].y + shape.points[i + 1].y) / 2 -
                        translate.y;
                    ctx.quadraticCurveTo(
                        shape.points[i].x - translate.x,
                        shape.points[i].y - translate.y,
                        xc,
                        yc
                    );
                }
                ctx.lineTo(
                    shape.points[shape.points.length - 1].x - translate.x,
                    shape.points[shape.points.length - 1].y - translate.y
                );

                ctx.stroke();
            } else {
                for (let i = 0; i < shape.points.length; i++) {
                    ctx.lineTo(
                        shape.points[i].x - translate.x,
                        shape.points[i].y - translate.y
                    );
                }
                ctx.stroke();
            }

            if (showPoints) {
                ctx.fillStyle = 'red';
                for (let p of shape.points) {
                    ctx.beginPath();
                    ctx.arc(
                        p.x - translate.x,
                        p.y - translate.y,
                        5,
                        0,
                        Math.PI * 2
                    );
                    ctx.fill();
                }
            }

            ctx.restore();
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.arc(center.x, center.y, 10, 0, Math.PI * 2);
            ctx.fill();
        } else if (shape.type == 'ellipse') {
            ctx.beginPath();
            ctx.ellipse(
                shape.center.x,
                shape.center.y,
                shape.radius.x,
                shape.radius.y,
                shape.rotation ?? 0,
                0,
                Math.PI * 2
            );
            ctx.stroke();
        }
    }
}
