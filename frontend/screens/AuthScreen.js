import React, { useState, useRef, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Alert, Image, ActivityIndicator, Animated, Easing } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, registerUser } from './api';
import CustomPrompt from './CustomPrompt';
import { AuthContext } from './AuthContext';

export default function AuthScreen({ navigation }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [promptVisible, setPromptVisible] = useState(false);
  const [promptMessage, setPromptMessage] = useState('');
  const [promptSuccess, setPromptSuccess] = useState(true);
  const flipAnim = useRef(new Animated.Value(0)).current;
  const [flipped, setFlipped] = useState(false);
  const [focusedInput, setFocusedInput] = useState('');
  const { setJwt } = useContext(AuthContext);

  // Interpolate rotation
  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });
  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const flipCard = () => {
    if (!flipped) {
      Animated.timing(flipAnim, {
        toValue: 180,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }).start(() => setFlipped(true));
    } else {
      Animated.timing(flipAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }).start(() => setFlipped(false));
    }
    setIsLogin(!isLogin);
  };

  const handleSubmit = async () => {
    // Validation for login
    if (isLogin) {
      if (!email.trim() || !password.trim()) {
        setPromptMessage('Please enter both email/username and password.');
        setPromptSuccess(false);
        setPromptVisible(true);
        return;
      }
      if (password.length < 6) {
        setPromptMessage('Password must be at least 6 characters.');
        setPromptSuccess(false);
        setPromptVisible(true);
        return;
      }
    } else {
      // Validation for signup
      if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
        setPromptMessage('Please fill in all fields.');
        setPromptSuccess(false);
        setPromptVisible(true);
        return;
      }
      if (password.length < 6 || confirmPassword.length < 6) {
        setPromptMessage('Password must be at least 6 characters.');
        setPromptSuccess(false);
        setPromptVisible(true);
        return;
      }
      if (password !== confirmPassword) {
        setPromptMessage('Passwords do not match.');
        setPromptSuccess(false);
        setPromptVisible(true);
        return;
      }
    }
    setLoading(true);
    if (isLogin) {
      try {
        const res = await loginUser({ identifier: email, password });
        if (res.success && res.data.token) {
          await AsyncStorage.setItem('jwt', res.data.token);
          setJwt(res.data.token);
          setPromptMessage('Login Successful! Welcome back!');
          setPromptSuccess(true);
          setPromptVisible(true);
        } else {
          setPromptMessage(res.error || res.data?.message || 'Invalid credentials.');
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
    } else {
      try {
        const res = await registerUser({ email, password, name });
        if (res.success) {
          setPromptMessage('Registration Successful! Check your email for the verification code.');
          setPromptSuccess(true);
          setPromptVisible(true);
        } else {
          setPromptMessage(res.error || res.data?.message || 'Registration failed.');
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
    }
  };

  const handlePromptClose = () => {
    setPromptVisible(false);
    if (promptSuccess && !isLogin) {
      navigation.navigate('EmailVerification', { email });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        {/* Logo */}
        <View style={styles.logoWrap}>
          <AntDesign name="cloud" size={32} color="#0061FF" />
          <Text style={styles.logoText}>CloudStore</Text>
        </View>
        {/* Flip Card */}
        <View style={{ height: 340, width: '100%', alignItems: 'center', marginTop: 10 }}>
          <Animated.View style={[styles.flipCard, { transform: [{ rotateY: frontInterpolate }] }]}> 
            {isLogin && (
              <View style={styles.form}>
                <TextInput
                  style={[styles.input, focusedInput === 'identifier' && styles.inputFocused]}
                  placeholder="Email or Username"
                  value={email}
                  onChangeText={setEmail}
                  placeholderTextColor="#888"
                  onFocus={() => setFocusedInput('identifier')}
                  onBlur={() => setFocusedInput('')}
                />
                <TextInput
                  style={[styles.input, focusedInput === 'password' && styles.inputFocused]}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholderTextColor="#888"
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput('')}
                />
                <TouchableOpacity style={styles.submitBtn} activeOpacity={0.85} onPress={handleSubmit} disabled={loading}>
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Log in</Text>}
                </TouchableOpacity>
                <TouchableOpacity onPress={flipCard} style={styles.link}>
                  <Text style={styles.link}>Don't have an account? <Text style={{ color: '#0061FF' }}>Sign up</Text></Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.googleBtn} activeOpacity={0.85} onPress={() => Alert.alert('Google Sign-In')}>
                  <Image source={require('../assets/images/Google.png')} style={styles.googleLogo} />
                  <Text style={styles.googleBtnText}>Continue with Google</Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
          <Animated.View style={[styles.flipCard, styles.flipCardBack, { transform: [{ rotateY: backInterpolate }] }]}> 
            {!isLogin && (
              <View style={styles.form}>
                <TextInput
                  style={[styles.input, focusedInput === 'name' && styles.inputFocused]}
                  placeholder="Full name"
                  value={name}
                  onChangeText={setName}
                  placeholderTextColor="#888"
                  onFocus={() => setFocusedInput('name')}
                  onBlur={() => setFocusedInput('')}
                />
                <TextInput
                  style={[styles.input, focusedInput === 'email' && styles.inputFocused]}
                  placeholder="Email address"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  placeholderTextColor="#888"
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput('')}
                />
                <TextInput
                  style={[styles.input, focusedInput === 'password' && styles.inputFocused]}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholderTextColor="#888"
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput('')}
                />
                <TextInput
                  style={[styles.input, focusedInput === 'confirmPassword' && styles.inputFocused]}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  placeholderTextColor="#888"
                  onFocus={() => setFocusedInput('confirmPassword')}
                  onBlur={() => setFocusedInput('')}
                />
                <TouchableOpacity style={styles.submitBtn} activeOpacity={0.85} onPress={handleSubmit} disabled={loading}>
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Sign up</Text>}
                </TouchableOpacity>
                <TouchableOpacity onPress={flipCard} style={styles.link}>
                  <Text style={styles.link}>Already have an account? <Text style={{ color: '#0061FF' }}>Log in</Text></Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.googleBtn} activeOpacity={0.85} onPress={() => Alert.alert('Google Sign-In')}>
                  <Image source={require('../assets/images/Google.png')} style={styles.googleLogo} />
                  <Text style={styles.googleBtnText}>Continue with Google</Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        </View>
      </View>
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
    padding: 24,
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0061FF',
    fontFamily: 'System',
    marginTop: 8,
    letterSpacing: 0.5,
  },
  form: {
    width: '100%',
    maxWidth: 350,
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    backgroundColor: '#faf9f7',
    borderRadius: 14,
    padding: 14,
    fontSize: 16,
    color: '#222',
    fontFamily: 'System',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#eee',
    width: '100%',
    alignSelf: 'stretch',
  },
  inputFocused: {
    borderColor: '#0061FF',
    borderWidth: 2,
  },
  submitBtn: {
    backgroundColor: '#0061FF',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#0061FF',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'System',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  flipCard: {
    position: 'absolute',
    width: '100%',
    backfaceVisibility: 'hidden',
  },
  flipCardBack: {
    transform: [{ rotateY: '180deg' }],
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
    alignSelf: 'center',
  },
  googleBtnText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 14,
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
}); 