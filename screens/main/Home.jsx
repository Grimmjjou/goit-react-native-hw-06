import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { TouchableOpacity, Platform } from "react-native";

import { AntDesign, Ionicons, Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProfileScreen from "./ProfileScreen";
import CreatePostsScreen from "./CreatePostsScreen";
import PostsScreen from "./PostsScreen";
import { authSlice } from "../../redux/auth/authReducer";
const MainTab = createBottomTabNavigator();
import { useDispatch } from "react-redux";
import { authSignOutUser } from "../../redux/auth/authOperations";

export default function Home() {
  const dispatch = useDispatch();
  const signOut = async () => {
    await AsyncStorage.removeItem("user");
    dispatch(authSlice.actions.updateUserProfile({}));
    dispatch(authSlice.actions.authStateChange({ stateChange: false }));
  };

  return (
    <MainTab.Navigator
      initialRouteName="PostsScreen"
      screenOptions={{
        showLabel: false,
        tabBarActiveBackgroundColor: "#FF6C00",
        tabBarStyle: {
          height: 83,
          paddingTop: 9,
          paddingBottom: 11,
          paddingLeft: 93,
          paddingRight: 93,
        },
        tabBarItemStyle: { borderRadius: 20, width: 70, height: 40 },
      }}
    >
      <MainTab.Screen
        options={({ navigation }) => ({
          headerStyle: { borderBottomWidth: 2 },
          title: "Публікації",
          headerTintColor: "#212121",
          headerTitleStyle: {
            fontSize: 17,

            ...Platform.select({
              ios: {},
              android: { marginLeft: 140 },
            }),
          },
          headerRight: () => (
            <TouchableOpacity
              activeOpacity={0.8}
              style={{ marginRight: 16 }}
              onPress={() => signOut({ navigation })}
            >
              <Feather name="log-out" size={24} color="#BDBDBD" />
            </TouchableOpacity>
          ),
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="grid-outline"
              size={24}
              color={focused ? "#fff" : "rgba(33, 33, 33, 0.8)"}
            />
          ),
        })}
        name="Posts"
        component={PostsScreen}
      />

      <MainTab.Screen
        options={({ navigation }) => ({
          headerStyle: { borderBottomWidth: 2 },
          title: "Створити публікацію",
          headerTintColor: "#212121",
          headerTitleStyle: {
            fontSize: 17,
            marginLeft: 50,
            ...Platform.select({
              ios: { marginRight: 25 },
              android: { marginLeft: 60 },
            }),
          },
          headerLeft: () => (
            <TouchableOpacity
              activeOpacity={0.8}
              style={{ marginLeft: 16 }}
              onPress={() => navigation.navigate("Posts")}
            >
              <AntDesign
                name="arrowleft"
                size={24}
                color="rgba(33, 33, 33, 0.8)"
              />
            </TouchableOpacity>
          ),
          tabBarShowLabel: false,
          tabBarStyle: { display: "none" },
          tabBarIcon: ({ focused }) => (
            <AntDesign
              name="plus"
              size={24}
              color={focused ? "#fff" : "rgba(33, 33, 33, 0.8)"}
            />
          ),
        })}
        name="Створити публікацію"
        component={CreatePostsScreen}
      />

      <MainTab.Screen
        options={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Feather
              name="user"
              size={24}
              color={focused ? "#fff" : "rgba(33, 33, 33, 0.8)"}
            />
          ),
        }}
        name="Profile"
        component={ProfileScreen}
      />
    </MainTab.Navigator>
  );
}
