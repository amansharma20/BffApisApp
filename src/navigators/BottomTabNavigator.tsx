/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/home/HomeScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import Icons from '../assets/constants/Icons';
import CollectionsScreen from '@/screens/collection/CollectionsScreen';
import { theme } from '@/atoms';
import { BottomTabIcon } from '@/components/bottomTabIcon/BottomTabIcon';
import { useIsUserLoggedIn } from '@/hooks/useIsUserLoggedIn';
import LoginScreen from '@/screens/auth/LoginScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const { isUserLoggedIn } = useIsUserLoggedIn();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.lightBlack,
        tabBarActiveBackgroundColor: theme.backgroundColor,
        tabBarInactiveBackgroundColor: theme.backgroundColor,
        tabBarStyle: {
          // height: 49, // default
          // height: 42,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color }) => {
            return (
              <BottomTabIcon
                source={Icons.homeIcon}
                focused={focused}
                color={color}
              />
            );
          },
        }}
      />
      {/* <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <BottomTabIcon
              source={Icons.cartIcon}
              focused={focused}
              color={color}
            />
          ),
        }}
      /> */}
      <Tab.Screen
        name="Collections"
        component={CollectionsScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <BottomTabIcon
              source={Icons.collectionsIcon}
              focused={focused}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={isUserLoggedIn ? ProfileScreen : LoginScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <BottomTabIcon
              source={Icons.profileIcon}
              focused={focused}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
