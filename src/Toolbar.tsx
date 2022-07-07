import MoveIcon from './icons/move_icon.svg';
import CursorIcon from './icons/cursor_icon.svg';
import DrawIcon from './icons/draw_icon.svg';
import LineIcon from './icons/line_icon.svg';
import TextIcon from './icons/text_icon.svg';
import WidthIcon from './icons/width_icon.svg';
import { tool } from './types/tool';
import { Move, Cursor, Draw, Line, Rect, Text } from './tools/Tools';
import { useEffect, useState } from 'react';
import { ToolDropdown } from './components/ToolDropdown';
import { ColorDropdown } from './components/ColorDropdown';
import { shape, stroke } from './types/shape';
import { LineStyleDropdown } from './components/LineStyleDropdown';

const toolUnderLinePos = {
    move: '37px',
    cursor: '73px',
    draw: '107px',
    line: '141px',
    rect: '173px',
    ellipse: '173px',
    polygon: '173px',
    text: '213px',
};

const colorUnderLinePos = ['453px', '489px', '525px', '561px', '597px'];

interface props {
    tool: tool;
    setTool: React.Dispatch<React.SetStateAction<tool>>;
    setCurrColor: React.Dispatch<React.SetStateAction<string>>;
    lineWidth: number;
    setLineWidth: React.Dispatch<React.SetStateAction<number>>;
    strokeStyle: stroke;
    setStrokeStyle: React.Dispatch<React.SetStateAction<stroke>>;
    hideDropdowns: boolean;
    editText: shape | undefined;
    setEditText: React.Dispatch<React.SetStateAction<shape | undefined>>;
}

export function Toolbar({
    tool,
    setTool,
    setCurrColor,
    lineWidth,
    setLineWidth,
    strokeStyle,
    setStrokeStyle,
    hideDropdowns,
    editText,
    setEditText,
}: props) {
    const [colors, setColors] = useState<string[]>([
        '#111111',
        '#FF4444',
        '#00C851',
        '#4285F4',
        '#AA66CC',
        '#ffbb33',
        '#2bbbad',
        '#ffafcc',
        '#06d6a0',
        '#dc2f02',
        '#3f7d20',
        '#173158',
        '#386641',
        '#780000',
        '#f72585',
    ]);
    const [selectedColor, setSelectedColor] = useState('#111111');
    const [dropdownTool, setDropdownTool] = useState<tool>(Rect);

    useEffect(() => {
        setCurrColor(selectedColor);
    }, [selectedColor]);

    return (
        <nav>
            <span className="toolbar-btn-group">
                <button onClick={() => setTool(Move)}>
                    <img
                        src={MoveIcon}
                        alt="move tool"
                        className={`${
                            tool.name === 'move' ? 'tool-selected' : ''
                        }`}
                    />
                </button>

                <span className="tooltip">Move Tool</span>
            </span>

            <span className="toolbar-btn-group">
                <button onClick={() => setTool(Cursor)}>
                    <img
                        src={CursorIcon}
                        alt="cursor tool"
                        className={`${
                            tool.name === 'cursor' ? 'tool-selected' : ''
                        }`}
                    />
                </button>

                <span className="tooltip">Cursor Tool</span>
            </span>

            <span className="toolbar-btn-group">
                <button onClick={() => setTool(Draw)}>
                    <img
                        src={DrawIcon}
                        alt="draw tool"
                        className={`${
                            tool.name === 'draw' ? 'tool-selected' : ''
                        }`}
                    />
                </button>

                <span className="tooltip">Drawing Tool</span>
            </span>

            <span className="toolbar-btn-group">
                <button onClick={() => setTool(Line)} className="line-btn">
                    <img
                        src={LineIcon}
                        alt="line tool"
                        className={`${
                            tool.name === 'line' ? 'tool-selected' : ''
                        }`}
                    />
                </button>

                <span className="tooltip">Line Tool</span>
            </span>

            <ToolDropdown
                tool={tool}
                setTool={setTool}
                dropdownTool={dropdownTool}
                setDropdownTool={setDropdownTool}
                hideDropdowns={hideDropdowns}
            ></ToolDropdown>

            <span className="toolbar-btn-group">
                <button onClick={() => setTool(Text)} className="line-btn">
                    <img
                        src={TextIcon}
                        alt="text tool"
                        className={`${
                            tool.name === 'text' ? 'tool-selected' : ''
                        }`}
                    />
                </button>

                <span className="tooltip">Text Tool</span>
            </span>

            <div
                className="underline"
                style={{ left: toolUnderLinePos[tool.name] }}
            ></div>

            <div className="spacer"></div>

            <LineStyleDropdown
                lineStyle={strokeStyle}
                setLineStyle={setStrokeStyle}
                hideDropdowns={hideDropdowns}
            ></LineStyleDropdown>

            <span className="toolbar-btn-group">
                <img
                    src={WidthIcon}
                    alt="line width"
                    style={{ marginLeft: '10px' }}
                />
                <span className="tooltip">Line Width</span>
            </span>

            <input
                type="number"
                value={lineWidth}
                onChange={(e) => setLineWidth(parseInt(e.target.value))}
            />

            <div className="spacer"></div>

            {colors.slice(0, 5).map((c) => (
                <button
                    onClick={() =>
                        editText == undefined
                            ? setSelectedColor(c)
                            : setEditText((prev) => {
                                  if (!prev || prev.type != 'text') return prev;
                                  prev.color = c;
                                  return prev;
                              })
                    }
                    key={c}
                >
                    <svg width={30} height={30}>
                        <circle
                            cx={15}
                            cy={15}
                            r={
                                editText == undefined || editText.type != 'text'
                                    ? selectedColor == c
                                        ? 15
                                        : 12
                                    : editText.color == c
                                    ? 15
                                    : 12
                            }
                            fill={c}
                        />
                    </svg>
                </button>
            ))}

            <ColorDropdown
                colors={colors}
                setColors={setColors}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                hideDropdowns={hideDropdowns}
                editText={editText}
                setEditText={setEditText}
            ></ColorDropdown>

            <div
                className="underline"
                style={{
                    left: colorUnderLinePos[
                        colors.indexOf(
                            editText == undefined || editText.type != 'text'
                                ? selectedColor
                                : editText.color
                        )
                    ],
                }}
            ></div>
        </nav>
    );
}
