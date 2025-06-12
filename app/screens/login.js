import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";

const { height } = Dimensions.get("window");

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const toggleVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.trim());
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const validateForm = () => {
    let valid = true;

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 8 characters long");
      valid = false;
    } else {
      setPasswordError("");
    }

    return valid;
  };

  const mockSignIn = async () => {
    if (validateForm()) {
      setLoading(true); 
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        console.log("Login successful for:", email);
        navigation.navigate("BottomTabNavigator");
      } catch (error) {
        Alert.alert("Error", "Something went wrong during login.");
      } finally {
        setLoading(false);
      }
    }
  };

  const forgotPasswordPressed = () => {
    navigation.navigate("ForgotPassword");
  };

  const signUpPressed = () => {
    navigation.navigate("SignUp");
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.root}>
        <Text style={styles.title}>Log into your account</Text>

        <CustomInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (emailError) setEmailError(""); 
          }}
          bordercolor={emailError ? "red" : "#ccc"}
          borderRadius={15}
          iconName="mail"
        />
        {emailError && <Text style={styles.errorText}>{emailError}</Text>}

        <View style={styles.passwordContainer}>
          <CustomInput
            placeholder="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (passwordError) setPasswordError(""); 
            }}
            secureTextEntry={!showPassword}
            bordercolor={passwordError ? "red" : "#ccc"}
            borderRadius={15}
            iconName="lock-closed"
          />
          <MaterialCommunityIcons
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color="#7D7D7D"
            style={styles.eyeIcon}
            onPress={toggleVisibility}
          />
        </View>
        {passwordError && (
          <Text style={styles.errorText}>{passwordError}</Text>
        )}

        <Text style={styles.link} onPress={forgotPasswordPressed}>
          Forgot your password?
        </Text>

        <View style={styles.bottomSection}>
          <CustomButton
            onPress={mockSignIn}
            bg="#F76F6F"
            txt="white"
            style={styles.button}
            text={loading ? "Processing..." : "Next"}
            disabled={loading}
          />
          <Text style={styles.text}>
            Don't have an account?{" "}
            <Text style={styles.link} onPress={signUpPressed}>
              Sign Up
            </Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  root: {
    alignItems: "center",
    padding: 20,
    marginTop: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
    marginBottom: 20,
  },
  passwordContainer: {
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 20,
    top: 15,
  },
  link: {
    color: "#FB3333",
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  bottomSection: {
    marginTop: 50,
    width: "100%",
    alignItems: "center",
  },
  button: {
    marginVertical: 20,
  },
  text: {
    textAlign: "center",
    marginTop: 20,
  },
  errorText: {
    color: "red",
    marginTop: 5,
    marginBottom: 10,
  },
});

export default LogIn;