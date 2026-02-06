import React from 'react';

const Layout = ({ children, title, subtitle }) => {
    return (
        <div className="container" style={{ maxWidth: '800px', width: '95%', margin: '0 auto', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', position: 'relative' }}>

                {/* Ambient Background Orbs */}
                <div style={{
                    position: 'absolute', top: '-10%', left: '-10%', width: '300px', height: '300px',
                    background: 'radial-gradient(circle, rgba(190, 177, 152, 0.4) 0%, transparent 70%)',
                    filter: 'blur(40px)', zIndex: -1
                }} />
                <div style={{
                    position: 'absolute', bottom: '-10%', right: '-10%', width: '300px', height: '300px',
                    background: 'radial-gradient(circle, rgba(0, 102, 204, 0.3) 0%, transparent 70%)',
                    filter: 'blur(40px)', zIndex: -1
                }} />

                <header style={{ textAlign: 'center', marginBottom: '40px' }}>
                    {/* Logo Placeholder */}
                    <img
                        src="https://images.squarespace-cdn.com/content/v1/618c07471e0c9432709100c3/ada76538-1899-4c79-b027-eb25f8f90ea3/TRANSPARENT+LOGO.png"
                        alt="Keys Credit Logo"
                        style={{ height: '60px', marginBottom: '20px' }}
                    />

                    {title && <h1 style={{
                        fontSize: '3rem', margin: '0 0 10px 0',
                        fontFamily: 'var(--font-heading)', color: '#1A1A1A'
                    }}>{title}</h1>}

                    {subtitle && <p style={{
                        fontSize: '1.2rem', color: '#666', margin: 0,
                        fontFamily: 'var(--font-body)'
                    }}>{subtitle}</p>}
                </header>

                <main className="animate-fade-in">
                    {children}
                </main>

                <footer style={{ textAlign: 'center', marginTop: '40px', color: '#888', fontSize: '0.9rem' }}>
                    <p>© {new Date().getFullYear()} Keys Credit. Secure 256-bit Encryption.</p>
                </footer>
            </div>
        </div>
    );
};

export default Layout;
