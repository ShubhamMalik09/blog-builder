export async function uploadImageToServer(file) {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
    });

    if (!res.ok) throw new Error("Image upload failed");

    const data = await res.json();
    return data.url; // returned URL from server
}