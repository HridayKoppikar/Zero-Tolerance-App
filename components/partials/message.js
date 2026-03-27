import * as React from "react";
import {
  Text,
} from "react-native";

export default function Message(props) {
  return (
    <Text style={{marginVertical:3, padding: 12, borderRadius: 18, backgroundColor: props.isMine ? "#F5EDED" : "#ECE4E2", marginLeft: props.isMine ? "auto" : 0, marginRight: props.isMine ? 0 : "auto"}}>{props.doc.message}</Text>
  );
}
