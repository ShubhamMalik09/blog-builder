import axios from "axios";

export function uploadMedia(file, onProgress) {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);
    
    return axios.post(`${process.env.NEXT_PUBLIC_API_URL}/media/upload`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            "ngrok-skip-browser-warning": "true",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress?.(progress);
        }
    });
}