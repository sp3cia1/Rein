import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef } from 'react'
import { useRemoteConnection } from '../hooks/useRemoteConnection';
import { useTrackpadGesture } from '../hooks/useTrackpadGesture';
import { ControlBar } from '../components/Trackpad/ControlBar';
import { ExtraKeys } from '../components/Trackpad/ExtraKeys';
import { TouchArea } from '../components/Trackpad/TouchArea';

export const Route = createFileRoute('/trackpad')({
    component: TrackpadPage,
})

function TrackpadPage() {
    const [scrollMode, setScrollMode] = useState(false);
    const hiddenInputRef = useRef<HTMLInputElement>(null);

    const { status, send } = useRemoteConnection();
    const { isTracking, handlers } = useTrackpadGesture(send, scrollMode);

    const toggleKeyboard = () => {
        const input = hiddenInputRef.current;
        if (!input) return;
        
        // check actual focus state, not tracked state as in testing this didnt account for cases where keyboard was dismissed via back button
        // this handles cases where keyboard was dismissed via back button
        if (document.activeElement === input) {
            input.blur();
        } else {
            input.focus();
        }
    };

    const handleClick = (button: 'left' | 'right') => {
        send({ type: 'click', button, press: true });
        // Release after short delay to simulate click
        setTimeout(() => send({ type: 'click', button, press: false }), 50);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const key = e.key.toLowerCase();
        if (key === 'backspace') send({ type: 'key', key: 'backspace' });
        else if (key === 'enter') send({ type: 'key', key: 'enter' });
        else if (key !== 'unidentified' && key.length > 1) {
            send({ type: 'key', key });
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (val) {
            send({ type: 'text', text: val.slice(-1) });
            e.target.value = '';
        }
    };

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Touch Surface */}
            <TouchArea
                isTracking={isTracking}
                scrollMode={scrollMode}
                handlers={handlers}
                status={status}
            />

            {/* Controls */}
            <ControlBar
                scrollMode={scrollMode}
                onToggleScroll={() => setScrollMode(!scrollMode)}
                onLeftClick={() => handleClick('left')}
                onRightClick={() => handleClick('right')}
                onKeyboardToggle={toggleKeyboard}
            />

            {/* Extra Keys */}
            <ExtraKeys
                sendKey={(k) => send({ type: 'key', key: k })}
            />

            {/* Hidden Input for Mobile Keyboard */}
            <input
                ref={hiddenInputRef}
                className="opacity-0 absolute bottom-0 pointer-events-none h-0 w-0"
                onKeyDown={handleKeyDown}
                onChange={handleInput}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
            />
        </div>
    )
}
