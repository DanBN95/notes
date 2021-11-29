import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, Modal, View, StatusBar, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { AntDesign } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as Permissions  from 'expo-permissions';

const NoteInputModal = ({ visible, onClose, onSubmit, note, isEdit}) => {

    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [permissionStatus, setPermissionStatus] = useState('');
    const [location, setLocation] = useState({});

    const handleModalClose = () => {
        Keyboard.dismiss();
    } 

    useEffect (() => {
        getLocation();
        if (isEdit) {
            setTitle(note.title);
            setDesc(note.desc);
            console.log("location:");
            console.log(location);
            setLocation(note.location);
        }
    }, [isEdit]);

    const getLocation = async () => {
        const { status } = await Location.requestBackgroundPermissionsAsync();
        if (status !== 'granted') {
            setPermissionStatus('PERMISSION NOT GRANTED!');
            alert(permissionStatus);
        }

        const userLocation = await Location.getCurrentPositionAsync({});
        setLocation(userLocation);
    }

    const handleSubmit = async () => {
        getLocation();
        if (!title.trim() && !desc.trim()) return onClose();

        if (isEdit) {   //  note opened for edit
            console.log("is editied");
            onSubmit(title, desc, Date.now(), location);
        } else {
            onSubmit(title, desc, location);
            setTitle('');
            setDesc('');
        }
        onClose();
    };

    const closeModal = () => {
        if (!isEdit) {  // exit note
            setTitle('');
            setDesc('');
        }
        onClose();
    }

    return (
        <>
        <StatusBar hidden />
        <Modal visible = {visible} animationType = 'fade'>
            <View style = {styles.container}>
                <TextInput 
                 value ={title}
                 multiline
                 placeholder = 'Title'
                 style = {[styles.input, styles.title]}
                 onChangeText = {setTitle}
                />
                <TextInput 
                 value = {desc}
                 multiline
                 placeholder = 'Your Note ...'
                 style = {[styles.input, styles.desc]}
                 onChangeText = {setDesc}
                />
                <View style = {styles.btnContainer}>
                    <AntDesign name="check" size={15} color="black" onPress = {handleSubmit} />
                    {title.trim() || desc.trim() ? (
                     <AntDesign name="close" size={15} color="black" onPress = {closeModal} />
                    ) : null }
                </View>
            </View>
            <TouchableWithoutFeedback onPress = {handleModalClose}>
                <View style = {[styles.modalBG, StyleSheet.absoluteFillObject]} />
            </TouchableWithoutFeedback>
        </Modal>
        </>
    );
};

export default NoteInputModal

const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      paddingTop: 15,
    },
    input: {
      borderBottomWidth: 2,
      borderBottomColor: 'black',
      fontSize: 20,
      color: 'black',
    },
    title: {
      height: 40,
      marginBottom: 15,
      fontWeight: 'bold',
    },
    desc: {
      height: 100,
    },
    modalBG: {
      flex: 1,
      zIndex: -1,   // The element which has a greater stack order is positioned in front of the element which has a low stack order
    },
    btnContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      paddingVertical: 15,
    },
  });
