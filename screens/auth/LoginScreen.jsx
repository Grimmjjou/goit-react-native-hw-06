import React, { useState, useRef } from "react";

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
} from "react-native";
import { useFonts } from "expo-font";
import { useDispatch } from "react-redux";
import { authSignInUser } from "../../redux/auth/authOperations";

const initialState = {
  email: "",
  password: "",
};

export default function LoginScreen({ navigation }) {
  const [isShownKeyboard, setIsShownKeyboard] = useState(false);
  const [isPasswordShown, setIsPasswordShown] = useState(true);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);

  const dispatch = useDispatch();

  const emailRef = useRef();

  const passwordToggle = () => {
    setIsPasswordShown((value) => !value);
  };

  const [auth, setAuth] = useState(initialState);
  const passwordHandler = (value) =>
    setAuth((prevState) => ({ ...prevState, password: value }));
  const emailHandler = (value) =>
    setAuth((prevState) => ({ ...prevState, email: value }));

  const keyboardHide = () => {
    setIsShownKeyboard(false);
    Keyboard.dismiss();
  };

  const onHandleSubmit = () => {
    setAuth(initialState);
    dispatch(authSignInUser(auth));
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
      <View style={styles.maincontainer}>
        <ImageBackground
          style={styles.image}
          source={require("../../assets/images/mountains-bg.png")}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            style={styles.containerKeyB}
          >
            <View onPress={keyboardHide} style={styles.container}>
              <Text style={styles.title}>Увійти</Text>
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
                  setIsShownKeyboard(true), setIsEmailFocused(true);
                }}
                onBlur={() => setIsEmailFocused(false)}
                returnKeyType="next"
                onSubmitEditing={() => {
                  emailRef.current.focus();
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
                    setIsShownKeyboard(true), setIsPasswordFocused(true);
                  }}
                  onBlur={() => setIsPasswordFocused(false)}
                  ref={emailRef}
                  onSubmitEditing={() => {
                    setIsShownKeyboard(false);
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
                  <Text style={styles.btnTitle}>Увійти</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{
                    marginTop: 16,
                    alignItems: "center",
                    ...Platform.select({
                      ios: { marginBottom: isShownKeyboard ? -115 : 45 },
                      android: { marginBottom: isShownKeyboard ? -105 : 145 },
                    }),
                  }}
                  onPress={() => navigation.navigate("Registration")}
                >
                  <Text style={styles.link}>
                    Немає акаунту? Зареєструватися
                  </Text>
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
  maincontainer: {
    flex: 1,
    alignItems: "center",
  },
  containerKeyB: {
    justifyContent: "flex-end",
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
    marginTop: 39,
    lineHeight: 35,
    marginBottom: 15,
  },
  input: {
    fontFamily: "Roboto-Regular",
    borderWidth: 1,
    backgroundColor: "#F6F6F6",
    width: 343,
    height: 50,
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 16,
    position: "relative",
  },
  showBtn: {
    top: -18,
    left: 230,
  },
  showTitle: {
    fontFamily: "Roboto-Regular",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 19,
    marginRight: 16,
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
});
