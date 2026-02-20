import React, { useState, useRef, useEffect } from 'react';

const HeroVSL = ({ onStart }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(100);
    const [isMuted, setIsMuted] = useState(false);
    const iframeRef = useRef(null);

    // Call YouTube API via postMessage
    const callPlayer = (func, args = []) => {
        if (iframeRef.current) {
            iframeRef.current.contentWindow.postMessage(JSON.stringify({
                event: 'command',
                func: func,
                args: args
            }), '*');
        }
    };

    const togglePlay = () => {
        if (isPlaying) {
            callPlayer('pauseVideo');
        } else {
            callPlayer('playVideo');
            // Ensure volume is up on first play
            if (currentTime === 0) {
                callPlayer('setVolume', [volume]);
                callPlayer('unMute');
            }
        }
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (e) => {
        const time = parseFloat(e.target.value);
        callPlayer('seekTo', [time, true]);
        setCurrentTime(time);
    };

    const handleVolumeChange = (e) => {
        const vol = parseInt(e.target.value);
        setVolume(vol);
        callPlayer('setVolume', [vol]);
        if (vol > 0) {
            setIsMuted(false);
            callPlayer('unMute');
        }
    };

    const toggleMute = () => {
        if (isMuted) {
            callPlayer('unMute');
            setIsMuted(false);
        } else {
            callPlayer('mute');
            setIsMuted(true);
        }
    };

    // Listen for events from YouTube
    useEffect(() => {
        const handleMessage = (event) => {
            if (event.origin !== "https://www.youtube.com") return;
            try {
                const data = JSON.parse(event.data);

                // YouTube sends 'infoDelivery' messages with state updates
                if (data.event === 'infoDelivery' && data.info) {
                    if (data.info.duration !== undefined) {
                        setDuration(data.info.duration);
                    }
                    if (data.info.currentTime !== undefined) {
                        setCurrentTime(data.info.currentTime);
                    }
                    if (data.info.playerState !== undefined) {
                        setIsPlaying(data.info.playerState === 1);
                    }
                }
            } catch (e) {
                // Ignore non-json messages
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    const formatTime = (seconds) => {
        if (!seconds) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <section style={{
            padding: '120px 20px 80px',
            textAlign: 'center',
            background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 100%)',
            minHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <style>{`
                input[type=range]::-webkit-slider-thumb {
                    appearance: none;
                    width: 12px;
                    height: 12px;
                    background: #fff;
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 0 10px rgba(0,0,0,0.3);
                }
            `}</style>
            <div style={{ maxWidth: '1000px', width: '100%' }}>
                <h1 style={{
                    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                    lineHeight: '1.1',
                    marginBottom: '24px',
                    color: 'var(--color-text-heading)'
                }}>
                    Stop Guessing. <span style={{ color: 'var(--color-accent)' }}>Predict</span> Your Credit Success in Minutes.
                </h1>
                <p style={{
                    fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                    color: '#666',
                    marginBottom: '48px',
                    maxWidth: '800px',
                    margin: '0 auto 48px'
                }}>
                    Watch how our AI-driven analysis helps you identify exactly what's holding your score back and how to fix it fast.
                </p>

                {/* Custom Video Player Container */}
                <div style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '800px',
                    aspectRatio: '16/9',
                    margin: '0 auto 40px',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
                    background: '#000'
                }}>
                    <iframe
                        ref={iframeRef}
                        width="150%"
                        height="150%"
                        src="https://www.youtube.com/embed/_Q0eE7MsKKY?controls=0&amp;rel=0&amp;modestbranding=1&amp;enablejsapi=1&amp;iv_load_policy=3&amp;fs=0&amp;disablekb=1&amp;showinfo=0&amp;playsinline=1"
                        title="YouTube VSL"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        style={{
                            position: 'absolute',
                            top: '-25%',
                            left: '-25%',
                            pointerEvents: 'none'
                        }}
                    ></iframe>

                    {/* Interaction Shield (Prevents clicking original YouTube UI) */}
                    <div
                        onClick={togglePlay}
                        style={{
                            position: 'absolute',
                            top: 0, left: 0,
                            width: '100%', height: 'calc(100% - 50px)',
                            zIndex: 5,
                            cursor: 'pointer'
                        }}
                    />

                    {/* Custom Play Overlay (Centered) */}
                    {!isPlaying && currentTime === 0 && (
                        <div
                            onClick={togglePlay}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                background: 'rgba(0,0,0,0.2)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 10
                            }}
                        >
                            <div style={{
                                width: '80px',
                                height: '80px',
                                background: 'var(--color-accent)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 0 30px var(--color-accent)',
                                transition: 'transform 0.2s ease'
                            }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <div style={{
                                    width: 0,
                                    height: 0,
                                    borderTop: '15px solid transparent',
                                    borderBottom: '15px solid transparent',
                                    borderLeft: '25px solid white',
                                    marginLeft: '8px'
                                }}></div>
                            </div>
                        </div>
                    )}

                    {/* Custom Control Bar (Premium Glassmorphism) */}
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '50px',
                        padding: '0 20px',
                        background: 'rgba(26, 26, 26, 0.85)',
                        backdropFilter: 'blur(10px)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                        zIndex: 20,
                        borderTop: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <button
                            onClick={togglePlay}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#fff',
                                cursor: 'pointer',
                                padding: '5px',
                                width: '30px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {isPlaying ? (
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    <div style={{ width: '4px', height: '16px', background: '#fff', borderRadius: '1px' }}></div>
                                    <div style={{ width: '4px', height: '16px', background: '#fff', borderRadius: '1px' }}></div>
                                </div>
                            ) : (
                                <div style={{ width: 0, height: 0, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderLeft: '14px solid #fff' }}></div>
                            )}
                        </button>

                        <span style={{ color: '#fff', fontSize: '13px', minWidth: '35px', fontFamily: 'Inter, sans-serif' }}>{formatTime(currentTime)}</span>

                        <input
                            type="range"
                            min="0"
                            max={duration || 100}
                            step="0.1"
                            value={currentTime}
                            onChange={handleSeek}
                            style={{
                                flex: 1,
                                height: '4px',
                                borderRadius: '2px',
                                appearance: 'none',
                                background: `linear-gradient(to right, var(--color-accent) ${(currentTime / (duration || 100)) * 100}%, rgba(255,255,255,0.2) ${(currentTime / (duration || 100)) * 100}%)`,
                                cursor: 'pointer',
                                outline: 'none'
                            }}
                        />

                        <span style={{ color: '#fff', fontSize: '13px', minWidth: '35px', fontFamily: 'Inter, sans-serif', opacity: 0.8 }}>{formatTime(duration)}</span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <button
                                onClick={toggleMute}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="white" style={{ opacity: isMuted ? 0.5 : 1 }}>
                                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                                </svg>
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={isMuted ? 0 : volume}
                                onChange={handleVolumeChange}
                                style={{
                                    width: '70px',
                                    height: '4px',
                                    borderRadius: '2px',
                                    appearance: 'none',
                                    background: `linear-gradient(to right, #fff ${isMuted ? 0 : volume}%, rgba(255,255,255,0.2) ${isMuted ? 0 : volume}%)`,
                                    cursor: 'pointer',
                                    outline: 'none'
                                }}
                            />
                        </div>
                    </div>
                </div>

                <button
                    onClick={onStart}
                    className="btn-primary"
                    style={{
                        padding: '18px 48px',
                        fontSize: '1.2rem',
                        boxShadow: '0 10px 20px rgba(190, 177, 152, 0.3)'
                    }}
                >
                    Start Your Analysis
                </button>

                <p style={{ marginTop: '20px', color: '#888', fontSize: '0.9rem' }}>
                    No credit card required • Secure AI analysis • Results in under 2 minutes
                </p>
            </div>
        </section>
    );
};

export default HeroVSL;
