import { StyleSheet, Text, View, Image, Pressable, Platform, SafeAreaView, ScrollView } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Accordion from 'react-native-collapsible/Accordion';
import { useFocusEffect } from '@react-navigation/native';
import { Table, Row } from 'react-native-table-component';
import { API_URL_ANDROID, API_URL_IOS } from '../config';
import Post from '../components/RenderPost';
import { UserType } from '../UserContext';
import {
  Colors,
  StyledContainer,
  StyledButton,
  ButtonText,
  InnerContainer,
  NetworkButtonContainer,
  SmallButton,
  ColorButtonText,
  PostContainer,
  PostTitle,
  AppName,
  PressableText,
  PostDestination,
  DeleteLocationText,
  PostDay
} from "./../components/Styles";
const API_URL = Platform.OS === 'ios' ? API_URL_IOS : API_URL_ANDROID;
const Profile = () => {
  const { userID, setUserID } = useContext(UserType);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeSections, setActiveSections] = useState([]);
  const [selectedButton, setSelectedButton] = useState("myPosts");

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

  useFocusEffect(
    React.useCallback(() => {
      const fetchPosts = async () => {
        try {
          const response = await axios.get(`http://${API_URL}/posts/${userID}`);
          setPosts(response.data);
        } catch (error) {
          console.error('Failed to fetch posts:', error);
        }
      };

      if (userID) {
        fetchPosts();
      }

      return () => setPosts([]); // Optional: clear posts when screen goes out of focus
    }, [userID])
  );

  useEffect(() => {
    console.log('User:', user);
    console.log('Posts:', posts);
  }
    , [user]);
  return (
    <StyledContainer>
      <InnerContainer>
        <SafeAreaView>
          <ScrollView>
            {user && (
              <View>
                <AppName>{user.firstname} {user.surname}</AppName>
                <PressableText>{user.userBio}</PressableText>
              </View>

            )}
            <NetworkButtonContainer>
              <SmallButton onPress={() => setSelectedButton('myPosts')} style={selectedButton === 'myPosts' ? styles.selectedButton : null}>
                <ColorButtonText style={selectedButton === 'myPosts' ? styles.selectedButton : null}>
                  My Posts
                </ColorButtonText>
              </SmallButton>

              <SmallButton onPress={() => setSelectedButton('editProfile')} style={selectedButton === 'editProfile' ? styles.selectedButton : null}>
                <ColorButtonText style={selectedButton === 'editProfile' ? styles.selectedButton : null}>
                  Edit my profile
                </ColorButtonText>
              </SmallButton>
            </NetworkButtonContainer>

            {selectedButton === 'myPosts' && (
              <PostContainer>
                <PostTitle>My Posts</PostTitle>
                {posts.map((post, index) => (
                  <Post
                    key={index}
                    post={post}
                    userID={userID}
                    isActive={activeSections.includes(index)}
                  />
                ))}
              </PostContainer>
            )}

            {selectedButton === 'editProfile' && (
              <PostContainer>
                <PostTitle>My Profile</PostTitle>
                {posts.map((post, index) => (
                  <Post
                    key={index}
                    post={post}
                    userID={userID}
                    isActive={activeSections.includes(index)}
                  />
                ))}
              </PostContainer>
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

const styles = StyleSheet.create({
  selectedButton: {
    backgroundColor: Colors.sage,
    color: Colors.white
  },
});