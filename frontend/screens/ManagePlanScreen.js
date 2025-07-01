import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';

const plans = [
  {
    key: 'plus',
    name: 'Plus',
    price: 'GH₵60.00 per month',
    storage: '2TB',
    features: [
      'Use 2,000 GB of encrypted cloud storage',
      'Send big files with Dropbox Transfer',
      'Automatically back up your files',
    ],
  },
  {
    key: 'family',
    name: 'Family',
    price: 'Up to 6 accounts, GH₵120.00 per month',
    storage: '2,000 GB',
    features: [
      '2,000 GB of encrypted cloud storage',
      'Up to 6 individual accounts',
      'No matter whose files, everything is private',
    ],
  },
  {
    key: 'professional',
    name: 'Professional',
    price: '3TB, GH₵130.00 per month',
    storage: '3,000 GB',
    features: [
      'Use 3,000 GB of encrypted cloud storage',
      'Access all Plus plan benefits and features',
      'Send big files with Dropbox Transfer',
    ],
  },
];

const { width } = Dimensions.get('window');

export default function ManagePlanScreen() {
  const [selectedTab, setSelectedTab] = useState(0);
  const flatListRef = useRef();

  const handleTabPress = (idx) => {
    setSelectedTab(idx);
    flatListRef.current.scrollToIndex({ index: idx });
  };

  const handleScroll = (event) => {
    const idx = Math.round(event.nativeEvent.contentOffset.x / (width * 0.85));
    setSelectedTab(idx);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => {/* navigation.goBack() */}}>
          <Text style={styles.backArrow}>{'←'}</Text>
        </TouchableOpacity>
        <Text style={styles.header}>Manage Plan</Text>
      </View>
      <View style={styles.tabsRow}>
        {plans.map((plan, idx) => (
          <TouchableOpacity
            key={plan.key}
            style={[styles.tab, selectedTab === idx && styles.tabSelected]}
            onPress={() => handleTabPress(idx)}
          >
            <Text style={[styles.tabText, selectedTab === idx && styles.tabTextSelected]}>{plan.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        ref={flatListRef}
        data={plans}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyExtractor={item => item.key}
        contentContainerStyle={styles.cardsScroll}
        renderItem={({ item }) => (
          <View style={[styles.card, { width: width * 0.85 }]}> 
            <Text style={styles.planName}>{item.name}</Text>
            <Text style={styles.planPrice}>{item.storage}, {item.price}</Text>
            <View style={styles.featuresList}>
              {item.features.map((f, idx) => (
                <View key={idx} style={styles.featureRow}>
                  <Text style={styles.check}>✔</Text>
                  <Text style={styles.featureText}>{f}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.reminderRow}>
              <Text style={styles.bell}>🔔</Text>
              <Text style={styles.reminderText}>Get a reminder before your trial ends</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.ctaButton}>
              <Text style={styles.ctaButtonText}>Try free for 30 days</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity style={styles.freePlanButton}>
        <Text style={styles.freePlanText}>Continue with Free Plan</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginTop: 10,
    marginBottom: 8,
  },
  backArrow: {
    fontSize: 26,
    color: '#222',
    marginRight: 12,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    marginHorizontal: 6,
  },
  tabSelected: {
    borderBottomColor: '#222',
  },
  tabText: {
    fontSize: 16,
    color: '#888',
    fontWeight: 'bold',
  },
  tabTextSelected: {
    color: '#222',
  },
  cardsScroll: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    minHeight: 340,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginHorizontal: 10,
    padding: 22,
    shadowColor: '#003366',
    shadowOpacity: 0.22,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  planName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 16,
    color: '#222',
    marginBottom: 16,
  },
  featuresList: {
    marginBottom: 18,
    width: '100%',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  check: {
    color: '#009900',
    fontSize: 16,
    marginRight: 8,
  },
  featureText: {
    fontSize: 15,
    color: '#222',
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bell: {
    fontSize: 18,
    color: '#2563eb',
    marginRight: 6,
  },
  reminderText: {
    color: '#2563eb',
    fontSize: 15,
    fontWeight: '500',
  },
  ctaButton: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignSelf: 'stretch',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 6,
  },
  ctaButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  freePlanButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 18,
    width: '80%',
  },
  freePlanText: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 