import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Image,
  Keyboard,
} from "react-native";
import { useSelector } from "react-redux";
import { db } from "../../Firebase/config";
import { format } from "date-fns";
import uuid from "react-native-uuid";

import {
  collection,
  updateDoc,
  doc,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import { AntDesign } from "@expo/vector-icons";
import { useFonts } from "expo-font";
export default function CommentsScreen({ route }) {
  const { postId, photo } = route.params;
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState([]);
  const [isShownKeyboard, setIsShownKeyboard] = useState(false);
  const { login, userAvatar, userId } = useSelector((state) => state.auth);

  useEffect(() => {
    (async () => {
      await getAllComments();
    })();
  }, []);

  const createComment = async () => {
    if (!comment) {
      return;
    }
    const date = new Date();

    const formatData = format(new Date(date), "dd MMM, yyyy | HH:mm");

    const dbRef = await doc(db, "posts", postId);
    await updateDoc(dbRef, {
      comments: allComments.length + 1,
    });

    await addDoc(collection(dbRef, "comments"), {
      login,
      comment,
      userId,
      userAvatar,
      formatData,
    });

    setComment("");
    setIsShownKeyboard(false);
    Keyboard.dismiss();
  };

  const getAllComments = async () => {
    try {
      const dbRef = doc(db, "posts", postId);
      onSnapshot(collection(dbRef, "comments"), (data) =>
        setAllComments(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
      );
    } catch (error) {
      console.log(`getAllComments`, error);
    }
  };
  const [fontsLoaded] = useFonts({
    "Roboto-Regular": require("../../assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Medium": require("../../assets/fonts/Roboto-Medium.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }
  const commentMarkup = (item) => {
    if (item.userId === userId) {
      return (
        <View
          style={{
            ...styles.imgAvatarContainer,
            marginLeft: Platform.OS === "ios" ? 90 : 90,
          }}
        >
          <View
            style={{
              ...styles.commentContainer,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 0,
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
            }}
          >
            <Text style={styles.commentText}>{item.comment}</Text>
            <Text style={styles.commentData}>{item.formatData}</Text>
          </View>
          <Image
            style={{ ...styles.userAvatarImg, marginRight: 0, marginLeft: 16 }}
            source={{
              uri: item.userAvatar,
            }}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.imgAvatarContainer}>
          <Image
            style={styles.userAvatarImg}
            source={{
              uri: item.userAvatar,
            }}
          />
          <View style={styles.commentContainer}>
            <Text style={styles.commentText}>{item.comment}</Text>
            <Text style={styles.commentData}>{item.formatData}</Text>
          </View>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.imgContainer}>
          <Image style={styles.img} source={{ uri: photo }} />
        </View>

        <FlatList
          data={allComments}
          renderItem={({ item }) => commentMarkup(item)}
          keyExtractor={() => uuid.v4()}
        />
        <View
          style={{
            ...styles.inputContainer,
            marginBottom: isShownKeyboard ? 350 : 35,
          }}
        >
          <TextInput
            value={comment}
            onChangeText={setComment}
            placeholder="Коментувати..."
            style={styles.textInput}
            onFocus={() => setIsShownKeyboard(true)}
            onBlur={() => setIsShownKeyboard(false)}
          />
          <TouchableOpacity
            onPress={createComment}
            activeOpacity={0.8}
            style={styles.commentCreateBtn}
          >
            <AntDesign name="arrowup" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  imgContainer: {
    marginBottom: 32,
    marginTop: 32,
    alignItems: "center",
  },
  img: {
    width: 370,
    height: 240,
    borderRadius: 8,
  },
  commentContainer: {
    paddingTop: 16,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 16,
    width: 250,
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    marginBottom: 24,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  commentText: {
    fontSize: 13,
    lineHeight: 18,
    color: "#212121",
    fontFamily: "Roboto-Regular",
    fontWeight: "400",
  },
  inputContainer: {
    justifyContent: "flex-end",
    paddingHorizontal: 10,
    fontFamily: "Roboto-Regular",
    fontWeight: "400",
  },
  textInput: {
    fontSize: 16,
    lineHeight: 19,
    paddingLeft: 16,
    height: 50,
    borderWidth: 1,
    fontFamily: "Roboto-Regular",
    fontWeight: "400",
    borderColor: "#E8E8E8",
    borderRadius: 100,
    backgroundColor: "#F6F6F6",
  },
  commentCreateBtn: {
    position: "absolute",
    bottom: 8,
    right: 24,
    alignItems: "center",
    justifyContent: "center",
    width: 34,
    height: 34,
    backgroundColor: "#FF6C00",
    borderRadius: 50,
  },
  commentData: {
    color: "#BDBDBD",
    fontSize: 10,
    lineHeight: 12,
    textAlign: "right",
    fontFamily: "Roboto-Regular",
    fontWeight: "400",
  },
  imgAvatarContainer: {
    flex: 1,
    flexDirection: "row",
    right: 25,
  },
  userAvatarImg: {
    width: 28,
    height: 28,
    borderRadius: 100,
    marginRight: 16,
  },
});
