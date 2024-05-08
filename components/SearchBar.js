import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
    Colors,
    SearchContainer,
    IconContainer,
    SearchInputText,

} from "./../components/Styles";

const SearchBar = ({ searchTerm, setSearchTerm }) => {
    return (
        <SearchContainer>
            <IconContainer>
                <Ionicons name="search" size={24} color={Colors.gold} />
            </IconContainer>
            <SearchInputText
                placeholder="Search Destination"
                onChangeText={text => setSearchTerm(text)}
                value={searchTerm}
            />
        </SearchContainer>
    );
};

export default SearchBar;