import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Dimensions } from 'react-native';
import { Platform } from 'react-native';
let MapView, Marker;
if (Platform.OS === 'web') {
  // Mock MapView and Marker for web to avoid native module errors
  MapView = ({ children, style }) => {
    return <div style={{ ...style, backgroundColor: '#ddd', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>MapView not supported on web</div>;
  };
  Marker = () => null;
} else {
  const MapViewModule = require('react-native-maps');
  MapView = MapViewModule.MapView;
  Marker = MapViewModule.Marker;
}
import * as SMS from 'expo-sms';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from './AuthContext';
import { API_BASE_URL } from './config';

export default function DashboardScreen({ navigation }) {
  const { user, logout } = useAuth();
  const username = user ? user.name : 'User';
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [userStats, setUserStats] = useState({ totalUsers: 0, domainStats: {} });

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerRight}>
          <Text style={styles.headerUsername}>{username}</Text>
        </View>
      ),
    });
    // Fetch user stats
    fetchUserStats();
  }, [navigation, username]);

  const fetchUserStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user-stats`);
      const data = await response.json();
      setUserStats(data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
      // Mock data for POC
      setUserStats({ totalUsers: 5, domainStats: { 'gmail.com': 3, 'yahoo.com': 2 } });
    }
  };

  const handleEmergencyAlert = async () => {
    Alert.alert(
      'Emergency Alert',
      'Please help me',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send', onPress: async () => {
          const isAvailable = await SMS.isAvailableAsync();
          if (isAvailable) {
            await SMS.sendSMSAsync(['797890046'], 'Please help me');
          } else {
            Alert.alert('Notification not sent');
          }
        }},
      ]
    );
  };

  const handleHelpMe = async () => {
    Alert.alert(
      'Help Me',
      'Are you sure you want to send a help request?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send', onPress: async () => {
          const isAvailable = await SMS.isAvailableAsync();
          if (isAvailable) {
            await SMS.sendSMSAsync(['797890068'], 'Help me');
          } else {
            Alert.alert('Notification not sent');
          }
        }},
      ]
    );
  };

  const menuItems = [
    { name: 'Live Map', icon: 'map', active: true },
    { name: 'Alerts', icon: 'notifications', active: false },
    { name: 'Logistics', icon: 'car', active: false },
    { name: 'Settings', icon: 'settings', active: false },
  ];

  return (
    <View style={styles.container}>
      {/* Left Sidebar */}
      <View style={[styles.sidebar, { width: isLeftSidebarOpen ? 80 : 40 }]}>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
        >
          <Ionicons name={isLeftSidebarOpen ? 'chevron-back' : 'chevron-forward'} size={24} color="#fff" />
        </TouchableOpacity>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.menuItem, item.active && styles.activeMenuItem]}
            onPress={() => {
              if (!item.active) {
                Alert.alert('Coming Soon', `${item.name} feature is under development.`);
              }
            }}
          >
            <Ionicons name={item.icon} size={24} color={item.active ? '#fff' : '#ccc'} />
            {isLeftSidebarOpen && <Text style={styles.menuText}>{item.name}</Text>}
          </TouchableOpacity>
        ))}
      </View>

      {/* Main Content - Map */}
      <View style={styles.mainContent}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{ latitude: 37.78825, longitude: -122.4324 }}
            title="San Francisco"
            description="A beautiful city"
          />
        </MapView>
      </View>

      {/* Right Sidebar */}
      <View style={styles.rightSidebar}>
        <Text style={styles.sidebarTitle}>Live Data</Text>
        <View style={styles.statsContainer}>
          <Text style={styles.statText}>Total Users: {userStats.totalUsers}</Text>
          <Text style={styles.statText}>Domains:</Text>
          {Object.entries(userStats.domainStats).map(([domain, count]) => (
            <Text key={domain} style={styles.statText}>{domain}: {count}</Text>
          ))}
        </View>
        <Text style={styles.sidebarTitle}>Actionable Alerts</Text>
        <TouchableOpacity style={styles.alertButton} onPress={handleEmergencyAlert}>
          <Ionicons name="warning" size={20} color="#fff" />
          <Text style={styles.alertButtonText}>Emergency Alert</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.helpButton} onPress={handleHelpMe}>
          <Ionicons name="help-circle" size={20} color="#fff" />
          <Text style={styles.helpButtonText}>Help Me</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            logout();
            navigation.replace('Login');
          }}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
  },
  sidebar: {
    backgroundColor: '#333',
    paddingTop: 50,
    alignItems: 'center',
  },
  toggleButton: {
    marginBottom: 20,
    padding: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    width: '100%',
  },
  activeMenuItem: {
    backgroundColor: '#555',
  },
  menuText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 14,
  },
  mainContent: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  rightSidebar: {
    width: 200,
    backgroundColor: '#fff',
    padding: 10,
    borderLeftWidth: 1,
    borderLeftColor: '#ddd',
  },
  sidebarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statsContainer: {
    marginBottom: 20,
  },
  statText: {
    fontSize: 14,
    marginBottom: 5,
  },
  alertButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff4444',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  alertButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 14,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  helpButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 14,
  },
  logoutButton: {
    padding: 10,
    backgroundColor: '#dc3545',
    borderRadius: 5,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  headerRight: {
    marginRight: 15,
    padding: 10,
  },
  headerUsername: {
    color: '#000',
    fontSize: 16,
  },
});
