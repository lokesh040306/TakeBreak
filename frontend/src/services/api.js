// src/services/api.js
import axios from "axios";

/**
 * Axios instance
 * Central place for all backend API calls
 */

const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_API_URL is not defined");
}

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Normalize API errors
 */
const handleApiError = (error) => {
  if (error.response?.data) {
    throw error.response.data;
  }
  throw new Error("Network error. Please try again.");
};

/**
 * Create a new room
 */
export const createRoom = async (password, durationInMinutes) => {
  try {
    const res = await api.post("/api/rooms/create", {
      password,
      durationInMinutes,
    });
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

/**
 * Join an existing room
 */
export const joinRoom = async (roomId, password) => {
  try {
    const res = await api.post("/api/rooms/join", {
      roomId,
      password,
    });
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

export default api;
