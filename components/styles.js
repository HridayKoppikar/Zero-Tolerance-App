import { StyleSheet } from "react-native";

//Defining styles
export const styles = StyleSheet.create({
  // Page style
  page: {
    backgroundColor: "#E2DAD6",
    paddingHorizontal: 30,
    flex: 1,
  },

  // Layout styles
  homeContent: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    padding: 15,
  },
  flexCol: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    height: "100%",
  },
  flexColCenter: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },

  // Navigation styles
  navigationContainer: {
    backgroundColor: "#7FA1C3",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    zIndex: 3,
    elevation: 3,
  },
  navItem: {
    marginVertical: 12.5,
  },

  // Text styles
  header: {
    fontSize: 30,
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "center",
  },
  subhead: {
    fontSize: 25,
    fontWeight: "bold",
  },
  section: {
    fontSize: 20,
    fontWeight: "bold",
  },
  smallText: {
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 10,
    marginTop: 15,
    marginBottom: 5,
  },
  dangerText: {
    color: "#B90000",
  },
  textShadow: {
    width: "100%",
    textShadowColor: "#86A4CF",
    textShadowRadius: 20,
  },

  // Button styles
  comboButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E2DAD6",
    borderRadius: 24,
  },
  reportButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 12.5,
    borderRadius: 50,
    backgroundColor: "#FF7A7A"
  },
  loginButton: {
    backgroundColor: "#7FA1C3",
    padding: 40,
    borderRadius: 100,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  emailButton: {
    width: "100%",
    backgroundColor: "#F5EDED",
    padding: 20,
    paddingHorizontal: 30,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 36,
    marginVertical: 15,
  },

  // Input styles
  input: {
    padding: 5,
    paddingHorizontal: 15,
    borderRadius: 24,
    width: "100%",
    backgroundColor: "#E8E8E8",
  },
  inputPicker: {
    padding: 7,
    paddingHorizontal: 15,
    borderRadius: 24,
    width: "100%",
    backgroundColor: "#E8E8E8",
  },
  pickerSelected: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "#E8E8E8",
    marginTop: 8,
    marginRight: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    elevation: 2,
  },
  pickerSelectedText: {
    marginRight: 7,
    fontSize: 16,
  },
});
