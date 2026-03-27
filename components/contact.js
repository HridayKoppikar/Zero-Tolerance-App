import * as React from "react";
import {
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  View,
} from "react-native";
import { styles } from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "./partials/header";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons/faPaperPlane";
import AuthUser from "./utils/authUser";
import * as crypto from "crypto-js";
import firestore, {
  Filter,
  serverTimestamp,
} from "@react-native-firebase/firestore";
import Message from "./partials/message";

export default function Contact() {
  // Check user is signed in
  const user = AuthUser();

  // Calculating message key
  const messageKey = crypto.SHA3(user.uid).toString();

  // Set reference for end of chat for autoscroll
  const messageContainer = React.useRef();

  // Setting state for chatbox
  const [messages, setMessages] = React.useState([]);

  // Setting states for messaging form
  const [content, setContent] = React.useState("");

  // Setting states for error messages
  const [errorMessage, setErrorMessage] = React.useState("");
  const [contentBlank, setContentBlank] = React.useState(false);

  React.useEffect(() => {
    firestore()
    .collection("Messages")
    .onSnapshot(
      (querySnapshot) => {
        getMessages()
      }
    )
  }, []);

  React.useEffect(() => {
    getMessages()
  }, [])


  async function getMessages() {
    await firestore()
      .collection("Messages")
      .where(
        Filter.or(
          Filter("to", "==", messageKey),
          Filter("from", "==", messageKey),
        ),
      )
      .get()
      .then((querySnapshot) => {
        let times = querySnapshot.docs.map((doc) => [doc, doc.data().timestamp]);
        times.sort((a, b) => a[1] - b[1]);
        timesortedDocs = times.map((doc) => doc[0]);
        let m_arr = [];
        timesortedDocs.forEach((doc) => {
          m_arr.push(
            <Message
              key={doc.id}
              doc={doc.data()}
              isMine={doc.data().from === messageKey}
            />,
          );
        });
        setMessages(m_arr);
        messageContainer.current.scrollToEnd();
      })
      .catch((err) => setErrorMessage(err.message));
  }

  function send() {
    if (content.length > 0) {
      firestore()
        .collection("Messages")
        .add({
          from: messageKey,
          to: "COUNSELLORS",
          message: content,
          timestamp: serverTimestamp(),
        })
        .then(() => {
          setContent("");
          setContentBlank(false);
        })
        .catch((err) => setErrorMessage(err.message));
    } else {
      setContentBlank(true);
      setErrorMessage("Please enter a message.");
    }
  }

  return (
    <>
      <Header />
      <SafeAreaView style={[styles.flexCol, styles.page]}>
        <Text style={[styles.header, styles.textShadow]}>
          Need to speak to someone?
        </Text>

        <ScrollView style={{ width: "100%" }}  ref={messageContainer}>
          {messages}
        </ScrollView>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            marginTop: 15,
          }}
        >
          <TextInput
            value={content}
            onChangeText={setContent}
            style={[
              styles.input,
              {
                borderColor: "#B90000",
                borderWidth: contentBlank ? 2 : 0,
                width: "80%",
                padding: 10,
              },
            ]}
            maxLength={1000}
            onChange={() => setContentBlank(false)}
            multiline={true}
          />

          <TouchableOpacity
            onPress={() => send()}
            style={[
              styles.reportButton,
              {
                paddingHorizontal: 15,
                paddingVertical: 15,
                backgroundColor: "#7FA1C3",
                borderRadius: 50,
              },
            ]}
          >
            <FontAwesomeIcon icon={faPaperPlane} size={20} color="#E8E8E8" />
          </TouchableOpacity>
        </View>
        <Text style={[styles.dangerText, styles.smallText, {marginTop: 0, marginLeft: 0, marginRight: 50}]}>
          {errorMessage}
        </Text>
      </SafeAreaView>
    </>
  );
}
