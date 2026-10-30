import api from "./client";

export const getRestaurants = async () => {
    const cityId = import.meta.env.VITE_CITY_ID || "118";
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Authentication required. Please login.");
    }

    const response = await api.get("/m/restaurant", {
        params: {
            city_id: cityId,
        },
        headers: {
            Authorization: `${token}`,
        },
    });

    return response.data;
};