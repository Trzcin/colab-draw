import { useEffect, useState } from 'react';
import PlusIcon from '../icons/plus_icon.svg';
import { shape } from '../types/shape';

interface props {
    colors: string[];
    selectedColor: string;
    setSelectedColor: React.Dispatch<React.SetStateAction<string>>;
    setColors: React.Dispatch<React.SetStateAction<string[]>>;
    hideDropdowns: boolean;
    editText: shape | undefined;
    setEditText: React.Dispatch<React.SetStateAction<shape | undefined>>;
}

export function ColorDropdown({
    colors,
    setColors,
    selectedColor,
    setSelectedColor,
    hideDropdowns,
    editText,
    setEditText,
}: props) {
    const [showDrop, setShowDrop] = useState(false);

    useEffect(() => {
        if (hideDropdowns && showDrop) {
            setShowDrop(false);
        }
    }, [hideDropdowns]);

    function pickColor(c: string) {
        if (editText && editText.type == 'text') {
            setEditText((prev) => {
                if (!prev || prev.type != 'text') return prev;
                prev.color = c;
                return prev;
            });
        } else {
            setSelectedColor(c);
        }

        if (colors.indexOf(c) > 4) {
            setColors((prev) => {
                const newStuff = [...prev];
                const i = newStuff.indexOf(c);
                const temp = newStuff[4];
                newStuff[4] = c;
                newStuff[i] = temp;
                return newStuff;
            });
        }
    }

    return (
        <span className="toolbar-btn-group">
            <button onClick={() => setShowDrop((prev) => !prev)}>
                <img src={PlusIcon} alt="more colors" className="colors-icon" />
            </button>

            <span className="tooltip">More Colors</span>

            <div
                className={`dropdown color-drop ${
                    showDrop ? 'color-drop-anim' : ''
                }`}
            >
                {colors.map((c) => (
                    <button
                        className="color-btn"
                        key={c}
                        onClick={() => {
                            pickColor(c);
                            setShowDrop(false);
                        }}
                    >
                        <svg width={40} height={40}>
                            <circle
                                cx={20}
                                cy={20}
                                r={
                                    editText == undefined ||
                                    editText.type != 'text'
                                        ? selectedColor == c
                                            ? 13
                                            : 10
                                        : editText.color == c
                                        ? 13
                                        : 10
                                }
                                fill={c}
                            ></circle>

                            {selectedColor == c ? (
                                <circle
                                    cx={20}
                                    cy={20}
                                    r={
                                        editText == undefined ||
                                        editText.type != 'text'
                                            ? selectedColor == c
                                                ? 18
                                                : 15
                                            : editText.color == c
                                            ? 18
                                            : 15
                                    }
                                    stroke="#33b5e5"
                                    strokeWidth={3}
                                    fill="none"
                                ></circle>
                            ) : null}
                        </svg>
                    </button>
                ))}
            </div>
        </span>
    );
}
