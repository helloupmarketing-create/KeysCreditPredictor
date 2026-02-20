import React from 'react';

const Layout = ({ children }) => {
    return (
        <div className="layout-root" style={{ width: '100%', minHeight: '100vh', position: 'relative' }}>
            {/* Ambient Background Orbs - fixed to follow scroll or absolute? absolute usually works best for long pages */}
            <div style={{
                position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
                zIndex: -1, pointerEvents: 'none', overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute', top: '-10%', left: '-10%', width: '40vmax', height: '40vmax',
                    background: 'radial-gradient(circle, rgba(190, 177, 152, 0.4) 0%, transparent 70%)',
                    filter: 'blur(60px)', opacity: 0.6
                }} />
                <div style={{
                    position: 'absolute', bottom: '-10%', right: '-10%', width: '40vmax', height: '40vmax',
                    background: 'radial-gradient(circle, rgba(0, 102, 204, 0.3) 0%, transparent 70%)',
                    filter: 'blur(60px)', opacity: 0.4
                }} />
            </div>

            <header style={{ 
                padding: '20px 0', 
                textAlign: 'center',
                position: 'absolute', 
                top: 0, 
                width: '100%', 
                zIndex: 10 
            }}>
                <img
                    src="https://images.squarespace-cdn.com/content/v1/618c07471e0c9432709100c3/ada76538-1899-4c79-b027-eb25f8f90ea3/TRANSPARENT+LOGO.png"
                    alt="Keys Credit Logo"
                    style={{ height: '50px' }}
                />
            </header>

            <main style={{ width: '100%' }}>
                {children}
            </main>

            <footer style={{ 
                textAlign: 'center', 
                padding: '60px 20px', 
                color: '#888', 
                fontSize: '0.9rem',
                borderTop: '1px solid rgba(0,0,0,0.05)',
                background: 'rgba(255,255,255,0.3)'
            }}>
                <p>© {new Date().getFullYear()} Keys Credit. Secure 256-bit Encryption.</p>
                <div style={{ marginTop: '10px', fontSize: '0.8rem' }}>
                    Standard messaging and data rates may apply. Results may vary.
                </div>
            </footer>
        </div>
    );
};

export default Layout;
