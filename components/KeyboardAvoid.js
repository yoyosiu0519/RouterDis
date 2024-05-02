import React from "react";
import { KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, View, Platform } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Colors } from "./Styles";

const KeyboardAvoid = ({children}) => {
    return (
        <KeyboardAvoidingView 
            style={{ flex: 1, backgroundColor: Colors.cream }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
        >
            <KeyboardAwareScrollView>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View>{children}</View>
                </TouchableWithoutFeedback>
            </KeyboardAwareScrollView>
        </KeyboardAvoidingView>
    );
}

export default KeyboardAvoid;