import React, { useState, useEffect } from 'react'
import {KeyboardAvoidingView,Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Dimensions, ScrollView } from 'react-native'
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
import Register from './RegisterScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import FormInput from '../components/FormInput';
import { AuthContext } from '../navigation/AuthProvider';



const LoginScreen = ({ onFinished }) => {
    
    const navigation = useNavigation();

    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ currentUser, setCurrentUser ] = useState('');

    // const { login } = React.useContext(AuthContext);
    

    const handleLogin = async () => {
        // thats create the email and the password we provided
        try {
        const user = await signInWithEmailAndPassword(auth, email, password);

       
        }catch (error) {
            alert('Wrong Email or Password!');
        }
        setEmail('');
        setPassword('');
    };


    useEffect (() => {
        const unsubscribe = onAuthStateChanged (auth, (user) => {
            if (user) {
                // User is signed in
                setCurrentUser(user);
            } 
        });
        
        // So when we leave this screen it's gonna unsubscribe from this listener,
        // so it doesn't keep pinging it while it shouldn't
        return unsubscribe;
    }, [])
    return (
        <ScrollView contentContainerStyle={styles.container}>
          <Image source = {require("../../assets/note.png")} style = {styles.logo} />
          <Text style={styles.text}>Note App</Text>
    
          <FormInput
            labelValue={email}
            onChangeText={(userEmail) => setEmail(userEmail)}
            placeholderText="Email"
            iconType="user"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
    
          <FormInput
            labelValue={password}
            onChangeText={(userPassword) => setPassword(userPassword)}
            placeholderText="Password"
            iconType="lock"
            secureTextEntry={true}
          />

          <TouchableOpacity
          onPress = {handleLogin}
          style = {styles.buttonContainer}
          >
            <Text style = {styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
          
          
    
          <TouchableOpacity style={styles.forgotButton} onPress={() => {}}>
            <Text style={styles.navButtonText}>Forgot Password?</Text>
          </TouchableOpacity>
    
    
          <TouchableOpacity
            style={styles.forgotButton}
            onPress={() => navigation.navigate('Register')}>
            <Text style={styles.navButtonText}>
              Don't have an acount? Create here
            </Text>
          </TouchableOpacity>
        </ScrollView>
      );
    };
    
    export default LoginScreen;
    
    const windowHeight = Dimensions.get('window').height;
    const windowWidth = Dimensions.get('window').width;

    const styles = StyleSheet.create({
      container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        paddingTop: 50
      },
      logo: {
        height: 150,
        width: 150,
        resizeMode: 'cover',
      },
      text: {
        //fontFamily: 'Kufam-SemiBoldItalic',
        fontSize: 28,
        marginBottom: 10,
        color: '#051d5f',
      },
      navButton: {
        marginTop: 15,
      },
      forgotButton: {
        marginVertical: 35,
      },
      navButtonText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#2e64e5',
      },
      buttonContainer: {
        marginTop: 10,
        width: '100%',
        height: windowHeight / 15,
        backgroundColor: '#2e64e5',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3,
      },
      buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
      },
    });