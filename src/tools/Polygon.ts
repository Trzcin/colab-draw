import { MouseArguments, tool } from '../types/tool';

export const Polygon: tool = {
    name: 'polygon',
    mouseDown,
    mouseMove,
    mouseUp,
};

function mouseDown(args: MouseArguments) {
    if (!args.isUsingPolygon) {
        args.setShapes((prev) => [
            ...prev,
            {
                id: '',
                type: 'polygon',
                color: args.currColor,
                points: [{ ...args.mousePos }, { ...args.mousePos }],
                handDrawn: false,
                lineWidth: args.lineWidth,
                strokeStyle: args.strokeStyle,
            },
        ]);
        args.setIsUsingPolygon(true);
    } else {
        args.setShapes((prev) => {
            const validShapes = prev.filter((s) => !s.remote);
            const lastShape = validShapes[validShapes.length - 1];
            if (lastShape.type != 'polygon') {
                return prev;
            }

            lastShape.points.push({ ...args.mousePos });
            return prev;
        });
    }
}

function mouseMove(args: MouseArguments) {
    if (!args.isUsingPolygon) {
        return;
    }

    args.setShapes((prev) => {
        const validShapes = prev.filter((s) => !s.remote);
        const lastShape = validShapes[validShapes.length - 1];
        if (lastShape.type != 'polygon') {
            return prev;
        }

        lastShape.points[lastShape.points.length - 1] = { ...args.mousePos };
        return prev;
    });
}

function mouseUp(args: MouseArguments) {}
