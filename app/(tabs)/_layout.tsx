import Header from '@/components/Layout/Header';
import { useAppContext } from '@/context/AppContext';
import { getTomatoImage } from '@/utils/level';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Image, View } from 'react-native';

export default function TabsLayout() {
  const { levelInfo } = useAppContext();

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#ff6347',
          tabBarInactiveTintColor: '#aaa',
          tabBarStyle: {
            backgroundColor: 'white',
            borderTopColor: '#f0f0f0',
            borderTopWidth: 1,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '600',
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'ホーム',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="stats"
          options={{
            title: '統計',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? 'bar-chart' : 'bar-chart-outline'} size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="tomato"
          options={{
            title: 'トマト',
            tabBarIcon: ({ size, focused }) => (
              <Image
                source={getTomatoImage(levelInfo.level)}
                style={{ width: size, height: size, borderRadius: size / 2, opacity: focused ? 1 : 0.5 }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: '設定',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? 'settings' : 'settings-outline'} size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
