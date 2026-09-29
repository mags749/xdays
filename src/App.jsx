import React, {useEffect} from 'react';
import {NavigationContainer, DarkTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StatusBar} from 'expo-status-bar';
import {useFonts} from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import DashboardScreen from './screens/dashboard';
import DayScreen from './screens/day';
import {fontFiles} from './utils/fonts';
import './global.css';

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

const theme = {
  ...DarkTheme,
  colors: {...DarkTheme.colors, background: '#000000'},
};

const App = () => {
  const [fontsLoaded, fontError] = useFonts(fontFiles);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{flex: 1, backgroundColor: '#000000'}}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <NavigationContainer theme={theme}>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{headerShown: false}}>
            <Stack.Screen name="Home" component={DashboardScreen} />
            <Stack.Screen name="Day" component={DayScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
