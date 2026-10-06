import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import TodosScreen from './screens/TodosScreen';
import { store } from './store';

export type RootStackParamList = {
  Todos: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    // Provider — найвищий компонент: стор доступний усьому дереву, включно з навігацією
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <Stack.Navigator>
            <Stack.Screen
              name="Todos"
              component={TodosScreen}
              options={{ title: 'Todos · Redux Toolkit' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}
