import { createContext, useContext, useEffect, useState } from "react";
import {
  getCurrentUser,
  loginUser,
  registerUser,
  logoutUser,
  registerOrganizer,
  createOrganizerProfile,
} from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check whether user is already authenticated
  const fetchUser = async () => {
    try {
      const data = await getCurrentUser();

      if (data.success) {
        setUser(data.user);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Login
  const login = async (credentials) => {
    const data = await loginUser(credentials);

    if (data.success) {
      setUser(data.user);
    }

    return data;
  };

  const register = async (userData) => {
    const data = await registerUser(userData);

    if (data.success) {
      setUser(data.user);
    }

    return data;
  };

  // Register roganizer
  const registerOrganizerAccount = async (userData) => {
    const data = await registerOrganizer(userData);

    if (data.success) {
      setUser(data.user);
    }

    return data;
  };

  const createOrganizerProfileData = async (profileData) => {
    const data = await createOrganizerProfile(profileData);

    return data;
  };

  // Logout
  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    registerOrganizerAccount,
    createOrganizerProfileData,
    logout,
    fetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
