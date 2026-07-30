import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8081/api",
    withCredentials: true
});

// JWT Automatique
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Gestion erreurs
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            console.log("SESSION EXPIREE");
        }
        return Promise.reject(error);
    }
);

// Upload de fichier (Image, Vidéo, Document, etc.)
export async function uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/files/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });

    return response.data; // Retourne l'objet FileUploadResponse (contenant .url)
}

export default api;