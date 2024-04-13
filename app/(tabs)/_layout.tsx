import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs, router, useNavigation } from 'expo-router';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={22} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  const handleTabPress = (screenName : string) => {
    if (screenName === 'viewQR') {
      console.log("presiono la tab de ", screenName)
      navigation.navigate('viewQR')
    } else if(screenName === 'list') {
      console.log("presiono la tab de ", screenName)
      navigation.navigate('list')
    }
  };
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarStyle: { 
          backgroundColor: '#0078b7', 
          height: 75,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 5,
        },
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={"#faffff"} />,
          tabBarLabelStyle: { color: '#faffff' },
        }}
      />
      <Tabs.Screen
        name="viewQR"
        options={{
          title: 'Ver QR',
          tabBarIcon: ({ color }) => <TabBarIcon name="smile-o" color={"#faffff"} />,
          tabBarLabelStyle: { color: '#faffff' },
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            handleTabPress('viewQR');
          },
        }}
      />
      <Tabs.Screen
        name="list"
        options={{
          title: 'Lista de padres',
          tabBarIcon: ({ color }) => <TabBarIcon name="list-alt" color={"#faffff"} />,
          tabBarLabelStyle: { color: '#faffff' },
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            handleTabPress('list');
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <TabBarIcon name="user-circle-o" color={"#faffff"} />,
          tabBarLabelStyle: { color: '#faffff' },
        }}
      />
    </Tabs>
  );
}
