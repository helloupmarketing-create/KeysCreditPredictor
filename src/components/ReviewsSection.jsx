import React from 'react';

const ReviewsSection = () => {
    const reviews = [
        {
            name: "Mariela Venzor",
            role: "Recent Client",
            content: "Great price! I am very thankful and grateful I found Keys Tactical, they helped me and my husband fix our credit from credit card debt collections, and a repo! We just recently bought our house and bought my dream SUV! If you are looking for a reliable credit repair company don't look further!!!!!",
            rating: 5
        },
        {
            name: "Jonathan Garcia",
            role: "Recent Client",
            content: "Keylani and her team went above and beyond for our family!!! They helped us pick the perfect home for us in such a short time frame and were there to answer any questions or concerns every step of the way!!! They are literally the best! Very thankful to them for everything.",
            rating: 5
        },
        {
            name: "Brianda Sanchez",
            role: "Recent Client",
            content: "Keylani has been nothing but the best. She was the sweetest and most patient with our process. It was an easy process and not a fast one but she didn't give up on us and all our hurdles to get our home. She made sure we got the best deal and always communicated with us throughout the entire process. She made our dream come true to own our Dream Home!",
            rating: 5
        }
    ];

    return (
        <section style={{ padding: '100px 20px', background: 'rgba(255,255,255,0.3)' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <h2 style={{
                        fontSize: 'clamp(2rem, 4vw, 3rem)',
                        marginBottom: '16px',
                        color: 'var(--color-text-heading)',
                        fontWeight: '700'
                    }}>
                        Trusted by Professionals. <br /> Loved by Families.
                    </h2>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginBottom: '15px' }}>
                        {[...Array(5)].map((_, i) => (
                            <span key={i} style={{ color: '#FFD700', fontSize: '1.5rem' }}>★</span>
                        ))}
                    </div>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: '40px'
                }}>
                    {reviews.map((review, index) => (
                        <div key={index} className="glass-panel" style={{
                            padding: '40px',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            border: '1px solid rgba(0,0,0,0.05)'
                        }}>
                            <div>
                                <div style={{ display: 'flex', gap: '2px', marginBottom: '25px' }}>
                                    {[...Array(review.rating)].map((_, i) => (
                                        <span key={i} style={{ color: '#FFD700', fontSize: '1rem' }}>★</span>
                                    ))}
                                </div>
                                <blockquote style={{
                                    fontStyle: 'italic',
                                    marginBottom: '30px',
                                    lineHeight: '1.8',
                                    color: '#444',
                                    fontSize: '1.1rem',
                                    margin: '0 0 30px'
                                }}>
                                    "{review.content}"
                                </blockquote>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: 'var(--color-accent)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontWeight: 'bold'
                                }}>
                                    {review.name.charAt(0)}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 'bold', color: 'var(--color-text-heading)' }}>{review.name}</div>
                                    <div style={{ fontSize: '0.85rem', color: '#888' }}>{review.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default ReviewsSection;
