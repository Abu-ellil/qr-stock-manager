import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "الكل",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name="home"
              style={{
                color: focused ? "#1199dd" : "#687076",
                fontSize: 28,
                marginBottom: -3,
              }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="AddProduct"
        options={{
          title: "اضافة",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="add-circle-outline"
              style={{
                color: focused ? "#1199dd" : "#687076",
                fontSize: 28,
                marginBottom: -3,
              }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
