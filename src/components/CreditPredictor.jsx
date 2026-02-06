import React, { useState } from 'react';
import { calculateProjection } from '../utils/creditLogic';
import { ZohoService } from '../services/ZohoService';

const CreditPredictor = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        email: '',
        phone: '',
        currentScore: 600,
        negativeItems: [],

        goal: 'Buy a Home'
    });
    const [result, setResult] = useState(null);
    const [priceEstimate, setPriceEstimate] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (item) => {
        setFormData(prev => {
            const items = prev.negativeItems.includes(item)
                ? prev.negativeItems.filter(i => i !== item)
                : [...prev.negativeItems, item];
            return { ...prev, negativeItems: items };
        });
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = async () => {
        setStep(4); // Loading state UI
        setLoading(true);

        // Simulate calculation delay
        setTimeout(async () => {
            const projection = calculateProjection(formData);

            setResult(projection);

            // Pricing Logic
            let price = '';
            if (formData.goal === 'Arizona Home Buyer') {
                price = 'FREE (Arizona Home Buyer Special)';
            } else {
                const count = formData.negativeItems.length; // Logic simplification: normally would ask for count per item
                // Heuristic: If they checked it, assume at least 1-2 accounts.
                // Refined Logic based on Item Types:
                const hasAdvancedItems = formData.negativeItems.some(i => ['Bankruptcy', 'Foreclosures', 'Repos'].includes(i));

                if (hasAdvancedItems) {
                    price = '$2,100 - $3,000 (One-time)';
                } else if (count >= 4) { // Heuristic for "Popular" (>10 accounts usually implies multiple types selected)
                    price = '$1,500 - $2,000 (One-time)';
                } else {
                    price = '$1,000 - $1,400 (One-time)';
                }
            }
            setPriceEstimate(price);

            // Send to Zoho in background
            await ZohoService.submitLead({
                contact: {
                    firstName: formData.firstName,
                    email: formData.email,
                    phone: formData.phone
                },
                creditProfile: {
                    currentScore: formData.currentScore,
                    negativeItems: formData.negativeItems,
                    goal: formData.goal
                },
                meta: {
                    source: 'website-funnel',
                    timestamp: new Date().toISOString()
                }
            });

            setLoading(false);
            setStep(5); // Result state
        }, 2000);
    };

    return (
        <div className="glass-panel" style={{ maxWidth: '600px', margin: '40px auto', padding: '40px' }}>
            {/* Progress Bar */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '30px' }}>
                {[1, 2, 3].map(s => (
                    <div key={s} style={{
                        height: '4px',
                        flex: 1,
                        background: s <= step ? 'var(--color-primary)' : '#ddd',
                        borderRadius: '2px'
                    }} />
                ))}
            </div>

            {/* Step 1: Contact */}
            {step === 1 && (
                <div>
                    <h2>Let's Get Started</h2>
                    <p>Where should we send your analysis?</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
                        <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} />
                        <input name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} />
                        <input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleInputChange} />
                        <button className="btn-primary" onClick={nextStep} style={{ marginTop: '10px' }}>Next: Your Profile</button>
                    </div>
                </div>
            )}

            {/* Step 2: Credit Profile */}
            {step === 2 && (
                <div>
                    <h2>Your Credit Profile</h2>

                    <label style={{ display: 'block', marginBottom: '10px', marginTop: '20px' }}>Estimated Current Score: <strong>{formData.currentScore}</strong></label>
                    <input
                        type="range"
                        min="300"
                        max="850"
                        name="currentScore"
                        value={formData.currentScore}
                        onChange={handleInputChange}
                        style={{ marginBottom: '30px' }}
                    />

                    <p>What's holding you back? (Select all that apply)</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        {['Collections', 'Charge Offs', 'Late Payments', 'Inquiries', 'Bankruptcy', 'Repos'].map(item => (
                            <label key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={formData.negativeItems.includes(item)}
                                    onChange={() => handleCheckboxChange(item)}
                                    style={{ width: 'auto' }}
                                />
                                {item}
                            </label>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                        <button className="btn-secondary" onClick={prevStep}>Back</button>
                        <button className="btn-primary" onClick={nextStep}>Next: Your Goal</button>
                    </div>
                </div>
            )}

            {/* Step 3: Goal */}
            {step === 3 && (
                <div>
                    <h2>What is your primary goal?</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
                        {['Arizona Home Buyer', 'Buy a Home', 'Buy a Car', 'Get a Credit Card', 'General Improvement'].map(goal => (
                            <button
                                key={goal}
                                className={formData.goal === goal ? 'btn-primary' : 'btn-secondary'}
                                onClick={() => setFormData(p => ({ ...p, goal }))}
                                style={{ textAlign: 'left' }}
                            >
                                {goal}
                            </button>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                        <button className="btn-secondary" onClick={prevStep}>Back</button>
                        <button className="btn-primary" onClick={handleSubmit}>Analyze Now</button>
                    </div>
                </div>
            )}

            {/* Step 4: Loading */}
            {step === 4 && (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <div className="spinner" style={{
                        width: '40px', height: '40px', border: '4px solid #ddd',
                        borderTopColor: 'var(--color-primary)', borderRadius: '50%',
                        margin: '0 auto 20px', animation: 'spin 1s linear infinite'
                    }} />
                    <h3>Analyzing Credit Matrix...</h3>
                    <p>Comparing against 50+ data points...</p>
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                </div>
            )}

            {/* Step 5: Results */}
            {step === 5 && result && (
                <div style={{ textAlign: 'center' }}>
                    <h3>Good News, {formData.firstName}!</h3>
                    <p>Based on our analysis, your score could reach:</p>

                    <div style={{
                        fontSize: '64px', fontWeight: 'bold', color: 'var(--color-primary)',
                        textShadow: '0 2px 10px rgba(190, 177, 152, 0.3)', margin: '10px 0'
                    }}>
                        {result.projectedScore}
                    </div>

                    <div style={{ background: 'rgba(0,102,204,0.1)', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
                        <span style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>+{result.increase} Points</span>
                        <span style={{ margin: '0 10px' }}>in</span>
                        <span style={{ fontWeight: 'bold' }}>{result.timeframe}</span>
                    </div>

                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '30px' }}>
                        We identified {result.details.length} factors holding you back.
                        We can help you remove them.
                    </p>

                    {priceEstimate && (
                        <div style={{ marginBottom: '25px', padding: '15px', border: '1px solid var(--color-primary)', borderRadius: '10px' }}>
                            <small style={{ display: 'block', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold', color: '#666' }}>Estimated Cost</small>
                            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#1A1A1A' }}>{priceEstimate}</span>
                            {priceEstimate.includes('FREE') && <div style={{ fontSize: '12px', marginTop: '5px' }}>*Standard fees waived for AZ Home Buyers.</div>}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                        <a
                            href={import.meta.env.VITE_CALENDAR_URL || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary"
                            style={{ width: '100%', textAlign: 'center', textDecoration: 'none', display: 'inline-block', boxSizing: 'border-box' }}
                        >
                            Schedule Free Consultation
                        </a>

                        <button className="btn-secondary" style={{ width: '100%' }} onClick={() => window.location.reload()}>
                            Start Over
                        </button>
                    </div>

                    <p style={{ fontSize: '12px', color: '#999', marginTop: '20px', fontStyle: 'italic' }}>
                        *Disclaimer: Results may vary. Projections are estimates based on standard credit repair models and your provided information.
                    </p>
                </div>
            )}
        </div>
    );
};

export default CreditPredictor;
