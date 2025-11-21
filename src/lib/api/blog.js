import api from "../axios";

export function createBlog(payload) {
    return api.post("/posts", payload);
}

export function updateBlog(id, payload) {
    return api.put(`/posts/${id}`, payload);
}

export function archiveBlog(id) {
    return api.post(`/posts/${id}/archive`);
}

export function getBlog(id) {
    return api.get(`/posts/${id}`);
}

export function getAllBlogs(params = {}) {
    return api.get("/posts", { params });
}

export function publishBlog(id) {
    return api.post(`/posts/${id}/publish`);
}

export function unpublishBlog(id){
    return api.post(`/posts/${id}/unpublish`);
}

export function unarchiveBlog(id){
    return api.post(`/posts/${id}/unpublish`);
}