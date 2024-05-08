import { StyleSheet, Text, View, Image, Alert, Platform, SafeAreaView, ScrollView } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Accordion from 'react-native-collapsible/Accordion';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
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
  DestinationText,
  TextRow,
  WhiteInputField
} from "./../components/Styles";
const API_URL = Platform.OS === 'ios' ? API_URL_IOS : API_URL_ANDROID;
const Profile = () => {
  const navigation = useNavigation();
  const { userID, setUserID } = useContext(UserType);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeSections, setActiveSections] = useState([]);
  const [selectedButton, setSelectedButton] = useState("myPosts");
  const [firstname, setFirstname] = useState(user ? user.firstname : '');
  const [surname, setSurname] = useState(user ? user.surname : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [userBio, setUserBio] = useState(user ? user.userBio : '');
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Handle logout
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      navigation.navigate('Login');
      setUserID('');
      setPosts([]);
      console.log('Logged out');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  // Handle deleting a post
  const deletePost = async (postID, userID) => {
    try {
      await axios.delete(`http://${API_URL}/posts/${postID}/${userID}/delete`);
      setPosts(posts.filter(post => post._id !== postID)); 
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  // Handle updating user details
  const updateUserDetails = async () => {
    try {
      const response = await axios.put(`http://${API_URL}/user/${userID}`, {
        firstname,
        surname,
        email,
        userBio
      });

      setUser(response.data.user); // Update the user state with the updated user
    } catch (error) {
      console.error('Failed to update user details:', error);
    }
  };

  // Handle updating user password
  const updateUserPassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('New password and confirm password do not match');
      return;
    }
    try {
      const response = await axios.put(`http://${API_URL}/user/${userID}/password`, {
        oldPassword,
        newPassword
      });

      if (response.status === 200) {
        Alert.alert('Password updated successfully');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      console.error('Failed to update password:', error);
      if (error.response) {
          if (error.response.status === 401) {
              Alert.alert('Old password is incorrect');
          } else if (error.response.data && error.response.data.message) {
              Alert.alert(error.response.data.message);
          } else {
              Alert.alert('Failed to update password');
          }
      } else {
          Alert.alert('Failed to update password');
      }
    }
  };

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


      return () => setActiveSections([]); // Optional: clear posts when screen goes out of focus
    }, [userID])
  );

  useEffect(() => {
    if (user) {
      console.log('User:', user);
    }
    if (posts) {
      console.log('Posts:', posts);
    }
    console.log('UserID:', userID);
  }, [user]);
  return (
    <StyledContainer>
      <InnerContainer>
        <SafeAreaView>
          <ScrollView>
            {user && (
              <View>
                <AppName style={{ marginBottom: 5 }}>{user.firstname} {user.surname}</AppName>
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
                {userID && posts.map((post, index) => (
                  <Post
                    key={index}
                    post={post}
                    userID={userID}
                    isActive={activeSections.includes(index)}
                    showDeleteButton={true}
                    deletePost={() => deletePost(post._id, userID)}
                  >
                    <StyledButton onPress={() => deletePost(post._id, userID)}>
                      <ButtonText>Delete Post</ButtonText>
                    </StyledButton>
                  </Post>
                ))}
              </PostContainer>
            )}

            {selectedButton === 'editProfile' && (
              <PostContainer>
                <PostTitle>My Profile</PostTitle>
                <TextRow>
                  <DestinationText>First Name: </DestinationText>
                  <WhiteInputField
                    value={firstname}
                    onChangeText={setFirstname}
                    placeholder={user ? user.firstname : ''}
                  />
                </TextRow>
                <TextRow>
                  <DestinationText>Surname: </DestinationText>
                  <WhiteInputField
                    value={surname}
                    onChangeText={setSurname}
                    placeholder={user ? user.surname : ''}
                  />
                </TextRow>
                <TextRow>
                  <DestinationText >Email : </DestinationText>
                  <WhiteInputField
                    value={email}
                    onChangeText={setEmail}
                    placeholder={user.email}
                  />
                </TextRow>
                <TextRow>
                  <DestinationText>Your Bio : </DestinationText>
                  <WhiteInputField
                    value={userBio}
                    onChangeText={setUserBio}
                    placeholder={user.userBio}
                  />
                </TextRow>

                <StyledButton onPress={updateUserDetails}>
                  <ButtonText>Update Profile</ButtonText>
                </StyledButton>

                <StyledButton onPress={() => setShowPasswordFields(!showPasswordFields)}>
                  <ButtonText>{showPasswordFields ? 'Hide' : 'Change Password'}</ButtonText>
                </StyledButton>
                {showPasswordFields && (
                  <View>
                    <TextRow>
                      <DestinationText >Old Password : </DestinationText>
                      <WhiteInputField
                        value={oldPassword}
                        onChangeText={setOldPassword}
                        placeholder=" Old Password"
                        secureTextEntry
                      />
                    </TextRow>
                    <TextRow>
                      <DestinationText >New Password : </DestinationText>
                      <WhiteInputField
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholder=" New Password"
                        secureTextEntry
                      />
                    </TextRow>
                    <TextRow>
                      <DestinationText >Confirm Password : </DestinationText>
                      <WhiteInputField
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder=" Confirm New Password"
                        secureTextEntry
                      />
                    </TextRow>

                    <StyledButton onPress={updateUserPassword}>
                      <ButtonText>Change Password</ButtonText>
                    </StyledButton>
                  </View>
                )}


              </PostContainer>
            )}


            <StyledButton onPress={logout} style={{ backgroundColor: Colors.red }}>
              <ButtonText >
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