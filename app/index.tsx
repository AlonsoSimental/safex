import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Switch  } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function TabOneScreen() {

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isRememberMe, setIsRememberMe] = useState(false);

  return (
    <View style={styles.container}> 
      <Text style={styles.title}>SAFEX</Text> 
      <Text style={styles.welcomeText}>Bienvenido</Text> 
      <Text style={styles.welcomeText2}>Inicia sesión para cuidar a tu hijo</Text>

      <Text style={styles.fieldLabel}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo"
        placeholderTextColor={'#dddded'}
        keyboardType="email-address" 
      />

      <Text style={styles.fieldLabel}>Contraseña</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.passwordInput, {flex: 1}]} 
          placeholder="Contraseña"
          secureTextEntry={!passwordVisible} 
          placeholderTextColor="#dddded"
        />
        <TouchableOpacity
          onPress={() => setPasswordVisible(!passwordVisible)}
          style={styles.eyeIcon}
        >
          <Ionicons name={passwordVisible ? 'eye-off-outline' : 'eye-outline'} size={24} color="#dcddf1" />
        </TouchableOpacity>
      </View>

      <View style={styles.rememberMeContainer}>
        <TouchableOpacity
          onPress={() => setIsRememberMe(!isRememberMe)}
        >
          <Ionicons
            name={isRememberMe ? 'checkmark-circle' : 'checkmark-circle-outline'}
            size={20}
            color={isRememberMe ? '#4CAF50' : '#f3ffff'}
          />
        </TouchableOpacity>
        <Text style={styles.rememberMeText}>Recordar contraseña</Text>
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={() => router.navigate('/home')}>
        <Text style={styles.loginButtonText}>Iniciar sesión</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 70,
    backgroundColor: '#0078b7',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#f3ffff',
    marginBottom: 70,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f3ffff',
    marginBottom: 8,
  },
  welcomeText2: {
    fontSize: 14,
    fontWeight: '200',
    color: '#f3ffff',
    maxWidth: '80%',
    marginBottom: 70,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '200',
    color: '#f3ffff', 
    width: '80%', 
    marginBottom: 8,
  },
  input: {
    height: 50, 
    width: '80%', 
    marginBottom: 40, 
    borderWidth: 0, 
    padding: 10, 
    borderRadius: 10, 
    backgroundColor: 'white',
    color: 'black', 
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginBottom: 20, 
    borderWidth: 0,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  passwordInput: {
    height: 50,
    flex: 1,
    padding: 10,
    backgroundColor: 'transparent',
    color: 'black',
  },
  eyeIcon: {
    marginRight: 15, 
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginBottom: 50,
    backgroundColor: 'transparent',
  },
  rememberMeText: {
    fontSize: 14,
    fontWeight: '100',
    color: '#f3ffff', 
    width: '80%', 
    marginLeft: 10,
  },
  loginButton: {
    height: 50,
    width: '80%',
    backgroundColor: '#ee528f',
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginBottom: 20, 
    // Sombreado para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.25, 
    shadowRadius: 3.84, 
    // Sombreado para Android
    elevation: 5, 
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '200',
    color: '#f3ffff',
  },
});