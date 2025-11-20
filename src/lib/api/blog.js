import api from "../axios";

export function createBlog(payload) {
    return api.post("/blogs", payload);
}

export function updateBlog(id, payload) {
    return api.put(`/blogs/${id}`, payload);
}

export function archiveBlog(id) {
    return api.patch(`/blogs/${id}/archive`);
}

export function getBlog(id) {
    return api.get(`/blogs/${id}`);
}

export function getAllBlogs() {
    return api.get(`/blogs/${id}`);
}