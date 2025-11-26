// lib/utils/storage.js
export const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

export const getUsername = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('username');
};

export const setToken = (token) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', token);
};

export const setUsername = (username) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('username', username);
};

export const clearAuth = () => {
  if (typeof window === 'undefined') return;
  localStorage.clear();
};