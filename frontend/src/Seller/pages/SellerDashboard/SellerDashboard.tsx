import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../State/hooks";
import { loadSellerProfile } from "../../../State/Auth/authSlice";
import SellerDrawerList from "../../components/SellerDrawerList/SellerDrawerList";
import SellerRoutes from "../../../Routes/SellerRoutes";
import { useNavigate } from "react-router-dom";

const SellerDashboard = () => {
  const [open, setOpen] = useState(false);
  const toggleDrawer = () => setOpen((prev) => !prev);
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const { jwt, seller, user, loading } = useAppSelector((state) => state.auth);

  console.log("DEBUG SELLER:", seller);

  /* ===============================
     FETCH SELLER PROFILE
  ================================ */
  useEffect(() => {
    if (jwt && !seller) {
      dispatch(loadSellerProfile());
    }
  }, [jwt, seller, dispatch]);

  /* ===============================
     AUTHENTICATION GUARD
  ================================ */
  useEffect(() => {
    // Only redirect if we have a JWT but loading is complete and still no seller
    // This prevents premature redirects during the loading phase
    if (jwt && !loading && !seller) {
      console.log("No seller profile found, redirecting to home");
      navigate("/");
    }
  }, [jwt, seller, loading, navigate]);

  /* ===============================
     NOT LOGGED IN
  ================================ */
  /* ===============================
     NOT LOGGED IN (Redirect handled by loadProfile failure or API interceptor)
  ================================ */
  // Cookie Auth: We wait for seller profile to load.
  // If loading fails, the user remains null/seller remains null.
  // You might want to show a loader here.

  return (
    <div className="min-h-screen font-sans">
      <main className="flex h-screen overflow-hidden lg:flex">
        {/* SIDEBAR */}
        <aside
          className={`fixed lg:static top-0 left-0 h-full
          w-[260px] lg:w-[280px]
          bg-[#1e293b] border-r border-slate-800
          shadow-2xl z-40 transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        >
          <SellerDrawerList toggleDrawer={toggleDrawer} />
        </aside>

        {/* MAIN CONTENT */}
        <section className="flex-1 h-full overflow-hidden relative bg-[#f4f6f8]">
          {/* Animation Styles */}
          <style>
            {`
              @keyframes slowPan {
                0% { background-position: 0% 0%; }
                50% { background-position: 100% 100%; }
                100% { background-position: 0% 0%; }
              }
            `}
          </style>

          {/* Animated Background Layer */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url('/adminbg.png')`,
              backgroundSize: "150% 150%",
              animation: "slowPan 60s ease-in-out infinite",
              opacity: 0.15,
              filter: "brightness(0.9) grayscale(10%)",
              zIndex: 0,
              pointerEvents: "none",
            }}
          />

          {/* SCROLLABLE CONTENT */}
          <div className="h-full overflow-y-auto relative z-10 px-6 py-10 lg:px-10">
            {/* MOBILE HEADER */}
            <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-md border-b mb-6 rounded-xl shadow-sm">
              <button
                onClick={toggleDrawer}
                className="px-3 py-2 rounded-lg bg-[#1e293b] text-white"
              >
                Menu
              </button>
              <h2 className="font-semibold text-[#1e293b]">Seller Portal</h2>
            </header>

            {/* CONTENT WRAPPER */}
            <div className="w-full max-w-[1500px] mx-auto">
              <SellerRoutes />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SellerDashboard;
