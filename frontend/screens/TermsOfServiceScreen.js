import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function TermsOfServiceScreen({ navigation }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.header}>Terms of Service</Text>
      <View style={styles.card}><Text style={styles.text}>Welcome to CloudStore! Please read these Terms of Service ("Terms") carefully before using our app. By accessing or using CloudStore, you agree to be bound by these Terms.</Text></View>
      <View style={styles.card}><Text style={styles.sectionHeader}>1. Using CloudStore</Text><Text style={styles.text}>You must be at least 13 years old to use CloudStore. You are responsible for your account and all activity on it. Please keep your password secure.</Text></View>
      <View style={styles.card}><Text style={styles.sectionHeader}>2. Your Content</Text><Text style={styles.text}>You retain ownership of your files. By uploading, you grant us permission to store and back up your files as needed to provide our service. We do not claim ownership of your content.</Text></View>
      <View style={styles.card}><Text style={styles.sectionHeader}>3. Prohibited Use</Text><Text style={styles.text}>Do not use CloudStore to store or share illegal, harmful, or infringing content. We reserve the right to suspend accounts that violate these rules.</Text></View>
      <View style={styles.card}><Text style={styles.sectionHeader}>4. Termination</Text><Text style={styles.text}>You may stop using CloudStore at any time. We may suspend or terminate your account if you violate these Terms.</Text></View>
      <View style={styles.card}><Text style={styles.sectionHeader}>5. Changes</Text><Text style={styles.text}>We may update these Terms from time to time. We will notify you of significant changes.</Text></View>
      <View style={styles.card}><Text style={styles.sectionHeader}>6. Contact</Text><Text style={styles.text}>If you have questions, contact us at support@cloudstore.com.</Text></View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 18,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: '#222',
    marginBottom: 32,
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'System',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563eb',
    marginTop: 18,
    marginBottom: 6,
    fontFamily: 'System',
  },
  card: {
    backgroundColor: '#f7fafd',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#0061FF',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  scrollContent: {
    paddingVertical: 24,
    paddingHorizontal: 8,
  },
}); 