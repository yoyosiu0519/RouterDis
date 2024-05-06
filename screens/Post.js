import { StyleSheet, Text, View, SafeAreaView, ScrollView, Pressable, Platform } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { Entypo } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { API_URL_ANDROID, API_URL_IOS } from '../config';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import 'core-js/stable/atob';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { UserType } from '../UserContext';
import { Ionicons } from '@expo/vector-icons';
import KeyboardAvoid from '../components/KeyboardAvoid';

import {
  Colors,
  StyledContainer,
  StyledPostButton,
  ButtonText,
  DestinationContainer,
  DestinationTextInput,
  DestinationText,
  LocationContainer,
  PressableText,
  TextRow,
  DeleteLocationText,
  ScreenHeadtitle,
  LogoContainer,
  PostContainer

} from "./../components/Styles";
const API_URL = Platform.OS === 'ios' ? API_URL_IOS : API_URL_ANDROID;
const Post = ({ navigation }) => {
  const [destination, setDestination] = useState("");
  const [locations, setLocations] = useState([{ day: '', name: '', from: '', to: '', description: '', transport: '', duration: '', image: '' }]);

  const { userID } = useContext(UserType);


  const handlePost = () => {
    const post = {
      userID,
      destination,
      locations
    };

    axios.post(`http://${API_URL}/newPost`, post)
      .then((response) => {
        console.log(response.data.message); // "Post created successfully"
        setDestination("");
        setLocations([{ day: '', name: '', from: '', to: '', description: '', transport: '', duration: '', image: '' }]);
        navigation.navigate('Upload');
      })
      .catch((error) => {
        console.log(error.response.data.message); // "Unable to create post"
      });
  };
  const handleLocationChange = (index, field, value) => {
    setLocations(locations => locations.map((location, i) => i === index ? { ...location, [field]: value } : location));
  };

  const addLocation = () => {
    setLocations(locations => [...locations, { day: '', name: '', from: '', to: '', description: '', transport: '', duration: '', image: '' }]);
  };

  const handleDeleteLocation = (index) => {
    if (locations.length > 1) {
      setLocations(locations => locations.filter((location, i) => i !== index));
    }
  };
  return (
    <KeyboardAvoid>
      <StyledContainer>
        <SafeAreaView>
          <ScrollView>
            <LogoContainer>
              <ScreenHeadtitle>New Post</ScreenHeadtitle>
            </LogoContainer>
            <PostContainer style={{ width: '100%' }}>
              <PressableText style={{ marginBottom: 10, marginTop: 5 }}>Fields with ' * ' are required</PressableText>
              <DestinationContainer>
                <FontAwesome5 name="city" size={22} color={Colors.sage} />
                <DestinationText>Destination:</DestinationText>
                <DestinationTextInput
                  placeholder="Destination"
                  value={destination}
                  onChangeText={setDestination} />

              </DestinationContainer>


              {locations.map((location, index) => (
                <LocationContainer key={index}>
                  <TextRow>
                    <FontAwesome name="calendar" size={24} color={Colors.sage} />
                    <DestinationText>Day: * </DestinationText>
                    <DestinationTextInput
                      placeholder="Day"
                      value={location.day}
                      onChangeText={(value) => handleLocationChange(index, 'day', value)}
                    />
                  </TextRow>
                  <TextRow>
                    <MaterialIcons name="location-pin" size={24} color={Colors.sage} />
                    <DestinationText>Location: * </DestinationText>
                    <DestinationTextInput
                      placeholder="Name"
                      value={location.name}
                      onChangeText={(value) => handleLocationChange(index, 'name', value)}
                    />
                  </TextRow>
                  <TextRow>
                    <MaterialCommunityIcons name="airplane-takeoff" size={24} color={Colors.sage} />
                    <DestinationText>From: * </DestinationText>
                    <DestinationTextInput
                      placeholder="From"
                      value={location.from}
                      onChangeText={(value) => handleLocationChange(index, 'from', value)}
                    />
                  </TextRow>
                  <TextRow>
                    <MaterialCommunityIcons name="airplane-landing" size={24} color={Colors.sage} />
                    <DestinationText>To: * </DestinationText>
                    <DestinationTextInput
                      placeholder="To"
                      value={location.to}
                      onChangeText={(value) => handleLocationChange(index, 'to', value)}
                    />
                  </TextRow>
                  <TextRow >
                    <Entypo name="text" size={24} color={Colors.sage} style={{ alignSelf: 'flex-start' }} />
                    <DestinationText style={{ alignSelf: 'flex-start' }}>Description: </DestinationText>
                    <DestinationTextInput
                      placeholder="Description"
                      value={location.description}
                      onChangeText={(value) => handleLocationChange(index, 'description', value)}
                      multiline={true}
                      numberOfLines={4}
                      style={{ alignSelf: 'flex-start', textAlignVertical: 'top' }}

                    />
                  </TextRow>
                  <TextRow>
                    <MaterialCommunityIcons name="train-car" size={24} color={Colors.sage} />
                    <DestinationText>Transport: </DestinationText>
                    <DestinationTextInput
                      placeholder="Transport"
                      value={location.transport}
                      onChangeText={(value) => handleLocationChange(index, 'transport', value)}
                    />
                  </TextRow>
                  <TextRow>
                    <Ionicons name="time-outline" size={24} color={Colors.sage} />
                    <DestinationText>Duration: </DestinationText>
                    <DestinationTextInput
                      placeholder="Duration"
                      value={location.duration}
                      onChangeText={(value) => handleLocationChange(index, 'duration', value)}
                    />
                  </TextRow>

                  <Pressable onPress={() => handleDeleteLocation(index)}>
                    <DeleteLocationText>Delete Location</DeleteLocationText>
                  </Pressable>
                </LocationContainer>
              ))}
            </PostContainer>

            <StyledPostButton onPress={addLocation}>
              <ButtonText>Add Location</ButtonText>
            </StyledPostButton>

            <StyledPostButton onPress={handlePost}>
              <ButtonText>Post</ButtonText>
            </StyledPostButton>
            
          </ScrollView>
        </SafeAreaView>
      </StyledContainer>
    </KeyboardAvoid>
  );
};

export default Post;

