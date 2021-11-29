import React, {createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NoteContext = createContext();    // used when some data needs to be accessible by many components at different nesting levels
const NoteProvider = ({ children }) => {
    const [notes, setNotes] = useState([]);

    const findNotes = async () => {
        console.log("find notes");
        const result = await AsyncStorage.getItem('NOTES');
        if (result !== null) setNotes(JSON.parse(result));
        console.log(result);
    };

    useEffect (() => {
        findNotes();
    },[]);

    return (
        /*
            Provider React Explaination:
            The Provider component accepts a value prop to
            be passed to consuming components that are descendants of this Provider.
            All consumers that are descendants of a Provider will re-render
            whenever the Provider’s value prop changes.
        */
        <NoteContext.Provider value = {{ notes, setNotes, findNotes }}>
            {children}
        </NoteContext.Provider>
    );
};

export const useNotes = () => useContext(NoteContext);

export default NoteProvider;