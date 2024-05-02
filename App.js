import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import NavigationStack from './navigation/NavigationStack';
import { UserContext } from './UserContext';


export default function App() {
  return (
    <UserContext>
      <NavigationStack />
    </UserContext>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
