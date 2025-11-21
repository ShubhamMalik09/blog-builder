import api from "../axios";

export function createBlog(payload) {
    return api.post("/posts", payload);
}

export function updateBlog(id, payload) {
    return api.put(`/posts/${id}`, payload);
}

export function archiveBlog(id, payload) {
    return api.post(`/posts/${id}/archive`, payload);
}

export function getBlog(id) {
    return api.get(`/posts/${id}`);
}

export function getAllBlogs(params = {}) {
    return api.get("/posts", { params });
}

export function publishBlog(id, payload) {
    return api.post(`/posts/${id}/publish`, payload);
}

export function unpublishBlog(id, payload){
    return api.post(`/posts/${id}/unpublish`, payload);
}

export function unarchiveBlog(id, payload){
    return api.post(`/posts/${id}/unpublish`, payload);
}

export function getBlogBySlug(slug){
    return api.get(`/posts/slug/${slug}`)
}