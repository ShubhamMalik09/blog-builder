import axios from "axios";

export function uploadMedia(file) {
    if (!file) return null;


    const formData = new FormData();
    formData.append("file", file);
    return axios.post("https://5b110fa4b776.ngrok-free.app/api/v1/media/upload", formData, {
        headers: {
        "Content-Type": "multipart/form-data",
        "ngrok-skip-browser-warning": "true",
        },
    });

}