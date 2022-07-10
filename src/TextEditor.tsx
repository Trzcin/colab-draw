import { useEffect, useRef, useState } from 'react';
import { shape } from './types/shape';
import TextIcon from './icons/text_icon.svg';
import { point } from './types/point';
import { canvasToScreenPoint } from './utils/canvasToScreenPoint';

interface props {
    editText: shape | undefined;
    setEditText: React.Dispatch<React.SetStateAction<shape | undefined>>;
    ctx: CanvasRenderingContext2D | undefined;
}

export function TextEditor({ editText, setEditText, ctx }: props) {
    if (!editText || editText.type != 'text') return null;
    const [text, setText] = useState(editText.value);
    const [fontSize, setFontSize] = useState(24);
    const [leftTop, setLeftTop] = useState<point>({ x: 0, y: 0 });
    const textInput = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!ctx) return;
        setEditText((prev) => {
            if (!prev || prev.type != 'text') return prev;
            prev.value = text;
            ctx.font = prev.font;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const metrics = ctx.measureText(text);
            prev.size = {
                x: metrics.width,
                y:
                    metrics.actualBoundingBoxAscent +
                    metrics.actualBoundingBoxDescent,
            };
            return prev;
        });
    }, [text]);

    useEffect(() => {
        if (!ctx) return;
        setEditText((prev) => {
            if (!prev || prev.type != 'text') return prev;
            const family = prev.font.split('px ')[1];
            prev.font = `${fontSize}px ${family}`;
            ctx.font = prev.font;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const metrics = ctx.measureText(text);
            prev.size = {
                x: metrics.width,
                y:
                    metrics.actualBoundingBoxAscent +
                    metrics.actualBoundingBoxDescent,
            };
            return prev;
        });
    }, [fontSize]);

    useEffect(() => {
        if (!ctx) return;
        editText.editMode = true;
        setText(editText.value);
        setFontSize(parseInt(editText.font.split('px ')[0]));
        setLeftTop(canvasToScreenPoint(ctx, editText.center));
        if (textInput.current) {
            setTimeout(() => textInput.current!.focus(), 1);
        }
    }, [editText]);

    return (
        <div
            className="text-edit-wrapper"
            style={{
                top: leftTop.y,
                left: leftTop.x,
                transform: `translate(-50%, -15px) rotate(${
                    editText.rotation ?? 0
                }rad)`,
            }}
        >
            <input
                className="text-edit-input"
                type="text"
                placeholder="Type here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                ref={textInput}
                style={{ color: editText.color, fontSize }}
            />

            <div className="text-toolbar">
                <img src={TextIcon} alt="font size" />
                <input
                    type="range"
                    min={10}
                    max={72}
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    onMouseUp={() => textInput.current?.focus()}
                />
            </div>
        </div>
    );
}
