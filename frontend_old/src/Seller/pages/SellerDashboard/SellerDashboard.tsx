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
  const { jwt, seller, user } = useAppSelector((state) => state.auth);

  console.log("DEBUG SELLER:", seller);

  /* ===============================
     FETCH SELLER PROFILE
  ================================ */
  useEffect(() => {
    if (!seller) {
      console.log("SellerDashboard: dispatching loadSellerProfile");
      dispatch(loadSellerProfile());
    }
  }, [seller, dispatch]);
  /* ===============================
     HISTORY TRAP
     Prevents "swiping back" or using the browser back button 
     to exit the dashboard.
  ================================ */
  useEffect(() => {
    // Push a dummy state to history twice to ensure we have a buffer
    window.history.pushState(null, "", window.location.href);

    const handlePopState = (event: PopStateEvent) => {
      // When the user tries to go back, we push the state again to "trap" them
      // We also show a tiny breadcrumb or log to confirm trap is active
      console.log("🧭 Navigation Trap: Back gesture blocked.");
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    // ONLY REDIRECT if we are certain the user is not a seller.
    // We wait until either seller profile is loaded OR we have a confirmed non-seller role.
    const isSeller = user?.role === "ROLE_SELLER" || !!seller;
    const isAuthChecked = !!user || !!seller; // Rough check for profile presence

    if (isAuthChecked && !isSeller) {
      console.log("🚫 Access Denied: User is not a seller. Redirecting to Home.");
      navigate("/", { replace: true });
    }
  }, [user, seller, navigate]);

  /* ===============================
     NOT LOGGED IN
  ================================ */
  /* ===============================
     NOT LOGGED IN (Redirect handled by loadProfile failure or API interceptor)
  ================================ */
  // Cookie Auth: We wait for seller profile to load.
  // If loading fails, the user remains null/seller remains null. 
  // You might want to show a loader here.

  const stats = [
    { label: "Total Products", value: 42 },
    { label: "Orders Completed", value: 117 },
    { label: "Pending Orders", value: 6 },
    { label: "Total Revenue", value: "₹1,24,500" },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans">
      <main className="flex h-screen overflow-hidden">

        {/* SIDEBAR */}
        <aside
          className={`fixed lg:static top-0 left-0 h-full
          w-[260px] lg:w-[280px]
          bg-[#3E2C1E] border-r border-[#5D4037]
          shadow-2xl z-40 transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        >
          <SellerDrawerList toggleDrawer={toggleDrawer} />
        </aside>

        {/* MAIN CONTENT */}
        <section className="flex-1 h-full overflow-y-auto relative z-10">

          {/* MOBILE HEADER */}
          <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-[#FDFBF7]/90 border-b">
            <button
              onClick={toggleDrawer}
              className="px-3 py-2 rounded-lg bg-[#3E2C1E] text-white"
            >
              Menu
            </button>
            <h2 className="font-semibold text-[#3E2C1E]">
              Seller Dashboard
            </h2>
          </header>

          {/* CONTENT */}
          <div className="relative z-10 p-6 lg:p-10 w-full max-w-[1500px] mx-auto">

            {/* SELLER PROFILE CARD */}
            <div className="mb-8">
              {!seller ? (
                <p className="text-[#6D5B4A]">Loading seller profile...</p>
              ) : (
                <div className="bg-white border shadow-md rounded-2xl p-6">
                  <h1 className="text-2xl font-semibold text-[#3E2C1E] mb-2">
                    🏪 {seller?.bussinessDetails?.bussinessName || "Your Store"}
                  </h1>

                  <div className="space-y-1 text-sm text-[#6D5B4A]">
                    <p>
                      <strong>Name:</strong> {seller?.sellerName}
                    </p>
                    <p>
                      <strong>Email:</strong> {seller?.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {seller?.mobile}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* DASHBOARD STATS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((s, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-white shadow border"
                >
                  <p className="text-sm text-[#6D5B4A]">{s.label}</p>
                  <h2 className="text-2xl font-bold text-[#3E2C1E]">
                    {s.value}
                  </h2>
                </div>
              ))}
            </div>

            {/* ROUTES */}
            <div className="bg-white border shadow rounded-2xl p-6">
              <SellerRoutes />
            </div>

          </div>
        </section>
      </main>
    </div>
  );
};

export default SellerDashboard;
