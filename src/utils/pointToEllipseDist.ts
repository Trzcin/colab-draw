import { point } from '../types/point';
import { pointToPointDist } from './pointToPointDist';

// https://stackoverflow.com/questions/22959698/distance-from-given-point-to-given-ellipse
export function pointToEllipseDist(
    center: point,
    a: number,
    b: number,
    p_g: point
) {
    const p = { x: p_g.x - center.x, y: p_g.y - center.y };
    const px = Math.abs(p.x);
    const py = Math.abs(p.y);

    let tx = 0.707;
    let ty = 0.707;

    for (let i = 0; i < 3; i++) {
        const x = a * tx;
        const y = b * ty;

        const ex = ((a * a - b * b) * Math.pow(tx, 3)) / a;
        const ey = ((b * b - a * a) * Math.pow(ty, 3)) / b;

        const rx = x - ex;
        const ry = y - ey;

        const qx = px - ex;
        const qy = py - ey;

        const r = Math.hypot(ry, rx);
        const q = Math.hypot(qy, qx);

        tx = Math.min(1, Math.max(0, ((qx * r) / q + ex) / a));
        ty = Math.min(1, Math.max(0, ((qy * r) / q + ey) / b));
        const t = Math.hypot(ty, tx);
        tx /= t;
        ty /= t;
    }

    const bestPoint = {
        x: a * tx * Math.sign(p.x),
        y: b * ty * Math.sign(p.y),
    };

    return pointToPointDist(bestPoint, p);
}
