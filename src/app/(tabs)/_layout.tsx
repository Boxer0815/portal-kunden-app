import { Tabs } from 'expo-router';
import { Text, useColorScheme } from 'react-native';
import { colors } from '../../utils/theme';

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return <Text style={{ fontSize: focused ? 24 : 20, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>;
}

export default function TabsLayout() {
  const dunkel = useColorScheme() === 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor:   colors.primary,
        tabBarInactiveTintColor: dunkel ? '#888' : '#999',
        tabBarStyle: {
          backgroundColor: dunkel ? colors.dark.surface  : colors.background,
          borderTopColor:  dunkel ? colors.dark.border   : colors.border,
        },
        headerStyle: {
          backgroundColor: dunkel ? colors.dark.surface  : colors.background,
        },
        headerTintColor:     dunkel ? colors.dark.text   : colors.text,
        headerTitleStyle:    { fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Übersicht',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="vertraege"
        options={{
          title: 'Verträge',
          tabBarIcon: ({ focused }) => <TabIcon emoji="📄" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="rechnungen"
        options={{
          title: 'Rechnungen',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🧾" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
