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
        if (shape.type == 'polygon') {
            ctx.strokeStyle = shape.color;
            ctx.lineWidth = shape.lineWidth;
            ctx.setLineDash(
                shape.strokeStyle == 'dashed'
                    ? [15, 15]
                    : shape.strokeStyle == 'dotted'
                    ? [5, 10]
                    : [0, 0]
            );
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
        } else if (shape.type == 'ellipse') {
            ctx.strokeStyle = shape.color;
            ctx.lineWidth = shape.lineWidth;
            ctx.setLineDash(
                shape.strokeStyle == 'dashed'
                    ? [15, 15]
                    : shape.strokeStyle == 'dotted'
                    ? [5, 10]
                    : [0, 0]
            );
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
        } else if (shape.type == 'image') {
            if (!shape.imageElement) {
                const img = new Image();
                img.src = `data:image/webp;base64,${shape.base64}`;
                img.onload = () => {
                    if (shape.type == 'image') {
                        ctx.save();
                        const transform = ctx.getTransform();
                        const translate = {
                            x: shape.center.x - transform.e,
                            y: shape.center.y - transform.f,
                        };
                        ctx.translate(translate.x, translate.y);
                        ctx.rotate(shape.rotation ?? 0);

                        if (!shape.size) {
                            shape.size = {
                                x: img.width,
                                y: img.height,
                            };
                        }

                        ctx.drawImage(
                            img,
                            shape.center.x - translate.x - shape.size.x / 2,
                            shape.center.y - translate.y - shape.size.y / 2,
                            shape.size.x,
                            shape.size.y
                        );
                    }
                    ctx.restore();
                };
                shape.imageElement = img;
            } else if (shape.size != undefined) {
                ctx.save();
                const transform = ctx.getTransform();
                const translate = {
                    x: shape.center.x - transform.e,
                    y: shape.center.y - transform.f,
                };
                ctx.translate(translate.x, translate.y);
                ctx.rotate(shape.rotation ?? 0);

                ctx.drawImage(
                    shape.imageElement,
                    shape.center.x - translate.x - shape.size.x / 2,
                    shape.center.y - translate.y - shape.size.y / 2,
                    shape.size.x,
                    shape.size.y
                );

                ctx.restore();
            }
        } else {
            if (shape.editMode) return;

            ctx.save();
            const transform = ctx.getTransform();
            const translate = {
                x: shape.center.x - transform.e,
                y: shape.center.y - transform.f,
            };
            ctx.translate(translate.x, translate.y);
            ctx.rotate(shape.rotation ?? 0);

            ctx.fillStyle = shape.color;
            ctx.font = shape.font;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(
                shape.value,
                shape.center.x - translate.x,
                shape.center.y - translate.y
            );
            ctx.restore();
        }
    }
}
