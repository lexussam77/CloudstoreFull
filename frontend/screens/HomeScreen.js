import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SectionList, Alert, SafeAreaView, ScrollView, Image } from 'react-native';
import { searchFiles } from './api';

const user = { name: 'Lazarus' }; // Replace with actual user context if available

export default function HomeScreen() {
  const [folders, setFolders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  const featureImages = [
    { uri: 'https://img.icons8.com/color/96/upload-to-cloud.png', label: 'Upload files', tagline: 'Add files to your cloud in seconds.' },
    { uri: 'https://img.icons8.com/color/96/share.png', label: 'Share with friends', tagline: 'Send files securely to anyone.' },
    { uri: 'https://img.icons8.com/color/96/cloud.png', label: 'Access anywhere', tagline: 'Your files, always with you.' },
    { uri: 'https://img.icons8.com/color/96/star.png', label: 'Favorite files', tagline: 'Keep important files at your fingertips.' },
  ];
  const recentFiles = [
    { id: '1', name: 'Document.pdf', modified: '1 week ago', thumb: 'https://img.icons8.com/color/96/pdf.png' },
    { id: '2', name: 'Document.docx', modified: '1 week ago', thumb: 'https://img.icons8.com/color/96/ms-word.png' },
  ];
  const recentActivity = [
    { icon: 'edit-3', text: 'You edited Document.docx' },
    { icon: 'user-plus', text: 'You shared a folder with Jane' },
  ];

  const sections = [
    {
      title: 'Suggested for you',
      data: [],
      key: 'suggested',
    },
    {
      title: 'Folders',
      data: folders.length ? folders : [{}],
      key: 'folders',
    },
    {
      title: 'Recent Files',
      data: recentFiles.length ? recentFiles : [{}],
      key: 'files',
    },
    {
      title: 'Recent activity',
      data: recentActivity.length ? recentActivity : [{}],
      key: 'activity',
    },
  ];

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query) {
      setSearchResults(null);
      return;
    }
    const res = await searchFiles(token, query);
    if (res.success) {
      setSearchResults(res.data);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Section with Welcome Message and Search Bar Overlay */}
        <View style={styles.heroSection}>
          <Image source={{ uri: 'https://static.storyset.com/illustration/welcome/rafiki/welcome-rafiki.png' }} style={styles.heroImage} resizeMode="contain" />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.welcomeText}>Welcome back, {user.name}!</Text>
            <View style={styles.heroSearchBarWrap}>
              <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/888888/search--v1.png' }} style={styles.searchIconImg} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search CloudStore"
                placeholderTextColor="#bbb"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>
        </View>
        {/* Show folders in grid */}
        {folders.length > 0 && (
          <View style={styles.foldersGrid}>
            {folders.map(folder => (
              <TouchableOpacity key={folder.id} style={styles.folderCardGrid} onPress={() => Alert.alert('Open Folder', `Open folder: ${folder.name}`)}>
                <Image source={{ uri: 'https://img.icons8.com/color/96/folder-invoices--v2.png' }} style={styles.folderIconImgGrid} />
                <Text style={styles.folderNameGrid}>{folder.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/222222/clock--v1.png' }} style={styles.sectionHeaderIcon} />
            <Text style={styles.sectionTitle}>Recent</Text>
          </View>
          {recentFiles.map((item, idx) => (
            <View key={item.id} style={styles.fileRow}>
              <Image source={{ uri: item.thumb }} style={styles.fileThumbImg} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.fileName}>{item.name}</Text>
                  <Text style={styles.fileMeta}>{item.modified}</Text>
                </View>
                <TouchableOpacity style={styles.menuButton} activeOpacity={0.7}>
                <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/888888/more.png' }} style={styles.menuIconImg} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
        {/* Enhanced App Description Sections */}
        <View style={styles.infoSection}>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80' }} style={styles.infoImage} />
          <Text style={styles.infoCaption}>Your Cloud, Everywhere</Text>
          <Text style={styles.infoDescription}>Access your files from any device, anywhere in the world. CloudStore keeps your memories and documents safe, secure, and always at your fingertips.</Text>
        </View>
        <View style={styles.infoSection}>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=800&q=80' }} style={styles.infoImage} />
          <Text style={styles.infoCaption}>Share Moments Instantly</Text>
          <Text style={styles.infoDescription}>Send photos, videos, and files to friends and family in a tap. With CloudStore, sharing is private, fast, and effortless.</Text>
        </View>
        <View style={styles.infoSection}>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80' }} style={styles.infoImage} />
          <Text style={styles.infoCaption}>Stay Effortlessly Organized</Text>
          <Text style={styles.infoDescription}>Create folders, favorite important files, and find what you need in seconds. CloudStore helps you keep your digital life beautifully organized.</Text>
        </View>
        {/* Features group at the bottom */}
        <View style={styles.featuresBottomRowWrap}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuresBottomRow}>
            {featureImages.map((f, idx) => (
              <View key={idx} style={styles.featureCardBottom}>
                <Image source={{ uri: f.uri }} style={styles.featureIconImgBottom} />
                <Text style={styles.featureLabelBottom}>{f.label}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  illustrationWrap: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  headerImage: {
    width: '96%',
    height: 120,
    borderRadius: 18,
  },
  searchBarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6f6f6',
    borderRadius: 18,
    marginHorizontal: 18,
    marginBottom: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  searchIconImg: {
    width: 20,
    height: 20,
    marginRight: 8,
    tintColor: '#888',
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 8,
    fontSize: 17,
    color: '#222',
    fontWeight: '500',
    fontFamily: 'System',
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginHorizontal: 16,
    marginBottom: 18,
    padding: 20,
    shadowColor: '#0061FF',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionHeaderIcon: {
    width: 18,
    height: 18,
    marginRight: 6,
    tintColor: undefined,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'System',
    color: '#222',
    marginBottom: 8,
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  fileThumbImg: {
    width: 32,
    height: 32,
    marginRight: 10,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  fileName: {
    fontSize: 16,
    color: '#222',
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  fileMeta: {
    fontSize: 13,
    color: '#aaa',
    fontWeight: '400',
    fontFamily: 'System',
  },
  menuButton: {
    padding: 8,
    marginLeft: 8,
  },
  menuIconImg: {
    width: 22,
    height: 22,
    tintColor: '#888',
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  featureCard: {
    alignItems: 'center',
    flex: 1,
  },
  featureIconImg: {
    width: 36,
    height: 36,
    marginBottom: 6,
  },
  featureLabel: {
    fontSize: 14,
    color: '#222',
    fontWeight: 'bold',
    fontFamily: 'System',
    textAlign: 'center',
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createFolderModal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 28,
    minWidth: 260,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    alignItems: 'stretch',
  },
  createFolderTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 14,
    fontFamily: 'System',
  },
  createFolderInput: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    fontFamily: 'System',
    color: '#222',
    backgroundColor: '#faf9f7',
  },
  scrollContent: {
    paddingBottom: 60,
    paddingTop: 10,
  },
  infoSection: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginHorizontal: 16,
    marginBottom: 18,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#0061FF',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  infoImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    marginBottom: 12,
  },
  infoCaption: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0061FF',
    marginBottom: 6,
    textAlign: 'center',
  },
  infoDescription: {
    fontSize: 15,
    color: '#444',
    textAlign: 'center',
    marginBottom: 2,
  },
  heroSection: {
    width: '100%',
    height: 180,
    marginBottom: 18,
    position: 'relative',
    justifyContent: 'flex-end',
    alignItems: 'stretch',
  },
  heroImage: {
    width: '100%',
    height: 180,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 180,
    backgroundColor: 'rgba(0,97,255,0.18)',
  },
  heroContent: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 18,
    zIndex: 2,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 14,
    letterSpacing: 0.2,
    textShadowColor: 'rgba(0,0,0,0.12)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  heroSearchBarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'flex-start',
    zIndex: 2,
  },
  createFolderPadIconWrap: {
    marginHorizontal: 18,
    marginTop: 18,
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  createFolderIconBtn: {
    backgroundColor: '#f6f8fc',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e0e7ef',
  },
  foldersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 18,
    marginBottom: 12,
  },
  folderCardGrid: {
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    marginBottom: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    shadowColor: '#003366',
    shadowOpacity: 0.22,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    minWidth: 110,
    maxWidth: 140,
  },
  folderIconImgGrid: {
    width: 40,
    height: 40,
    marginBottom: 6,
  },
  folderNameGrid: {
    fontSize: 15,
    color: '#222',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  createFolderModalInline: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: '100%',
    shadowColor: '#003366',
    shadowOpacity: 0.22,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  createFolderBtn: {
    backgroundColor: '#0061FF',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginRight: 8,
  },
  createFolderBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelFolderBtn: {
    backgroundColor: '#eee',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  cancelFolderBtnText: {
    color: '#0061FF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  featuresBottomRowWrap: {
    marginTop: 18,
    marginBottom: 24,
  },
  featuresBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 8,
  },
  featureCardBottom: {
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    paddingVertical: 18,
    paddingHorizontal: 18,
    shadowColor: '#003366',
    shadowOpacity: 0.22,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    minWidth: 120,
    maxWidth: 180,
  },
  featureIconImgBottom: {
    width: 36,
    height: 36,
    marginBottom: 8,
  },
  featureLabelBottom: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
  },
}); 