import React from 'react';
import Layout from './components/Layout';
import CreditPredictor from './components/CreditPredictor';

function App() {
    return (
        <Layout
            title="Keys Credit Predictor"
            subtitle="Unlock your financial potential with our AI-driven analysis."
        >
            <CreditPredictor />
        </Layout>
    );
}

export default App;
