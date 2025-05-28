import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Image
} from "react-native";
import { useNavigation } from "@react-navigation/native";


  // TO DO
  // Forgot Password handler, and go to home page if already logged in, useeffect 

const LoginScreen = () => {
  //use states for fields 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleLogin = async (e) => {
    //nneed to update this logic, only doing frontend at the moment
  };

  const handleForgotPassword = async () => {
    //neeed to naldle this in db later
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Image 
        source={require('../assets/fulllogo.png')}
        style={styles.image} 
        resizeMode="contain"
      />
      
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
      </View>

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleLogin} style={[styles.button, styles.buttonOutline]}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPasswordButton}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <Text style={styles.text}>Don't have an Account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.createAccountText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};
export default LoginScreen;

const styles = StyleSheet.create({

  forgotPasswordText:{
    color: 'blue'
  },
 
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    width: "80%",
    height: "12%"
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
    width: "100%",
    fontSize: 16
  },
  buttonContainer: {
    width: "80%",
    marginTop: 20,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
    
  },
  buttonOutline: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "grey",
  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16
  },

  image: {
    width: 300,
    height: 150,
    margin:15,
  },

  text:{
    marginTop: 50
  },

  createAccountText:{
    color: "blue"
  },

  errorText: {
    color: "red",
    marginTop: 20,
    marginBottom: 10,
    fontSize: 14,
    textAlign: 'center'
  },

});
