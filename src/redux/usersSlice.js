import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

const initialState = {
  users: [],
  usersFind: [],
  message: {},
};

export const getUsers = createAsyncThunk("users/getUsers", async () => {
  const response = await axios.get(`${apiUrl}/users`);
  return response.data;
});

export const deleteUser = createAsyncThunk("users/deleteUsers", async (id) => {
  await axios.delete(`${apiUrl}/users/${id}`);
  return id;
});

export const addUsers = createAsyncThunk(
  "users/addUsers",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${apiUrl}/users`, payload);
      return data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response);
      } else {
        return rejectWithValue(error.response);
      }
    }
  }
);

export const editUsers = createAsyncThunk(
  "users/editUsers",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${apiUrl}/users/${payload.id}`,
        payload
      );
      return data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response);
      } else {
        return rejectWithValue(error.response);
      }
    }
  }
);

export const addCheckin = createAsyncThunk(
  "users/addCheckin",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${apiUrl}/attendance`, payload);
      return data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response);
      } else {
        return rejectWithValue(error.response);
      }
    }
  }
);

export const addCheckout = createAsyncThunk(
  "users/addCheckout",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${apiUrl}/users/${payload.userId}/attendance/${payload.attendanceId}`,
        payload
      );
      return data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response);
      } else {
        return rejectWithValue(error.response);
      }
    }
  }
);

export const addTotalTime = createAsyncThunk(
  "users/addTotalTime",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${apiUrl}/users/${payload.userId}/attendance/${payload.attendanceId}/total`,
        payload
      );
      return data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response);
      } else {
        return rejectWithValue(error.response);
      }
    }
  }
);

export const resetPass = createAsyncThunk(
  "users/resetPass",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${apiUrl}/reset-password`, payload);
      return data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response);
      } else {
        return rejectWithValue(error.response);
      }
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    findUser(state, action) {
      const newUserList = state.users.filter((item) => {
        return item.name
          .trim()
          .toLowerCase()
          .includes(action.payload.trim().toLowerCase());
      });
      state.usersFind = newUserList;
    },
    logoutUser: (state) => {
      state.users = [];
      state.usersFind = [];
      state.message = {};
    },
    clearMessage: (state) => {
      state.message = {};
    },
  },
  extraReducers: (builder) => {
    // Xử lý khi gọi API login thành công
    builder.addCase(getUsers.fulfilled, (state, action) => {
      state.users = action.payload;
      state.usersFind = action.payload;
      state.message = {};
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      const id = action.payload;
      const index = state.usersFind.findIndex((item) => item.id === id);
      const index2 = state.users.findIndex((item) => item.id === id);
      const deletedState = state.usersFind;
      const deletedState2 = state.users;
      deletedState.splice(index, 1);
      deletedState2.splice(index2, 1);
      state.usersFind = deletedState;
      state.users = deletedState2;
    });
    builder.addCase(addUsers.fulfilled, (state, action) => {
      state.users.push(action.payload.user);
      state.usersFind.push(action.payload.user);
      state.message = action.payload.message;
    });
    builder.addCase(addUsers.rejected, (state, action) => {
      state.message = action.payload.data.message;
    });

    builder.addCase(editUsers.fulfilled, (state, action) => {
      const editItemIndexUser = state.users.findIndex(
        (item) => item.id === action.payload.newUser.id
      );
      const editedUser = state.users;
      editedUser.splice(editItemIndexUser, 1, action.payload.newUser);
      state.users = editedUser;

      const editItemIndexUserFind = state.usersFind.findIndex(
        (item) => item.id === action.payload.newUser.id
      );
      const editedUserFind = state.usersFind;
      editedUserFind.splice(editItemIndexUserFind, 1, action.payload.newUser);
      state.usersFind = editedUserFind;
      state.message = action.payload.message;
    });
    builder.addCase(editUsers.rejected, (state, action) => {
      state.message = action.payload.data.message;
    });
  },
});

export const { findUser, logoutUser, clearMessage } = usersSlice.actions;
export default usersSlice.reducer;
