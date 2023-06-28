import React, { useState, useEffect } from "react";
import CrossIcon from "../../assets/images/svg/CrossIcon";
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Feather, AntDesign, Ionicons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { db } from "../../Firebase/config";
import { authSignOutUser } from "../../redux/auth/authOperations";
import { useDispatch, useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import { useFonts } from "expo-font";
import { authSlice } from "../../redux/auth/authReducer";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  increment,
  doc,
  addDoc,
  orderBy,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen() {
  const [userPosts, setUserPosts] = useState([]);
  const [avatar, setAvatar] = useState(null);
  const navigation = useNavigation();

  const dispatch = useDispatch();

  const { login, userAvatar, userId } = useSelector((state) => state.auth);

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

  const onLikeBtn = async (photo) => {
    const postRef = doc(db, "posts", photo.id);

    await updateDoc(postRef, {
      likes: increment(1),
    });

    await addDoc(collection(postRef, "likes"), {
      userId,
    });
  };
  const getUserPosts = async () => {
    const dbRef = collection(db, "posts");
    const q = query(dbRef, orderBy("createdDate", "desc"));
    onSnapshot(q, (data) =>
      setUserPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    );
  };
  useEffect(() => {
    getUserPosts();
  }, []);

  const signOut = async () => {
    await AsyncStorage.removeItem("user");
    dispatch(authSlice.actions.updateUserProfile({}));
    dispatch(authSlice.actions.authStateChange({ stateChange: false }));
  };

  const [fontsLoaded] = useFonts({
    "Roboto-Regular": require("../../assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Medium": require("../../assets/fonts/Roboto-Medium.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <ImageBackground
      style={styles.image}
      source={require("../../assets/images/mountains-bg.png")}
    >
      <View style={styles.container}>
        <View>
          <View style={styles.avatar}>
            <View style={styles.avatarBg}>
              {userAvatar && (
                <Image style={styles.avatarImg} source={{ uri: userAvatar }} />
              )}
              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => avatarSelect()}
              >
                {!userAvatar ? (
                  <CrossIcon isShown={false} />
                ) : (
                  <CrossIcon isShown={true} />
                )}
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.logout}
              onPress={() => signOut({ navigation })}
            >
              <Feather name="log-out" size={24} color="#BDBDBD" />
            </TouchableOpacity>
          </View>
          <Text style={styles.mainTitle}>{login}</Text>

          <View style={styles.userPosts}>
            <FlatList
              data={userPosts}
              keyExtractor={(item, indx) => indx.toString()}
              renderItem={({ item }) => (
                <View style={styles.photoContainer}>
                  <Image style={styles.photo} source={{ uri: item.photo }} />

                  <Text style={styles.title}>{item.title}</Text>

                  <View style={styles.iconsWrapper}>
                    <View style={styles.iconsLeft}>
                      <View style={styles.iconContainer}>
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate("Comments", {
                              postId: item.id,
                              photo: item.photo,
                            })
                          }
                          style={styles.iconContainer}
                        >
                          <FontAwesome
                            name="comment"
                            size={24}
                            color={item.comments ? "#FF6C00" : "#BDBDBD"}
                          />
                          <Text style={styles.numbers}>
                            {item.comments ? item.comments : 0}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.iconContainer}>
                        <TouchableOpacity
                          style={styles.iconContainer}
                          onPress={() => onLikeBtn(item)}
                        >
                          <AntDesign name="like2" size={24} color="#FF6C00" />
                          <Text style={styles.numbers}>{item.likes}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={styles.locationContainer}>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate("MapScreen", {
                            location: item.location,
                          });
                        }}
                      >
                        <Ionicons
                          name="ios-location-outline"
                          size={24}
                          color="#BDBDBD"
                        />
                      </TouchableOpacity>
                      <Text style={styles.location}>{item.inputRegion}</Text>
                    </View>
                  </View>
                </View>
              )}
            />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-end",
  },
  container: {
    marginTop: 150,
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 16,
    paddingTop: 92,
  },
  avatar: {
    position: "absolute",
    left: 0,
    right: 0,
    transform: [{ translateY: -150 }],
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
  logout: {
    position: "absolute",
    bottom: 16,
    right: 0,
  },
  mainTitle: {
    fontSize: 30,
    lineHeight: 35,
    alignSelf: "center",
    fontFamily: "Roboto-Regular",
    fontWeight: "400",
  },
  iconContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    lineHeight: 19,
    marginVertical: 8,
    fontFamily: "Roboto-Regular",
    fontWeight: "400",
  },
  numbers: {
    fontSize: 16,
    lineHeight: 19,
    marginLeft: 6,
    fontFamily: "Roboto-Regular",
    fontWeight: "400",
  },
  locationContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  location: {
    fontSize: 16,
    lineHeight: 19,
    fontFamily: "Roboto-Regular",
    fontWeight: "400",
    textDecorationLine: "underline",
  },
  photoContainer: {
    marginBottom: 32,
  },
  photo: {
    height: 240,
    borderRadius: 10,
  },
  userPosts: {
    marginTop: 32,
    marginBottom: 83,
  },
  iconsLeft: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  iconsWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
