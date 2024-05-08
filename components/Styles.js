import styled from "styled-components";
import { Platform, View, Text, Image, TextInput, Pressable } from "react-native";
import Constants from "expo-constants";

const StatusBarHeight = Constants.statusBarHeight;

export const Colors = {

    black: "#000000",
    white: "#FFFFFF",
    cream: "#FEFCED",
    red: "#9E2A2B",
    sage: "#99AA88",
    navy: "#3A5E7A",
    darkSage: "#1F281E",
    lightSage: "#CBD2C5",
    lightBlue: "#517e8f",
    lightGrey: "#5f6360",

};

const { black, white, cream, lightBlue, 
   red, sage, navy, darkSage, lightSage, lightGrey } = Colors;
export const StyledContainer = styled.View`
    flex: 1;
    padding: 25px;
    padding-top: ${StatusBarHeight + 20}px;
    background-color: ${cream};
    `
export const InnerContainer = styled.View`
    flex: 1;
    width: 100%;
    align-items: center;
    `
export const LogoContainer = styled.View`
    flex: 1;
    width: 100%;
    flex-direction: row;
    `
export const AppLogo = styled.Image`
    width: 160px;
    height: 160px;
    margin-top: 50px;
    alignSelf: center;
    `

export const AppName = styled.Text`
    font-size: 40px;
    text-align: center;
    font-weight: bold;
    color: ${black};

    `
export const HomeAppName = styled.Text`
    font-size: 35px;
    text-align: center;
    font-weight: bold;
    color: ${black};
    padding: 5px;
    padding-left: 120px;
    `
export const ScreenHeadtitle = styled.Text`
    paddingLeft: 110px;
    font-size: 25px;
    letter-spacing: 1px;
    align-items: center;
    font-weight: bold;
    color: ${black};
    text-align: center;
    `
    
export const Subtitle = styled.Text`
    font-size: 20px;
    margin-bottom: 14px;
    margin-top: 55px;
    letter-spacing: 1px;
    font-weight: bold;
    color: ${navy};
    text-align: center;
    `
export const StyledInputBox = styled.View`
    flexDirection: row;
    alignItems: center;
    gap: 15px;
    backgroundColor: ${sage};
    paddingVertical: 7px;
    borderRadius: 8px;
    marginTop: 25px;
    ${Platform.OS === 'ios' ? `
        shadowColor: ${black};
        shadowOpacity: 0.5;
        shadowOffset: 0px 2px;
        shadowRadius: 2px;
    ` : `
        elevation: 3;
    `}
  `
export const StyledInputText = styled.TextInput`
    color: ${cream};
    font-size: 15px;
    width: 80%;
    padding: 10px;
    `
export const StyledButton = styled.Pressable`
    padding: 20px;
    marginTop: 20px;
    marginBottom: 10px;
    backgroundColor: ${navy};
    alignSelf: center;
    borderRadius: 8px;
    marginvertical: 5px;
    width: 200px;
    height: 60px;
    `
export const SmallButton = styled.Pressable`
    padding: 15px;
    marginBottom: 10px;
    marginTop: 40px;
    backgroundColor: ${white};
    borderRadius: 8px;
    borderWidth: 3px;
    borderColor: ${sage};
    marginvertical: 5px;
    width: 160px;
    height: 60px;
    `
export const ButtonText = styled.Text`
    color: ${white};
    font-size: 15.5px;
    font-weight: bold;
    text-align: center;
    `
    export const ColorButtonText = styled.Text`
    color: ${sage};
    font-size: 15.5px;
    font-weight: bold;
    text-align: center;
    `
export const PressableText = styled.Text`
    color: ${navy};
    font-size: 15px;
    font-weight: 500;
    text-align: center;
    `
export const SearchContainer = styled.View`
    flexDirection: row;
    position: center;
    backgroundColor: ${white};
    padding: 3px;
    borderRadius: 8px;
    marginTop: 10px;
    borderWidth: 1px; 
    borderColor: ${navy}; 
    borderStyle: solid; 
    ${Platform.OS === 'ios' ? `
    shadowColor: ${black};
    shadowOpacity: 0.5;
    shadowOffset: 0px 2px;
    shadowRadius: 2px;
` : `
    elevation: 5;
`}
  `;
  export const SearchInputText = styled.TextInput`
    color: ${black};
    font-size: 15px;
    width: 80%;
    padding: 10px;
    `
export const IconContainer = styled.View`
    alignItems: center;
    justifyContent: center;
    marginLeft: 10px;
    `
export const IconPressable = styled.Pressable`
    flexDirection: row;
    alignItems: center;
    marginLeft: 80px;
    `
export const NetworkButtonContainer = styled.View`
    flexDirection: row;
    justifyContent: center;
    gap: 5px;
    `
export const NetworkButton = styled.Pressable`
    paddingVertical: 10px; 
    width: 110px;
    marginBottom: 10px;
    marginTop: 25px;
    backgroundColor: ${white};
    alignSelf: center;
    borderRadius: 5px;
    borderWidth: 1px; 
    borderColor: ${navy}; 
    borderStyle: solid; 
    `
export const NetworkButtonText = styled.Text`
    color: ${navy};
    font-size: 15px;
    font-weight: bold;
    text-align: center;
    `
export const FollowButton = styled.Pressable`
    marginLeft: 10px;
    backgroundColor: ${sage};
    padding: 10px;
    borderRadius: 5px;
    
`
export const StyledPostButton = styled.Pressable`
    padding: 20px;
    marginBottom: 5px;
    marginTop: 20px;
    backgroundColor: ${navy};
    alignSelf: center;
    borderRadius: 8px;
    marginvertical: 5px;
    width: 300px;
    height: 60px;
    `

export const DestinationContainer = styled.View`
    flexDirection: row;
    marginTop: 10px;
    padding: 10px;
    alignItems: center;
    justifyContent: space-between;
    backgroundColor: ${white};
    borderWidth: 2px; 
    borderColor: ${navy}; 
    borderStyle: solid; 
    borderRadius: 8px;
    ${Platform.OS === 'ios' ? `
    shadowColor: ${black};
    shadowOpacity: 0.5;
    shadowOffset: 0px 2px;
    shadowRadius: 2px;
` : `
    elevation: 5;
`}
  `;

export const DestinationTextInput = styled.TextInput`
    flex: 1;
    color: ${black};
    fontSize: 15px;
    paddingLeft: 10px;
  `;

export const DestinationText = styled.Text`
    color: ${lightBlue};
    fontWeight: bold;
    fontSize: 15px;
    textAlign: right;
    paddingLeft: 10px;
    width: 100px;
  `;
export const LocationContainer = styled.View`
    flexDirection: column;
    position: center;
    backgroundColor: ${white};
    padding: 3px;
    borderRadius: 8px;
    marginTop: 10px;
    borderWidth: 2px; 
    borderColor: ${navy}; 
    borderStyle: solid; 
    ${Platform.OS === 'ios' ? `
    shadowColor: ${darkSage};
    shadowOpacity: 0.5;
    shadowOffset: 0px 2px;
    shadowRadius: 2px;
` : `
    elevation: 5;
`}
  `;
export const TextRow = styled.View`
    flexDirection: row;
    alignItems: center;
    justifyContent: space-between;
    marginLeft: 10px;
    marginTop: 5px;

    `
export const WhiteInputField = styled.TextInput`
    color: ${lightGrey};
    backgroundColor: ${white};
    borderRadius: 15px;
    fontSize: 15px;
    width: 65%;
    padding: 10px;
    `
export const DeleteLocationText = styled.Text`
    color: ${red};
    font-size: 15px;
    font-weight: bold;
    text-align: center;
    marginTop: 20px;
    `
export const PostContainer = styled.View`
    flexDirection: column;
    position: center;
    backgroundColor: ${lightSage};
    padding:5px;
    borderRadius: 3px;
    marginTop: 10px;
    ${Platform.OS === 'ios' ? `
    shadowColor: ${darkSage};
    shadowOpacity: 0.5;
    shadowOffset: 0px 2px;
    shadowRadius: 2px;
` : `
    elevation: 5;
`}
  `
export const PostTitle = styled.Text`
    font-size: 20px;
    margin-bottom: 5px;
    margin-left: 10px;
    margin-top: 13px;
    letter-spacing: 1px;
    font-weight: bold;
    color: ${white};
    text-align: left;
    `
export const PostDestination = styled.Text`
    font-size: 19px;
    margin-bottom: 5px;
    letter-spacing: 1px;
    font-weight: bold;
    color: ${darkSage};
    text-align: left;
    margin-right: 10px;
    `
export const PostTime = styled.Text`
    font-size: 10px;
    color: ${lightBlue};
    `
export const PostUser = styled.Text`
    font-size: 13px;
    font-weight: bold;
    color: ${lightBlue};
    padding-bottom: 5px;
    `
export const PostDay = styled.Text`
    font-size: 28px;
    font-weight: bold;
    color: ${lightBlue};
    `
export const PostLocation = styled.Text`
    font-size: 25px;
    font-weight: bold;
    margin-bottom: 5px;
    color: ${navy};
    `
export const LocationTitle = styled.Text`
    font-size: 15px;
    margin-bottom: 1px;
    margin-left: 15px;
    letter-spacing: 1px;
    font-weight: 600;
    color: ${lightBlue};
    text-align: left;
    `
export const LocationDetails = styled.Text`
    font-size: 13px;
    margin-bottom: 1px;
    margin-left: 3px;
    letter-spacing: 1px;
    font-weight: 400;
    color: ${darkSage};
    text-align: left;
    `
export const PostLocationContainer = styled.View`
    borderWidth: 1px;
    borderRadius: 9px;
    padding: 4px;
    borderColor: ${sage};
    backgroundColor: ${white};
    marginBottom: 10px;
    margin: 5px;
    ${Platform.OS === 'ios' ? `
    shadowColor: ${darkSage};
    shadowOpacity: 0.5px;
    shadowOffset: 0px 2px;
    shadowRadius: 2px;
    shadowOpacity: 0.25;
` : `
    elevation: 5;
`}
      `
export const MessageText = styled.Text`
    font-size: 18px;
    font-weight: bold;
    color: ${navy};
    text-align: center;
    padding: 50px;
    `

