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
    // Cookie Auth: No explicit JWT check needed
    // if (!jwt) {
    //   return thunkAPI.rejectWithValue("No JWT found");
    // }

    const res = await api.get("/sellers/profile");

    return res.data.data;
  } catch (err) {
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
  User,
  void,
  { rejectValue: string }
>("auth/loadUserProfile", async (_, thunkAPI) => {
  try {
    // Cookie Auth: No explicit JWT check needed
    // if (!jwt) {
    //   return thunkAPI.rejectWithValue("No JWT found");
    // }

    const res = await api.get("/users/profile");

    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue("Failed to load user profile");
  }
});



/* =========================
   INITIAL STATE
========================= */
const initialState: AuthState = {
  seller: JSON.parse(localStorage.getItem("seller") || "null"),
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
      action: PayloadAction<{ seller: Seller; jwt: string; refreshToken?: string }>
    ) => { // Added refreshToken optional (will be populated consistently later)
      state.seller = action.payload.seller;
      state.jwt = action.payload.jwt;

      localStorage.setItem("seller", JSON.stringify(action.payload.seller));
      localStorage.setItem("jwt", action.payload.jwt);
      if (action.payload.refreshToken) {
        localStorage.setItem("refreshToken", action.payload.refreshToken);
      }
    },


    // 🔹 Generic Login Success (Admin/Customer)
    loginSuccess: (state, action: PayloadAction<{ jwt: string, refreshToken?: string }>) => {
      // Adjusted payload to object to carry refreshToken
      state.jwt = action.payload.jwt;
      localStorage.setItem("jwt", action.payload.jwt);
      if (action.payload.refreshToken) {
        localStorage.setItem("refreshToken", action.payload.refreshToken);
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
        state.user = action.payload;
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
