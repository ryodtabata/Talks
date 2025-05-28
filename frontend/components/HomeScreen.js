import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Animated, Text } from "react-native";
import { Audio } from "expo-av";

const HomeScreen = () => {
  const [recording, setRecording] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [latestRecording, setLatestRecording] = useState(null);
  const [sound, setSound] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [soundLevel, setSoundLevel] = useState(0);
  const circleScale = new Animated.Value(1);

  // Animation for the circle based on sound level
  useEffect(() => {
    if (isRecording) {
      Animated.spring(circleScale, {
        toValue: 1 + soundLevel / 500, // Scale based on sound level
        speed: 2, // Increase speed for faster animation
        bounciness: 81, // Reduce bounciness for less elasticity
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(circleScale, {
        toValue: 1, // Reset to normal size
        speed: 2, // Increase speed for faster animation
        bounciness: 1, // Reduce bounciness for less elasticity
        useNativeDriver: true,
      }).start();
    }
  }, [soundLevel, isRecording]);

  async function startRecording() {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access microphone is required!");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await newRecording.startAsync();

      // Start monitoring sound levels
      newRecording.setOnRecordingStatusUpdate((status) => {
        if (status.metering) {
          setSoundLevel(status.metering); // Update sound level
        }
      });

      setRecording(newRecording);
      setIsRecording(true);
    } catch (error) {
      console.error("Failed to start recording", error);
    }
  }

  async function stopRecording() {
    try {
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecordings([...recordings, uri]);
      setLatestRecording(uri);
      setRecording(null);
      setIsRecording(false);
      setSoundLevel(0); // Reset sound level
    } catch (error) {
      console.error("Error stopping recording", error);
    }
  }

  async function playRecording() {
    try {
      if (!latestRecording) return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      const { sound } = await Audio.Sound.createAsync({ uri: latestRecording });
      setSound(sound);
      await sound.setVolumeAsync(1.0);
      await sound.playAsync();
    } catch (error) {
      console.error("Error playing recording", error);
    }
  }

  function clearRecording() {
    setRecordings([]);
    setLatestRecording(null);
  }

  return (
    <View style={styles.container}>
      {/* Big Circle for Recording */}
      <TouchableOpacity
        onPress={isRecording ? stopRecording : startRecording}
        style={styles.circleButton}
      >
        <Animated.View
          style={[
            styles.circle,
            {
              transform: [{ scale: circleScale }],
              backgroundColor: isRecording ? "#ff4444" : "#007bff", // Change color when recording
            },
          ]}
        >
          <Text style={styles.circleText}>
            {isRecording ? "" : ""}
          </Text>
        </Animated.View>
      </TouchableOpacity>

      {/* Play and Clear Buttons */}
      {latestRecording && (
        <TouchableOpacity onPress={playRecording} style={styles.button}>
          <Text style={styles.buttonText}>Play Recording</Text>
        </TouchableOpacity>
      )}
      {recordings.length > 0 && (
        <TouchableOpacity onPress={clearRecording} style={styles.button}>
          <Text style={styles.buttonText}>Clear Recording</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  circleButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  circleText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  button: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#007bff",
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HomeScreen;