import * as React from "react";
import { Text, View, Image } from "react-native";
import { styles } from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "./partials/header";
import AuthUser from "./utils/authUser";

export default function Home() {
  // Check user is signed in
  AuthUser()
  return (
    <>
      <Header />
      <SafeAreaView style={[styles.flexColCenter, styles.page]}>
        <View style={styles.homeContent}>
          <View style={{ width: "60%" }}>
            <Text style={[styles.header, styles.textShadow, { textAlign: "left" }]}>
              Zero Tolerance
            </Text>
            <Text style={[{ width: "100%", fontWeight: "bold" }]}>
              Creating a bully-free environment is our collective responsibility.
              If you witness bullying, report bullying. We can fight bullying
              together.
            </Text>
          </View>
          <Image
            source={require("../assets/person_on_phone.png")}
            style={{ width: "40%", resizeMode: "contain" }}
          />
        </View>
      </SafeAreaView>
    </>
  );
}
