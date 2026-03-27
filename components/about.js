import * as React from "react";
import { Text, TouchableOpacity, ScrollView } from "react-native";
import * as Linking from "expo-linking";
import { styles } from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Header from "./partials/header";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons/faRightFromBracket";
import AuthUser from "./utils/authUser";
import auth from "@react-native-firebase/auth";

export default function About() {
  // Check user is signed in
  AuthUser();
  // Creating the navigation object to allow redirecting on logout
  const navigation = useNavigation();
  return (
    <>
      <Header />
      <SafeAreaView style={[styles.flexCol, styles.page]}>
        <ScrollView style={{width: "100%"}} showsVerticalScrollIndicator={false}>
          <Text style={[styles.header, styles.textShadow]}>About</Text>
          <Text style={[{ width: "100%", marginBottom: 10 }]}>
            Witnessed bullying? Been a victim of bullying yourself? No worries,
            you can report all such incidents on this app. Simply fill up the
            report form and the incident will be anonymously sent to counsellors
            to look at. If you need to talk to someone, there is also an option to
            contact the relevant ABWA staff.
          </Text>
          <Text style={styles.section}>Why should bullying be reported?</Text>
          <Text style={[{ width: "100%", marginBottom: 10 }]}>
            Bullying is a harmful behavior that can have serious consequences for victims. It can take many forms, including:{"\n"}

            Physical bullying: This involves hurting someone physically, such as hitting, kicking, or tripping them.{"\n"}
            Verbal bullying: This involves using words to hurt someone, such as name-calling, teasing, or making threats.{"\n"}
            Social bullying: This involves excluding someone from a group or spreading rumors about them.{"\n"}
            Cyberbullying: This involves using technology to bully someone, such as sending them mean messages or posting embarrassing photos of them online.{"\n"}
            {"\n"}
            It's important to report bullying because it can have a significant impact on victims' mental and emotional well-being. Bullying can lead to:{"\n"}
            Low self-esteem{"\n"}
            Depression{"\n"}
            Anxiety{"\n"}
            Difficulty concentrating{"\n"}
            and even physical symptoms{"\n"}
            {"\n"}
            Reporting bullying can help to stop the behavior and provide support for victims. If you or someone you know is being bullied, it's important to talk to a trusted adult, such as a parent, teacher, or counselor.
          </Text>
          <Text style={styles.section}>Feedback</Text>
          <Text style={[{ width: "100%", marginBottom: 20 }]}>
            Feel free to share your thoughts and experiences to <Text style={{textDecorationLine: "underline"}} onPress={() => Linking.openURL("mailto:abwa.hriday.koppikar2018@abet.co.in")}>abwa.hriday.koppikar2018@abet.co.in</Text>. Your feedback will help us improve our app to better fit the needs
            of our users.
          </Text>
          <Text style={styles.section}>Privacy and security</Text>
          <Text style={[{ width: "100%", marginBottom: 20 }]}>
            Zero Tolerance ensures that all reports are stored confidentially and that they remain anonymous unless the reporter specifies their inclusion. Reports sent are only accessible by the counsellors and the discipline coordinator.
          </Text>
          <Text style={styles.section}>More about Zero Tolerance</Text>
          <Text style={[{ width: "100%", marginBottom: 20 }]}>
            Zero Tolerance was made as a part of the ABWA App Development Competition
            2024 by Arjun Pathak, Hriday Koppikar and Suhaan Mobhani. It is linked
            to its own counsellor portal allowing monitoring and resolution of
            bullying reports.
          </Text>
          <Text style={[{ width: "100%", marginBottom: 30 }]}>
            Zero Tolerance was built with React Native Expo as the app development platform, along with Firebase for authentication and database services. It is available on Android, iOS and Web (untested).
          </Text>
          <TouchableOpacity
            style={[
              styles.reportButton,
              {
                marginBottom: "auto",
                width: "100%",
                padding: 20,
                paddingHorizontal: 30,
                marginBottom: 30,
              },
            ]}
            onPress={() =>
              auth()
                .signOut()
                .then(() => {
                  navigation.navigate("Login");
                })
            }
          >
            <Text style={styles.section}>Log Out</Text>
            <FontAwesomeIcon icon={faRightFromBracket} size={20} />
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
