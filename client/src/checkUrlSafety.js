import axios from "axios";

const API_KEY = "YOUR_GOOGLE_API_KEY";

export const checkUrlSafety = async (url) => {
    const requestData = {
        client: {
            clientId: "your-app",
            clientVersion: "1.0"
        },
        threatInfo: {
            threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
            platformTypes: ["ANY_PLATFORM"],
            threatEntryTypes: ["URL"],
            threatEntries: [{ url }]
        }
    };

    try {
        const response = await axios.post(
            `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${API_KEY}`,
            requestData
        );

        if (response.data.matches) {
            return { safe: false, message: "⚠️ This URL is dangerous!" };
        }
        return { safe: true, message: "✅ The URL is safe." };
    } catch (error) {
        console.error("Error checking URL:", error);
        return { safe: false, message: "Error checking URL. Try again." };
    }
};
