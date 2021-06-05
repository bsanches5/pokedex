import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import MainScreen from './src/components/MainScreen/MainScreen';
import CharacterScreen from './src/components/CharacterScreen/CharacterScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen
          name="Main"
          component={MainScreen}
          options={{headerTitle: false, headerTransparent: true}}
        />
        <Stack.Screen
          name="Character"
          component={CharacterScreen}
          options={{headerTitle: false, headerTransparent: true, headerLeft: null}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
