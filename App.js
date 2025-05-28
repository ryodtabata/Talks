import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './components/LoginScreen';
import HomeScreen from './components/HomeScreen';
import SignUpScreen from './components/SignUpScreen';
import ProfileScreen from './components/ProfileScreen'
import GroupsScreen from './components/GroupsScreen'



const Stack = createStackNavigator();

export default function App() {
  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Profile">
        <Stack.Screen options= {{headerShown: false}} name="Profile" component={ProfileScreen} />
        <Stack.Screen options= {{headerShown: false}} name="Login" component={LoginScreen} />
        <Stack.Screen options= {{headerShown: false}} name="Home" component={HomeScreen} />
        <Stack.Screen options= {{headerShown: false}} name="GroupsScreen" component={GroupsScreen} />

        <Stack.Screen name="Signup" component={SignUpScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )

}

