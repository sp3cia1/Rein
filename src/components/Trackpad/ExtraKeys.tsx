import React, { useState } from 'react';

interface ExtraKeysProps {
    sendKey: (key: string) => void;
}

const KEYS = ['Esc', 'Tab', 'Ctrl', 'Alt', 'Shift', 'Meta', 'Home', 'End', 'PgUp', 'PgDn', 'Del'];

export const ExtraKeys: React.FC<ExtraKeysProps> = ({ sendKey }) => {
    const [activeKey, setActiveKey] = useState<string | null>(null);

    const handlePointerDown = (e: React.PointerEvent, key: string) => {
        e.preventDefault();
        // Blur any focused input to prevent keyboard from re-showing
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        setActiveKey(key);
        sendKey(key.toLowerCase());
    };

    const handlePointerUp = () => {
        setActiveKey(null);
    };

    return (
        <div className="bg-base-300 py-2 px-2 overflow-x-auto whitespace-nowrap shrink-0 flex gap-2 hide-scrollbar border-t border-base-content/10">
            {KEYS.map(k => (
                <button
                    key={k}
                    className={`
                        min-w-14 h-10 rounded-lg text-sm font-semibold
                        flex items-center justify-center
                        transition-all duration-100
                        select-none touch-manipulation
                        shadow-sm
                        ${activeKey === k
                            ? 'bg-primary text-primary-content scale-95 shadow-inner'
                            : 'bg-base-100 text-base-content hover:bg-base-200 active:scale-95'
                        }
                    `}
                    onPointerDown={(e) => handlePointerDown(e, k)}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                >
                    {k}
                </button>
            ))}
        </div>
    );
};
