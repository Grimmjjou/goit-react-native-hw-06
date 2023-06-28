import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Platform, Button } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import RegistrationScreen from "./screens/auth/RegistrationScreen";
import LoginScreen from "./screens/auth/LoginScreen";
import MapScreen from "./screens/main/MapScreen";
import CommentsScreen from "./screens/main/CommentsScreen";
import Home from "./screens/main/Home";
import { authSlice } from "./redux/auth/authReducer";

const AuthStack = createNativeStackNavigator();
const MainStack = createStackNavigator();

const useRoute = (isAuth) => {
  const dispatch = useDispatch();

  const handleLogout = async ({ navigation }) => {
    await AsyncStorage.removeItem("user");
    dispatch(authSlice.actions.updateUserProfile({}));
    dispatch(authSlice.actions.authStateChange({ stateChange: false }));
    navigation.navigate("Login");
  };

  if (!isAuth) {
    return (
      <AuthStack.Navigator
        initialRouteName='Login'
        screenOptions={{ headerShown: false }}>
        <AuthStack.Screen name='Registration' component={RegistrationScreen} />
        <AuthStack.Screen name='Login' component={LoginScreen} />
      </AuthStack.Navigator>
    );
  }

  return (
    <MainStack.Navigator initialRouteName="Home">
      <MainStack.Screen options={{ headerShown: false }} name='Home' component={Home} />
      <MainStack.Screen options={({ navigation }) => ({
        headerShown: true,
        headerStyle: { borderBottomWidth: 2 },
        title: "Карта", headerTitleStyle: {
          fontSize: 17,
          ...Platform.select({
            ios: { marginLeft: 10 },
            android: { marginLeft: 110 },
          }),
        },
        headerLeft: () => (
          <TouchableOpacity
            activeOpacity={0.8}
            style={{ marginLeft: 16 }}
            onPress={() => navigation.navigate('Posts')}>
            <AntDesign
              name='arrowleft'
              size={24}
              color='rgba(33, 33, 33, 0.8)'
            />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <Button
            title="Logout"
            onPress={() => handleLogout({ navigation })}
          />
        )
      })} name='MapScreen' component={MapScreen} />

      <MainStack.Screen tabBarStyle={{ display: 'none' }} options={({ navigation }) => ({
        headerShown: true,
        headerStyle: { borderBottomWidth: 2 },
        title: "Коментарі", headerTitleStyle: {
          fontSize: 17,
          ...Platform.select({
            ios: { marginLeft: 10 },
            android: { marginLeft: 90 },
          }),
        }, headerLeft: () => (
          <TouchableOpacity
            activeOpacity={0.8}
            style={{ marginLeft: 16 }}
            onPress={() => navigation.navigate('Posts')}>
            <AntDesign
              name='arrowleft'
              size={24}
              color='rgba(33, 33, 33, 0.8)'
            />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <Button
            title="Logout"
            onPress={() => handleLogout({ navigation })}
          />
        )
      })} name='Comments' component={CommentsScreen} />
    </MainStack.Navigator>
  )
}
export default useRoute;