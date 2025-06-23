import axios from "axios";

const API_KEY = "3b0d51ebd48f233cacfcd72182c426f355d24d0fb1df17616c27f27aa7e64a53"; // Replace with your API Key

export const checkUrlVirusTotal = async (url) => {
    try {
        // Step 1: Submit the URL for scanning
        const response = await axios.post(
            "https://www.virustotal.com/api/v3/urls",
            new URLSearchParams({ url }), // Encode URL
            {
                headers: {
                    "x-apikey": API_KEY,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        const analysisId = response.data.data.id;

        // Step 2: Fetch the analysis results
        const analysisResponse = await axios.get(
            `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
            { headers: { "x-apikey": API_KEY } }
        );

        const stats = analysisResponse.data.data.attributes.stats;
        const maliciousCount = stats.malicious;
        const suspiciousCount = stats.suspicious;
        const harmlessCount = stats.harmless;

        return {
            safe: maliciousCount === 0,
            message: maliciousCount > 0
                ? `⚠️ Detected as malicious by ${maliciousCount} sources.`
                : "✅ No threats detected.",
            details: analysisResponse.data.data.links.self,
        };
    } catch (error) {
        console.error("Error checking URL:", error);
        return { safe: false, message: "Error checking URL. Try again." };
    }
};

export const checkFileVirusTotal = async (file) => {

    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post("https://www.virustotal.com/api/v3/files", formData, {
        headers: { "x-apikey": API_KEY, "Content-Type": "multipart/form-data" },
    });

    return response.data;
};


const checkDomain = async (domain) => {
    const response = await axios.get(
        `https://www.virustotal.com/api/v3/domains/${domain}`,
        { headers: { "x-apikey": API_KEY } }
    );
    return response.data;
};
