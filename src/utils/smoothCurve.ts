import { point } from '../types/point';

const EPSILON = 1.5;

export function simplifyCurve(points: point[]) {
    const result = DouglasPeucker(points);
    if (result.length < 3) {
        return points;
    } else {
        return result;
    }
}

// https://en.wikipedia.org/wiki/Ramer%E2%80%93Douglas%E2%80%93Peucker_algorithm
function DouglasPeucker(points: point[]): point[] {
    let max_dist = 0;
    let max_ind = 0;

    for (let i = 1; i < points.length - 1; i++) {
        const dist = lineToPointDist(
            points[0],
            points[points.length - 1],
            points[i]
        );

        if (dist > max_dist) {
            max_dist = dist;
            max_ind = i;
        }
    }

    let resultPoints: point[] = [];

    if (max_dist > EPSILON) {
        const recResults1 = DouglasPeucker(points.slice(0, max_ind + 1));
        recResults1.pop();
        const recResults2 = DouglasPeucker(points.slice(max_ind));

        resultPoints = [...recResults1, ...recResults2];
    } else {
        resultPoints = [points[0], points[points.length - 1]];
    }

    return resultPoints;
}

function lineToPointDist(l1: point, l2: point, p: point) {
    const a = (l1.y - l2.y) / (l1.x - l2.x);
    const b = l1.y - a * l1.x;

    const A = a;
    const B = -1;
    const C = b;

    const top = Math.abs(A * p.x + B * p.y + C);
    const bot = Math.sqrt(A * A + B * B);

    return top / bot;
}
