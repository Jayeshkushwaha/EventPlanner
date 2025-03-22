import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import RegistrationScreen from '../screens/RegistrationScreen';
import EventListScreen from '../screens/EventListScreen';
import CreateEventScreen from '../screens/CreateEventScreen';
import EventDetailScreen from '../screens/EventDetailScreen';

export type RootStackParamList = {
  Registration: undefined;
  EventList: undefined;
  CreateEvent?: { eventId?: string };
  EventDetail: { eventId: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Registration"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Registration" component={RegistrationScreen} />
        <Stack.Screen name="EventList" component={EventListScreen} />
        <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
        <Stack.Screen name="EventDetail" component={EventDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;