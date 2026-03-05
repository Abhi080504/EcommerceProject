import { api } from "../../config/Api";

export const verifyPayment = async (paymentId: string, paymentLinkId: string) => {
    try {
        const response = await api.get(`/payment/${paymentId}?paymentLinkId=${paymentLinkId}`);
        return response.data.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Payment verification failed";
    }
};
