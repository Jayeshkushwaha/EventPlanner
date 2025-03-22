import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import Ionicons from 'react-native-vector-icons/Ionicons';

type RegistrationScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Registration'>;
};

const RegistrationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().matches(/^[0-9]{10}$/, 'Must be 10 digits').required('Phone number is required'),
  password: Yup.string()
    .min(8, 'At least 8 characters')
    .max(16, 'Max 16 characters')
    .matches(/[A-Z]/, 'Include at least one uppercase letter')
    .matches(/[a-z]/, 'Include at least one lowercase letter')
    .matches(/[0-9]/, 'Include at least one number')
    .matches(/[@$!%*?&#]/, 'Include at least one special character')
    .required('Password is required'),
});

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (values: { name: string; email: string; phone: string; password: string }) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(values));
      navigation.replace('EventList');
    } catch (error) {
      console.error('Error saving user:', error);
      Alert.alert('Error', 'Failed to save user data');
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1557683311-eac922347aa1?q=80&w=2940' }}
      style={styles.backgroundImage}
    >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.overlay}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to continue</Text>

            <Formik initialValues={{ name: '', email: '', phone: '', password: '' }} validationSchema={RegistrationSchema} onSubmit={handleRegister}>
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View style={styles.form}>
                  <View style={styles.inputContainer}>
                    <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Full Name *"
                      placeholderTextColor="#666"
                      onChangeText={handleChange('name')}
                      onBlur={handleBlur('name')}
                      value={values.name}
                    />
                  </View>
                  {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}

                  <View style={styles.inputContainer}>
                    <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Email *"
                      placeholderTextColor="#666"
                      keyboardType="email-address"
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      value={values.email}
                      autoCapitalize="none"
                    />
                  </View>
                  {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

                  <View style={styles.inputContainer}>
                    <Ionicons name="call-outline" size={20} color="#666" style={styles.icon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Phone *"
                      placeholderTextColor="#666"
                      keyboardType="numeric"
                      onChangeText={handleChange('phone')}
                      onBlur={handleBlur('phone')}
                      value={values.phone}
                      maxLength={10}
                    />
                  </View>
                  {touched.phone && errors.phone && <Text style={styles.error}>{errors.phone}</Text>}

                  <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
                    <TextInput
                      style={[styles.input, styles.passwordInput]}
                      placeholder="Password *"
                      placeholderTextColor="#666"
                      secureTextEntry={!showPassword}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      value={values.password}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.passwordToggle}>
                      <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#666" />
                    </TouchableOpacity>
                  </View>
                  {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}

                  <TouchableOpacity style={styles.signUpButton} onPress={() => handleSubmit()}>
                    <Text style={styles.signUpButtonText}>Sign Up</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
          </View>
        </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  scrollContent: { 
    flexGrow: 1 
  },
  backgroundImage: { 
    flex: 1, 
    resizeMode: 'cover' 
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 14,
    paddingHorizontal: 16,
    height: 50,
  },
  icon: { 
    marginRight: 12 
  },
  input: { 
    flex: 1, 
    color: '#333', 
    fontSize: 16 
  },
  passwordInput: { 
    paddingRight: 40 
  },
  passwordToggle: { 
    position: 'absolute', 
    right: 16 
  },
  error: { 
    color: 'red', 
    fontSize: 13, 
    marginBottom: 5 
  },
  signUpButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  signUpButtonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
});

export default RegistrationScreen;