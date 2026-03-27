import * as React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "../styles";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons/faHouse";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons/faPaperPlane";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons/faCircleExclamation";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons/faCircleInfo";

export default function Header() {
  // Creating the navigation object to allow redirecting
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.navigationContainer}>
      <TouchableOpacity
        style={[styles.navItem, styles.comboButton, { padding: 12 }]}
        onPress={() => {
          navigation.navigate("Home");
        }}
      >
        <FontAwesomeIcon icon={faHouse} size={20} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navItem, styles.reportButton]}
        onPress={() => {
          navigation.navigate("Report");
        }}
      >
        <FontAwesomeIcon
          icon={faCircleExclamation}
          size={25}
          style={{ marginRight: 10 }}
        />
        <Text style={styles.section}>Report a Bully</Text>
      </TouchableOpacity>
      <View style={[styles.comboButton, styles.navItem, { padding: 0 }]}>
        <TouchableOpacity
          style={[styles.comboButton, { padding: 12 }]}
          onPress={() => {
            navigation.navigate("Contact");
          }}
        >
          <FontAwesomeIcon icon={faPaperPlane} size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.comboButton, { padding: 12 }]}
          onPress={() => {
            navigation.navigate("About");
          }}
        >
          <FontAwesomeIcon icon={faCircleInfo} size={20} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
