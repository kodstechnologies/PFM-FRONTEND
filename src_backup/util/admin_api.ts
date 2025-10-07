// import axios from "axios";
// import { getConfig } from "../config/environment";

// // Get configuration
// const config = getConfig();

// // Base URL from config
// const BASE_URL = config.API_BASE_URL;

// // Create axios instance
// const API = axios.create({
//   baseURL: BASE_URL,
// });
// console.log("🚀 ~ API:", API)

// // Request interceptor → attach access token
// API.interceptors.request.use(
//   (config: any) => {
//     const accessToken = localStorage.getItem("accessToken");
//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }
//     return config;
//   },
//   (error: any) => Promise.reject(error)
// );

// // Response interceptor → refresh token if access token expired
// // API.interceptors.response.use(
// //   (response: any) => response,
// //   async (error: any) => {
// //     const originalRequest = error.config;

// //     // Check if token expired (401 Unauthorized)
// //     if (error.response?.status === 401 && !originalRequest._retry) {
// //       originalRequest._retry = true;

// //       try {
// //         const refreshToken = localStorage.getItem("refreshToken");

// //         // Call refresh endpoint
// //         const res = await axios.post(`${BASE_URL}/auth/refresh`, {
// //           refreshToken,
// //         });

// //         const newAccessToken = res.data.accessToken;

// //         // Save new token
// //         localStorage.setItem("accessToken", newAccessToken);

// //         // Retry original request with new token
// //         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
// //         return API(originalRequest);
// //       } catch (err: any) {
// //         console.error("Token refresh failed:", err);
// //         // Optional: logout user
// //         localStorage.removeItem("accessToken");
// //         localStorage.removeItem("refreshToken");
// //         window.location.href = "/login";
// //       }
// //     }

// //     return Promise.reject(error);
// //   }
// // );

// // Request interceptor → attach access token
// API.interceptors.request.use(
//   (config: any) => {
//     // Skip token for login request
//     if (config.url?.includes("/admin/login")) {
//       return config;
//     }

//     // Get token from stored user
//     const user = localStorage.getItem("superAdminUser");
//     if (user) {
//       const parsedUser = JSON.parse(user);
//       const token = parsedUser?.token;
//       if (token) {
//         config.headers = {
//           ...config.headers,
//           Authorization: `Bearer ${token}`,
//         };
//       }
//     }

//     return config;
//   },
//   (error: any) => Promise.reject(error)
// );


// // ✅ Reusable function with validation
// export const callApi = async (
//   endpoint: string, 
//   method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET", 
//   data: any = null
// ) => {
//   try {
//     const response = await API({
//       url: endpoint,
//       method,
//       data,
//     });
//     return response.data;
//   } catch (error: any) {
//     console.error("API call failed:", error);
//     throw error;
//   }
// };

// export default API;


import axios, { AxiosRequestConfig, InternalAxiosRequestConfig, Method } from "axios";
import { getConfig } from "../config/environment";

const config = getConfig();
const BASE_URL = config.API_BASE_URL;

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
