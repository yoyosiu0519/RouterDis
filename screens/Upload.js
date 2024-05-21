import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import {
  StyledContainer,
  InnerContainer,
  AppName,
  AppLogo,
  Subtitle,
  DeleteLocationText

} from "./../components/Styles";
const Upload = () => {
  const navigation = useNavigation();
  return (
    <StyledContainer>
      <InnerContainer>
        <AppName>Upload Successful </AppName>
        <AppLogo source={require('./../assets/img/Upload.png')} />
        <Subtitle>Your post has been uploaded successfully</Subtitle>
        <Pressable onPress={() => navigation.navigate('Home')}>
          <DeleteLocationText>Go to Home</DeleteLocationText>
        </Pressable>
      </InnerContainer>
    </StyledContainer>

  )
}

export default Upload


