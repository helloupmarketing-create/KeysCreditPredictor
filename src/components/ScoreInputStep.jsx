import React, { useState } from 'react';

const ScoreInputStep = ({ onNext, data, updateData }) => {
    const [score, setScore] = useState(data.currentScore || 580);

    const getScoreColor = (s) => {
        if (s < 580) return '#ef4444'; // Red
        if (s < 670) return '#f59e0b'; // Amber
        if (s < 740) return '#3b82f6'; // Blue
        return '#10b981'; // Green
    };

    const handleChange = (e) => {
        const val = parseInt(e.target.value);
        setScore(val);
        updateData('currentScore', val);
    };

    return (
        <div className="animate-fade-in">
            <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 600 }}>What is your current credit score estimate?</h2>

            <div style={{ position: 'relative', marginBottom: '3rem', padding: '1rem 0' }}>
                <div style={{
                    fontSize: '4rem',
                    fontWeight: 800,
                    textAlign: 'center',
                    color: getScoreColor(score),
                    marginBottom: '1rem',
                    textShadow: `0 0 20px ${getScoreColor(score)}40`
                }}>
                    {score}
                </div>

                <input
                    type="range"
                    min="300"
                    max="850"
                    value={score}
                    onChange={handleChange}
                    style={{ width: '100%', cursor: 'pointer', accentColor: getScoreColor(score) }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.875rem' }}>
                    <span>300 (Poor)</span>
                    <span>850 (Exceptional)</span>
                </div>
            </div>

            <button className="btn-primary" onClick={onNext} style={{ width: '100%' }}>
                Continue
            </button>
        </div>
    );
};

export default ScoreInputStep;
