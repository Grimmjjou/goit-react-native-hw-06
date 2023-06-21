import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut
} from "firebase/auth";
import { auth } from "../../Firebase/config";

import { authSlice } from './authReducer';

export const authSignInUser =
  ({ email, password }) =>
    async (dispatch, getState) => {
      try {
        const credentials = await signInWithEmailAndPassword(auth, email, password);
        return credentials.user;
      } catch (error) {
        console.log(error.message);
      }
    };

export const authSignUpUser =
  ({ login, email, password, avatar }) =>
    async (dispatch, getState) => {
      try {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        const userCurrent = auth.currentUser;

        const updateUser = await updateProfile(userCurrent, {
          displayName: login,
          photoURL: avatar,
        });

        const updateUserSuccess = auth.currentUser;

        dispatch(
          authSlice.actions.updateUserProfile({
            userId: updateUserSuccess.uid,
            login: updateUserSuccess.displayName,
            userAvatar: updateUserSuccess.photoURL,
            userEmail: updateUserSuccess.email,
          })
        )
      } catch (error) {
        console.log(error.message);
      }
    };

export const authSignOutUser = () => async (dispatch) => {
  try {
    await signOut(auth);
    dispatch(authSlice.actions.authSignOut())
  } catch (error) {
    console.log("error", error.message);
  }
};

export const authStateChangeUser = () => async (dispatch, getState) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const userUpdateProfile = {
        login: user.displayName,
        userId: user.uid
      }
      dispatch(authSlice.actions.updateUserProfile(userUpdateProfile))
      dispatch(authSlice.actions.authStateChange({ stateChange: true }))
    }
  })
};
