import { point } from '../types/point';

export const pointToPointDist = (p1: point, p2: point) => {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
};
