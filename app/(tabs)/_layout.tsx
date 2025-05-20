import { Tabs, usePathname, router } from 'expo-router';
import React, { useState } from 'react';
import { Platform, Text, View, TouchableOpacity, Alert, Modal } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { logOut } from '@/db/firebase';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  const [menuVisible, setMenuVisible] = useState(false);
  
  const handleLogout = () => {
    setMenuVisible(false);
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: async () => {
            const result = await logOut();
            router.replace('/');
          },
          style: "destructive"
        }
      ]
    );
  };
  
  const MenuIcon = () => (
    <TouchableOpacity
      onPress={() => setMenuVisible(true)}
      style={{ marginRight: 15 }}
    >
      <Text style={{ color: '#FFFFFF', fontSize: 30, fontWeight: 'bold' }}>⋮</Text>
    </TouchableOpacity>
  );
  
  const MenuModal = () => (
    <Modal
      transparent={true}
      visible={menuVisible}
      onRequestClose={() => setMenuVisible(false)}
    >
      <TouchableOpacity 
        style={{ flex: 1 }} 
        activeOpacity={1} 
        onPress={() => setMenuVisible(false)}
      >
        <View style={{ 
          position: 'absolute', 
          right: 10, 
          top: 50, 
          backgroundColor: 'white', 
          borderRadius: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}>
          <TouchableOpacity 
            onPress={handleLogout}
            style={{ 
              padding: 15, 
              borderBottomWidth: 1, 
              borderBottomColor: '#eee' 
            }}
          >
            <Text>Logout</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
  
  return (
    <>
      <MenuModal />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              position: 'absolute',
            },
            default: {},
          }),
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarActiveTintColor: '#1E6091',
            headerShown: true,
            headerTitle: 'FireBot Guardian',  
            headerStyle : {
              backgroundColor: '#1E6091',
              borderColor: '#1E6091',
            },
            headerTitleStyle : {
              color: '#FFFFFF',
              fontWeight: 'bold',
            },
            headerRight: MenuIcon,
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="house.fill" color={pathname == "/" ? `#1E6091` : color} />
            ),
          }}
        />
        <Tabs.Screen
          name="online"
          options={{
            headerShown: true,
            headerTitle: 'Live Camera',
            headerStyle : {
              backgroundColor: '#1E6091',
              borderColor: '#1E6091',
            },
            headerTitleStyle : {
              color: '#FFFFFF',
              fontWeight: 'bold',
            },
            headerRight: MenuIcon,
            tabBarActiveTintColor: '#1E6091',
            title: 'Online',
            tabBarIcon: ({ color }) => (<IconSymbol size={28} name="online-prediction.fill" color={pathname == "/online" ? `#1E6091` : color} />),
          }}
        />
        
        <Tabs.Screen
          name="historic"
          options={{
            headerShown:true,
            headerStyle : {
              backgroundColor: '#1E6091',
              borderColor: '#1E6091',
            },
            headerTitleStyle : {
              color: '#FFFFFF',
              fontWeight: 'bold',
            },
            headerTitle: 'Alert history',
            headerRight: MenuIcon,
            tabBarActiveTintColor: '#1E6091',
            title: 'Historic',
            tabBarIcon: ({ color }) => (<IconSymbol size={28} name="history.fill" color={pathname == "/historic" ? `#1E6091` : color} />),
          }}
        />
      </Tabs>
    </>
  );
}
