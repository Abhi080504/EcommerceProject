import { api } from "../../config/Api";

export const createOrder = async (req: { address: any; paymentMethod: "RAZORPAY" | "STRIPE" | "COD" }) => {
    try {
        // Post address as body, paymentMethod as param
        const response = await api.post(`/orders?paymentMethod=${req.paymentMethod}`, req.address);
        return response.data; // Returns PaymentLinkResponse { payment_link_url, ... }
    } catch (error: any) {
        throw error.response?.data?.message || "Failed to create order";
    }
};

export const fetchUserOrders = async () => {
    try {
        const response = await api.get(`/orders/user`);
        return response.data.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Failed to fetch orders";
    }
};

export const fetchOrderById = async (orderId: number) => {
    try {
        const response = await api.get(`/orders/${orderId}`);
        return response.data.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Failed to fetch order";
    }
};
