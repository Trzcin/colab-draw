import SolidIcon from '../icons/solid_icon.svg';
import DottedIcon from '../icons/dotted_icon.svg';
import DashedIcon from '../icons/dashed_icon.svg';
import DropdownIcon from '../icons/dropdown_icon.svg';
import { shape, stroke } from '../types/shape';
import { useEffect, useState } from 'react';

interface props {
    lineStyle: stroke;
    setLineStyle: React.Dispatch<React.SetStateAction<stroke>>;
    hideDropdowns: boolean;
    selectedShape: shape | undefined;
    setSelectedShape: React.Dispatch<React.SetStateAction<shape | undefined>>;
}

export function LineStyleDropdown({
    lineStyle,
    setLineStyle,
    hideDropdowns,
    selectedShape,
    setSelectedShape,
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
                        selectedShape &&
                        (selectedShape.type == 'polygon' ||
                            selectedShape?.type == 'ellipse')
                            ? selectedShape.strokeStyle == 'solid'
                                ? SolidIcon
                                : selectedShape.strokeStyle == 'dashed'
                                ? DashedIcon
                                : DottedIcon
                            : lineStyle == 'solid'
                            ? SolidIcon
                            : lineStyle == 'dashed'
                            ? DashedIcon
                            : DottedIcon
                    }
                    alt={`${
                        selectedShape &&
                        (selectedShape.type == 'polygon' ||
                            selectedShape?.type == 'ellipse')
                            ? selectedShape.strokeStyle
                            : lineStyle
                    } line style`}
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
                        selectedShape &&
                        (selectedShape.type == 'polygon' ||
                            selectedShape?.type == 'ellipse')
                            ? selectedShape.strokeStyle == 'solid'
                            : lineStyle == 'solid'
                            ? 'dropdown-active'
                            : ''
                    }`}
                    onClick={() => {
                        if (
                            selectedShape &&
                            (selectedShape.type == 'polygon' ||
                                selectedShape.type == 'ellipse')
                        ) {
                            setSelectedShape((prev) => {
                                //@ts-ignore
                                prev.strokeStyle = 'solid';
                                return prev;
                            });
                            setShowDrop(false);
                            return;
                        }
                        setLineStyle('solid');
                        setShowDrop(false);
                    }}
                >
                    <img
                        src={SolidIcon}
                        alt="solid lines"
                        className={`${
                            (
                                selectedShape &&
                                (selectedShape.type == 'polygon' ||
                                    selectedShape?.type == 'ellipse')
                                    ? selectedShape.strokeStyle == 'solid'
                                    : lineStyle == 'solid'
                            )
                                ? 'tool-selected'
                                : ''
                        }`}
                    />
                    <p>Solid lines</p>
                </button>
                <button
                    className={`dropdown-tool ${
                        selectedShape &&
                        (selectedShape.type == 'polygon' ||
                            selectedShape?.type == 'ellipse')
                            ? selectedShape.strokeStyle == 'dashed'
                            : lineStyle == 'dashed'
                            ? 'dropdown-active'
                            : ''
                    }`}
                    onClick={() => {
                        if (
                            selectedShape &&
                            (selectedShape.type == 'polygon' ||
                                selectedShape.type == 'ellipse')
                        ) {
                            setSelectedShape((prev) => {
                                //@ts-ignore
                                prev.strokeStyle = 'dashed';
                                return prev;
                            });
                            setShowDrop(false);
                            return;
                        }
                        setLineStyle('dashed');
                        setShowDrop(false);
                    }}
                >
                    <img
                        src={DashedIcon}
                        alt="dashed lines"
                        className={`${
                            (
                                selectedShape &&
                                (selectedShape.type == 'polygon' ||
                                    selectedShape?.type == 'ellipse')
                                    ? selectedShape.strokeStyle == 'dashed'
                                    : lineStyle == 'dashed'
                            )
                                ? 'tool-selected'
                                : ''
                        }`}
                    />
                    <p>Dashed lines</p>
                </button>
                <button
                    className={`dropdown-tool drop-tool-bottom ${
                        selectedShape &&
                        (selectedShape.type == 'polygon' ||
                            selectedShape?.type == 'ellipse')
                            ? selectedShape.strokeStyle == 'dotted'
                            : lineStyle == 'dotted'
                            ? 'dropdown-active'
                            : ''
                    }`}
                    onClick={() => {
                        if (
                            selectedShape &&
                            (selectedShape.type == 'polygon' ||
                                selectedShape.type == 'ellipse')
                        ) {
                            setSelectedShape((prev) => {
                                //@ts-ignore
                                prev.strokeStyle = 'dotted';
                                return prev;
                            });
                            setShowDrop(false);
                            return;
                        }
                        setLineStyle('dotted');
                        setShowDrop(false);
                    }}
                >
                    <img
                        src={DottedIcon}
                        alt="dotted lines"
                        className={`${
                            (
                                selectedShape &&
                                (selectedShape.type == 'polygon' ||
                                    selectedShape?.type == 'ellipse')
                                    ? selectedShape.strokeStyle == 'dotted'
                                    : lineStyle == 'dotted'
                            )
                                ? 'tool-selected'
                                : ''
                        }`}
                    />
                    <p>Dotted lines</p>
                </button>
            </div>
        </span>
    );
}
