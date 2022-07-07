import { useEffect, useRef, useState } from 'react';
import { shape } from './types/shape';
import TextIcon from './icons/text_icon.svg';

interface props {
    editText: shape | undefined;
    setEditText: React.Dispatch<React.SetStateAction<shape | undefined>>;
}

export function TextEditor({ editText, setEditText }: props) {
    if (!editText || editText.type != 'text') return null;
    const [text, setText] = useState(editText.value);
    const [fontSize, setFontSize] = useState(24);
    const textInput = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setEditText((prev) => {
            if (!prev || prev.type != 'text') return prev;
            prev.value = text;
            return prev;
        });
    }, [text]);

    useEffect(() => {
        setEditText((prev) => {
            if (!prev || prev.type != 'text') return prev;
            const family = prev.font.split('px ')[1];
            prev.font = `${fontSize}px ${family}`;
            return prev;
        });
    }, [fontSize]);

    useEffect(() => {
        setText(editText.value);
        setFontSize(parseInt(editText.font.split('px ')[0]));
        if (textInput.current) {
            setTimeout(() => textInput.current!.focus(), 1);
        }
    }, [editText]);

    return (
        <div
            className="text-edit-wrapper"
            style={{
                top: editText.center.y,
                left: editText.center.x,
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
