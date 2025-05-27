import React, { useState, useLayoutEffect } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, Image, Alert, 
  KeyboardAvoidingView, Platform, Pressable, StyleSheet
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { auth, db } from "./FirebaseConfig"; 
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const SignUpScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [date, setDate] = useState(new Date()); // Initialize with current date
  const [showPicker, setShowPicker] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDateSelected, setIsDateSelected] = useState(false); // Track if date is selected

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Create Account",
      headerBackTitle: "Back",
      headerBackVisible: true,
    });
  }, [navigation]);

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const toggleDatePicker = () => {
    setShowPicker(!showPicker);
  };

  const onChange = (event, selectedDate) => {
    if (event.type === "set" && selectedDate) {
      setDate(selectedDate);
      setIsDateSelected(true); // Mark date as selected
      toggleDatePicker();
    } else {
      toggleDatePicker();
    }
  };

  const getAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleSignup = async () => {
    const dob = date.toISOString().split("T")[0];
    const age = getAge(dob);

    if (name.trim() === "") {
      setErrorMessage("Please enter your name.");
      return;
    } else if (/\d/.test(name)) {
      setErrorMessage("Name cannot contain numbers.");
      return;
    } else if (name.length > 20) {
      setErrorMessage("Name cannot be longer than 20 characters.");
      return;
    } else if (email.trim() === "") {
      setErrorMessage("Please enter your email.");
      return;
    } else if (password === "") {
      setErrorMessage("Please enter a password.");
      return;
    } else if (confirmPass.trim() === "") {
      setErrorMessage("Please confirm your password.");
      return;
    } else if (password !== confirmPass) {
      setErrorMessage("Passwords do not match.");
      return;
    } else if (!validatePassword(password)) {
      setErrorMessage("Password must be at least 8 characters long, include an uppercase letter, and a symbol.");
      return;
    } else if (age < 13) {
      setErrorMessage("You must be at least 13 years old to sign up.");
      return;
    }

    setErrorMessage("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        dob: dob,
        createdAt: new Date().toISOString(),
      });

      navigation.navigate("Home");
    } catch (error) {
      
      if (error.code === "auth/network-request-failed") {
        setErrorMessage("Please try again later.");
      } else if (error.code === "auth/weak-password") {
        setErrorMessage("Password must be at least 8 characters long, include an uppercase letter, and a symbol.");
      } else if (error.code === "auth/email-already-in-use") {
        setErrorMessage("This email is already associated with an account.");
      } else if (error.code === "auth/invalid-email") {
        setErrorMessage("This email is not valid.");
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={styles.inputContainer}>
        <Image source={require("../assets/logo.png")} style={styles.image} resizeMode="contain" />
        <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />
        <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" autoCapitalize="none" />
        <TextInput placeholder="Password" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
        <TextInput placeholder="Confirm Password" value={confirmPass} onChangeText={setConfirmPass} style={styles.input} secureTextEntry />

        <Pressable onPress={toggleDatePicker} style={styles.dateButton}>
          <Text style={styles.dateButtonText}>
            {isDateSelected
              ? date.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "Select Birthdate"}
          </Text>
        </Pressable>

        {showPicker && (
          Platform.OS === "web" ? (
            <input
              type="date"
              value={date.toISOString().split("T")[0]}
              onChange={e => {
                const selectedDate = new Date(e.target.value);
                setDate(selectedDate);
                setIsDateSelected(true);
                setShowPicker(false);
              }}
              style={{
                marginTop: 10,
                padding: 10,
                borderRadius: 10,
                borderColor: "#ccc",
                borderWidth: 1,
                width: "100%",
              }}
            />
          ) : (
            <DateTimePicker
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              value={date}
              onChange={onChange}
              style={Platform.OS === "ios" ? { backgroundColor: "white" } : undefined}
            />
          )
        )}
      </View>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSignup} style={styles.button}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    width: "80%",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  dateButton: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  dateButtonText: {
    fontSize: 16,
    color: 'blue',

    
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  button: {
    backgroundColor: "#0782F9",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
  image: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 20,
  },
});

export default SignUpScreen;