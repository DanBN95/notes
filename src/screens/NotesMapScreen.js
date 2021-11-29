import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Map from '../components/Map';
import { useNotes } from '../contexts/NoteProvider';

const NotesMapScreen = ({user, navigation}) => {

  console.log('note map screen')
  const {notes, setNotes, findNotes} = useNotes();

  const findnote = () => {
    console.log("*****notes:");
    console.log(notes);
  };
  useEffect(() => {
    findnote();
  })

    return (
        <SafeAreaView style = {styles.container} forceInset = {{ top: 'always'}}>
            <Map notes = {notes} navigation = {navigation} />
        </SafeAreaView>
      );
    
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
});

export default NotesMapScreen;
