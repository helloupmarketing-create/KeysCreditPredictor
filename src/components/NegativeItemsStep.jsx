import React from 'react';

const NEGATIVE_ITEMS = [
    { id: 'late', label: 'Late Payments' },
    { id: 'collections', label: 'Collections' },
    { id: 'chargeoffs', label: 'Charge-Offs' },
    { id: 'inquiries', label: 'Hard Inquiries' },
    { id: 'bankruptcy', label: 'Bankruptcy' },
    { id: 'foreclosure', label: 'Foreclosure' },
    { id: 'errors', label: 'Inaccurate Info' },
    { id: 'unsure', label: 'I\'m not sure' }
];

const NegativeItemsStep = ({ onNext, data, updateData }) => {
    const selected = data.negativeItems || [];

    const toggleItem = (id) => {
        if (selected.includes(id)) {
            updateData('negativeItems', selected.filter(i => i !== id));
        } else {
            updateData('negativeItems', [...selected, id]);
        }
    };

    const handleNext = () => {
        if (selected.length === 0) {
            alert("Please select at least one item or 'I'm not sure'");
            return;
        }
        onNext();
    };

    return (
        <div className="animate-fade-in">
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 600 }}>
                What's holding you back?
            </h2>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Select all that apply to your situation.
            </p>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginBottom: '2rem'
            }}>
                {NEGATIVE_ITEMS.map(item => {
                    const isSelected = selected.includes(item.id);
                    return (
                        <div
                            key={item.id}
                            onClick={() => toggleItem(item.id)}
                            style={{
                                padding: '1rem',
                                borderRadius: 'var(--radius-md)',
                                background: isSelected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)',
                                border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--glass-border)'}`,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                                fontWeight: isSelected ? 600 : 400
                            }}
                        >
                            {item.label}
                        </div>
                    );
                })}
            </div>

            <button className="btn-primary" onClick={handleNext} style={{ width: '100%' }}>
                Analyze My Score
            </button>
        </div>
    );
};

export default NegativeItemsStep;
