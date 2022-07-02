import { shape } from '../types/shape';
import { MouseArguments, tool } from '../types/tool';
import { pointToPointDist } from '../utils/pointToPointDist';
import { lineToPointDist } from '../utils/lineToPointDist';
import { pointToEllipseDist } from '../utils/pointToEllipseDist';
import { scaleShape } from '../utils/scaleShape';
import { rotateShape } from '../utils/rotateShape';
import { rotatePoint } from '../utils/rotatePoint';
import { findShapeCenter } from '../utils/findShapeCenter';

export const Cursor: tool = {
    name: 'cursor',
    mouseDown,
    mouseMove,
    mouseUp,
};

const SELECT_TOLARANCE = 50;

function mouseDown(args: MouseArguments) {
    if (args.cursorMode == 'select') {
        let closestShape: shape | undefined = undefined;
        let bestDist = Infinity;
        for (let shape of args.shapes) {
            if (shape.type == 'ellipse') {
                const distance = pointToEllipseDist(
                    shape.center,
                    shape.radius.x,
                    shape.radius.y,
                    args.mousePos
                );

                if (distance <= SELECT_TOLARANCE && distance < bestDist) {
                    bestDist = distance;
                    closestShape = shape;
                }
            } else {
                for (let i = 0; i < shape.points.length; i++) {
                    const pointDist = pointToPointDist(
                        shape.points[i],
                        args.mousePos
                    );
                    if (pointDist <= SELECT_TOLARANCE && pointDist < bestDist) {
                        bestDist = pointDist;
                        closestShape = shape;
                    }
                    if (i == shape.points.length - 1) continue;

                    const lineDist = lineToPointDist(
                        shape.points[i],
                        shape.points[i + 1],
                        args.mousePos
                    );

                    if (lineDist <= SELECT_TOLARANCE && lineDist < bestDist) {
                        bestDist = lineDist;
                        closestShape = shape;
                    }
                }
            }
        }

        args.setSelectedShape(closestShape);
    }
}

function mouseMove(args: MouseArguments) {
    if (!args.isMouseDown) return;

    if (args.cursorMode == 'move') {
        if (!args.clickSelectShape) return;

        const moveVector = {
            x: args.mousePosRaw.x - args.clickMousePosRaw.x,
            y: args.mousePosRaw.y - args.clickMousePosRaw.y,
        };

        args.setShapes((prev) => {
            if (!args.selectedShape || !args.clickSelectShape) return prev;
            const newStuff = [...prev];
            const theShape = newStuff[newStuff.indexOf(args.selectedShape)];

            if (
                theShape.type == 'ellipse' &&
                args.clickSelectShape.type == 'ellipse'
            ) {
                const newCenter = {
                    x: args.clickSelectShape.center.x + moveVector.x,
                    y: args.clickSelectShape.center.y + moveVector.y,
                };

                theShape.center = newCenter;
            } else if (
                theShape.type == 'polygon' &&
                args.clickSelectShape.type == 'polygon'
            ) {
                theShape.points = args.clickSelectShape.points.map((p) => {
                    return { x: p.x + moveVector.x, y: p.y + moveVector.y };
                });
            }

            return newStuff;
        });
    } else if (args.cursorMode == 'scale') {
        if (!args.selectedShape) return;
        const center = findShapeCenter(args.selectedShape);
        const rotatedMouse = rotatePoint(
            args.mousePosRaw,
            center,
            (args.selectedShape.rotation ?? 0) * -1
        );
        const rotatedClick = rotatePoint(
            args.clickMousePosRaw,
            center,
            (args.selectedShape.rotation ?? 0) * -1
        );

        const moveVector = {
            x: rotatedMouse.x - rotatedClick.x,
            y: rotatedMouse.y - rotatedClick.y,
        };
        console.log(moveVector);
        args.setShapes((prev) => {
            if (!args.selectedShape || !args.clickSelectShape) return prev;
            const newStuff = [...prev];
            const shapeToUpdate =
                newStuff[newStuff.indexOf(args.selectedShape)];
            if (shapeToUpdate.type == 'polygon') {
                const updatedShape = scaleShape(
                    args.clickSelectShape,
                    moveVector
                );
                if (updatedShape.type != 'polygon') return newStuff;
                shapeToUpdate.points = updatedShape.points;
            } else if (shapeToUpdate.type == 'ellipse') {
                const updatedShape = scaleShape(
                    args.clickSelectShape,
                    moveVector
                );
                if (updatedShape.type != 'ellipse') return newStuff;
                shapeToUpdate.center = updatedShape.center;
                shapeToUpdate.radius = updatedShape.radius;
            }

            return newStuff;
        });
    } else {
        args.setShapes((prev) => {
            if (!args.selectedShape || !args.clickSelectShape) return prev;
            const newStuff = [...prev];
            const shapeToUpdate =
                newStuff[newStuff.indexOf(args.selectedShape)];
            if (shapeToUpdate.type == 'polygon') {
                const updatedShape = rotateShape(
                    args.clickSelectShape,
                    args.mousePos
                );
                if (updatedShape.type != 'polygon') return newStuff;
                shapeToUpdate.rotation = updatedShape.rotation;
            } else if (shapeToUpdate.type == 'ellipse') {
                const updatedShape = rotateShape(
                    args.clickSelectShape,
                    args.mousePos
                );
                if (updatedShape.type != 'ellipse') return newStuff;
                shapeToUpdate.rotation = updatedShape.rotation;
            }

            return newStuff;
        });
    }
}

function mouseUp(args: MouseArguments) {
    if (args.selectedShape) {
        args.updateShape(args.selectedShape);
    }
}
