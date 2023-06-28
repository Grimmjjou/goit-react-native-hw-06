import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import useRoute from "../router";
import { useSelector, useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Firebase/config";
import { authSlice } from "../redux/auth/authReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Main = () => {
  const { isAuth, stateChange } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuthState = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const userUpdateProfile = JSON.parse(storedUser);
        dispatch(authSlice.actions.updateUserProfile(userUpdateProfile));
        dispatch(authSlice.actions.authStateChange({ stateChange: true }));
      } else {
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
            await AsyncStorage.setItem("user", JSON.stringify(userUpdateProfile));
          } else {
            // Якщо користувач вийшов з облікового запису, видаляємо дані зі сховища
            await AsyncStorage.removeItem("user");
            dispatch(authSlice.actions.updateUserProfile(null));
            dispatch(authSlice.actions.authStateChange({ stateChange: true }));
          }
        });
      }
    };

    checkAuthState();
  }, []);

  const routing = useRoute(stateChange);

  return <NavigationContainer>{routing}</NavigationContainer>

};

export default Main;