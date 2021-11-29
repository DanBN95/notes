import * as React from 'react';
import MapView, { Callout } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, FlatList } from 'react-native';
import { Marker } from 'react-native-maps';
import { useNotes } from '../contexts/NoteProvider';
import Note from './Note';


const Map = ({notes, navigation}) => {

  const openNote = note => {
    console.log('navigation');
    navigation.navigate('NoteDetail', { note });
};


    return (
            <MapView 
                style={styles.map} 
                loadingEnabled = {true}
                region = {{
                  latitude: 31.80344,
                  longitude: 34.7911206,
                  latitudeDelta: 0.015,
                  longitudeDelta: 0.0121
                }}
            >
              {notes.map((marker,index) => (
                <Marker 
                key = {marker.id}
                coordinate = {{
                  latitude:  marker.location.coords.latitude,
                  longitude: marker.location.coords.longitude,
                }}
                title = {marker.title}
                description = {marker.desc}
                >
                  <Callout tooltip={true}>
                    <View>
                  <Note onPress = {() => openNote(marker)} item = {marker} />
                  </View>
                  </Callout>
                </Marker>
              ))}
              </MapView>
    )
}

export default Map

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    map: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },
    marker: {
      backgroundColor: "#550bbc",
      padding: 5,
      borderRadius: 5,
    },
});