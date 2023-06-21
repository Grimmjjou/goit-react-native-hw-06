import React, { useState, useRef } from "react";
import CrossIcon from "../../assets/images/svg/CrossIcon";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";

import { useDispatch } from "react-redux";
import { authSignUpUser } from "../../redux/auth/authOperations";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../Firebase/config";
import * as ImagePicker from "expo-image-picker";

const initialState = {
  login: "",
  email: "",
  password: "",
  avatar: null,
};

export default function RegistrationScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [isPasswordShown, setIsPasswordShown] = useState(true);
  const [avatar, setAvatar] = useState(null);
  const [auth, setAuth] = useState(initialState);
  const [isLoginFocused, setIsLoginFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);

  const emailRef = useRef();
  const passwordRef = useRef();

  const passwordToggle = () => {
    setIsPasswordShown((value) => !value);
  };

  const loginHandler = (value) =>
    setAuth((prevState) => ({ ...prevState, login: value }));
  const passwordHandler = (value) =>
    setAuth((prevState) => ({ ...prevState, password: value }));
  const emailHandler = (value) =>
    setAuth((prevState) => ({ ...prevState, email: value }));

  const avatarSelect = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const uploadAvatarToServer = async (photo) => {
    const response = await fetch(photo);

    const file = await response.blob();

    const uniquePostId = Date.now().toString();

    const storageRef = await ref(storage, `avatar/${uniquePostId}`);

    const uploadPhoto = await uploadBytes(storageRef, file);

    const takePhoto = await getDownloadURL(uploadPhoto.ref);

    return takePhoto;
  };

  const keyboardHide = () => {
    Keyboard.dismiss();
    setIsShowKeyboard(false);
  };

  const onHandleSubmit = async () => {
    try {
      const refAvatar = await uploadAvatarToServer(avatar);

      const newAuth = {
        avatar: refAvatar,
        login: auth.login,
        email: auth.email,
        password: auth.password,
      };

      dispatch(authSignUpUser(newAuth));
      setAuth(initialState);
    } catch (error) {
      console.log(error);
    }
  };
  const [fontsLoaded] = useFonts({
    "Roboto-Regular": require("../../assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Medium": require("../../assets/fonts/Roboto-Medium.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View
        onPress={() => {
          Keyboard.dismiss();
        }}
        style={styles.maincontainer}
      >
        <ImageBackground
          style={styles.image}
          source={require("../../assets/images/mountains-bg.png")}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            style={styles.containerKeyB}
          >
            <View onPress={keyboardHide} style={styles.container}>
              <View style={styles.avatar}>
                <View style={styles.avatarBg}>
                  {avatar && (
                    <Image style={styles.avatarImg} source={{ uri: avatar }} />
                  )}
                  <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => avatarSelect()}
                  >
                    {!avatar ? (
                      <CrossIcon isShown={false} />
                    ) : (
                      <CrossIcon isShown={true} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.title}>Реєстрація</Text>
              <TextInput
                value={auth.login}
                onChangeText={loginHandler}
                placeholder="Логін"
                style={[
                  styles.input,
                  {
                    borderColor: isLoginFocused ? "#FF6C00" : "#E8E8E8",
                    backgroundColor: isLoginFocused ? "#fff" : "#F6F6F6",
                  },
                ]}
                textAlign={"left"}
                onFocus={() => {
                  setIsShowKeyboard(true), setIsLoginFocused(true);
                }}
                onBlur={() => setIsLoginFocused(false)}
                returnKeyType="next"
                onSubmitEditing={() => {
                  emailRef.current.focus();
                }}
                blurOnSubmit={false}
              />
              <TextInput
                value={auth.email}
                onChangeText={emailHandler}
                placeholder="Адреса електронної пошти"
                keyboardType="email-address"
                style={[
                  styles.input,
                  {
                    borderColor: isEmailFocused ? "#FF6C00" : "#E8E8E8",
                    backgroundColor: isEmailFocused ? "#fff" : "#F6F6F6",
                  },
                ]}
                textAlign={"left"}
                onFocus={() => {
                  setIsShowKeyboard(true), setIsEmailFocused(true);
                }}
                onBlur={() => setIsEmailFocused(false)}
                ref={emailRef}
                returnKeyType="next"
                onSubmitEditing={() => {
                  passwordRef.current.focus();
                }}
                blurOnSubmit={false}
              />
              <View
                style={[
                  styles.input,
                  {
                    borderColor: isPasswordFocused ? "#FF6C00" : "#E8E8E8",
                    backgroundColor: isPasswordFocused ? "#fff" : "#F6F6F6",
                  },
                ]}
              >
                <TextInput
                  value={auth.password}
                  onChangeText={passwordHandler}
                  placeholder="Пароль"
                  secureTextEntry={isPasswordShown}
                  textAlign={"left"}
                  onFocus={() => {
                    setIsShowKeyboard(true), setIsPasswordFocused(true);
                  }}
                  onBlur={() => setIsPasswordFocused(false)}
                  ref={passwordRef}
                  onSubmitEditing={() => {
                    setIsShowKeyboard(true);
                  }}
                />
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={styles.showBtn}
                  onPress={passwordToggle}
                >
                  <Text style={styles.showTitle}>
                    {isPasswordShown ? "Показати" : "Сховати"}
                  </Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.btn}
                  onPress={onHandleSubmit}
                >
                  <Text style={styles.btnTitle}>Зареєстуватися</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{
                    alignItems: "center",
                    marginTop: 16,
                    ...Platform.select({
                      ios: { marginBottom: isShowKeyboard ? -115 : 45 },
                      android: { marginBottom: isShowKeyboard ? -115 : 65 },
                    }),
                  }}
                  onPress={() => navigation.navigate("Login", { auth })}
                >
                  <Text style={styles.link}>Вже є акаунт? Увійти</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  containerKeyB: {
    justifyContent: "flex-end",
  },
  maincontainer: {
    flex: 1,
    alignItems: "center",
  },
  image: {
    flex: 1,
    justifyContent: "flex-end",
    width: "100%",
  },
  container: {
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    width: "100%",
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
  },
  title: {
    fontFamily: "Roboto-Medium",
    fontWeight: "500",
    fontSize: 30,
    marginTop: 92,
    marginBottom: 15,
    lineHeight: 35,
  },
  input: {
    borderWidth: 1,
    fontFamily: "Roboto-Regular",
    width: 343,
    height: 50,
    borderRadius: 8,
    marginTop: 15,
    padding: 16,
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 19,
  },
  showBtn: {
    position: "absolute",
    alignSelf: "flex-end",
    right: 16,
    marginTop: 14,
  },
  showTitle: {
    color: "#1B4371",
    fontSize: 16,
    fontFamily: "Regular",
    lineHeight: 19,
  },
  btn: {
    backgroundColor: "#FF6C00",
    height: 50,
    width: 343,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    marginTop: 44,
  },
  btnTitle: {
    fontFamily: "Roboto-Regular",
    color: "#fff",
    fontWeight: "400",
  },
  link: {
    fontFamily: "Roboto-Regular",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 19,
  },
  avatar: {
    position: "absolute",
    left: 0,
    right: 0,
    transform: [{ translateY: -60 }],
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarBg: {
    position: "relative",
    minWidth: 120,
    minHeight: 120,
    backgroundColor: "#F6F6F6",
    borderRadius: 16,
  },
  avatarImg: {
    borderRadius: 16,
    minWidth: 120,
    minHeight: 120,
  },
  addBtn: {
    position: "absolute",
    bottom: 14,
    right: -13,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: 25,
    height: 25,
    backgroundColor: "#fff",
    borderRadius: 13,
  },
});
