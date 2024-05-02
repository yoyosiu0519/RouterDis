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
import { FontAwesome } from '@expo/vector-icons';
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
  const [user, setUser] = useState("");
  const [posts, setPosts] = useState([]);
  const [activeSections, setActiveSections] = useState([]);
  const navigation = useNavigation();
  const fetchUserPosts = async () => {
    try {
        const userToken = await AsyncStorage.getItem('userToken');
        const decoded = jwtDecode(userToken);
        const userID = decoded.userID;

        const response = await axios.get(`http://${API_URL}/posts/${userID}`);
        console.log('Response data:', response.data);
        setPosts(response.data);
    } catch (error) {
        console.log("error", error);
    }
};

  const fetchProfile = async () => {
    try {
        const token = await AsyncStorage.getItem('userToken');
        const decodedToken = jwtDecode(token);
        const userID = decodedToken.userID;
        const response = await axios.get(`http://${API_URL}/profile/${userID}`);
        const { user } = response.data;
        setUser(user);
    } catch (error) {
        console.log("error", error);
    }
};

useEffect(() => {
  fetchProfile();
  fetchUserPosts();
}, []);

const deletePost = async (postID) => {
  try {
      const userToken = await AsyncStorage.getItem('userToken');
      const decoded = jwtDecode(userToken);
      const userID = decoded.userID;

      const response = await axios.delete(`http://${API_URL}/posts/${userID}/${postID}`);
      console.log('Delete response:', response.data);

      // Refresh posts after deletion
      fetchUserPosts();
  } catch (error) {
      console.log("error", error);
  }
};

  const handleLogout = async () => {
    try {
        await AsyncStorage.removeItem('userToken');
        
        const userTokenAfterClear = await AsyncStorage.getItem('userToken');
        console.log(`Token after removal: ${userTokenAfterClear}`);

        navigation.navigate('Login');
    } catch (error) {
        console.error('Failed to remove the token', error);
    }
};

const renderSection = (section, _, isActive) => {
  const createdAt = new Date(section.createdAt);
  const formattedDate = createdAt.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
  const BoldText = ({ children }) => (
    <Text style={{ textAlign: 'right', fontWeight: 'bold', alignSelf: 'flex-start' }}>{children}</Text>
);
  return (
    <PostContainer>
      <View>
        <LocationTextRow>
          <PostDestination>{section.destination}</PostDestination>
          {isActive ? <AntDesign name="up" size={20} color="grey" /> : <AntDesign name="down" size={20} color="grey" />}
        </LocationTextRow>
        <LocationTextRow>
          <PostTime>{formattedDate}</PostTime>
        </LocationTextRow>
      </View>
      {isActive && [...new Set(section.locations.map(location => location.day))]
        .sort((a, b) => a - b) // Sort by days
        .map(day => (
          <Table key={day} style={{ margin: 10 }}>
            <PostDay>
              <Row data={[`Day ${day}`]} />
            </PostDay>
            {section.locations
  .filter(location => location.day === day) // Filter locations for this day
  .map((location, index) => (
      <React.Fragment key={index}>
<Row key={index} data={[
  " ",
  <BoldText>Name:</BoldText>,
  location.name,
]} />
<Row key={index} data={[
  " ",
  <BoldText>From:</BoldText>,
  location.from,
]} />
<Row key={index} data={[
  " ",
  <BoldText>To:</BoldText>,
  location.to,
]} />
<Row key={index} data={[
  " ",
  <BoldText>Description:</BoldText>,
  location.description,
]} />
<Row key={index} data={[
  " ",
  <BoldText>Transport:</BoldText>,
  location.transport,
]} />
<Row key={index} data={[
  " ",
  <BoldText>Duration:</BoldText>,
  location.duration,
]} />
      </React.Fragment>
))}
          </Table>
        ))}
                    {isActive && (
                <StyledButton onPress={() => deletePost(section._id)}>
                    <ButtonText>Delete Post</ButtonText>
                </StyledButton>
            )}
    </PostContainer>
  );
};

  return (
    <StyledContainer>
      <InnerContainer>
      <SafeAreaView>
        <ScrollView>

      <View style={{ flex: 1, alignItems: 'center', marginTop: 20 }}>
    <FontAwesome name="user-circle-o" size={210} color="black" />
    <Text style={{ fontSize: 40, fontWeight: "bold", marginTop: 20  }}>{user?.firstname} {user?.surname}</Text>

</View>
<Accordion
            sections={posts}
            renderHeader={renderSection}
            renderContent={() => null}
            activeSections={activeSections}
            onChange={setActiveSections}
          />
          

          <StyledButton onPress={handleLogout}>
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