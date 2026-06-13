import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import {RootStackParamList} from '../types';
import {Colors} from '../theme/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: {backgroundColor: Colors.background},
      animation: 'slide_from_right',
      animationDuration: 300,
    }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen
      name="Details"
      component={DetailsScreen}
      options={{animation: 'slide_from_right'}}
    />
  </Stack.Navigator>
);

export default AppNavigator;
