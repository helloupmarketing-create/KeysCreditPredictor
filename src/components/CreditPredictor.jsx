import React, { useState } from 'react';
import { calculateProjection } from '../utils/creditLogic';
import { IntegrationService } from '../services/IntegrationService';


import { parsePhoneNumber } from 'libphonenumber-js';

const CreditPredictor = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        emailConsent: false,
        currentScore: 600,
        negativeItems: [],

        goal: 'Buy a Home',
        homeBuyerDetails: ''
    });
    const [result, setResult] = useState(null);
    const [priceEstimate, setPriceEstimate] = useState(null);

    const [consentError, setConsentError] = useState('');

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;
        setFormData(prev => ({ ...prev, [name]: val }));

        if (name === 'emailConsent' && checked) {
            setConsentError('');
        }
    };

    const handleCheckboxChange = (item) => {
        setFormData(prev => {
            const items = prev.negativeItems.includes(item)
                ? prev.negativeItems.filter(i => i !== item)
                : [...prev.negativeItems, item];
            return { ...prev, negativeItems: items };
        });
    };

    const nextStep = () => {
        if (step === 1) {
            // Validate Name and Email
            if (!formData.firstName || !formData.lastName || !formData.email) {
                setConsentError('Please fill in all fields.'); // Reuse error state for simplicity or create general error
                return;
            }

            // Validate Consent
            if (!formData.emailConsent) {
                setConsentError('You must agree to receive emails to proceed.');
                return;
            }
        }
        setStep(prev => prev + 1);
    };
    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = async () => {


        setStep(4); // Loading state UI
        setLoading(true);

        // Simulate calculation delay
        setTimeout(async () => {
            try {
                const projection = calculateProjection(formData);

                // Exemption Logic: AZ and CA homebuyers are NEVER disqualified
                // regardless of negative items selected.
                const isExempt = formData.homeBuyerDetails && (
                    formData.homeBuyerDetails.includes('Arizona') ||
                    formData.homeBuyerDetails.includes('California')
                );

                if (isExempt && projection.disqualified) {
                    projection.disqualified = false;

                    // If exempt, we must ensure the projection object has all necessary fields
                    // because the 'disqualified' return from creditLogic might be missing them.
                    if (!projection.increase || projection.increase === 0) {
                        projection.increase = 40; // Default increase for manual review scenario
                    }
                    if (!projection.projectedScore) {
                        projection.projectedScore = parseInt(formData.currentScore) + (projection.increase || 40);
                    }
                    if (!projection.timeframe) {
                        projection.timeframe = '3-6 months';
                    }
                    if (!projection.details) {
                        projection.details = [{ item: 'Credit Analysis Review', points: 40 }];
                    }
                }

                setResult(projection);

                // Pricing Logic
                let price = '';
                // Pricing Logic Update: FREE Only for Arizona + No Realtor
                if (formData.goal === 'Buy a Home' && formData.homeBuyerDetails === "Arizona (I don't have a Realtor)") {
                    price = 'FREE (Arizona Home Buyer Special)';
                } else {
                    const count = formData.negativeItems.length;
                    // Heuristic: If they checked it, assume at least 1-2 accounts.
                    // Refined Logic based on Item Types:
                    const hasAdvancedItems = formData.negativeItems.some(i => ['Bankruptcy', 'Foreclosures', 'Repos', 'Child Support', 'Judgments'].includes(i));

                    if (hasAdvancedItems) {
                        price = '$2,100 - $3,000 (One-time)';
                    } else if (count >= 4) { // Heuristic for "Popular" (>10 accounts usually implies multiple types selected)
                        price = '$1,500 - $2,000 (One-time)';
                    } else {
                        price = '$1,000 - $1,400 (One-time)';
                    }
                }
                setPriceEstimate(price);

                // Send to Integration (Zapier) in background
                // Conditions:
                // 1. Not an Arizona Buyer with a Realtor
                // 2. Not Disqualified (only Late Payments or High Balances)

                const isArizonaWithRealtor = formData.goal === 'Buy a Home' && formData.homeBuyerDetails === "Arizona (I have a realtor)";
                const isDisqualified = projection.disqualified;

                if (!isArizonaWithRealtor && !isDisqualified) {
                    await IntegrationService.submitLead({
                        contact: {
                            firstName: formData.firstName,
                            lastName: formData.lastName,
                            email: formData.email,
                            emailConsent: formData.emailConsent
                        },
                        creditProfile: {
                            currentScore: formData.currentScore,
                            negativeItems: formData.negativeItems,
                            goal: formData.goal,
                            homeBuyerDetails: formData.goal === 'Buy a Home' ? formData.homeBuyerDetails : 'N/A'
                        },
                        meta: {
                            source: 'website-funnel',
                            timestamp: new Date().toISOString()
                        }
                    });

                    // Track Lead Event (if pixel exists)
                    if (window.fbq) {
                        window.fbq('track', 'Lead');
                    }
                }

                setStep(5); // Result state
            } catch (error) {
                console.error("Error in calculation/submission:", error);
                alert("An error occurred while processing your request. Please try again.");
                setStep(1); // Go back to start or handle gracefully
            } finally {
                setLoading(false);
            }
        }, 2000);
    };


    // Load Acuity Script removed - using direct links now

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
                        <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
                        <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
                        <input name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />

                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                            <input
                                type="checkbox"
                                name="emailConsent"
                                checked={formData.emailConsent}
                                onChange={handleInputChange}
                                style={{ marginTop: '4px', width: 'auto' }}
                            />
                            <label style={{ fontSize: '14px', color: '#555' }}>
                                I agree to receiving e-mails and updates.
                            </label>
                        </div>
                        {consentError && <small style={{ color: 'red', marginTop: '-10px' }}>{consentError}</small>}

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
                        {['Collections', 'Charge Offs', 'Late Payments', 'Inquiries', 'Bankruptcy', 'Repos', 'Child Support', 'High Balances'].map(item => (
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
                        {['Buy a Home', 'Buy a Car', 'Get a Credit Card', 'General Improvement'].map(goal => (
                            <button
                                key={goal}
                                className={formData.goal === goal ? 'btn-primary' : 'btn-secondary'}
                                onClick={() => setFormData(p => ({ ...p, goal, homeBuyerDetails: '' }))} // Reset details on goal change
                                style={{ textAlign: 'left' }}
                            >
                                {goal}
                            </button>
                        ))}
                    </div>

                    {formData.goal === 'Buy a Home' && (
                        <div style={{ marginTop: '20px', animation: 'fadeIn 0.5s' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Tell us more about your home buying journey:</label>
                            <select
                                value={formData.homeBuyerDetails}
                                onChange={(e) => setFormData(prev => ({ ...prev, homeBuyerDetails: e.target.value }))}
                                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                            >
                                <option value="">-- Please Select --</option>
                                <option value="Arizona (I don't have a Realtor)">Arizona (I don't have a Realtor)</option>
                                <option value="Arizona (I have a realtor)">Arizona (I have a realtor)</option>
                                <option value="California (I don't have a realtor)">California (I don't have a realtor)</option>
                                <option value="California (I have a realtor)">California (I have a realtor)</option>
                                <option value="Any other state">Any other state</option>
                            </select>
                        </div>
                    )}
                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>

                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                        <button className="btn-secondary" onClick={prevStep}>Back</button>
                        <button className="btn-primary" onClick={handleSubmit} disabled={formData.goal === 'Buy a Home' && !formData.homeBuyerDetails}>Analyze Now</button>
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
                    {result.disqualified ? (
                        /* Disqualified View */
                        <div style={{ padding: '20px', background: '#fff5f5', borderRadius: '10px', border: '1px solid #fed7d7' }}>
                            <h3 style={{ color: '#c53030' }}>We're Sorry, {formData.firstName}</h3>
                            <p style={{ color: '#2d3748', margin: '20px 0', lineHeight: '1.6' }}>
                                Based on the items you selected ({formData.negativeItems.join(', ')}),
                                we are unable to assist you at this time.
                            </p>
                            <p style={{ fontSize: '14px', color: '#718096' }}>
                                We specialize in removing inaccurate negative items such as collections, charge-offs, and bankruptcies.
                                We generally cannot help with legitimate late payments or high credit card balances.
                            </p>
                            <button className="btn-secondary" style={{ width: '100%', marginTop: '20px' }} onClick={() => window.location.reload()}>
                                Start Over
                            </button>
                        </div>
                    ) : (
                        /* Qualified View */
                        <>
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
                                    {priceEstimate.includes('FREE') ? (
                                        <div style={{ fontSize: '12px', marginTop: '5px' }}>*Standard fees waived for AZ Home Buyers.</div>
                                    ) : (
                                        <div style={{ fontSize: '12px', marginTop: '5px', fontStyle: 'italic', color: '#555' }}>
                                            *One-time payment. Financing options available.
                                        </div>
                                    )}
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                                {formData.homeBuyerDetails === "Arizona (I don't have a Realtor)" ? (
                                    <a
                                        href="https://keystacticalappointment.as.me/schedule/14e19d5f/appointment/69755159/calendar/10477452?appointmentTypeIds%5B%5D=69755159"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-primary"
                                        style={{ width: '100%', textAlign: 'center', textDecoration: 'none', display: 'inline-block', boxSizing: 'border-box' }}
                                    >
                                        Schedule Appointment
                                    </a>
                                ) : formData.homeBuyerDetails === "California (I don't have a realtor)" ? (
                                    <a
                                        href="https://keystacticalappointment.as.me/schedule/14e19d5f/appointment/69755159/calendar/10477452?appointmentTypeIds%5B%5D=69755159"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-primary"
                                        style={{ width: '100%', textAlign: 'center', textDecoration: 'none', display: 'inline-block', boxSizing: 'border-box' }}
                                    >
                                        Schedule Free Consultation
                                    </a>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(255, 255, 255, 0.6)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.8)', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                        <h3 style={{ color: '#2f855a', marginBottom: '10px', fontSize: '20px' }}>🎉 You're on your way!</h3>
                                        <p style={{ color: '#4a5568', lineHeight: '1.6', marginBottom: '15px' }}>
                                            Congratulations on taking the first step! We've sent an email to <strong>{formData.email}</strong> with your personalized plan to fix your credit.
                                        </p>
                                        <p style={{ color: '#2d3748', fontWeight: 'bold' }}>
                                            Check your inbox now to get started! 🚀
                                        </p>
                                    </div>
                                )}

                                <button className="btn-secondary" style={{ width: '100%' }} onClick={() => window.location.reload()}>
                                    Start Over
                                </button>
                            </div>

                            <p style={{ fontSize: '12px', color: '#999', marginTop: '20px', fontStyle: 'italic' }}>
                                *Disclaimer: Results may vary. Projections are estimates based on standard credit repair models and your provided information.
                            </p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default CreditPredictor;
