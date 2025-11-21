import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import { defaults } from "./data";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const getDefaultContent = (type) => {
  return defaults[type] || ''
}

export const logout = () =>{
  localStorage.clear();
  window.location.href = "/login";
}

export const generateId = () => crypto.randomUUID();
