import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  TextInput,
  Keyboard,
} from "react-native";
import { Ionicons, EvilIcons } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import * as Location from "expo-location";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { useFonts } from "expo-font";

import { db, storage } from "../../Firebase/config";

export default function CreatePostsScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [locationTitle, setLocationTitle] = useState("");
  const [hasPermission, setHasPermission] = useState(null);
  const [title, setTitle] = useState("");
  const [region, setRegion] = useState(null);
  const [inputRegion, setInputRegion] = useState("");
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [camera, setCamera] = useState(null);
  const [photo, setPhoto] = useState(null);
  const { userId, login } = useSelector((state) => state.auth);
  const locationRef = useRef();
  const [fontsLoaded] = useFonts({
    "Roboto-Regular": require("../../assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Medium": require("../../assets/fonts/Roboto-Medium.ttf"),
  });

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === "granted");
  };

  const requestLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
    }

    try {
      const locationPos = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: locationPos.coords.latitude,
        longitude: locationPos.coords.longitude,
      };
      const regionName = await Location.reverseGeocodeAsync(coords);
      setRegion(regionName);
      setLocation(coords);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    requestCameraPermission();
    MediaLibrary.requestPermissionsAsync();
  }, []);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  if (!fontsLoaded) {
    return null;
  }
  const takePhoto = async () => {
    const photo = await camera.takePictureAsync();
    await MediaLibrary.createAssetAsync(photo.uri);
    setPhoto(photo.uri);
    setInputRegion(region[0]["country"] + ", " + region[0]["city"]);
  };

  const sendPhoto = () => {
    writeDataToFirestore();
    setLocationTitle("");
    setInputRegion("");
    setTitle("");
    setPhoto(null);
    navigation.navigate("Posts");
  };

  const uploadPhotoToServer = async () => {
    const response = await fetch(photo);
    const file = await response.blob();

    const uniquePostId = Date.now().toString();
    const storageRef = await ref(storage, `postImage/${uniquePostId}`);

    const uploadPhoto = await uploadBytes(storageRef, file);
    const takePhoto = await getDownloadURL(uploadPhoto.ref);

    return takePhoto;
  };

  const writeDataToFirestore = async () => {
    try {
      const createdDate = Date.now();
      const photo = await uploadPhotoToServer();
      const docRef = await addDoc(collection(db, "posts"), {
        photo,
        location,
        inputRegion,
        locationTitle,
        title,
        userId,
        login,
        createdDate,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
      throw e;
    }
  };

  const photoSelect = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  const renderCamera = () => {
    if (photo) {
      return (
        <Camera style={styles.camera} ref={setCamera} type={type}>
          <Image
            source={{ uri: photo }}
            style={{ height: "100%", width: "100%", borderRadius: 10 }}
          />
        </Camera>
      );
    } else {
      return (
        <Camera style={styles.camera} ref={setCamera} type={type}>
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(232, 232, 232, 1)",
              borderColor: "#E8E8E8",
              borderWidth: 1,
              borderRadius: 10,
            }}
          />
        </Camera>
      );
    }
  };
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={styles.container}>
        <View
          style={{
            borderRadius: 10,
            overflow: "hidden",
            borderBottomRightRadius: 30,
            borderBottomLeftRadius: 30,
            justifyContent: "center",
          }}
        >
          {photo ? renderCamera() : renderCamera()}

          <View style={{ ...styles.snap, marginLeft: 150 }}>
            <TouchableOpacity onPress={takePhoto}>
              <Ionicons name="camera" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={styles.addPhotoBtn}
          onPress={() => photoSelect()}
        >
          <Text style={styles.text}>
            {photo ? "Редагувати фото" : "Завантажте фото"}
          </Text>
        </TouchableOpacity>
        <View>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Назва..."
            style={styles.input}
            textAlign={"left"}
            onSubmitEditing={() => {
              locationRef.current.focus();
            }}
            blurOnSubmit={false}
          />

          <View style={styles.locationContainer}>
            {!photo ? (
              <Text
                style={{
                  ...styles.postName,
                  color: "#BDBDBD",
                  fontSize: 16,
                  lineHeight: 19,
                  fontFamily: "Roboto-Regular",
                  fontWeight: "400",
                }}
                inputMode="navigation"
              >
                <EvilIcons name="location" size={20} color="gray" />
                Місцевість...
              </Text>
            ) : (
              <Text
                style={{ ...styles.postName, paddingLeft: 10 }}
                inputMode="navigation"
              >
                {" "}
                <EvilIcons name="location" size={24} color="gray" />
                {inputRegion}
              </Text>
            )}
          </View>

          <TouchableOpacity
            disabled={!photo ? true : false}
            style={photo ? styles.postBtn : styles.postBtnDisabled}
            onPress={sendPhoto}
          >
            <Text
              style={photo ? styles.postBtnLabel : styles.postBtnLabelDisabled}
            >
              Опубліковати
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => setPhoto("")}
          style={{
            ...styles.deleteBtn,
            position: "absolute",
            ...Platform.select({
              ios: { marginTop: 730 },
              android: { marginTop: 640 },
            }),
          }}
        >
          <EvilIcons name="trash" size={24} color="#DADADA"></EvilIcons>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  camera: {
    height: 240,
    backgroundColor: "rgba(232, 232, 232, 1)",
    borderColor: "#E8E8E8",
    borderWidth: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    overflow: "hidden",
    borderRadius: 8,
  },
  snap: {
    position: "absolute",
    width: 60,
    height: 60,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
  },
  text: {
    fontSize: 16,
    lineHeight: 19,
    color: "#BDBDBD",
    fontFamily: "Roboto-Regular",
    fontWeight: "400",
  },
  addPhotoBtn: {
    marginBottom: 32,
  },
  input: {
    fontSize: 16,
    lineHeight: 19,
    borderBottomColor: "#E8E8E8",
    borderBottomWidth: 1,
    marginBottom: 16,
    height: 50,
    fontFamily: "Roboto-Regular",
    fontWeight: "400",
  },
  postBtn: {
    alignItems: "center",
    backgroundColor: "#FF6C00",
    paddingHorizontal: 118,
    paddingVertical: 16,
    borderRadius: 100,
    marginTop: 16,
    fontFamily: "Roboto-Regular",
    fontWeight: "400",
  },
  postBtnLabel: {
    color: "#fff",
  },
  postBtnDisabled: {
    backgroundColor: "#F6F6F6",
    alignItems: "center",
    paddingHorizontal: 118,
    paddingVertical: 16,
    borderRadius: 100,
    marginTop: 16,
  },
  postBtnLabelDisabled: {
    color: "#BDBDBD",
  },
  locationContainer: {
    fontSize: 16,
    lineHeight: 19,
    borderBottomColor: "#E8E8E8",
    borderBottomWidth: 1,
    marginBottom: 16,
    height: 50,
    fontFamily: "Roboto-Regular",
    fontWeight: "400",
    justifyContent: "center",
  },
  location: {
    position: "absolute",
  },
  deleteBtn: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    borderRadius: 20,
    width: 70,
    height: 40,
    alignSelf: "center",
    marginTop: 200,
  },
});
