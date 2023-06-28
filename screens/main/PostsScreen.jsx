import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

import { db } from "../../Firebase/config";
import { onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { useFonts } from "expo-font";
import { useSelector } from "react-redux";
import uuid from "react-native-uuid";

export default function PostsScreen() {
  const [posts, setPosts] = useState([]);
  const navigation = useNavigation();
  const { login, userEmail, userAvatar } = useSelector((state) => state.auth);

  const getDataFromFirestore = async () => {
    const postsQuery = query(
      collection(db, "posts"),
      orderBy("createdDate", "desc")
    );

    onSnapshot(postsQuery, (data) => {
      setPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
  };

  useEffect(() => {
    getDataFromFirestore();
  }, []);
  const [fontsLoaded] = useFonts({
    "Roboto-Regular": require("../../assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Medium": require("../../assets/fonts/Roboto-Medium.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <View style={styles.container}>
      <View style={styles.userContainer}>
        <Image style={styles.avatar} source={{ uri: userAvatar }} />
        <View style={styles.text}>
          <Text style={styles.name}>{login}</Text>
          <Text style={styles.email}>{userEmail}</Text>
        </View>
      </View>

      <FlatList
        style={{ paddingLeft: 16, paddingRight: 16 }}
        data={posts}
        keyExtractor={() => uuid.v4()}
        renderItem={({ item }) => (
          <View>
            <View style={styles.imgContainer}>
              <Image style={styles.image} source={{ uri: item.photo }} />
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <View style={styles.iconContainer}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Comments", {
                    postId: item.id,
                    photo: item.photo,
                  })
                }
                style={styles.commentContainer}
              >
                <FontAwesome
                  name="comment"
                  size={24}
                  color={!item.comments ? "#BDBDBD" : "#FF6C00"}
                />
                <Text
                  style={{
                    marginLeft: 10,
                    color: !item.comments ? "#BDBDBD" : "#FF6C00",
                  }}
                >
                  {item.comments}
                </Text>
              </TouchableOpacity>
              <View style={styles.locationContainer}>
                <TouchableOpacity
                  style={{ display: "flex", flexDirection: "row" }}
                  onPress={() => {
                    navigation.navigate("MapScreen", {
                      location: item.location,
                      title: item.title,
                    });
                  }}
                >
                  <Ionicons
                    name="ios-location-outline"
                    size={24}
                    color="#BDBDBD"
                  />
                  <Text style={styles.location}>{item.inputRegion}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: 32,
    backgroundColor: "#fff",
  },
  userContainer: {
    flexDirection: "row",
    paddingLeft: 16,
    marginBottom: 32,
  },
  text: {
    marginLeft: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Roboto-Regular",
  },
  email: {
    color: "rgba(33, 33, 33, 0.8)",
    fontSize: 16,
    fontFamily: "Roboto-Regular",
    fontWeight: "400",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  imgContainer: {
    height: 240,
    marginBottom: 8,
  },
  image: {
    height: 240,
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    lineHeight: 19,
    fontFamily: "Roboto-Regular",
    fontWeight: "400",
    marginBottom: 11,
  },
  numbers: {
    fontSize: 16,
    lineHeight: 19,
    marginLeft: 6,
    fontFamily: "Roboto-Regular",
    fontWeight: "400",
  },
  iconContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  commentContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  locationContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 141,
  },
  location: {
    marginTop: 5,
    fontSize: 16,
    lineHeight: 19,
    fontFamily: "Roboto-Regular",
    fontWeight: "400",
    textDecorationLine: "underline",
  },
});
