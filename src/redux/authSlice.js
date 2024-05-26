import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

const initialState = {
  isAuthenticated: false,
  userToken: null,
  isLoading: false,
  error: null,
};

export const userLogin = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      // configure header's Content-Type as JSON
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(`${apiUrl}/login`, payload, config);
      // store user's token in local storage
      localStorage.setItem("userToken", data.token);
      return data;
    } catch (error) {
      // return custom error message from API if any
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response);
      } else {
        return rejectWithValue(error.response);
      }
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("userToken");
      state.isAuthenticated = false;
      state.isLoading = false;
      state.userToken = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Xử lý khi gọi API login thành công
    builder.addCase(userLogin.fulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.userToken = action.payload.token;
      state.isLoading = false;
      state.error = null;
    });
    // Xử lý khi gọi API login thất bại
    builder.addCase(userLogin.rejected, (state, action) => {
      state.isAuthenticated = false;
      state.userToken = null;
      state.isLoading = false;
      state.error = action.payload.data;
    });
    // Xử lý khi đang gọi API login
    builder.addCase(userLogin.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
