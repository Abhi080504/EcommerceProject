import { combineReducers, configureStore } from "@reduxjs/toolkit";
import productReducer from "./product/productSlice";
import authReducer from "./Auth/authSlice";
import cartReducer from "./Cart/cartSlice";
import orderReducer from "./Order/orderSlice";
import homeCategoryReducer from "./HomeCategory/homeCategorySlice";
import dealReducer from "./Deals/dealSlice";
import couponReducer from "./Coupon/couponSlice";
import sellerReducer from "./Seller/sellerSlice";
import sellerOrderReducer from "./Seller/sellerOrderSlice";
import transactionReducer from "./Seller/transactionSlice";
import reviewReducer from "./review/reviewSlice";

/* =========================
   ROOT REDUCER
========================= */
const rootReducer = combineReducers({
   auth: authReducer,
   products: productReducer,
   cart: cartReducer,
   order: orderReducer,
   homeCategory: homeCategoryReducer,
   deal: dealReducer,
   coupon: couponReducer,
   seller: sellerReducer,
   sellerOrder: sellerOrderReducer,
   transaction: transactionReducer,
   reviews: reviewReducer,
});

/* =========================
   STORE
========================= */
export const store = configureStore({
   reducer: rootReducer,
});

/* =========================
   TYPES (IMPORTANT)
========================= */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
