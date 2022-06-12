import { tool } from '../types/tool';
import RectIcon from '../icons/rect_icon.svg';
import EllipseIcon from '../icons/ellipse_icon.svg';
import PolygonIcon from '../icons/polygon_icon.svg';
import DropdownIcon from '../icons/dropdown_icon.svg';
import { Rect, Ellipse, Polygon } from '../tools/Tools';
import { useEffect, useState } from 'react';

interface props {
    tool: tool;
    dropdownTool: tool;
    setDropdownTool: React.Dispatch<React.SetStateAction<tool>>;
    setTool: React.Dispatch<React.SetStateAction<tool>>;
    hideDropdowns: boolean;
}

export function ToolDropdown({
    dropdownTool,
    setDropdownTool,
    setTool,
    tool,
    hideDropdowns,
}: props) {
    const [showDrop, setShowDrop] = useState(false);

    useEffect(() => {
        if (tool != dropdownTool) {
            setShowDrop(false);
        }
    }, [tool, dropdownTool]);

    useEffect(() => {
        if (hideDropdowns && showDrop) {
            setShowDrop(false);
        }
    }, [hideDropdowns]);

    return (
        <span className="toolbar-btn-group">
            <button
                style={{ display: 'flex' }}
                onClick={() =>
                    tool != dropdownTool
                        ? setTool(dropdownTool)
                        : setShowDrop((prev) => !prev)
                }
            >
                <img
                    src={(() => {
                        if (dropdownTool.name == 'rect') return RectIcon;
                        else if (dropdownTool.name == 'ellipse')
                            return EllipseIcon;
                        else return PolygonIcon;
                    })()}
                    alt={`${dropdownTool.name} tool`}
                    className={`icon ${
                        tool.name === dropdownTool.name ? 'tool-selected' : ''
                    }`}
                />
                <img src={DropdownIcon} alt="dropdown" />
            </button>

            <span className="tooltip">
                {dropdownTool.name[0].toUpperCase() +
                    dropdownTool.name.slice(1)}{' '}
                Tool
            </span>

            <div className={`dropdown ${showDrop ? 'dropdown-anim' : ''}`}>
                <button
                    className={`dropdown-tool drop-tool-top ${
                        dropdownTool.name == 'rect' ? 'dropdown-active' : ''
                    }`}
                    onClick={() => {
                        setDropdownTool(Rect);
                        setTool(Rect);
                        setShowDrop(false);
                    }}
                >
                    <img
                        src={RectIcon}
                        alt="rect tool"
                        className={`${
                            dropdownTool.name == 'rect' ? 'tool-selected' : ''
                        }`}
                    />
                    <p>Rectangle tool</p>
                </button>
                <button
                    className={`dropdown-tool ${
                        dropdownTool.name == 'ellipse' ? 'dropdown-active' : ''
                    }`}
                    onClick={() => {
                        setDropdownTool(Ellipse);
                        setTool(Ellipse);
                        setShowDrop(false);
                    }}
                >
                    <img
                        src={EllipseIcon}
                        alt="ellipse tool"
                        className={`${
                            dropdownTool.name == 'ellipse'
                                ? 'tool-selected'
                                : ''
                        }`}
                    />
                    <p>Ellipse tool</p>
                </button>
                <button
                    className={`dropdown-tool drop-tool-bottom ${
                        dropdownTool.name == 'polygon' ? 'dropdown-active' : ''
                    }`}
                    onClick={() => {
                        setDropdownTool(Polygon);
                        setTool(Polygon);
                        setShowDrop(false);
                    }}
                >
                    <img
                        src={PolygonIcon}
                        alt="polygon tool"
                        className={`${
                            dropdownTool.name == 'polygon'
                                ? 'tool-selected'
                                : ''
                        }`}
                    />
                    <p>Polygon tool</p>
                </button>
            </div>
        </span>
    );
}
