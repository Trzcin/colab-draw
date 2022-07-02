import { point } from '../types/point';

export function lineToPointDist(l1: point, l2: point, p: point) {
    const a = (l1.y - l2.y) / (l1.x - l2.x);
    const b = l1.y - a * l1.x;

    const A = a;
    const B = -1;
    const C = b;

    const top = Math.abs(A * p.x + B * p.y + C);
    const bot = Math.sqrt(A * A + B * B);

    return top / bot;
}
