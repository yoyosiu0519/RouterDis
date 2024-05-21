import { StyleSheet} from 'react-native';
import NavigationStack from './navigation/NavigationStack';
import { UserContext } from './UserContext';


export default function App() {
  return (
    <UserContext>
      <NavigationStack />
    </UserContext>

  );
}
