import { shape } from '../types/shape';
import { MouseArguments, tool } from '../types/tool';
import { pointToPointDist } from '../utils/pointToPointDist';
import { SELECT_TOLARANCE } from './Cursor';

export const Text: tool = {
    name: 'text',
    mouseDown,
    mouseMove,
    mouseUp,
};

function mouseDown(args: MouseArguments) {
    if (args.editText && args.editText.type == 'text') {
        if (args.editText.value == '') {
            args.setShapes((prev) => {
                const i = prev.indexOf(args.editText!);
                prev.splice(i, 1);
                return prev;
            });
        } else {
            if (args.editText.id == '') {
                args.sendShape(args.editText);
            } else {
                args.updateShape(args.editText);
            }
        }
        args.setEditText(undefined);
        return;
    }

    const texts = args.shapes.filter((s) => s.type == 'text');
    for (let t of texts) {
        if (t.type != 'text') continue;
        if (pointToPointDist(args.mousePos, t.center) <= SELECT_TOLARANCE) {
            args.setEditText(t);
            return;
        }
    }

    args.setShapes((prev) => {
        const newText: shape = {
            id: '',
            type: 'text',
            color: args.currColor,
            center: { ...args.mousePos },
            value: '',
            font: '24px serif',
        };

        args.setEditText(newText);
        return [...prev, newText];
    });
}

function mouseMove(args: MouseArguments) {}

function mouseUp(args: MouseArguments) {}
