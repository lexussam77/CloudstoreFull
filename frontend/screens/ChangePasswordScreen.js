import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import SimplePrompt from './SimplePrompt';

export default function ChangePasswordScreen({ navigation }) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [promptVisible, setPromptVisible] = useState(false);
  const [promptMessage, setPromptMessage] = useState('');

  const handleSubmit = () => {
    if (!current || !next || !confirm) {
      setPromptMessage('Please fill all fields.');
      setPromptVisible(true);
      return;
    }
    if (next !== confirm) {
      setPromptMessage('Passwords do not match.');
      setPromptVisible(true);
      return;
    }
    setPromptMessage('Password changed successfully!');
    setPromptVisible(true);
    setTimeout(() => navigation.goBack(), 1200);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>Change Password</Text>
        <TextInput
          style={styles.inputAligned}
          placeholder="Current password"
          secureTextEntry
          value={current}
          onChangeText={setCurrent}
        />
        <TextInput
          style={styles.inputAligned}
          placeholder="New password"
          secureTextEntry
          value={next}
          onChangeText={setNext}
        />
        <TextInput
          style={styles.inputAligned}
          placeholder="Confirm new password"
          secureTextEntry
          value={confirm}
          onChangeText={setConfirm}
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit} activeOpacity={0.85}>
          <Text style={styles.buttonText}>Change Password</Text>
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
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 18,
    textAlign: 'center',
  },
  inputAligned: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#f6f8fc',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#222',
    marginBottom: 16,
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