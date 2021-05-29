import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import MainScreen from './src/Components/MainScreen/MainScreen';
import {createStackNavigator} from '@react-navigation/stack';

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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
