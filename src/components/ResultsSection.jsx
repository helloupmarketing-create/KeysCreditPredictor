import React from 'react';

const ResultsSection = () => {
    const results = [
        {
            image: "/results/results 3.png",
            title: "Score Boost & Deletions",
            desc: "80+ Point increase across all bureaus with 10 deletions."
        },
        {
            image: "/results/results 2.jpg",
            title: "Hitting the 800s",
            desc: "Client reached Excellent credit status with massive point gains."
        },
        {
            image: "/results/results 1.png",
            title: "Fast Fair Credit Leap",
            desc: "155 Point jump to reach Fair credit in record time."
        }
    ];

    return (
        <section style={{ padding: '80px 20px', background: 'rgba(255,255,255,0.5)' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Real Data. Real Results.</h2>
                    <p style={{ color: '#666', fontSize: '1.2rem' }}>We don't just talk about it—we show you the proof.</p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: '40px'
                }}>
                    {results.map((result, index) => (
                        <div key={index} className="glass-panel" style={{
                            padding: '15px',
                            textAlign: 'center',
                            transition: 'transform 0.3s ease'
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <div style={{
                                borderRadius: '12px',
                                overflow: 'hidden',
                                marginBottom: '20px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                background: '#fff'
                            }}>
                                <img
                                    src={result.image}
                                    alt={result.title}
                                    style={{ width: '100%', display: 'block' }}
                                />
                            </div>
                            <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>{result.title}</h3>
                            <p style={{ color: '#666', fontSize: '1rem', lineHeight: '1.5' }}>{result.desc}</p>
                        </div>
                    ))}
                </div>

                <div style={{ textAlign: 'center', marginTop: '60px' }}>
                    <div style={{
                        display: 'inline-block',
                        padding: '15px 30px',
                        background: 'rgba(0,102,204,0.05)',
                        borderRadius: '50px',
                        color: 'var(--color-accent)',
                        fontWeight: '600'
                    }}>
                        ✓ Results Verified by Third-Party Bureau Reports
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ResultsSection;
