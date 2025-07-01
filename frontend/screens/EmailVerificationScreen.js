import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, verifyEmail } from './api';
import CustomPrompt from './CustomPrompt';

export default function EmailVerificationScreen({ navigation, route }) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState(route?.params?.email || '');
  const inputs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
  const [loading, setLoading] = useState(false);
  const [promptVisible, setPromptVisible] = useState(false);
  const [promptMessage, setPromptMessage] = useState('');
  const [promptSuccess, setPromptSuccess] = useState(true);

  // If email is not passed, try to get it from AsyncStorage
  useEffect(() => {
    if (!email) {
      AsyncStorage.getItem('email').then(storedEmail => {
        if (storedEmail) setEmail(storedEmail);
      });
    }
  }, []);

  const handleChange = (text, idx) => {
    if (/^[0-9]?$/.test(text)) {
      const newCode = [...code];
      newCode[idx] = text;
      setCode(newCode);
      if (text && idx < 5) {
        inputs[idx + 1].current.focus();
      }
      if (!text && idx > 0) {
        inputs[idx - 1].current.focus();
      }
    }
  };

  const handleVerify = async () => {
    setLoading(true);
      const codeStr = code.join('');
    if (codeStr.length !== 6) {
      setPromptMessage('Please enter the 6-digit code.');
      setPromptSuccess(false);
      setPromptVisible(true);
      setLoading(false);
      return;
    }
    if (!email) {
      setPromptMessage('Email is missing.');
      setPromptSuccess(false);
      setPromptVisible(true);
      setLoading(false);
      return;
    }
    console.log('Verifying email:', email, 'with code:', codeStr);
    try {
      const res = await verifyEmail({ email, code: codeStr });
      if (res.success) {
        setPromptMessage('Email verified! You can now log in.');
        setPromptSuccess(true);
        setPromptVisible(true);
      } else {
        setPromptMessage(res.error || res.data?.message || 'Invalid code.');
        setPromptSuccess(false);
        setPromptVisible(true);
      }
    } catch (err) {
      setPromptMessage(err.message || 'Network error.');
      setPromptSuccess(false);
      setPromptVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePromptClose = () => {
    setPromptVisible(false);
    if (promptSuccess) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.simpleTitle}>Verify Email</Text>
      <View style={styles.card}>
        <Text style={styles.header}>Verify your CloudStore email</Text>
        <Text style={styles.message}>Enter the 6-digit verification code sent to your email address.</Text>
        <View style={styles.codeInputRow}>
          {code.map((digit, idx) => (
            <TextInput
              key={idx}
              ref={inputs[idx]}
              style={styles.input}
              value={digit}
              onChangeText={text => handleChange(text, idx)}
              keyboardType="number-pad"
              maxLength={1}
              placeholder="-"
              placeholderTextColor="#888"
              returnKeyType="next"
              autoFocus={idx === 0}
            />
          ))}
        </View>
        <TouchableOpacity style={styles.button} activeOpacity={0.85} onPress={handleVerify} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verify Email</Text>}
        </TouchableOpacity>
      </View>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0061FF" />
        </View>
      )}
      <CustomPrompt
        visible={promptVisible}
        message={promptMessage}
        onClose={handlePromptClose}
        success={promptSuccess}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fc',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
    width: '100%',
    maxWidth: 350,
    shadowColor: '#0061FF',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    alignItems: 'center',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0061FF',
    marginBottom: 18,
    fontFamily: 'System',
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#888',
    fontWeight: '400',
    fontFamily: 'System',
    marginBottom: 18,
    textAlign: 'center',
  },
  codeInputRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#faf9f7',
    borderRadius: 14,
    padding: 10,
    fontSize: 16,
    color: '#222',
    fontFamily: 'System',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#eee',
  },
  button: {
    backgroundColor: '#0061FF',
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#0061FF',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    fontFamily: 'System',
  },
  link: {
    color: '#0061FF',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'System',
    textAlign: 'center',
    marginTop: 8,
  },
  error: {
    color: 'crimson',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  simpleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
}); 