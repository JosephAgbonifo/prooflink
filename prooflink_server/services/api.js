import axios from "axios";
import { configDotenv } from "dotenv";

configDotenv();

const BASE_URL = process.env.BASE_URL || "http://localhost:8000";
const PROOFRAIL_API_KEY = process.env.PROOFRAIL_API_KEY;

if (!PROOFRAIL_API_KEY) {
  throw new Error("Missing PROOFRAIL_API_KEY in env");
}

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
  headers: {
    "X-API-Key": PROOFRAIL_API_KEY,
  },
});

// Helper request methods
export const getRequest = async (endpoint, options = {}) => {
  const res = await api.get(endpoint, options);
  return res.data;
};

export const postRequest = async (endpoint, data, options = {}) => {
  const res = await api.post(endpoint, data, options);
  return res.data;
};
