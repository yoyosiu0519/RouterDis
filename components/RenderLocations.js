import React from 'react';
import { View } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import {
    Colors,
    PostDay,
    PostLocation,
    LocationTitle,
    LocationDetails,
    TextRow
} from "./../components/Styles";

const RenderLocations = ({ locations }) => {
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
                                    {[...Array(Object.keys(location).length - 1)].map((_, dotIndex) => (
                                        <Entypo key={dotIndex} name="dot-single" size={24} color="black" />
                                    ))}
                                </View>
                                <View style={{ marginLeft: 10, marginBottom: 20, flexShrink: 1 }}>
                                    {/* each location details */}
                                    <PostLocation> {location.name}</PostLocation>
                                    <LocationTitle>From: <LocationDetails>{location.from}</LocationDetails></LocationTitle>
                                    <LocationTitle style={{ marginBottom: 5 }}>To: <LocationDetails>{location.to}</LocationDetails></LocationTitle>
                                    {location.description &&
                                        <>
                                            <TextRow>
                                                <LocationTitle>Description:</LocationTitle>
                                            </TextRow>
                                            <TextRow style={{ marginLeft: 15, marginBottom: 5 }}>
                                                <LocationDetails >{location.description}</LocationDetails>
                                            </TextRow>
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

export default RenderLocations;