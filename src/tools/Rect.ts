import { MouseArguments, tool } from '../types/tool';

export const Rect: tool = {
    name: 'rect',
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
            points: [
                { ...args.mousePos },
                { ...args.mousePos },
                { ...args.mousePos },
                { ...args.mousePos },
                { ...args.mousePos },
            ],
            handDrawn: false,
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

        const clickPos = lastShape.points[0];
        lastShape.points = [
            clickPos,
            { x: args.mousePos.x, y: clickPos.y },
            { ...args.mousePos },
            { x: clickPos.x, y: args.mousePos.y },
            clickPos,
        ];
        return newStuff;
    });
}

function mouseUp(args: MouseArguments) {}
