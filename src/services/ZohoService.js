/**
 * Zoho CRM Service Layer
 * Handles data submission to Zoho via Webhook or API.
 */

const WEBHOOK_URL = import.meta.env.VITE_ZOHO_WEBHOOK_URL;
const MOCK_MODE = import.meta.env.VITE_ENABLE_MOCK_MODE === 'true';

export const ZohoService = {
    async submitLead(leadData) {
        // console.log("🚀 Submitting Lead to Zoho:", leadData);

        if (MOCK_MODE) {
            console.log("⚠️ Mock Mode Enabled: Simulating success response.");
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({ success: true, message: "Mock submission successful" });
                }, 1500);
            });
        }

        if (!WEBHOOK_URL) {
            console.error("❌ Zoho Webhook URL not configured.");
            return { success: false, message: "Configuration Error" };
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
                throw new Error(`Zoho submission failed: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("❌ Zoho Submission Error:", error);
            return { success: false, message: error.message };
        }
    }
};
