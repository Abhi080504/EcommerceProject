import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../config/Api";

/* =========================
   TYPES
========================= */
interface Seller {
  id: number;
  name: string;
  email: string;
  mobile: string;
  sellerName: string;
  bussinessDetails: {
    bussinessName: string;
    bussinessEmail: string;
    bussinessMobile: string;
    bussinessAddress: string;
    logo: string;
    banner: string;
  };
  bankDetails: any;
  pickUpAddress: any;
  gstin: string;
}

interface User {
  id: number;
  fullName: string;
  email: string;
  mobile: string;
  role: string; // Add role property
  addresses: any[]; // Use Address type if available, else any[]
}

interface AuthState {
  seller: Seller | null;
  user: User | null;
  jwt: string | null;
  loading: boolean;
  isAuthChecked: boolean;
}

/* =========================
   ASYNC: LOAD SELLER PROFILE
========================= */
export const loadSellerProfile = createAsyncThunk<
  Seller,
  void,
  { rejectValue: string }
>("auth/loadSellerProfile", async (_, thunkAPI) => {
  try {
    const token = localStorage.getItem("jwt");
    if (!token) {
      return thunkAPI.rejectWithValue("No JWT found");
    }

    const res = await api.get("/sellers/profile");
    console.log("loadSellerProfile success:", res.data);
    return res.data.data;
  } catch (err) {
    console.error("loadSellerProfile failed:", err);
    return thunkAPI.rejectWithValue("Failed to load seller profile");
  }
});

/* =========================
   ASYNC: UPDATE SELLER PROFILE
========================= */
export const updateSeller = createAsyncThunk<
  Seller,
  any,
  { rejectValue: string }
>("auth/updateSeller", async (data, thunkAPI) => {
  try {
    // Cookie Auth: No explicit JWT check needed
    // if (!jwt) {
    //   return thunkAPI.rejectWithValue("No JWT found");
    // }

    const res = await api.patch("/sellers", data);

    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue("Failed to update seller profile");
  }
});

/* =========================
   ASYNC: LOAD USER PROFILE
========================= */
export const loadUserProfile = createAsyncThunk<
  any, // Can be User or Seller
  void,
  { rejectValue: string }
>("auth/loadUserProfile", async (_, thunkAPI) => {
  try {
    const role = localStorage.getItem("role");

    // Choose endpoint based on role
    const endpoint = role === "ROLE_SELLER" ? "/sellers/profile" : "/users/profile";

    console.log(`🔍 [authSlice] Loading profile for role=${role} via ${endpoint}`);
    const res = await api.get(endpoint);

    return res.data.data;
  } catch (err) {
    console.error("loadUserProfile failed:", err);
    return thunkAPI.rejectWithValue("Failed to load profile");
  }
});



/* =========================
   INITIAL STATE
========================= */
const getInitialSeller = (): Seller | null => {
  try {
    const seller = localStorage.getItem("seller");
    if (seller && seller !== "undefined") {
      return JSON.parse(seller);
    }
  } catch (error) {
    console.error("Failed to parse seller from localStorage", error);
  }
  return null;
};

const initialState: AuthState = {
  seller: getInitialSeller(),
  user: null,
  jwt: localStorage.getItem("jwt"),
  loading: false,
  isAuthChecked: false,
};

/* =========================
   SLICE
========================= */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // 🔹 Save seller after login
    setSellerAuth: (
      state,
      action: PayloadAction<{ seller?: Seller; jwt: string; refreshToken?: string; role?: string }>
    ) => {
      if (!action.payload) return;

      // Only update seller if it's provided in payload (don't clear existing)
      if (action.payload.seller) {
        state.seller = action.payload.seller;
        localStorage.setItem("seller", JSON.stringify(action.payload.seller));
      }

      // Clear stale user profile so Dashboard doesn't redirect based on old ROLE_CUSTOMER
      state.user = null;

      state.jwt = action.payload.jwt;
      localStorage.setItem("jwt", action.payload.jwt);

      if (action.payload.role) {
        localStorage.setItem("role", action.payload.role);
      } else if (action.payload.seller) {
        localStorage.setItem("role", "ROLE_SELLER");
      }
      if (action.payload.refreshToken) {
        localStorage.setItem("refreshToken", action.payload.refreshToken);
      }
    },

    // 🔹 Generic Login Success (Admin/Customer)
    loginSuccess: (state, action: PayloadAction<{ jwt: string, refreshToken?: string, role?: string }>) => {
      // Adjusted payload to object to carry refreshToken and role
      state.jwt = action.payload.jwt;
      localStorage.setItem("jwt", action.payload.jwt);
      if (action.payload.refreshToken) {
        localStorage.setItem("refreshToken", action.payload.refreshToken);
      }
      if (action.payload.role) {
        localStorage.setItem("role", action.payload.role);
      }
    },

    // 🔹 Logout
    logout: (state) => {
      state.seller = null;
      state.user = null;
      state.jwt = null;

      localStorage.removeItem("seller");
      localStorage.removeItem("jwt");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("role");
    },
  },

  /* =========================
     EXTRA REDUCERS
  ========================= */
  extraReducers: (builder) => {
    // SELLER
    builder
      .addCase(loadSellerProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadSellerProfile.fulfilled, (state, action) => {
        state.seller = action.payload;
        state.loading = false;
        localStorage.setItem("seller", JSON.stringify(action.payload));
      })
      .addCase(loadSellerProfile.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateSeller.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSeller.fulfilled, (state, action) => {
        state.seller = action.payload;
        state.loading = false;
        localStorage.setItem("seller", JSON.stringify(action.payload));
      })
      .addCase(updateSeller.rejected, (state) => {
        state.loading = false;
      });

    // USER
    builder
      .addCase(loadUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUserProfile.fulfilled, (state, action) => {
        const role = localStorage.getItem("role");
        if (role === "ROLE_SELLER") {
          state.seller = action.payload;
          state.user = null; // Ensure no user profile if seller
        } else {
          state.user = action.payload;
          state.seller = null; // Ensure no seller profile if customer/admin
        }
        state.loading = false;
        state.isAuthChecked = true;
      })
      .addCase(loadUserProfile.rejected, (state) => {
        state.loading = false;
        state.isAuthChecked = true;
      });
  },
});

export const { setSellerAuth, logout, loginSuccess } = authSlice.actions;
export default authSlice.reducer;

/* =========================
   ASYNC: LOGOUT
========================= */
/* =========================
   ASYNC: LOGOUT
========================= */
export const performLogout = createAsyncThunk<void, void, { state: any }>(
  "auth/performLogout",
  async (_, { dispatch }) => {
    try {
      // 1. Kill the session immediately to prevent race conditions
      // (e.g. background 401 triggering a refresh that restores the JWT)
      localStorage.removeItem("jwt");
      localStorage.removeItem("seller");
      localStorage.removeItem("refreshToken");

      // 2. Notify backend (optional, best effort)
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout API failed", error);
    } finally {
      // 3. Ensure clean state & redirect
      dispatch(logout());
      window.location.href = "/";
    }
  }
);
