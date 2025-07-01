import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import HomeScreen from './HomeScreen';
import FilesScreen from './FilesScreen';
import PhotosScreen from './PhotosScreen';
import AccountScreen from './AccountScreen';
import Feather from 'react-native-vector-icons/Feather';

const TABS = [
  { key: 'Home', label: 'Home', icon: 'home' },
  { key: 'Files', label: 'Files', icon: 'file' },
  { key: 'Photos', label: 'Photos', icon: 'image' },
  { key: 'Account', label: 'Account', icon: 'user' },
];

export default function BottomTabNavigation({ navigation }) {
  const [activeTab, setActiveTab] = useState('Home');

  let ScreenComponent;
  switch (activeTab) {
    case 'Files':
      ScreenComponent = FilesScreen;
      break;
    case 'Photos':
      ScreenComponent = PhotosScreen;
      break;
    case 'Account':
      ScreenComponent = (props) => <AccountScreen {...props} navigation={navigation} />;
      break;
    case 'Home':
    default:
      ScreenComponent = HomeScreen;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Main Screen Content */}
      <View style={styles.content}>
        {/* Top Bar with Title and Bell */}
        <View style={styles.topBar}>
          <Text style={styles.topBarTitle}>{activeTab}</Text>
          {/* Bell icon for notifications, only on Home tab */}
          {activeTab === 'Home' && (
            <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={styles.bellButton}>
              <Feather name="bell" size={24} color="#0061FF" style={styles.bellIcon} />
            </TouchableOpacity>
          )}
        </View>
        <ScreenComponent />
      </View>
      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={styles.tabButton}
            onPress={() => setActiveTab(tab.key)}
          >
            <Feather
              name={tab.icon}
              size={24}
              color={activeTab === tab.key ? '#0061FF' : '#888'}
              style={activeTab === tab.key ? styles.activeTabIcon : styles.tabIcon}
            />
            <Text style={[styles.tabLabel, activeTab === tab.key && styles.activeTabLabel, activeTab !== tab.key && { color: '#888' }]}> 
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    top: 15,
  },
  topBarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'System',
    flex: 1,
    textAlign: 'center',
  },
  bellButton: {
    marginLeft: 'auto',
    marginRight: 10,
    padding: 6,
  },
  bellIcon: {
    marginLeft: 2,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    height: 64,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
    paddingBottom: 4,
    paddingTop: 4,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  tabIcon: {
    marginBottom: 2,
  },
  activeTabIcon: {
    marginBottom: 2,
  },
  tabLabel: {
    color: '#222',
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'System',
    marginTop: 4,
    textAlign: 'center',
  },
  activeTabLabel: {
    color: '#0061FF',
  },
});