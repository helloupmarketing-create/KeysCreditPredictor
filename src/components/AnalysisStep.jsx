import React, { useEffect, useState } from 'react';

const AnalysisStep = ({ onNext }) => {
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState('Initializing...');

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(old => {
                if (old >= 100) {
                    clearInterval(timer);
                    setTimeout(() => onNext(), 500);
                    return 100;
                }

                // Random usage
                const increment = Math.random() * 15;
                const newProgress = Math.min(old + increment, 100);

                if (newProgress < 30) setMessage('Analyzing Payment History...');
                else if (newProgress < 60) setMessage('Checking for Negative Items...');
                else if (newProgress < 90) setMessage('Calculating Potential Score...');
                else setMessage('Finalizing Report...');

                return newProgress;
            });
        }, 400);

        return () => clearInterval(timer);
    }, [onNext]);

    return (
        <div className="animate-fade-in" style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ marginBottom: '2rem' }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    border: '4px solid var(--accent-glow)',
                    borderTop: '4px solid var(--accent-primary)',
                    borderRadius: '50%',
                    margin: '0 auto',
                    animation: 'spin 1s linear infinite'
                }} />
                <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
            </div>

            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{message}</h3>

            <div style={{
                width: '100%',
                height: '8px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '4px',
                overflow: 'hidden'
            }}>
                <div style={{
                    width: `${progress}%`,
                    height: '100%',
                    background: 'var(--accent-primary)',
                    transition: 'width 0.2s ease'
                }} />
            </div>
        </div>
    );
};

export default AnalysisStep;
