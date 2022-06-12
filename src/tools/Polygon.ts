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
            const newStuff = [...prev];
            const lastShape = newStuff[newStuff.length - 1];
            if (lastShape.type != 'polygon') {
                return newStuff;
            }

            lastShape.points.push({ ...args.mousePos });
            return newStuff;
        });
    }
}

function mouseMove(args: MouseArguments) {
    if (!args.isUsingPolygon) {
        return;
    }

    args.setShapes((prev) => {
        const newStuff = [...prev];
        const lastShape = newStuff[newStuff.length - 1];
        if (lastShape.type != 'polygon') {
            return newStuff;
        }

        lastShape.points[lastShape.points.length - 1] = { ...args.mousePos };
        return newStuff;
    });
}

function mouseUp(args: MouseArguments) {}
