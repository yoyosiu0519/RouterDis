import { StyleSheet, SafeAreaView, Pressable, Platform, Alert } from 'react-native'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { API_URL_ANDROID, API_URL_IOS } from '../config';
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import KeyboardAvoid from '../components/KeyboardAvoid';
import {
  Colors,
  StyledContainer,
  InnerContainer,
  AppName,
  Subtitle,
  StyledInputBox,
  StyledInputText,
  StyledButton,
  ButtonText,
  PressableText

} from "./../components/Styles";

const API_URL = Platform.OS === 'ios' ? API_URL_IOS : API_URL_ANDROID;
const Login = () => {
  const [firstname, setFirstname] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleRegister = () => {
    if (!firstname || !surname || !email || !password) {
      Alert.alert("Missing fields", "All fields must be filled in.");
      return;
    }
    const user = {
      firstname: firstname,
      surname: surname,
      email: email,
      password: password
    }
    axios.post(`http://${API_URL}/register`, user).then((response) => {
      console.log(`Status code: ${response.status}`);
      console.log(`Server message: ${response.data.message}`);
      Alert.alert("Verify your email address", "Account has been created successfully, please check your email inbox .");
      setFirstname("");
      setSurname("");
      setEmail("");
      setPassword("");
    }).catch((error) => {
      if (error.response && error.response.status === 409) {
        Alert.alert("Email already exists", "The email you entered is already associated with an account. Please use a different email or check if there is any verification emailin your email inbox.");
      } else  {
        Alert.alert("Registration failed", "Please check all fields are filled correctly.");
      } 
      console.log("Registration failed", error);
    });
  }
  return (
    <KeyboardAvoid>
      <StyledContainer>
        <InnerContainer>
          <SafeAreaView>
            <AppName>Router</AppName>
            <Subtitle>Account Register</Subtitle>
            <StyledInputBox>
              <FontAwesome5 style={{ marginLeft: 8 }} name="user-alt" size={24} color={Colors.cream} />
              <StyledInputText
                value={firstname}
                onChangeText={(text) => setFirstname(text)} //set the value of email to the user's text input
                placeholder="Firstname"
                placeholderTextColor={Colors.cream}
              />
            </StyledInputBox>
            <StyledInputBox>
              <FontAwesome5 style={{ marginLeft: 8 }} name="user-alt" size={24} color={Colors.cream} />
              <StyledInputText
                value={surname}
                onChangeText={(text) => setSurname(text)} //set the value of email to the user's text input
                placeholder="Surname"
                placeholderTextColor={Colors.cream}
              />
            </StyledInputBox>
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
            <StyledButton
              onPress={handleRegister}>
              <ButtonText>
                Register
              </ButtonText>
            </StyledButton>
            <Pressable onPress={() => navigation.goBack()}
              style={{
                marginTop: 5,
              }}>
              <PressableText>
                Already have an account? Login Here
              </PressableText>
            </Pressable>
          </SafeAreaView>
        </InnerContainer>
      </StyledContainer>
    </KeyboardAvoid>

  )
}

export default Login

const styles = StyleSheet.create({})