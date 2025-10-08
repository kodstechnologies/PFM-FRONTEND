import axios, { AxiosRequestConfig, InternalAxiosRequestConfig, Method } from "axios";
import { getConfig } from "../config/environment";

const config = getConfig();
const BASE_URL = import.meta.env.VITE_API_URL;

const API = axios.create({
  baseURL: BASE_URL,
});

// Request interceptor → attach access token
API.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Skip token for login request
    if (config.url?.includes("/admin/login")) {
      return config;
    }

    const user = localStorage.getItem("superAdminUser");
    if (user) {
      const parsedUser = JSON.parse(user);
      const token = parsedUser?.token;
      if (token) {
        // ✅ Ensure headers exist and have correct type
        config.headers = config.headers ?? {};
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Reusable API call
interface CallApiOptions {
  endpoint: string;
  method?: Method;
  data?: any;
  config?: AxiosRequestConfig;
}

export const callApi = async ({
  endpoint,
  method = "GET",
  data = null,
  config = {},
}: CallApiOptions) => {
  try { 
    const response = await API.request({
      url: endpoint,
      method,
      data,
      ...config,
    });
    return response.data;
  } catch (error: any) {
    console.error("API call failed:", error);
    throw error;
  }
};

export default API;
