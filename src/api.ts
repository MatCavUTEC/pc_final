import axios from "axios";

const api = axios.create({
  baseURL: "https://mentoriautec-api.aaron-navarro.workers.dev/api",
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !error.config.url.includes("/auth/")
    ) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export function apiError(err: unknown) {
  if (axios.isAxiosError(err) && err.response) {
    return err.response.data as { code: string; message: string };
  }
  return { code: "NETWORK", message: "No se pudo conectar al servidor" };
}

export default api;
