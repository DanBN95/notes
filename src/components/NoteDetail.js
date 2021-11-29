import React, { useState } from 'react'
import { StyleSheet, View, Text, Alert, ScrollView } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNotes } from '../contexts/NoteProvider';
import NoteInputModal from './NoteInputModal'; 
import { AntDesign } from '@expo/vector-icons';
import { useHeaderHeight } from '@react-navigation/elements'

const formatDate = ms => {
    const date = new Date(ms);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

const NoteDetail = (props) => {
    const [note, setNote] = useState(props.route.params.note);
    const { setNotes } = useNotes();
    const [showModal, setShowModal] = useState(false);
    // const [location, setLocation] = useState({});
    const [isEdit, setIsEdit] = useState(false);
    const headerHeight = useHeaderHeight();

    // new notes array without the specific note
    const deleteNote = async () => {
        const result = await AsyncStorage.getItem('NOTES');
        let notes = [];
        if (result !== null) notes = JSON.parse(result);

        const newNotes = notes.filter(n => n.id !== note.id);  
        setNotes(newNotes);
        await AsyncStorage.setItem('NOTES', JSON.stringify(newNotes));
        props.navigation.goBack();
    };

    const displayDeleteAlert = () => {
        Alert.alert(
            'Are You Sure?',
            'This action will delete your note permanently',
            [
                {
                    text: 'Delete',
                    onPress: deleteNote,
                },
                {
                    text: 'No Thanks',
                    onPress: () => console.log('no thanks'),
                },
            ],
            {
                cancelable: true,
            }
        )
    };

    const handleUpdate = async (title, desc, time, location) => {
        const result = await AsyncStorage.getItem('NOTES');
        let notes = [];
        if (result !== null) notes = JSON.parse(result);

        // Updating the desierd note to be with the updated info
        const newNotes = notes.filter(n => {
            if (n.id === note.id) {
                console.log("note:");
                console.log(n);
                n.title = title;
                n.desc = desc;
                n.isUpdated = true;
                n.time = time;
                n.location = location;
                console.log(n.location);

                setNotes(n);
            }
            return n;
        });

        setNotes(newNotes);
        await AsyncStorage.setItem('NOTES', JSON.stringify(newNotes));
    };

    const handleOnClose = () => setShowModal(false);

    const openEditModal = () => {
        setIsEdit(true);
        setShowModal(true);
    }

    return (
        <>
            <ScrollView contentContainerStyle = {[ styles.container, { paddingTop: headerHeight}]}>
                <Text style = {styles.time}>
                    {note.isUpdated
                    ? `Updated at ${formatDate(note.time)}`
                    : `Created at ${formatDate(note.time)}`}
                </Text>
                <Text style = {styles.title}>{note.title}</Text>
                <Text style = {styles.desc}>{note.desc}</Text>
            </ScrollView>
            <View style = {styles.btnContainer}>
            <AntDesign name="delete" size={25} color="black" 
            style = {{ marginBottom: 15}}
            onPress = {displayDeleteAlert} 
            />
            <AntDesign name="edit" size={25} color="black" onPress = {openEditModal} />
            </View>
            <NoteInputModal 
                isEdit = {isEdit}
                note = {note}
                onClose = {handleOnClose}
                onSubmit = {handleUpdate}
                visible = {showModal}
            />
        </>
    );
}

export default NoteDetail


const styles = StyleSheet.create({
    container: {
      // flex: 1,
      paddingHorizontal: 15,
    },
    title: {
      fontSize: 30,
      color: 'black',
      fontWeight: 'bold',
    },
    desc: {
      fontSize: 20,
      opacity: 0.6,
    },
    time: {
      textAlign: 'right',
      fontSize: 12,
      opacity: 0.5,
    },
    btnContainer: {
      position: 'absolute',
      right: 15,
      bottom: 50,
    },
  });
  
