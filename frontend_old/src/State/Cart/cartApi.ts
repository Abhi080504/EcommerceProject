import { api } from "../../config/Api";

export const fetchUserCart = async () => {
    try {
        const response = await api.get(`/cart`);
        return response.data.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Failed to fetch cart";
    }
};

export const addItemToCart = async (req: { productId: number; size: string; quantity: number }) => {
    try {
        const response = await api.put(`/cart/add`, req);
        return response.data.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Failed to add item to cart";
    }
};

export const removeCartItem = async (cartItemId: number) => {
    try {
        const response = await api.delete(`/cart/item/${cartItemId}`);
        return response.data.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Failed to remove cart item";
    }
};

export const updateCartItem = async (req: { cartItemId: number; data: { quantity: number } }) => {
    try {
        const response = await api.put(`/cart/item/${req.cartItemId}`, req.data);
        return response.data.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Failed to update cart item";
    }
};

export const applyCoupon = async (req: { apply: string; code: string; orderValue: number }) => {
    try {
        const response = await api.post(`/cart/apply-coupon`, null, {
            params: {
                apply: req.apply,
                code: req.code,
                orderValue: req.orderValue,
            },
        });
        return response.data.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Failed to apply coupon";
    }
};
