import api from "../axios";

export function login(payload) {
    return api.post("/auth/login", payload);
}

export function verifyToken() {
    return api.get("/auth/verify");
}