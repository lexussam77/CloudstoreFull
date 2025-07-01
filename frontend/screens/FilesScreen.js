import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SectionList, Modal, TouchableWithoutFeedback, Alert, SafeAreaView, FlatList, ScrollView, Image, ActivityIndicator } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import * as DocumentPicker from 'expo-document-picker';
import { uploadFiles, searchFiles, createFolder, listFiles } from './api';
import { useNavigation } from '@react-navigation/native';
import MyFilesSVG from '../assets/images/undraw_my-files_1xwx.svg';
import UploadSVG from '../assets/images/undraw_upload_cucu.svg';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const folders = [];
const categories = [
  { key: 'all', label: 'All' },
  { key: 'favourites', label: 'Favourites' },
  { key: 'deleted', label: 'Recently Deleted' },
];
const files = [];
const recentlyDeleted = [];

const sections = [
  {
    title: 'Folders',
    data: folders.length ? folders : [{}],
    key: 'folders',
  },
  {
    title: 'Files',
    data: files.length ? files : [{}],
    key: 'files',
  },
  {
    title: 'Recently deleted',
    data: recentlyDeleted.length ? recentlyDeleted : [{}],
    key: 'deleted',
  },
];

export default function FilesScreen() {
  const [menuFileId, setMenuFileId] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const menuButtonRefs = useRef({});
  const [folders, setFolders] = useState([]);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [fileList, setFileList] = useState(files);
  const [uploading, setUploading] = useState(false);
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [sortOption, setSortOption] = useState('date');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [menuType, setMenuType] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigation = useNavigation();

  const handleMenuPress = (item, type) => {
    if (menuButtonRefs.current[item.id]) {
      menuButtonRefs.current[item.id].measureInWindow((x, y, width, height) => {
        setMenuPosition({ x, y: y + height });
        setMenuFileId(item.id);
        setMenuType(type);
        setSelectedItem(item);
      });
    } else {
      setMenuFileId(item.id);
      setMenuType(type);
      setSelectedItem(item);
    }
  };
  const closeMenu = () => {
    setMenuFileId(null);
    setMenuType(null);
    setSelectedItem(null);
  };

  const handleMenuAction = (action, item, type) => {
    closeMenu();
    if (type === 'file') {
      if (action === 'preview') Alert.alert('Preview', `Preview file: ${item.name}`);
      else if (action === 'download') Alert.alert('Download', `Download file: ${item.name}`);
      else if (action === 'rename') Alert.alert('Rename', `Rename file: ${item.name}`);
      else if (action === 'delete') Alert.alert('Delete', `Delete file: ${item.name}`);
      else if (action === 'restore') Alert.alert('Restore', `Restore file: ${item.name}`);
      else if (action === 'move') Alert.alert('Move', `Move file: ${item.name}`);
      else if (action === 'copy') Alert.alert('Copy', `Copy file: ${item.name}`);
      else if (action === 'share') Alert.alert('Share', `Share file: ${item.name}`);
      else if (action === 'favorite') Alert.alert('Favorite', `Favorite file: ${item.name}`);
      else if (action === 'unfavorite') Alert.alert('Unfavorite', `Unfavorite file: ${item.name}`);
    } else if (type === 'folder') {
      if (action === 'open') Alert.alert('Open', `Open folder: ${item.name}`);
      else if (action === 'rename') Alert.alert('Rename', `Rename folder: ${item.name}`);
      else if (action === 'delete') Alert.alert('Delete', `Delete folder: ${item.name}`);
      else if (action === 'move') Alert.alert('Move', `Move folder: ${item.name}`);
    }
  };

  const handleUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        multiple: true,
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;
      const files = result.assets || (result.type === 'success' ? [result] : []);
      if (!files.length) return;
      setUploading(true);
      const uploadRes = await uploadFiles(token, files, currentFolderId);
      setUploading(false);
      if (uploadRes.success) {
        // Optionally show a success prompt
        await refreshFiles();
      } else {
        // Optionally show an error prompt
        Alert.alert('Upload failed', uploadRes.error || 'Unknown error');
      }
    } catch (err) {
      setUploading(false);
      Alert.alert('Upload error', err.message || 'Unknown error');
    }
  };

  const handleScan = () => {
    Alert.alert('Scan', 'This would open a document scanner.');
  };
  const handleCreateFolder = () => {
    setShowFolderModal(true);
  };
  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      setFolders([...folders, { id: Date.now().toString(), name: newFolderName.trim() }]);
      setNewFolderName('');
      setShowFolderModal(false);
    }
  };

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

  const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/ds5gugfv0';
  const UPLOAD_PRESET = 'EXPO_UPLOAD';
  const BACKEND_URL = 'http://localhost:8080'; // Change to your backend URL if needed

  const handleOptionPress = async (option) => {
    setShowUploadModal(false);
    let token = null;
    try {
      token = await AsyncStorage.getItem('token');
    } catch {}
    try {
      if (option === 'Create Folder') {
        Alert.prompt('Create Folder', 'Enter folder name:', async (folderName) => {
          if (!folderName) return;
          if (!token) { Alert.alert('Error', 'Not authenticated'); return; }
          setUploading(true);
          const res = await createFolder(token, folderName);
          if (res.success) {
            Alert.alert('Success', 'Folder created!');
            setFolders(prev => [...prev, { id: Date.now().toString(), name: folderName }]);
            // TODO: To sync folders with HomeScreen, use React Context or add a navigation listener to HomeScreen to refresh folders when focused.
          } else {
            Alert.alert('Error', res.error || 'Failed to create folder');
          }
          setUploading(false);
        });
        return;
      }
      setUploading(true);
      let fileAsset = null;
      let formData = new FormData();
      if (option === 'Take Photo') {
        const result = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 1 });
        if (!result.canceled && result.assets && result.assets.length > 0) {
          fileAsset = result.assets[0];
          const name = fileAsset.fileName || fileAsset.name || `photo_${Date.now()}.jpg`;
          const type = fileAsset.mimeType || fileAsset.type || 'image/jpeg';
          formData.append('file', {
            uri: fileAsset.uri,
            type,
            name,
          });
        } else {
          setUploading(false);
          return;
        }
      } else {
        const result = await DocumentPicker.getDocumentAsync({ type: '*/*', copyToCacheDirectory: true });
        if (!result.canceled && result.assets && result.assets.length > 0) {
          fileAsset = result.assets[0];
          formData.append('file', {
            uri: fileAsset.uri,
            type: fileAsset.mimeType || fileAsset.type || 'application/octet-stream',
            name: fileAsset.name || fileAsset.fileName || 'upload',
          });
        } else {
          setUploading(false);
          return;
        }
      }
      formData.append('upload_preset', UPLOAD_PRESET);
      try {
        const res = await fetch(`${CLOUDINARY_URL}/raw/upload`, {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.secure_url) {
          // Register file in backend
          try {
            await fetch(`${BACKEND_URL}/api/files/register`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                name: fileAsset.name || fileAsset.fileName || 'upload',
                url: data.secure_url,
                folderId: currentFolderId,
                type: fileAsset.mimeType || fileAsset.type,
                size: fileAsset.size,
              }),
            });
          } catch (err) {
            Alert.alert('Error', 'Failed to register file in backend');
          }
          // Refresh files
          const res = await listFiles(token, currentFolderId);
          if (res && res.success && Array.isArray(res.data)) {
            setFileList(res.data);
          }
          Alert.alert('Success', 'File uploaded!');
        } else {
          Alert.alert('Error', data.error?.message || 'Upload failed');
        }
      } catch (err) {
        Alert.alert('Error', err.message || 'Upload failed');
      }
      setUploading(false);
    } catch (err) {
      setUploading(false);
      Alert.alert('Error', err.message || 'Something went wrong');
    }
  };

  // Filtering logic for categories
  let filteredFiles = fileList;
  if (selectedCategory === 'favourites') {
    filteredFiles = fileList.filter(f => f.favourite);
  } else if (selectedCategory === 'deleted') {
    filteredFiles = [];
  }
  // Sorting logic
  if (sortOption === 'type') {
    filteredFiles = [...filteredFiles].sort((a, b) => {
      const extA = a.name?.split('.').pop().toLowerCase() || '';
      const extB = b.name?.split('.').pop().toLowerCase() || '';
      return extA.localeCompare(extB);
    });
  } else if (sortOption === 'date') {
    filteredFiles = [...filteredFiles].sort((a, b) => {
      // Assuming you have a 'modified' or 'createdAt' field as a date string or timestamp
      return (b.modifiedAt || 0) - (a.modifiedAt || 0);
    });
  } else if (sortOption === 'size') {
    filteredFiles = [...filteredFiles].sort((a, b) => (b.size || 0) - (a.size || 0));
  }

  const menuOptions = [
    { label: 'Upload Picture', icon: 'image' },
    { label: 'Take Photo', icon: 'camera' },
    { label: 'Upload Document', icon: 'file-text' },
    { label: 'Upload Audio', icon: 'music' },
    { label: 'Upload Video', icon: 'video' },
    { label: 'Create Folder', icon: 'folder-plus' },
  ];

  function RadialMenu({ onPress }) {
    const RADIUS = 110;
    const CENTER = 130;
    const angleStep = (2 * Math.PI) / menuOptions.length;
    return (
      <View style={styles.overlay} pointerEvents="box-none">
        <View style={styles.wheel}>
          {menuOptions.map((opt, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const x = CENTER + RADIUS * Math.cos(angle) - 32;
            const y = CENTER + RADIUS * Math.sin(angle) - 32;
            return (
              <TouchableOpacity
                key={opt.label}
                style={[styles.iconButton, { left: x, top: y }]}
                onPress={() => onPress(opt.label)}
                activeOpacity={0.8}
              >
                <Feather name={opt.icon} size={32} color="#2563eb" />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }

  useEffect(() => {
    const fetchFiles = async () => {
      let token = null;
      try {
        token = await AsyncStorage.getItem('token');
      } catch {}
      if (!token) return;
      const res = await listFiles(token, currentFolderId);
      if (res && res.success && Array.isArray(res.data)) {
        setFileList(res.data);
      }
    };
    fetchFiles();
  }, [currentFolderId]);

  return (
    <View style={{ flex: 1 }}>
      {/* Spinner overlay when uploading */}
      {uploading && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.6)' }}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      )}
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          {/* Search Bar */}
          <View style={styles.searchBarWrap}>
            <Feather name="search" size={20} color="#888" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInputModern}
              placeholder="Search"
              placeholderTextColor="#bbb"
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </View>
          {/* Category Bar */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryBar}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat.key}
                style={[
                  styles.categoryButton,
                  selectedCategory === cat.key && styles.categoryButtonSelected,
                ]}
                activeOpacity={0.7}
                onPress={() => setSelectedCategory(cat.key)}
              >
                <Text style={[
                  styles.categoryButtonText,
                  selectedCategory === cat.key && styles.categoryButtonTextSelected,
                ]}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {/* Sort Bar */}
          <View style={styles.sortBar}>
            <View style={{ flex: 1, height: 2, backgroundColor: '#e0e7ef', borderRadius: 1 }} />
            <TouchableOpacity style={styles.sortIconBtn} onPress={() => setSortModalVisible(true)}>
              <Feather name="sliders" size={22} color="#2563eb" />
            </TouchableOpacity>
          </View>
          {/* Sort Modal */}
          <Modal
            visible={sortModalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setSortModalVisible(false)}
          >
            <View style={styles.sortModalOverlay}>
              <View style={styles.sortModalCard}>
                <Text style={styles.sortModalTitle}>Sort by</Text>
                <View style={styles.sortModalDivider} />
                {['type', 'date', 'size'].map(opt => (
                  <TouchableOpacity
                    key={opt}
                    style={[styles.sortOptionBtn, sortOption === opt && styles.sortOptionBtnSelected]}
                    onPress={() => {
                      setSortOption(opt);
                      setSortModalVisible(false);
                    }}
                  >
                    <Text style={[styles.sortOptionText, sortOption === opt && styles.sortOptionTextSelected]}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity style={styles.sortModalCloseBtn} onPress={() => setSortModalVisible(false)}>
                  <Text style={styles.sortModalCloseText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          {/* SVG Illustration */}
          <View style={styles.uploadIllustrationWrap}>
            <UploadSVG width={120} height={90} />
          </View>
          {/* Folders Grid */}
          {folders.length > 0 && (
            <View style={styles.foldersGrid}>
              {folders.map(folder => (
                <View key={folder.id} style={styles.folderCardGrid}>
                  <TouchableOpacity onPress={() => Alert.alert('Open Folder', `Open folder: ${folder.name}`)}>
                    <Image source={{ uri: 'https://img.icons8.com/color/96/folder-invoices--v2.png' }} style={styles.folderIconImgGrid} />
                    <Text style={styles.folderNameGrid}>{folder.name}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    ref={ref => (menuButtonRefs.current[folder.id] = ref)}
                    style={styles.menuButton}
                    activeOpacity={0.7}
                    onPress={() => handleMenuPress(folder, 'folder')}
                  >
                    <Feather name="more-vertical" size={22} color="#888" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
          {/* Files List */}
          {filteredFiles.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No files yet. Upload or create a file to get started!</Text>
            </View>
          ) : (
            filteredFiles.map((item, idx) => {
              let fileColor = '#888';
              if (item.name && item.name.toLowerCase().endsWith('.pdf')) fileColor = '#e74c3c';
              else if (item.name && (item.name.toLowerCase().endsWith('.doc') || item.name.toLowerCase().endsWith('.docx'))) fileColor = '#2563eb';
              else if (item.name && (item.name.toLowerCase().endsWith('.xls') || item.name.toLowerCase().endsWith('.xlsx'))) fileColor = '#27ae60';
              else if (item.name && (item.name.toLowerCase().endsWith('.ppt') || item.name.toLowerCase().endsWith('.pptx'))) fileColor = '#e67e22';
              else if (item.name && (item.name.toLowerCase().endsWith('.jpg') || item.name.toLowerCase().endsWith('.jpeg') || item.name.toLowerCase().endsWith('.png') || item.name.toLowerCase().endsWith('.gif'))) fileColor = '#8e44ad';
              return (
                <View key={item.id || idx} style={styles.fileCardRow}>
                  <View style={styles.fileThumbWrap}>
                    <Feather name="file-text" size={32} color={fileColor} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.fileCardName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.fileCardMeta} numberOfLines={1}>{item.source || 'CloudStore'} • {item.size || ''}</Text>
                  </View>
                  <TouchableOpacity
                    ref={ref => (menuButtonRefs.current[item.id] = ref)}
                    style={styles.menuButton}
                    activeOpacity={0.7}
                    onPress={() => handleMenuPress(item, 'file')}
                  >
                    <Feather name="more-vertical" size={22} color="#888" />
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </ScrollView>
        {/* File/Folder menu modal rendered at root */}
        {menuFileId && (
          <View style={[styles.fileMenuModal, { position: 'absolute', left: menuPosition.x - 180, top: menuPosition.y, zIndex: 9999 }]}> 
            {menuType === 'file' ? (
              <>
                <TouchableOpacity style={styles.fileMenuItem} onPress={() => handleMenuAction('preview', selectedItem, 'file')}>
                  <Feather name="eye" size={18} color="#0061FF" style={{ marginRight: 8 }} />
                  <Text style={styles.fileMenuText}>Preview</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.fileMenuItem} onPress={() => handleMenuAction('download', selectedItem, 'file')}>
                  <Feather name="download" size={18} color="#0061FF" style={{ marginRight: 8 }} />
                  <Text style={styles.fileMenuText}>Download</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.fileMenuItem} onPress={() => handleMenuAction('rename', selectedItem, 'file')}>
                  <Feather name="edit-3" size={18} color="#0061FF" style={{ marginRight: 8 }} />
                  <Text style={styles.fileMenuText}>Rename</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.fileMenuItem} onPress={() => handleMenuAction('delete', selectedItem, 'file')}>
                  <Feather name="trash" size={18} color="crimson" style={{ marginRight: 8 }} />
                  <Text style={[styles.fileMenuText, { color: 'crimson' }]}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.fileMenuItem} onPress={() => handleMenuAction('move', selectedItem, 'file')}>
                  <Feather name="folder" size={18} color="#0061FF" style={{ marginRight: 8 }} />
                  <Text style={styles.fileMenuText}>Move</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.fileMenuItem} onPress={() => handleMenuAction('copy', selectedItem, 'file')}>
                  <Feather name="copy" size={18} color="#0061FF" style={{ marginRight: 8 }} />
                  <Text style={styles.fileMenuText}>Copy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.fileMenuItem} onPress={() => handleMenuAction('share', selectedItem, 'file')}>
                  <Feather name="share-2" size={18} color="#0061FF" style={{ marginRight: 8 }} />
                  <Text style={styles.fileMenuText}>Share</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.fileMenuItem} onPress={() => handleMenuAction('favorite', selectedItem, 'file')}>
                  <Feather name="star" size={18} color="#fbbf24" style={{ marginRight: 8 }} />
                  <Text style={styles.fileMenuText}>Favorite</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity style={styles.fileMenuItem} onPress={() => handleMenuAction('open', selectedItem, 'folder')}>
                  <Feather name="folder" size={18} color="#0061FF" style={{ marginRight: 8 }} />
                  <Text style={styles.fileMenuText}>Open</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.fileMenuItem} onPress={() => handleMenuAction('rename', selectedItem, 'folder')}>
                  <Feather name="edit-3" size={18} color="#0061FF" style={{ marginRight: 8 }} />
                  <Text style={styles.fileMenuText}>Rename</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.fileMenuItem} onPress={() => handleMenuAction('delete', selectedItem, 'folder')}>
                  <Feather name="trash" size={18} color="crimson" style={{ marginRight: 8 }} />
                  <Text style={[styles.fileMenuText, { color: 'crimson' }]}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.fileMenuItem} onPress={() => handleMenuAction('move', selectedItem, 'folder')}>
                  <Feather name="arrow-right" size={18} color="#0061FF" style={{ marginRight: 8 }} />
                  <Text style={styles.fileMenuText}>Move</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity style={styles.fileMenuClose} onPress={closeMenu}>
              <Text style={styles.fileMenuCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        )}
        {/* Plus Button and Upload Modal */}
        <TouchableOpacity
          style={styles.plusButton}
          onPress={() => setShowUploadModal(true)}
          activeOpacity={0.85}
        >
          <Feather name="plus" size={28} color="#fff" />
        </TouchableOpacity>
        <Modal
          visible={showUploadModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowUploadModal(false)}
        >
          <TouchableOpacity style={styles.overlay} onPress={() => setShowUploadModal(false)} activeOpacity={1}>
            <RadialMenu onPress={handleOptionPress} />
          </TouchableOpacity>
        </Modal>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    marginTop: 10,
    marginBottom: 8,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconBtn: {
    marginLeft: 18,
    padding: 6,
    borderRadius: 20,
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
  searchIcon: {
    marginRight: 8,
  },
  searchInputModern: {
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
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 18,
    marginBottom: 8,
    marginTop: 8,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    letterSpacing: 0.1,
  },
  seeAll: {
    color: '#0061FF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  fileCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#faf9f7',
    borderRadius: 16,
    marginHorizontal: 18,
    marginBottom: 14,
    padding: 16,
    shadowColor: '#003366',
    shadowOpacity: 0.22,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  fileThumbWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0061FF',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  fileCardName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
    fontFamily: 'System',
    marginBottom: 2,
  },
  fileCardMeta: {
    fontSize: 13,
    color: '#aaa',
    fontWeight: '400',
    fontFamily: 'System',
  },
  menuButton: {
    padding: 8,
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 18,
  },
  emptyIllustration: {
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#bbb',
    fontWeight: 'bold',
    fontFamily: 'System',
    textAlign: 'center',
    marginHorizontal: 24,
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
  categoryBar: {
    marginBottom: 18,
    marginLeft: 16,
    flexDirection: 'row',
    paddingVertical: 8,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 22,
    marginRight: 12,
    backgroundColor: '#fff',
    shadowColor: '#0061FF',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    minWidth: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryButtonSelected: {
    backgroundColor: '#0061FF',
    shadowColor: '#0061FF',
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  categoryButtonText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'System',
    letterSpacing: 0.2,
  },
  categoryButtonTextSelected: {
    color: '#fff',
  },
  uploadIllustrationWrap: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  scrollContent: {
    paddingBottom: 60,
    paddingTop: 10,
  },
  fileMenuModal: {
    position: 'absolute',
    right: 0,
    top: 48,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: '#003366',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    zIndex: 99,
  },
  fileMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  fileMenuText: {
    fontSize: 16,
    color: '#222',
    fontWeight: 'bold',
  },
  fileMenuClose: {
    marginTop: 8,
    alignItems: 'center',
  },
  fileMenuCloseText: {
    color: '#0061FF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  sortBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 18,
    marginBottom: 8,
    marginTop: 2,
  },
  sortIconBtn: {
    marginLeft: 10,
    backgroundColor: '#f6f8fc',
    borderRadius: 16,
    padding: 8,
    borderWidth: 1.5,
    borderColor: '#e0e7ef',
  },
  sortModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sortModalCard: {
    backgroundColor: '#fff',
    borderRadius: 28,
    paddingVertical: 36,
    paddingHorizontal: 32,
    minWidth: 240,
    shadowColor: '#003366',
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  sortModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 10,
    textAlign: 'center',
  },
  sortModalDivider: {
    width: '100%',
    height: 1.5,
    backgroundColor: '#e0e7ef',
    marginBottom: 18,
    borderRadius: 1,
  },
  sortOptionBtn: {
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 16,
    marginBottom: 10,
    width: 160,
    alignItems: 'center',
    backgroundColor: '#f7fafd',
    borderWidth: 0,
  },
  sortOptionBtnSelected: {
    backgroundColor: '#e6f0fa',
    borderColor: '#2563eb',
    borderWidth: 2,
    shadowColor: '#2563eb',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sortOptionText: {
    fontSize: 16,
    color: '#222',
    fontWeight: 'bold',
  },
  sortOptionTextSelected: {
    color: '#2563eb',
  },
  sortModalCloseBtn: {
    marginTop: 16,
    alignItems: 'center',
  },
  sortModalCloseText: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 0.2,
  },
  plusButton: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    backgroundColor: '#0061FF',
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-end',
  },
  wheel: {
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#e5e7eb',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -130,
    marginTop: -130,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
  },
  iconButton: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563eb',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
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
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadingText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
}); 