import auth from "@react-native-firebase/auth";
import { useNavigation } from '@react-navigation/native';

export default function AuthUser() {
  // Creating the navigation object to allow redirecting
  const navigation = useNavigation();
  // Getting the current user from firebase auth
  user = auth().currentUser
  /*
   * Checking if the user is logged in with an abet email, returning user object.
   * Otherwise redirecting to login.
   */
  if (user && user.email.endsWith("@abet.co.in")) {
    return user
  } else {
    navigation.navigate("Login")
    return
  }
}
