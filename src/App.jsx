import React, { useRef } from 'react';
import Layout from './components/Layout';
import CreditPredictor from './components/CreditPredictor';
import HeroVSL from './components/HeroVSL';
import ResultsSection from './components/ResultsSection';
import ReviewsSection from './components/ReviewsSection';

function App() {
    const predictorRef = useRef(null);

    const scrollToPredictor = () => {
        predictorRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <Layout>
            <HeroVSL onStart={scrollToPredictor} />

            <section
                ref={predictorRef}
                style={{
                    padding: '80px 20px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <div style={{ maxWidth: '800px', width: '100%' }}>
                    <CreditPredictor />
                </div>
            </section>

            <ResultsSection />
            <ReviewsSection />
        </Layout>
    );
}

export default App;
