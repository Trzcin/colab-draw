import { point } from '../types/point';
import { pointToPointDist } from './pointToPointDist';

export function pointToSegmentDist(l1: point, l2: point, p: point) {
    const l = pointToPointDist(l1, l2);
    if (l === 0) return pointToPointDist(p, l1);

    let t =
        ((p.x - l1.x) * (l2.x - l1.x) + (p.y - l1.y) * (l2.y - l1.y)) / (l * l);
    t = Math.max(0, Math.min(1, t));
    const result = pointToPointDist(p, {
        x: l1.x + t * (l2.x - l1.x),
        y: l1.y + t * (l2.y - l1.y),
    });

    return result;
}
