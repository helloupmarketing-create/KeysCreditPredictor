/**
 * Integration Service Layer
 * Handles data submission to external platforms via Webhook (e.g., Zapier, Make).
 */

const WEBHOOK_URL = import.meta.env.VITE_ZAPIER_WEBHOOK_URL;
const MOCK_MODE = import.meta.env.VITE_ENABLE_MOCK_MODE === 'true';

export const IntegrationService = {
    async submitLead(leadData) {
        // console.log("🚀 Submitting Lead to Integration Endpoint:", leadData);

        if (MOCK_MODE) {
            console.log("⚠️ Mock Mode Enabled: Simulating success response.");
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({ success: true, message: "Mock submission successful" });
                }, 1500);
            });
        }

        if (!WEBHOOK_URL) {
            console.error("❌ Integration Webhook URL not configured.");
            // We return success: false, but in a real funnel you might want to 
            // fallback or log this critical failure without stopping the UI flow if possible, 
            // but for now we warn the user/dev.
            return { success: false, message: "Configuration Error: Webhook URL missing" };
        }

        try {
            // Simple POST to Webhook
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(leadData),
            });

            if (!response.ok) {
                // Zapier hooks usually return 200 OK even if they fail logic, 
                // but if 4xx/5xx happens, we catch it here.
                throw new Error(`Integration submission failed: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("❌ Integration Submission Error:", error);
            // In many funnels, even if the "Zap" fails, we might still want to show the success page 
            // to the user so they don't get stuck. 
            // However, we'll return false here so the UI knows.
            return { success: false, message: error.message };
        }
    }
};
