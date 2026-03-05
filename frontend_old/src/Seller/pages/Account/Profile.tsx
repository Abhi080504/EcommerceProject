import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../State/hooks";
import { updateSeller } from "../../../State/Auth/authSlice";
import { Snackbar, Alert } from "@mui/material";

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  // pull seller data
  const seller = useAppSelector((state: any) => state.auth?.seller);

  const [editMode, setEditMode] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [form, setForm] = useState({
    sellerName: "",
    email: "",
    mobile: "",
    bussinessDetails: {
      bussinessName: ""
    }
  });

  useEffect(() => {
    if (seller) {
      setForm({
        sellerName: seller.sellerName || "",
        email: seller.email || "",
        mobile: seller.mobile || "",
        bussinessDetails: {
          bussinessName: seller.bussinessDetails?.bussinessName || ""
        }
      });
    }
  }, [seller]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "storeName") {
      setForm({
        ...form,
        bussinessDetails: { ...form.bussinessDetails, bussinessName: value }
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSave = () => {
    dispatch(updateSeller(form))
      .unwrap()
      .then(() => {
        setEditMode(false);
        setSnackbarOpen(true);
      })
      .catch((err) => {
        console.error("Update failed", err);
      });
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="space-y-6">

      {/* PAGE TITLE */}
      <h2 className="text-2xl font-semibold text-[#3E2C1E]">
        Seller Account Profile
      </h2>

      {/* CARD */}
      <div className="bg-white/80 backdrop-blur-md border border-[#E3D4BF] shadow-xl rounded-2xl p-6">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-[#3E2C1E] text-white flex items-center justify-center text-xl font-bold">
            {seller?.sellerName?.charAt(0) || "S"}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#3E2C1E]">
              {seller?.sellerName || "Seller"}
            </h3>
            <p className="text-sm text-[#6D5B4A]">
              Seller Account
            </p>
          </div>
        </div>

        {/* PROFILE FORM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Name */}
          <div>
            <label className="text-sm text-[#6D5B4A]">Full Name</label>
            <input
              name="sellerName"
              value={form.sellerName}
              disabled={!editMode}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 rounded-lg border border-[#E3D4BF] bg-white focus:outline-none focus:ring-2 focus:ring-[#F9B233]"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-[#6D5B4A]">Email</label>
            <input
              name="email"
              value={form.email}
              disabled={!editMode}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 rounded-lg border border-[#E3D4BF] bg-white focus:outline-none focus:ring-2 focus:ring-[#F9B233]"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm text-[#6D5B4A]">Phone</label>
            <input
              name="mobile"
              value={form.mobile}
              disabled={!editMode}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 rounded-lg border border-[#E3D4BF] bg-white focus:outline-none focus:ring-2 focus:ring-[#F9B233]"
            />
          </div>

          {/* Store Name */}
          <div>
            <label className="text-sm text-[#6D5B4A]">Store Name</label>
            <input
              name="storeName"
              value={form.bussinessDetails.bussinessName}
              disabled={!editMode}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 rounded-lg border border-[#E3D4BF] bg-white focus:outline-none focus:ring-2 focus:ring-[#F9B233]"
            />
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-3 mt-6">

          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="px-4 py-2 rounded-lg bg-[#3E2C1E] text-white"
            >
              Edit Profile
            </button>
          )}

          {editMode && (
            <>
              <button
                onClick={() => setEditMode(false)}
                className="px-4 py-2 rounded-lg border border-[#E3D4BF]"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-[#F9B233] text-[#3E2C1E] font-semibold"
              >
                Save Changes
              </button>
            </>
          )}
        </div>
      </div>

      {/* ACCOUNT STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <div className="p-4 bg-white/80 border border-[#E3D4BF] rounded-2xl shadow-md">
          <p className="text-sm text-[#6D5B4A]">Products Listed</p>
          <h3 className="text-xl font-bold text-[#3E2C1E]">42</h3>
        </div>

        <div className="p-4 bg-white/80 border border-[#E3D4BF] rounded-2xl shadow-md">
          <p className="text-sm text-[#6D5B4A]">Orders Fulfilled</p>
          <h3 className="text-xl font-bold text-[#3E2C1E]">117</h3>
        </div>

        <div className="p-4 bg-white/80 border border-[#E3D4BF] rounded-2xl shadow-md">
          <p className="text-sm text-[#6D5B4A]">Pending Orders</p>
          <h3 className="text-xl font-bold text-[#3E2C1E]">6</h3>
        </div>

        <div className="p-4 bg-white/80 border border-[#E3D4BF] rounded-2xl shadow-md">
          <p className="text-sm text-[#6D5B4A]">Account Status</p>
          <h3 className="text-xl font-bold text-green-600">Active</h3>
        </div>

      </div>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Profile updated successfully!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Profile;

