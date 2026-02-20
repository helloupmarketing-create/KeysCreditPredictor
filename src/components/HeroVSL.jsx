import React, { useState } from 'react';

const HeroVSL = ({ onStart }) => {
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlay = () => {
        const iframe = document.querySelector('iframe[title="YouTube VSL"]');
        if (iframe) {
            // YouTube API command to play video
            iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
            setIsPlaying(true);
        }
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

                {/* YouTube Embed with Custom Overlay */}
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
                        width="100%"
                        height="100%"
                        src="https://www.youtube.com/embed/_Q0eE7MsKKY?controls=1&amp;rel=0&amp;modestbranding=1&amp;enablejsapi=1&amp;iv_load_policy=3&amp;fs=0"
                        title="YouTube VSL"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        style={{ position: 'absolute', top: 0, left: 0 }}
                    ></iframe>

                    {!isPlaying && (
                        <div
                            onClick={handlePlay}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                background: 'rgba(0,0,0,0.1)',
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
