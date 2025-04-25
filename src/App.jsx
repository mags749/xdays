import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import DashboardScreen from './screens/dashboard';
import DayScreen from './screens/day';
import "./global.css"

const Stack = createNativeStackNavigator();

const App = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        options={{headerShown: false}}
        component={DashboardScreen}
      />
      <Stack.Screen
        name="Day"
        options={{headerShown: false}}
        component={DayScreen}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;
