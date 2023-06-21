import React from 'react';
import { StyleSheet, View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';

export default function MapScreen({ route }) {
    const {longitude, latitude} = route.params.location;
    const {title} = route.params;
  
    return(
       <View style={styles.container}>
            <MapView style={styles.map} initialRegion={{longitude:longitude, latitude:latitude, latitudeDelta:0.1,longitudeDelta:0.1}} mapType="standard"
        minZoomLevel={15}
        ><Marker title={title} coordinate={{longitude:longitude, latitude:latitude}} /></MapView>
        </View>
    )

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    map: {
        width: "100%",
        height: "100%",
    },
});