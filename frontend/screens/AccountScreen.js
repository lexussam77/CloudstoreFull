import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SectionList, Alert, SafeAreaView, ScrollView, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Feather from 'react-native-vector-icons/Feather';
import { AuthContext } from './AuthContext';
import LogoutSVG from '../assets/images/undraw_log-out_2vod.svg';

const user = {
  name: 'lazarus sam',
  email: 'akombea77@gmail.com',
  plan: 'Dropbox Basic',
  storage: '4.0 MB / 2.0 GB',
};
const securityOptions = [
  { icon: 'lock', label: 'Change password' },
  { icon: 'shield', label: 'Two-factor authentication' },
];
const connectedApps = [
  { icon: 'slack', label: 'Slack' },
  { icon: 'github', label: 'GitHub' },
];
const recentLogins = [
  { icon: 'monitor', label: 'Windows 10 · 2 hours ago' },
  { icon: 'smartphone', label: 'iPhone 13 · 1 day ago' },
];

const sections = [
  { title: 'Security', data: securityOptions.length ? securityOptions : [{}], key: 'security' },
  { title: 'Connected apps', data: connectedApps.length ? connectedApps : [{}], key: 'apps' },
  { title: 'Recent logins', data: recentLogins.length ? recentLogins : [{}], key: 'logins' },
  { title: 'Keep work moving', data: [{}], key: 'keepwork' },
];

export default function AccountScreen({ navigation }) {
  const { logout } = useContext(AuthContext);
  const [avatarUri, setAvatarUri] = useState('https://randomuser.me/api/portraits/men/32.jpg');

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets[0]?.uri) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCardSmallPadding}>
          <View style={styles.topRowSmallPadding}>
              <View style={styles.avatarWrap}>
              <TouchableOpacity onPress={pickImage} activeOpacity={0.8} style={styles.avatarCircleImgWrap}>
                <Image source={{ uri: avatarUri }} style={styles.avatarCircleImg} />
                <View style={styles.editAvatarOverlay}>
                  <Feather name="edit-3" size={16} color="#fff" />
                </View>
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.email}>{user.email}</Text>
              </View>
              <TouchableOpacity style={styles.settingsIconWrap} onPress={() => navigation.navigate('Settings')} activeOpacity={0.7}>
                <Feather name="settings" size={26} color="#888" />
              </TouchableOpacity>
            </View>
          <View style={styles.accountInfoSectionSmallPadding}>
            <Text style={styles.accountCaption}>Welcome to your CloudStore profile</Text>
            <Text style={styles.accountDescription}>Manage your account, upgrade your plan, and keep your files safe and accessible from anywhere.</Text>
          </View>
        </View>
        <View style={styles.singleCard}>
          <Text style={styles.cardTitle}>Your Plan</Text>
          <View style={styles.planCardRow}>
                  <Feather name="award" size={22} color="#0061FF" style={styles.planIcon} />
            <Text style={styles.planBadge}>{user.plan}</Text>
                </View>
              </View>
        <View style={styles.singleCard}>
          <Text style={styles.cardTitle}>Your Storage</Text>
          <View style={styles.storageBarBg}>
            <View style={[styles.storageBarFill, { width: '0.2%' }]} />
                </View>
          <Text style={styles.storageValueText}>{user.storage}</Text>
          <TouchableOpacity style={styles.upgradeBtnWide} activeOpacity={0.85} onPress={() => navigation.navigate('ManagePlan')}>
                  <Text style={styles.upgradeBtnText}>Upgrade</Text>
                </TouchableOpacity>
              </View>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Security</Text>
          {securityOptions.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.sectionRow}
              activeOpacity={0.85}
              onPress={() => {
                if (item.label === 'Change password') navigation.navigate('ChangePassword');
                if (item.label === 'Two-factor authentication') navigation.navigate('TwoFactor');
              }}
            >
              <Feather name={item.icon} size={20} color="#0061FF" style={styles.sectionIcon} />
              <Text style={styles.sectionLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Connected apps</Text>
          {connectedApps.map((item, idx) => {
            let iconColor = '#888';
            if (item.label.toLowerCase().includes('github')) iconColor = '#181717';
            if (item.label.toLowerCase().includes('slack')) iconColor = '#611f69';
            return (
              <View key={idx} style={styles.sectionRow}>
                <Feather name={item.icon} size={20} color={iconColor} style={styles.sectionIcon} />
                <Text style={styles.sectionLabel}>{item.label}</Text>
              </View>
            );
          })}
        </View>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Recent logins</Text>
          {recentLogins.map((item, idx) => (
            <View key={idx} style={styles.sectionRow}>
              <Feather name={item.icon} size={20} color="#888" style={styles.sectionIcon} />
              <Text style={styles.sectionLabel}>{item.label}</Text>
            </View>
          ))}
              </View>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Keep work moving</Text>
          <View style={styles.sectionRow}>
            <Feather name="help-circle" size={20} color="#0061FF" style={styles.sectionIcon} />
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionLabel}>Try more ways to keep your files safe, secure, and easily accessible from your devices.</Text>
            </View>
          </View>
        </View>
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={async () => {
          await logout();
            navigation.getParent()?.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
        }}
        activeOpacity={0.85}
      >
          <LogoutSVG width={32} height={32} style={{ marginRight: 8 }} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  illustrationWrap: {
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  avatarWrap: {
    position: 'relative',
    marginRight: 16,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0061FF',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  editAvatar: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 2,
    shadowColor: '#0061FF',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0061FF',
    fontFamily: 'System',
  },
  email: {
    fontSize: 15,
    color: '#888',
    fontWeight: '400',
    fontFamily: 'System',
  },
  settingsIconWrap: {
    marginLeft: 10,
    padding: 6,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  planBox: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginRight: 8,
    flex: 1,
    shadowColor: '#0061FF',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    alignItems: 'center',
  },
  planIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  planIcon: {
    marginRight: 8,
  },
  planBadge: {
    backgroundColor: '#f6f8fc',
    color: '#0061FF',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontWeight: 'bold',
    fontSize: 13,
    marginLeft: 2,
  },
  planLabel: {
    fontSize: 13,
    color: '#aaa',
    fontWeight: '400',
    fontFamily: 'System',
  },
  planName: {
    fontSize: 16,
    color: '#222',
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  storageBox: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginLeft: 8,
    flex: 1,
    shadowColor: '#0061FF',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    alignItems: 'center',
  },
  storageCircleWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  storageCircleBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f6f8fc',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  storageCircleFg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#0061FF',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  storageCircleText: {
    fontSize: 13,
    color: '#0061FF',
    fontWeight: 'bold',
    fontFamily: 'System',
    textAlign: 'center',
    marginTop: 14,
  },
  storageLabel: {
    fontSize: 13,
    color: '#aaa',
    fontWeight: '400',
    fontFamily: 'System',
  },
  storageValue: {
    fontSize: 16,
    color: '#222',
    fontWeight: 'bold',
    fontFamily: 'System',
    marginBottom: 8,
  },
  upgradeBtn: {
    backgroundColor: '#0061FF',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginTop: 6,
    alignItems: 'center',
    shadowColor: '#0061FF',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  upgradeBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    fontFamily: 'System',
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    marginHorizontal: 16,
    marginBottom: 18,
    padding: 20,
    shadowColor: '#003366',
    shadowOpacity: 0.22,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'System',
    color: '#222',
    marginBottom: 8,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    marginBottom: 10,
    padding: 12,
    shadowColor: '#003366',
    shadowOpacity: 0.22,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  sectionIcon: {
    marginRight: 10,
  },
  sectionLabel: {
    fontSize: 16,
    color: '#222',
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#0061FF',
    borderRadius: 16,
    paddingVertical: 16,
    shadowColor: '#003366',
    shadowOpacity: 0.22,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    fontFamily: 'System',
  },
  scrollContent: {
    paddingBottom: 60,
    paddingTop: 10,
  },
  bannerImage: {
    width: '100%',
    height: 110,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    marginBottom: 0,
  },
  avatarCircleImg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#003366',
    shadowOpacity: 0.22,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  accountInfoSection: {
    alignItems: 'center',
    marginBottom: 18,
    marginTop: -8,
    paddingHorizontal: 18,
  },
  accountCaption: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0061FF',
    marginBottom: 6,
    textAlign: 'center',
  },
  accountDescription: {
    fontSize: 15,
    color: '#444',
    textAlign: 'center',
    marginBottom: 2,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginHorizontal: 16,
    marginBottom: 18,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#003366',
    shadowOpacity: 0.22,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  avatarCircleImgWrap: {
    position: 'relative',
    marginRight: 16,
  },
  editAvatarOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0061FF',
    borderRadius: 12,
    padding: 2,
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 2,
  },
  groupCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginHorizontal: 16,
    marginBottom: 18,
    padding: 18,
    shadowColor: '#003366',
    shadowOpacity: 0.22,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  groupTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0061FF',
    marginBottom: 10,
    marginLeft: 2,
  },
  largePhotoIllustration: {
    width: '100%',
    height: 180,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    marginBottom: 0,
  },
  profileCardSmallPadding: {
    backgroundColor: '#fff',
    borderRadius: 24,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 10,
    padding: 14,
    shadowColor: '#003366',
    shadowOpacity: 0.22,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  topRowSmallPadding: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginBottom: 14,
  },
  accountInfoSectionSmallPadding: {
    marginTop: 2,
    marginBottom: 2,
    paddingHorizontal: 2,
  },
  singleCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 18,
    shadowColor: '#003366',
    shadowOpacity: 0.22,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0061FF',
    marginBottom: 8,
  },
  planCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storageBarBg: {
    width: '100%',
    height: 10,
    backgroundColor: '#f0f4fa',
    borderRadius: 6,
    marginBottom: 8,
    marginTop: 2,
    overflow: 'hidden',
  },
  storageBarFill: {
    height: 10,
    backgroundColor: '#0061FF',
    borderRadius: 6,
  },
  storageValueText: {
    fontSize: 15,
    color: '#222',
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 2,
  },
  upgradeBtnWide: {
    backgroundColor: '#0061FF',
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 4,
  },
}); 