import Feather from "@expo/vector-icons/build/Feather";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import Octicons from "@expo/vector-icons/build/Octicons";
import MaterialCommunityIcons from "@expo/vector-icons/build/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { colors } from "@/styles/colors";
import { TabBarButton } from "@/components/tabbar-button";

export default function TabLayout() {
  return (
    <View className='flex-1 bg-zinc-950'>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.lime[300],
          tabBarInactiveTintColor: colors.zinc[800],
          tabBarStyle: {
            backgroundColor: colors.zinc[950]
          }
        }}
        
      >
        <Tabs.Screen
          name="index"
          options={{
            headerShown: false,
            tabBarButton: (props) => (
              <TabBarButton
                {...props}
                activeTintColor={colors.lime[300]}
                inactiveTintColor={colors.zinc[800]}
                icon={({ color }) => (
                  <Ionicons size={24} name="trail-sign-outline" color={color} />
                )}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            headerShown: false,
            tabBarButton: (props) => (
              <TabBarButton
                {...props}
                activeTintColor={colors.lime[300]}
                inactiveTintColor={colors.zinc[800]}
                icon={({ color }) => (
                  <Ionicons size={24} name="person-circle" color={color} />
                )}
              />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
