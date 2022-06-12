import { useEffect, useState } from 'react';
import PlusIcon from '../icons/plus_icon.svg';

interface props {
    colors: string[];
    selectedColor: string;
    setSelectedColor: React.Dispatch<React.SetStateAction<string>>;
    setColors: React.Dispatch<React.SetStateAction<string[]>>;
    hideDropdowns: boolean;
}

export function ColorDropdown({
    colors,
    setColors,
    selectedColor,
    setSelectedColor,
    hideDropdowns,
}: props) {
    const [showDrop, setShowDrop] = useState(false);

    useEffect(() => {
        if (hideDropdowns && showDrop) {
            setShowDrop(false);
        }
    }, [hideDropdowns]);

    function pickColor(c: string) {
        setSelectedColor(c);

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
                                r={selectedColor == c ? 13 : 10}
                                fill={c}
                            ></circle>

                            {selectedColor == c ? (
                                <circle
                                    cx={20}
                                    cy={20}
                                    r={selectedColor == c ? 18 : 15}
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
