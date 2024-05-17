import NavigationContainer from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import MovieDetailScreen from '../screens/MovieDetailScreen';

const Stack = createStackNavigator();
export default function AppNavigation() {
    return (
        <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="MovieDetail" component={MovieDetailScreen} />
        </Stack.Navigator>
        </NavigationContainer>
    );
    }   