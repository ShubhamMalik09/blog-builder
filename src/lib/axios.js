import axios from "axios";

const api = axios.create({
  baseURL: "https://8c0aea22cf8e.ngrok-free.app/api/v1",
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

export default api;