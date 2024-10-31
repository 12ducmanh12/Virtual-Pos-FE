import axios from "axios";

const API_URL = "https://vpos.giftzone.vn/api/user/refresh-token";

export const refreshToken = async () => {
    try {
        const accessToken = localStorage.getItem("token");
        const refreshToken = localStorage.getItem("refreshToken");

        // Make sure both tokens are available
        if (!accessToken || !refreshToken) {
            throw new Error("No tokens available");
        }

        const response = await axios.post(API_URL, {
            accessToken,
            refreshToken,
        });

        // Assuming the response contains the new token and refresh token
        const { accessToken: newToken, refreshToken: newRefreshToken, expiration } = response.data;

        // Save the new tokens to local storage
        localStorage.setItem("token", newToken);
        localStorage.setItem("refreshToken", newRefreshToken);
        localStorage.setItem("expiration", expiration);

        return newToken;
    } catch (error) {
        console.error("Failed to refresh token:", error);
        throw error;
    }
};