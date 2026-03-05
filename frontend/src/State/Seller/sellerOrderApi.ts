import { api } from "../../config/Api";

export const fetchSellerOrders = async () => {
    try {
        const response = await api.get(`/seller/orders`);
        return response.data.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Failed to fetch seller orders";
    }
};

export const updateSellerOrderStatus = async ({ orderId, status }: { orderId: number, status: string }) => {
    try {
        const response = await api.patch(`/seller/orders/${orderId}/status/${status}`);
        return response.data.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Failed to update seller order status";
    }
};
