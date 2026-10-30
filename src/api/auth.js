import api from "./client";

export const registerUser = async (payload) => {
    const response = await api.post("/pwa/user/register", payload);
    return response.data;
};

export const loginUser = async (payload) => {
    const response = await api.post("/pwa/user/login", payload);
    return response.data;
};