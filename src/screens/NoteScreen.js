import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, View, StatusBar, TouchableWithoutFeedback, Keyboard, FlatList } from 'react-native';
import Note from '../components/Note';
import NoteInputModal from '../components/NoteInputModal';
import NotFound from '../components/NotFound';
import { useNotes } from '../contexts/NoteProvider';
import { AntDesign } from '@expo/vector-icons';
import colors from '../projectColors/colors';
import RoundIconBtn from '../components/RoundIconBtn';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from "firebase/auth";

const sortByDate = (data) => {
    return (data.sort((a,b) => {
        const aInt = parseInt(a.time);
        const bInt = parseInt(b.time);
        if (aInt < bInt) return 1;
        if (aInt === bInt) return 0;
        if (aInt > bInt) return -1;
    }));
};

const NoteScreen = ({user, navigation}) => {

    const auth = getAuth();

    const [greet, setGreet] = useState('');
    const [username, setUsername] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [resultNotFound, setResultNotFound] = useState(false);
    const [location, setLocation] = useState({});

    const { notes, setNotes, findNotes } = useNotes();

    const findGreet = () => {
        const hrs = new Date().getHours();
        if (hrs === 6  || hrs < 12) return setGreet('Morning');
        if (hrs === 1 || hrs < 17) return setGreet('Afternoon');
        setGreet('Evening');
    };

    
    const getUsername = async () => {
        try {
        const result = await AsyncStorage.getItem('USERS');
        console.log(result);
        const json = await JSON.parse(result);
        setUsername(json.name);
        console.log(json.name)
      } catch (err) {
        console.log("error in getUsername")
      }
      };

    useEffect (() => {
            getUsername()
            findGreet();
            sortNotes();
    },[]);


    const sortNotes = () => {
        notes.sort((a,b) => {
                    const aInt = parseInt(a.time);
                    const bInt = parseInt(b.time);
                    if (aInt < bInt) return 1;
                    if (aInt === bInt) return 0;
                    if (aInt > bInt) return -1;
                });
    }
    

    const openNote = note => {
        navigation.navigate('NoteDetail', { note });
    };

    const handleOnSubmit = async (title, desc, location) => {
        const note = { id: Date.now(), title, desc, time: Date.now(), location };
        const updatedNotes = [...notes, note];
        setNotes(updatedNotes);
        await AsyncStorage.setItem('NOTES', JSON.stringify(updatedNotes));
    };

    const logOut = async () => {
        try {
            await auth.signOut()
            .then(() => navigation.navigate('Login'));
        } catch (error) { console.log('Logout error!'); }
    };

    return (
        <>
            <StatusBar barStyle = 'dark-content' backgroundColor = 'white' />
            <TouchableWithoutFeedback onPress = {Keyboard.dismiss}>
                <View style = {styles.container}>
                    <Text style = {styles.header}>{`Good ${greet} ${username}`}</Text>
                    {resultNotFound ? (
                        <NotFound />
                    ) : (
                        <FlatList 
                        data = {notes}
                        numColumns = {2}
                        columnWrapperStyle = {{
                            justifyContent: 'space-between',
                            marginBottom: 15,
                            marginTop: 15,
                        }}
                        keyExtractor = {item => item.id.toString()}
                        renderItem = {({ item }) => (
                            <Note onPress = {() => openNote(item)} item = {item} />
                        )}
                        />
                    )}
                    {!notes.length ? (
                        <View
                        style = {[
                            StyleSheet.absoluteFillObject,
                            styles.emptyHeaderContainer,
                        ]}
                        >
                            <Text style = {styles.emptyHeader}>Add Notes</Text>
                        </View>
                    ) : null}
                </View>  
            </TouchableWithoutFeedback>
            <View style ={styles.btnContainer}>
            <RoundIconBtn
                onPress={() => setModalVisible(true)}
                antIconName='plus'
                style={styles.addBtn}
            />  
            </View>
            <View style ={styles.btnLogoutContainer}>
            <RoundIconBtn
                onPress={() => logOut()}
                antIconName='logout'
                style={styles.addBtn}
            />  
            </View>
            <NoteInputModal 
             visible = {modalVisible}
             onClose = {() => setModalVisible(false)}
             onSubmit = {handleOnSubmit}
            />

        </>
    )
}

export default NoteScreen

const styles = StyleSheet.create({
    header: {
      fontSize: 25,
      fontWeight: 'bold',
    },
    container: {
      paddingHorizontal: 20,
      flex: 1,
      zIndex: 1,
    },
    emptyHeader: {
      fontSize: 30,
      textTransform: 'uppercase',
      fontWeight: 'bold',
      opacity: 0.2,
    },
    emptyHeaderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: -1,
    },
    addBtn: {
      position: 'absolute',
      right: 15,
      bottom: 50,
      zIndex: 1,
    },
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 15,
    },
    btnLogoutContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 15,
        marginTop: 30,
    },
  });