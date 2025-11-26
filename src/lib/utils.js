import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import { defaults } from "./data";
import { clearAuth } from "./utils/storage";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const getDefaultContent = (type) => {
  return defaults[type] || ''
}

export const logout = () => {
  clearAuth();
  window.location.href = "/login";
}

export const generateId = () => crypto.randomUUID();