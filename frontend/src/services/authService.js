import api from "./api";

// Login
export const loginUser = async (credentials) => {
    const response = await api.post("/auth/login", credentials);

    return response.data;
};


// forgot password
export const forgotPassword = async (email) => {
    const response = await api.post(
        "/auth/password/forgot",
        { email }
    );

    return response.data;
};

// Reset password
export const resetPassword = async (token, password, confirmPassword) => {
    const response = await api.put(
        `/auth/password/reset/${token}`,
        {
            password,
            confirmPassword,
        }
    );

    return response.data;
};


// Register user
export const registerUser = async (userData) => {
    const response = await api.post("/auth/register", userData);

    return response.data;
};

// Get currently authenticated user
export const getCurrentUser = async () => {
    const response = await api.get("/auth/me");

    return response.data;
};

// Register organizer account
export const registerOrganizer = async (userData) => {
    const response = await api.post(
        "/auth/organizer/register",
        userData
    );

    return response.data;
};

// Create organizer profile
export const createOrganizerProfile = async (profileData) => {
    const response = await api.post(
        "/organizer/profile",
        profileData
    );

    return response.data;
};


// Logout
export const logoutUser = async () => {
    const response = await api.get("/auth/logout");

    return response.data;
};