import SolidIcon from '../icons/solid_icon.svg';
import DottedIcon from '../icons/dotted_icon.svg';
import DashedIcon from '../icons/dashed_icon.svg';
import DropdownIcon from '../icons/dropdown_icon.svg';
import { stroke } from '../types/shape';
import { useEffect, useState } from 'react';

interface props {
    lineStyle: stroke;
    setLineStyle: React.Dispatch<React.SetStateAction<stroke>>;
    hideDropdowns: boolean;
}

export function LineStyleDropdown({
    lineStyle,
    setLineStyle,
    hideDropdowns,
}: props) {
    const [showDrop, setShowDrop] = useState(false);

    useEffect(() => {
        if (hideDropdowns && showDrop) {
            setShowDrop(false);
        }
    }, [hideDropdowns]);

    return (
        <span className="toolbar-btn-group">
            <button
                className="line-btn"
                onClick={() => setShowDrop((prev) => !prev)}
            >
                <img
                    src={
                        lineStyle == 'solid'
                            ? SolidIcon
                            : lineStyle == 'dashed'
                            ? DashedIcon
                            : DottedIcon
                    }
                    alt={`${lineStyle} line style`}
                />
                <img
                    src={DropdownIcon}
                    alt="dropdown"
                    style={{ display: 'block', marginLeft: '5px' }}
                />
            </button>

            <span className="tooltip">Line Style</span>

            <div
                className={`dropdown line-drop ${
                    showDrop ? 'line-drop-anim' : ''
                }`}
            >
                <button
                    className={`dropdown-tool drop-tool-top ${
                        lineStyle == 'solid' ? 'dropdown-active' : ''
                    }`}
                    onClick={() => {
                        setLineStyle('solid');
                        setShowDrop(false);
                    }}
                >
                    <img
                        src={SolidIcon}
                        alt="solid lines"
                        className={`${
                            lineStyle == 'solid' ? 'tool-selected' : ''
                        }`}
                    />
                    <p>Solid lines</p>
                </button>
                <button
                    className={`dropdown-tool ${
                        lineStyle == 'dashed' ? 'dropdown-active' : ''
                    }`}
                    onClick={() => {
                        setLineStyle('dashed');
                        setShowDrop(false);
                    }}
                >
                    <img
                        src={DashedIcon}
                        alt="dashed lines"
                        className={`${
                            lineStyle == 'dashed' ? 'tool-selected' : ''
                        }`}
                    />
                    <p>Dashed lines</p>
                </button>
                <button
                    className={`dropdown-tool drop-tool-bottom ${
                        lineStyle == 'dotted' ? 'dropdown-active' : ''
                    }`}
                    onClick={() => {
                        setLineStyle('dotted');
                        setShowDrop(false);
                    }}
                >
                    <img
                        src={DottedIcon}
                        alt="dotted lines"
                        className={`${
                            lineStyle == 'dotted' ? 'tool-selected' : ''
                        }`}
                    />
                    <p>Dotted lines</p>
                </button>
            </div>
        </span>
    );
}
