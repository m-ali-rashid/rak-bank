import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from './src/Home';

const menu = [
  {
    title: 'Products',
    img: require('./src/assets/Products.png'),
    Comp: () => <Home />,
  },
  {
    title: 'Live Chat',
    img: require('./src/assets/LiveChat.png'),
    Comp: () => <Home />,
  },
  {
    title: 'RAK Token',
    img: require('./src/assets/RAKToken.png'),
    Comp: () => <Home />,
  },
  {
    title: 'Locate Us',
    img: require('./src/assets/LocateUs.png'),
    Comp: () => <Home />,
  },
];

export default function HomeNavigator() {
  const Tab: any = createBottomTabNavigator();
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={() => ({
          headerShown: false,
          tabBarStyle: {
            borderTopColor: '#dcdcdc',
            borderTopWidth: 3,
            height: 100,
            paddingBottom: 30,
          },
          tabBarActiveTintColor: '#ae2c2a',
          tabBarInactiveTintColor: '#3a393a',
        })}>
        {menu.map((scr, ind) => (
          <Tab.Screen
            key={ind}
            name={scr.title}
            options={{
              tabBarIcon: () => (
                <Image source={scr.img} style={{width: 30, height: 30}} />
              ),
            }}
            component={scr.Comp}
          />
        ))}
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
