import { StyleSheet, Text, View, Image, Pressable, Platform, SafeAreaView, ScrollView } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Accordion from 'react-native-collapsible/Accordion';
import { AntDesign } from '@expo/vector-icons';
import { Table, Row } from 'react-native-table-component';
import { API_URL_ANDROID, API_URL_IOS } from '../config';
import { jwtDecode } from 'jwt-decode';
import { UserType } from '../UserContext';
import {
  Colors,
  StyledContainer,
  StyledButton,
  ButtonText,
  InnerContainer,
  ScreenHeadtitle,
  LogoContainer,
  LocationTextRow,
  PostContainer,
  PostTitle,
  PostUser,
  PostTime,
  PostDestination,
  DeleteLocationText,
  PostDay
} from "./../components/Styles";
const API_URL = Platform.OS === 'ios' ? API_URL_IOS : API_URL_ANDROID;
const Profile = () => {
  const { userID, setUserID } = useContext(UserType);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://${API_URL}/profile/${userID}`);
        setUser(response.data.user); // Access the nested user object
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    if (userID) {
      fetchUser();
    }
  }, [userID]);

  useEffect(() => {
    console.log('User:', user);
  }
    , [user]);
  return (
    <StyledContainer>
      <InnerContainer>
        <SafeAreaView>
          <ScrollView>
            {user && (
              <View>
                <Text>{user.firstname} {user.surname}</Text>
              </View>
            )}

            <StyledButton >
              <ButtonText>
                Logout
              </ButtonText>
            </StyledButton>
          </ScrollView>
        </SafeAreaView>
      </InnerContainer>
    </StyledContainer>
  )
}

export default Profile

const styles = StyleSheet.create({})