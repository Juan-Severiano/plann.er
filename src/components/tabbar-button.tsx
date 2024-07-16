import {
  AccessibilityState,
  GestureResponderEvent,
  Pressable,
} from "react-native";
import React from "react"

interface TabBarButtonProps {
  icon: React.FC<{ color: string }>;
  onPress?: (e: GestureResponderEvent) => void;
  accessibilityState?: AccessibilityState;
  activeTintColor: string;
  inactiveTintColor: string;
}

export function TabBarButton({
  icon,
  onPress,
  accessibilityState,
  activeTintColor,
  inactiveTintColor,
}: TabBarButtonProps) {
  const focused = accessibilityState?.selected;
  const color = focused ? activeTintColor : inactiveTintColor;

  return (
    <Pressable
      onPress={(e) => {
        onPress?.(e);
      }}
      className="flex-1 items-center justify-center"
    >
      {icon({ color })}
    </Pressable>
  );
}
