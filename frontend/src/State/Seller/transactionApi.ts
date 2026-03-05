import { api } from "../../config/Api";

export const fetchSellerTransactions = async () => {
    try {
        const response = await api.get(`/transactions/seller`);
        return response.data.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Failed to fetch seller transactions";
    }
};
