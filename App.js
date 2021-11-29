import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useEffect, useState } from 'react/cjs/react.development';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import NotesMapScreen from './src/screens/NotesMapScreen';
import NoteScreen from './src/screens/NoteScreen';
import NoteDetail from './src/components/NoteDetail';
import NoteProvider from './src/contexts/NoteProvider';

import { createStackNavigator } from '@react-navigation/stack';
import { getAuth } from '@firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { auth } from './firebase';
import firestore from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/auth';
import { onAuthStateChanged } from "firebase/auth";


const Tab = createBottomTabNavigator();

const getUser = async () => {
  const [user, setUser] = useState({});
  console.log("hi************************************");
  try {
  const result = await AsyncStorage.getItem('USERS');
  const json = await JSON.parse(result);
  console.log(json.name);
  return json.name;
} catch (err) {
  console.log("error in get")
}
};

const NoteListStack = createStackNavigator();

function NoteListStackScreen () {
  const renderNoteScreen = (props) => { 
    const [username, setUsername] = useState('');
    
    return (
       <NoteScreen {...props} user={username} /> 
    )};
    
  return (
  <NoteListStack.Navigator>
    <NoteListStack.Screen options={{ headerShown: false }} name="NoteList" component={renderNoteScreen} />
    <NoteListStack.Screen options={{ headerShown: false }} name="NoteDetail" component={NoteDetail} />
    <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
  </NoteListStack.Navigator>
  )
}

const NoteMapStack = createStackNavigator();

function NoteMapStackScreen () {

  const renderMapScreen = props => { 
    const [username, setUsername] = useState('');

    return (
       <NotesMapScreen {...props} user={username} /> 
    )};
  return (
    <NoteMapStack.Navigator>
    <NoteMapStack.Screen options={{ headerShown: false }} name="NotesMap" component={renderMapScreen} />
    <NoteListStack.Screen options={{ headerShown: false }} name="NoteDetail" component={NoteDetail} />
  </NoteMapStack.Navigator>
  )
}


const CustomTabBarButton = ({children, onPress}) => (
  <TouchableOpacity
    style = {{
      top: -30,
      justifyContent: 'center',
      alignItems: 'center',
      ...styles.shadow
    }}
    onPress = {onPress}
  >
    <View style = {{
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: '#e32f45'
    }}>
      {children}
    </View>
  </TouchableOpacity>
);


export default function App() {

  // const [user, setUser] = useState({});
  const [isAppFirstTimeOpen, setIsAppFirstTimeOpen] = useState(true);

  const findUser = async () => {
    onAuthStateChanged(auth, (user) => {
      if (user === null)  return setIsAppFirstTimeOpen(true);

      // const result = await AsyncStorage.getItem('user');
      //var user1 = firebase.auth().currentUser;
      //console.log(user1);

      // setUser(JSON.parse(result));
      setIsAppFirstTimeOpen(false);
    })
  };

  // const getUser = async () => {
  //   console.log("hi************************************");
  //   try {
  //   AsyncStorage.getItem('USERS', (err, result) => {
  //     console.log(result);
  //   })
  // } catch (err) {
  //   console.log("error in get")
  // }
  //   //const user = await firestore().collection('users').doc(uEMUz8LP91uOZoxjSSYh).get().then((user) => console.log(user));
  //   //console.log(user);
  // };

  useEffect (() => {
    findUser();
  }, []);

  
  Stack = createStackNavigator();

  if (!isAppFirstTimeOpen) {
    return (
    <NavigationContainer>
      <NoteProvider>
        <Tab.Navigator
        screenOptions = {{
          tabBarShowLabel: false,
          style: {
              position: 'absolute',
              bottom: 25,
              left: 20,
              right: 20,
              elevation: 0,
              backgroundColor: '#ffffff',
              borderRadius: 15,
              height: 90,
              ...styles.shadow
           
            },
          }}
        >
        <Tab.Screen name = "Note Screen" component = {NoteListStackScreen} headerShown = {false}
        options = {{
          tabBarIcon: ({ focused }) => (
            <View style = {{ alignItems: 'center', justifyContent: 'center' }}>
              <Image 
              source = { require('./assets/sticky-note.png') }
              resizeMode = 'contain'
              style = {{
                width: 25,
                height: 25,
                tintColor: focused ? '#ffa000' : '#748c94',
              }}
              />
              <Text style = {{color: focused ? '#e32f45' : '#748c94', fontSize: 12 }}>
                List Mode
              </Text>
            </View>
          )
        }} />

        <Tab.Screen name = "Notes Map Screen" component = {NoteMapStackScreen}
          options = {{
            tabBarIcon: ({ focused }) => (
              <View style = {{ alignItems: 'center', justifyContent: 'center' }}>
                <Image 
                source = { require('./assets/maps.png') }
                resizeMode = 'contain'
                style = {{
                  width: 25,
                  height: 25,
                  tintColor: focused ? '#e32f45' : '#748c94',
                }}
                />
                <Text style = {{color: focused ? '#e32f45' : '#748c94', fontSize: 12 }}>
                Map Mode
                </Text>
              </View>
            )
          }}
        />
    </Tab.Navigator>
        </NoteProvider>
    </NavigationContainer>
    );
  }
  
  else {
    return (
          <NavigationContainer>
            <NoteProvider>
            <Stack.Navigator initialRouteName = "Login">
              <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
              <Stack.Screen options={{ headerShown: false }} name="Register" component={RegisterScreen} />
              </Stack.Navigator>
              </NoteProvider>
           </NavigationContainer>
         );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    shadowColor: '#7F5DF0',
    shadowOffset : {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5
  }
});
