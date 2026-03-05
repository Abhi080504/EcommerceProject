import React, { useEffect } from "react";
import "./App.css";
import { ThemeProvider } from "@mui/material";
import { Route, Routes, useLocation } from "react-router-dom"; // 1. Import useLocation
import { ToastProvider } from "./context/ToastContext";

// Theme
import customTheme from "./Theme/customTheme";


// Components
import Navbar from "./Customer/components/Navbar/Navbar";
import Footer from "./Customer/components/Footer/Footer"; // 2. Import Footer

// Customer Pages
import Home from "./Customer/pages/Home/Home";
import GroceryPage from "./Customer/pages/Home/GrocerySection/GroceryPage";
import Product from "./Customer/pages/Product/Product";
import ProductDetails from "./Customer/pages/ProductDetails/ProductDetails";
import GroceryProductDetails from "./Customer/pages/ProductDetails/GroceryProductDetails";
import Review from "./Customer/pages/Review/Review";
import Cart from "./Customer/pages/Cart/Cart";
import Checkout from "./Customer/pages/Checkout/Checkout";
import PaymentSuccess from "./Customer/pages/PaymentSuccess/PaymentSuccess";
import Account from "./Customer/pages/Account/Account";
import BecomeSeller from "./Customer/pages/BecomeSeller/BecomeSeller";
import ProductList from "./Customer/pages/Product/ProductList";
import AboutUs from "./Customer/pages/AboutUs/AboutUs";
import ContactUs from "./Customer/pages/ContactUs/ContactUs";
import PrivacyPolicy from "./Customer/pages/PrivacyPolicy/PrivacyPolicy";
import Blogs from "./Customer/pages/Blogs/Blogs";
import Careers from "./Customer/pages/Careers/Careers";

// Seller & Admin Pages
import SellerDashboard from "./Seller/pages/SellerDashboard/SellerDashboard";
import AdminDashboard from "./admin/pages/dashboard/Dashboard";
import SuperAdminDashboard from "./admin/pages/SuperAdmin/SuperAdminDashboard";
import { fetchProduct } from "./State/fetchProduct";

import { useAppDispatch, useAppSelector } from "./State/hooks";
import { loadUserProfile } from "./State/Auth/authSlice";

function App() {
  const location = useLocation();

  // 3. Define routes where Footer/Navbar should be HIDDEN
  // We hide the main footer on dashboards because they are "app-like" interfaces
  const hideFooterRoutes = ["/seller", "/admin", "/grocery", "/super-admin"];
  const hideNavbarRoutes = ["/seller", "/admin", "/super-admin"];

  const shouldHideFooter = hideFooterRoutes.some((route) =>
    location.pathname.startsWith(route),
  );
  const shouldHideNavbar = hideNavbarRoutes.some((route) =>
    location.pathname.startsWith(route),
  );

  const dispatch = useAppDispatch(); // Need dispatch
  const { auth } = useAppSelector((store) => store); // Optional: if we want to check state

  useEffect(() => {
    fetchProduct();

    // 🌍 GLOBAL AUTH CHECK: Always try to load profile (via Cookie)
    dispatch(loadUserProfile());
  }, [dispatch]);
  return (
    <ThemeProvider theme={customTheme}>
      <ToastProvider>
        {/* Global Background: Warm Cream */}
        <div className="min-h-screen flex flex-col bg-[#FDFBF7] font-sans selection:bg-[#F9B233] selection:text-[#3E2C1E]">
          {/* Navbar (Sticky at Top) - Hidden on Dashboard routes */}
          {!shouldHideNavbar && (
            <div className="sticky top-0 z-[100]">
              <Navbar />
            </div>
          )}

          {/* Main Content Area - Expands to fill space */}
          <div className="flex-1 w-full">
            <Routes>
              {/* --- CUSTOMER ROUTES --- */}
              <Route path="/" element={<Home />} />

              {/* The Grocery Page has its own internal layout/theme */}
              <Route path="/grocery" element={<GroceryPage />} />

              <Route path="/products/:category" element={<ProductList />} />
              <Route path="/products" element={<ProductList />} />

              {/* Product Details Route */}
              <Route path="/product/:productId" element={<ProductDetails />} />
              <Route path="/grocery/product/:productId" element={<GroceryProductDetails />} />

              {/* Legacy Route Support */}
              {/* <Route path="/product-details/:categoryId/:name/:productId" element={<ProductDetails />} /> */}

              <Route path="/reviews/:productId" element={<Review />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route
                path="/payment-success/:orderId"
                element={<PaymentSuccess />}
              />

              <Route path="/account/*" element={<Account />} />
              <Route path="/become-seller" element={<BecomeSeller />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/careers" element={<Careers />} />

              {/* --- SELLER ROUTES (Has internal Sidebar) --- */}
              <Route path="/seller/*" element={<SellerDashboard />} />

              {/* --- ADMIN ROUTES --- */}
              <Route path="/admin/*" element={<AdminDashboard />} />

              {/* --- SUPER ADMIN ROUTES --- */}
              <Route path="/super-admin/*" element={<SuperAdminDashboard />} />
            </Routes>
          </div>

          {/* Footer - Hidden on Dashboard routes */}
          {!shouldHideFooter && <Footer />}
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
