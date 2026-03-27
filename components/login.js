import * as React from "react";
import { Text, TouchableOpacity } from "react-native";
import { styles } from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons/faGoogle";

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from "@react-native-firebase/auth";

GoogleSignin.configure({
  webClientId: '768291671311-aj6lp41a4kfa2g92lvq0sue17anihstn.apps.googleusercontent.com',
});

export default function Login() {
  // Creating the navigation object to allow redirecting
  const navigation = useNavigation();
  // Creating variable for error messages
  const [errorMessage, setErrorMessage] = React.useState("");

  /*
   * Uses the firebase auth api to sign in with Google.
   */
  async function signInWithGoogle() {
    // Ensure Google Play Services is installed and enabled
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    
    // Getting ID token
    const { idToken } = await GoogleSignin.signIn();

    // Getting credential
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Use the credential to sign in the user
    await auth().signInWithCredential(googleCredential);

    return checkABETUser()
  }

  /*
   * Checks users email to see if they are an ABET user.
   */
  function checkABETUser() {
    const user = auth().currentUser
    if (user.email.endsWith("@abet.co.in")) {
      navigation.navigate("Home")
    } else {
      setErrorMessage("You are not an ABET user. Please sign in with your school provided ABET account.")
      auth().signOut()
    }
  }
  return (
    <SafeAreaView style={[styles.flexColCenter, styles.page]}>
      <Text style={[styles.header, styles.textShadow, { fontSize: 30, color: "#6482AD" }]}>
        Zero Tolerance
      </Text>
      <TouchableOpacity style={styles.loginButton} onPress={() => signInWithGoogle()}>
        <FontAwesomeIcon icon={ faGoogle } size={ 40 } color="#E2DAD6" />
        <Text style={[styles.section, { marginLeft: 30, color: "#E2DAD6", }]}>Login with your ABET email.</Text>
      </TouchableOpacity>
      <Text style={[styles.dangerText, { marginTop: 30 }]}>{errorMessage}</Text>
    </SafeAreaView>
  )
}