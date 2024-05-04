import { StyleSheet, Text, View, SafeAreaView, ScrollView, Pressable, Platform } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import Accordion from 'react-native-collapsible/Accordion';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL_ANDROID, API_URL_IOS } from '../config';
import { jwtDecode } from 'jwt-decode';
import 'core-js/stable/atob';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { UserType } from '../UserContext';
import {
    Colors,
    LocationTextRow,
    PostUser,
    PostTime,
    PostDestination,
    PostLocationContainer,
    PostDay,
    PostLocation,
    LocationTitle,
    LocationDetails,

} from "./../components/Styles";

const RenderPost = ({ post, savedPosts, savePost, userID }) => {
    const [activeSections, setActiveSections] = useState([]);

    const toggleSection = () => {
        setActiveSections(activeSections.includes(0) ? [] : [0]);
    };

    const getHoursSince = (dateString) => {
        const postDate = new Date(dateString);
        const currentDate = new Date();
        const differenceInMilliseconds = currentDate - postDate;
        const differenceInHours = Math.floor(differenceInMilliseconds / 1000 / 60 / 60);
        return differenceInHours;
    };

    const renderLocations = (locations) => {
        // Group locations by day
        const locationsByDay = locations.reduce((groups, location) => {
            const day = location.day;
            if (!groups[day]) {
                groups[day] = [];
            }
            groups[day].push(location);
            return groups;
        }, {});

        return (
            <View style={{ padding: 10 }}>
                {/* post content */}
                {Object.keys(locationsByDay).map(day => (
                    <View key={day} style={{ marginBottom: 20 }}>
                        <PostDay>Day: {day}</PostDay>
                        {locationsByDay[day].map((location, index) => {
                            return (
                                <View key={index} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 }}>
                                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                    <Entypo name="location-pin" size={54} color={Colors.sage} /> 
                                        <Entypo name="dot-single" size={24} color="black" />

                                    </View>
                                    <View style={{ marginLeft: 10, marginBottom: 20, flexShrink: 1 }}>
                                        {/* each location details */}
                                        <PostLocation> {location.name}</PostLocation>
                                        <LocationTitle>From: <LocationDetails>{location.from}</LocationDetails></LocationTitle>
                                        <LocationTitle style={{ marginBottom: 5 }}>To: <LocationDetails>{location.to}</LocationDetails></LocationTitle>
                                        {location.description &&
                                            <>
                                                <LocationTextRow>
                                                    <LocationTitle>Description:</LocationTitle>
                                                </LocationTextRow>
                                                <LocationTextRow style={{ marginLeft: 15, marginBottom: 5 }}>
                                                    <LocationDetails >{location.description}</LocationDetails>
                                                </LocationTextRow>
                                            </>
                                        }
                                        {location.transport &&
                                            <LocationTitle>Transport: <LocationDetails>{location.transport}</LocationDetails></LocationTitle>
                                        }
                                        {location.duration &&
                                            <LocationTitle>Duration: <LocationDetails>{location.duration}</LocationDetails></LocationTitle>
                                        }
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                ))}
            </View>
        );
    };

    return (
        <PostLocationContainer>
            <Accordion
                activeSections={activeSections}
                sections={[post]}
                onChange={toggleSection}
                touchableProps={{ underlayColor: 'transparent' }}

                renderHeader={post => (
                    <View>
                      <LocationTextRow>
                      <PostDestination>{post.destination}</PostDestination>
                            {activeSections.includes(0) ? (
                                <Ionicons name="caret-up" size={24} color={Colors.navy} />
                            ) : (
                                <Ionicons name="caret-down" size={24} color={Colors.navy} />
                            )}
                      </LocationTextRow>
                      <LocationTextRow>
                        <PostUser>{post.user.firstname} {post.user.surname}</PostUser>
                        <PostTime>{getHoursSince(post.createdAt)} hours ago</PostTime>
                      </LocationTextRow>
                    </View>
                  )}
                  
                  renderContent={post => (
                    <Pressable activeOpacity={1} onPress={toggleSection}>
                      {renderLocations(post.locations)}
                  
                      {post.user._id !== userID && (
                        <Ionicons
                          name={savedPosts[post._id] ? "bookmark" : "bookmark-outline"}
                          size={24}
                          color={Colors.red}
                          onPress={() => savePost(post._id, userID)}
                        />
                      )}
                    </Pressable>
                  )}
            />
        </PostLocationContainer>
    );
};

export default RenderPost;