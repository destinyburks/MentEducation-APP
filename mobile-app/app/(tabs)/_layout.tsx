import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme';

const icon = (name: keyof typeof Ionicons.glyphMap) => ({ color, size }: { color: string; size: number }) => (
  <Ionicons name={name} size={size} color={color} />
);

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.purple,
        tabBarInactiveTintColor: '#7A8195',
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600', paddingBottom: 4 },
        tabBarStyle: { height: 74, paddingTop: 8, borderTopColor: colors.line, backgroundColor: colors.white },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: icon('home-outline') }} />
      <Tabs.Screen name="discover" options={{ title: 'Discover', tabBarIcon: icon('search-outline') }} />
      <Tabs.Screen name="sessions" options={{ title: 'Sessions', tabBarIcon: icon('calendar-outline') }} />
      <Tabs.Screen name="messages" options={{ title: 'Messages', tabBarIcon: icon('chatbubble-ellipses-outline') }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: icon('person-outline') }} />
    </Tabs>
  );
}
