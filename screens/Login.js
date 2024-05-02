import { StyleSheet, SafeAreaView, Pressable, View, Platform, Alert } from 'react-native'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { API_URL_ANDROID, API_URL_IOS } from '../config';
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import KeyboardAvoid from '../components/KeyboardAvoid';
import {
  Colors,
  StyledContainer,
  InnerContainer,
  AppName,
  AppLogo,
  Subtitle,
  StyledInputBox,
  StyledInputText,
  StyledButton,
  ButtonText,
  PressableText,

} from "./../components/Styles";

const API_URL = Platform.OS === 'ios' ? API_URL_IOS : API_URL_ANDROID;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  //Check user logged in status
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (token) {
          navigation.replace("Main");
        }

      } catch (error) {
        console.log("Error getting token:", error);
      }
    }
    checkLoginStatus();
  }, [])

  const logToken = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      console.log("Retrieved token:", token);
    } catch (error) {
      console.log("Error getting token:", error);
    }
  }
  const handleLogin = () => {
    const user = {
      email: email,
      password: password
    }

    axios.post(`http://${API_URL}/login`, user).then((response) => {
      console.log(`Status code: ${response.status}`);
      console.log(`Server message: ${response.data.message}`);
      const token = response.data.token;
      AsyncStorage.setItem("userToken", token);
      logToken();
      console.log("Stored token:", token);
      navigation.replace("Main");
    }).catch((error) => {
      if (error.response && error.response.status === 401) {
        Alert.alert("Login failed", "Incorrect login details.");
      } else {
        Alert.alert("Login failed", "An unexpected error occurred.");
      }
      console.log("Login failed", error);
    })
  }



  return (
    <KeyboardAvoid>
      <StyledContainer>
        <InnerContainer>
          <SafeAreaView>
            <AppLogo source={require("./../assets/img/Logo.png")} />
            <AppName>Router</AppName>
            <Subtitle>Account Login</Subtitle>
            <StyledInputBox>
              <MaterialIcons style={{ marginLeft: 8 }} name="email" size={24} color={Colors.cream} />
              <StyledInputText
                value={email}
                onChangeText={(text) => setEmail(text)} //set the value of email to the user's text input
                placeholder="Email"
                placeholderTextColor={Colors.cream}
              />
            </StyledInputBox>
            <StyledInputBox>
              <Entypo style={{ marginLeft: 8 }} name="lock" size={24} color={Colors.cream} />
              <StyledInputText
                value={password}
                onChangeText={(text) => setPassword(text)} //set the value of password to the user's text input
                secureTextEntry={true}
                placeholder="Password"
                placeholderTextColor={Colors.cream}
              />
            </StyledInputBox>
            <Pressable onPress={() => navigation.navigate("Register")}
              style={{
                marginTop: 5,
              }}>
                <View style={{padding: 10}}>

                
              <PressableText>
                Don't have an account? Sign Up Here
              </PressableText>
              </View>
            </Pressable>
            <StyledButton onPress={handleLogin}>
              <ButtonText>
                Login
              </ButtonText>
            </StyledButton>




          </SafeAreaView>
        </InnerContainer>
      </StyledContainer>
    </KeyboardAvoid>

  )
}

export default Login

const styles = StyleSheet.create({})