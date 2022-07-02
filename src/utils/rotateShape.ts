import { point } from '../types/point';
import { shape } from '../types/shape';

export function rotateShape(_shape: shape, mousePos: point): shape {
    const shape = { ..._shape };

    if (shape.type == 'polygon') {
        const center = { x: 0, y: 0 };
        shape.points.forEach((p) => {
            center.x += p.x;
            center.y += p.y;
        });
        center.x = Math.round(center.x / shape.points.length);
        center.y = Math.round(center.y / shape.points.length);

        let angle = findAngle({
            x: mousePos.x - center.x,
            y: mousePos.y - center.y,
        });

        shape.rotation = angle;
    } else if (shape.type == 'ellipse') {
        const angle = findAngle({
            x: mousePos.x - shape.center.x,
            y: mousePos.y - shape.center.y,
        });

        if (shape.rotation) {
            shape.rotation += angle;
        } else {
            shape.rotation = angle;
        }
    }

    return shape;
}

function findAngle(v: point) {
    return Math.atan2(v.y, v.x) + Math.PI / 2;
}
