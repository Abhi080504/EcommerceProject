import { api } from "../config/Api";

export const fetchProduct = async () => {
    try {
        const response = await api.get("/products");
        console.log("response", response);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}