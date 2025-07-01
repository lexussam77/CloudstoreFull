import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import SimplePrompt from './SimplePrompt';

export default function TwoFactorScreen({ navigation }) {
  const [promptVisible, setPromptVisible] = useState(false);
  const [promptMessage, setPromptMessage] = useState('');

  const handleEnable = () => {
    setPromptMessage('Fingerprint enabled for two-factor authentication!');
    setPromptVisible(true);
    setTimeout(() => navigation.goBack(), 1200);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Image source={{ uri: 'https://img.icons8.com/fluency/96/fingerprint.png' }} style={styles.fingerprintImg} />
        <Text style={styles.header}>Two-Factor Authentication</Text>
        <Text style={styles.info}>Add an extra layer of security to your account by enabling fingerprint authentication.</Text>
        <TouchableOpacity style={styles.button} onPress={handleEnable} activeOpacity={0.85}>
          <Text style={styles.buttonText}>Enable fingerprint</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Back</Text>
        </TouchableOpacity>
      </View>
      <SimplePrompt
        visible={promptVisible}
        message={promptMessage}
        onClose={() => setPromptVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fafd',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 28,
    marginHorizontal: 10,
    shadowColor: '#003366',
    shadowOpacity: 0.22,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fingerprintImg: {
    width: 64,
    height: 64,
    marginBottom: 12,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 12,
    textAlign: 'center',
  },
  info: {
    fontSize: 16,
    color: '#444',
    marginBottom: 22,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginTop: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backBtn: {
    marginTop: 18,
    alignSelf: 'center',
  },
  backBtnText: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 