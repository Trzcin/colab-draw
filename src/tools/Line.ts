import { MouseArguments, tool } from '../types/tool';

export const Line: tool = {
    name: 'line',
    mouseDown,
    mouseMove,
    mouseUp,
};

function mouseDown(args: MouseArguments) {
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
}

function mouseMove(args: MouseArguments) {
    if (!args.isMouseDown) {
        return;
    }

    args.setShapes((prev) => {
        const newStuff = [...prev];
        const lastShape = newStuff[newStuff.length - 1];
        if (lastShape.type != 'polygon') {
            return newStuff;
        }

        lastShape.points[1] = { ...args.mousePos };
        return newStuff;
    });
}

function mouseUp(args: MouseArguments) {}
