import React, { useMemo } from 'react';

const ResultStep = ({ data }) => {
    const calculations = useMemo(() => {
        const baseScore = data.currentScore || 580;
        const negatives = data.negativeItems || [];

        // Simple logic engine
        let potentialIncrease = 30; // Baseline optimization
        negatives.forEach(item => {
            if (item === 'late') potentialIncrease += 40;
            if (item === 'collections') potentialIncrease += 50;
            if (item === 'chargeoffs') potentialIncrease += 45;
            if (item === 'inquiries') potentialIncrease += 15;
            if (item === 'bankruptcy') potentialIncrease += 80;
            if (item === 'foreclosure') potentialIncrease += 70;
            if (item === 'errors') potentialIncrease += 60;
        });

        // Cap realism
        if (potentialIncrease > 150) potentialIncrease = 150 + Math.floor(Math.random() * 20);

        const projectedScore = Math.min(850, baseScore + potentialIncrease);

        return {
            increase: potentialIncrease,
            projected: projectedScore,
            timeframe: '45-90'
        };
    }, [data]);

    return (
        <div className="animate-fade-in" style={{ textAlign: 'center' }}>
            <h2 style={{ marginBottom: '0.5rem' }}>Good News!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Based on your profile, we found significant room for improvement.</p>

            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', background: 'rgba(16, 185, 129, 0.1)', borderColor: 'var(--accent-primary)' }}>
                <p style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Potential Increase</p>
                <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                    +{calculations.increase} Points
                </div>
                <p style={{ marginTop: '0.5rem' }}>Projected Score: <strong>{calculations.projected}</strong></p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem', textAlign: 'left' }}>
                <div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Estimated Timeframe</p>
                    <p style={{ fontSize: '1.25rem', fontWeight: 600 }}>{calculations.timeframe} Days</p>
                </div>
                <div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Negative Items</p>
                    <p style={{ fontSize: '1.25rem', fontWeight: 600 }}>{data.negativeItems.length} Found</p>
                </div>
            </div>

            <button className="btn-primary" style={{ width: '100%', marginBottom: '1rem' }}>
                Get My Action Plan
            </button>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                *Estimates based on typical results. Individual results may vary.
            </p>
        </div>
    );
};

export default ResultStep;
