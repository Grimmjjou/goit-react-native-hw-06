import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import useRoute from "../router";
import { useSelector, useDispatch } from "react-redux";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Firebase/config";
import { authSlice } from "../redux/auth/authReducer";

const Main = () => {
  const { stateChange } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userUpdateProfile = {
          login: user.displayName,
          userId: user.uid,
          userAvatar: user.photoURL,
          userEmail: user.email,
        };
        dispatch(authSlice.actions.updateUserProfile(userUpdateProfile));
        dispatch(authSlice.actions.authStateChange({ stateChange: true }));
      }
    });
  }, []);

  const routing = useRoute(stateChange);

  return <NavigationContainer>{routing}</NavigationContainer>
};

export default Main;
