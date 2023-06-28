import { createSlice } from "@reduxjs/toolkit";

const state = {
  userId: null,
  login: null,
  stateChange: null,
  userAvatar: null,
  userEmail: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: state,
  reducers: {
    updateUserProfile: (state, { payload }) => ({
      ...state, userId: payload.userId, login: payload.login, userAvatar: payload.userAvatar, userEmail: payload.userEmail,
    }),

    authStateChange: (state, { payload }) => ({ ...state, stateChange: payload.stateChange }),

    authSignOut: () => state,
  },
});