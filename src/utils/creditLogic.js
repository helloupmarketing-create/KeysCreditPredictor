/**
 * SOP 002: Predictor Logic Engine Implementation
 * Deterministic calculation of projected credit scores.
 */

const POINT_IMPACT = {
    COLLECTIONS: 30,
    CHARGE_OFFS: 25,
    LATE_PAYMENTS: 15,
    INQUIRIES: 4,
    BANKRUPTCY: 50,
    REPOS: 30
};

/**
 * Calculates the projected credit score increase based on negative items.
 * @param {Object} data - The user input data
 * @param {number} data.currentScore - Current credit score
 * @param {string[]} data.negativeItems - List of negative items
 * @returns {Object} { projectedScore, increase, framing }
 */
export function calculateProjection(data) {
    const { currentScore, negativeItems = [] } = data;
    let increase = 0;

    // Calculate potential increase
    negativeItems.forEach(item => {
        // Normalize string to match keys
        const key = item.toUpperCase().replace(/\s+/g, '_');
        if (POINT_IMPACT[key]) {
            // Logic: For each *type* we add points. 
            // In a real app we might ask for "count", here we assume existence implies impact.
            increase += POINT_IMPACT[key];
        }
    });

    // Cap the score or increase if needed (Business Rule: Max 100pts swing for realism?)
    // SOP says: Projected = Current + Sum. Max 850.
    let projectedScore = Math.min(850, parseInt(currentScore) + increase);

    // Timeframe Logic
    let months = 3;
    if (negativeItems.some(i => i.toLowerCase().includes('bankruptcy') || i.toLowerCase().includes('repo'))) {
        months += 3;
    }
    if (negativeItems.includes('Collections') && increase > 60) {
        months += 2;
    }

    return {
        currentScore: parseInt(currentScore),
        projectedScore,
        increase,
        timeframe: `${months}-${months + 3} months`,
        details: negativeItems.map(item => ({
            item,
            points: POINT_IMPACT[item.toUpperCase().replace(/\s+/g, '_')] || 0
        }))
    };
}
