import * as React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { styles } from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "./partials/header";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons/faXmarkCircle";
import { faCircleChevronRight } from "@fortawesome/free-solid-svg-icons/faCircleChevronRight";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons/faCalendarDays";
import AuthUser from "./utils/authUser";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import CalendarPicker from "react-native-calendar-picker";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Form() {
  // Check user is signed in and store the user object
  const user = AuthUser();
  // Creating the navigation object to allow redirecting
  const navigation = useNavigation();

  /*
   * Gets a user's full name from their email address.
   */
  function getName() {
    firstName = user.email.split(".")[1];
    lastName = user.email.split(".")[2].split("@")[0].slice(0, -4);

    return (
      firstName.charAt(0).toUpperCase() +
      firstName.slice(1) +
      " " +
      lastName.charAt(0).toUpperCase() +
      lastName.slice(1)
    );
  }

  /*
   * Returns formatted date in the format "DD/MM/YYYY".
   */
  function getFullDate(d) {
    if (!d) return "Unspecified";
    function pad(s) {
      return s < 10 ? "0" + s : s;
    }
    return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join("/");
  }

  /*
   * Checks that all required inputs are filled.
   * Updates the relevant boolean to trigger the error message.
   */
  function validateData() {
    let valid = true;

    // Presence checks
    if (mode.length === 0) {
      valid = false;
      setModeBlank(true);
    }
    if (mode === "IP" && location.length === 0) {
      valid = false;
      setLocationBlank(true);
    }
    if (category.length === 0) {
      valid = false;
      setCategoryBlank(true);
    }
    if (category.includes("other") && otherCategory === "") {
      valid = false;
      setOtherCategoryBlank(true);
    }
    if (bullyName === "") {
      valid = false;
      setBullyNameBlank(true);
    }
    if (victimName === "") {
      valid = false;
      setVictimNameBlank(true);
    }
    if (gradesInvolved.length === 0) {
      valid = false;
      setGradesInvolvedBlank(true);
    }
    if (adultsPresent === null) {
      valid = false;
      setAdultsPresentBlank(true);
    }
    if (includeName === null) {
      valid = false;
      setIncludeNameBlank(true);
    }

    return valid;
  }

  /*
   * Enforces a ratelimit of 3 reports per user per day.
   * Keeps track of daily report count in cache.
   * There are better ways to enforce this rate limit, but those require the use of Firebase cloud functions, which is a paid service.
   */
  async function validateRate() {
    const submissionCounter = JSON.parse(
      await AsyncStorage.getItem("submissionCounter"),
    );
    if (
      !submissionCounter ||
      submissionCounter.date !== getFullDate(new Date())
    ) {
      await AsyncStorage.setItem(
        "submissionCounter",
        JSON.stringify({ date: getFullDate(new Date()), count: 1 }),
      );
    } else if (submissionCounter.count >= 3) {
      Alert.alert(
        "Exceeded Report Limit",
        "You have reached the maximum number of reports allowed for today. Please try again tomorrow.",
      );
      return false;
    } else {
      await AsyncStorage.setItem(
        "submissionCounter",
        JSON.stringify({
          date: submissionCounter.date,
          count: submissionCounter.count + 1,
        }),
      );
    }
    return true;
  }

  /*
   * Calls validateData() and validateRate() to ensure that the data is valid and the ratelimit is followed.
   * Collects the data from the form and calls getName() if necessary.
   * Creates a new document in the Reports collection with the data.
   * Displays confirmation message and redirects user to home.
   */
  async function submit() {
    if (!validateData() || !(await validateRate())) return false;
    const report = {
      mode,
      location,
      category,
      otherCategory,
      bullyingTime: {
        startDate: bullyingTimeStartDate,
        endDate: bullyingTimeEndDate,
      },
      bullyName,
      victimName,
      witnesses,
      gradesInvolved,
      adultsPresent,
      additionalDetails,
      reporter: includeName ? getName() : "",
      reportedTime: new Date(),
      resolved: false,
      notes: "",
    };
    firestore()
      .collection("Reports")
      .add(report)
      .then(() => {
        Alert.alert(
          "Report Submitted",
          "Thank you for reporting this incident. The counsellors will look into it as soon as possible.",
        );
        navigation.navigate("Home");
      })
      .catch((err) => {
        setErrorMessage(err.message);
      });
  }

  // Setting states for form inputs
  const [mode, setMode] = React.useState([]);
  const modeItems = [
    { label: "Online", value: "O" },
    { label: "In Person", value: "IP" },
  ];

  const [location, setLocation] = React.useState([]);
  const locationItems = [
    { label: "In School", value: "IS" },
    { label: "Outside School", value: "OS" },
    { label: "On the School Bus", value: "SB" },
  ];

  const [category, setCategory] = React.useState([]);
  const categoryItems = [
    { label: "Physical Bullying", value: "physical" },
    { label: "Verbal Bullying", value: "verbal" },
    { label: "Social Isolation", value: "social_isolation" },
    { label: "Cyberbullying", value: "cyberbullying" },
    { label: "Relational Aggression", value: "relational_aggression" },
    { label: "Racial Bullying", value: "racial_bullying" },
    { label: "Gender-Based Bullying", value: "gender_based_bullying" },
    { label: "Other", value: "other" },
  ];

  const [otherCategory, setOtherCategory] = React.useState("");

  const [bullyName, setBullyName] = React.useState("");

  const [victimName, setVictimName] = React.useState("");

  const [witnesses, setWitnesses] = React.useState("");

  const [gradesInvolved, setGradesInvolved] = React.useState([]);
  const gradesInvolvedItems = [
    { label: "6A", value: "6A" },
    { label: "6B", value: "6B" },
    { label: "6C", value: "6C" },
    { label: "7A", value: "7A" },
    { label: "7B", value: "7B" },
    { label: "7C", value: "7C" },
    { label: "8A", value: "8A" },
    { label: "8B", value: "8B" },
    { label: "8C", value: "8C" },
    { label: "9A", value: "9A" },
    { label: "9B", value: "9B" },
    { label: "9C", value: "9C" },
    { label: "10A", value: "10A" },
    { label: "10B", value: "10B" },
    { label: "10C", value: "10C" },
    { label: "11 AS", value: "11AS" },
    { label: "11 IB", value: "11IB" },
    { label: "12 AL", value: "12AL" },
    { label: "12 IB", value: "12IB" },
  ];

  const [adultsPresent, setAdultsPresent] = React.useState(null);

  const [includeName, setIncludeName] = React.useState(null);

  const [additionalDetails, setAdditionalDetails] = React.useState(null);

  const yesNoItems = [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ];

  const [bullyingTimeStartDate, setBullyingTimeStartDate] =
    React.useState(null);
  const [bullyingTimeEndDate, setBullyingTimeEndDate] = React.useState(null);
  const [datePickerOpen, setDatePickerOpen] = React.useState(false);

  // Setting states for error messages
  const [errorMessage, setErrorMessage] = React.useState("");

  const [modeBlank, setModeBlank] = React.useState(false);
  const [locationBlank, setLocationBlank] = React.useState(false);
  const [categoryBlank, setCategoryBlank] = React.useState(false);
  const [otherCategoryBlank, setOtherCategoryBlank] = React.useState(false);
  const [bullyNameBlank, setBullyNameBlank] = React.useState(false);
  const [victimNameBlank, setVictimNameBlank] = React.useState(false);
  const [gradesInvolvedBlank, setGradesInvolvedBlank] = React.useState(false);
  const [adultsPresentBlank, setAdultsPresentBlank] = React.useState(false);
  const [includeNameBlank, setIncludeNameBlank] = React.useState(false);
  
  return (
    <>
      <Header />
      <ScrollView style={{ backgroundColor: "#E2DAD6" }}>
        <SafeAreaView style={styles.page}>
          <Text style={[styles.header, styles.textShadow]}>Report</Text>
          <Text style={[styles.smallText]}>
            Were you bullied online, in person, or both?
            <Text style={[styles.dangerText, styles.smallText]}>*</Text>
          </Text>
          <MultiSelect
            style={[
              styles.inputPicker,
              { borderColor: "#B90000", borderWidth: modeBlank ? 2 : 0 },
            ]}
            data={modeItems}
            maxHeight={500}
            labelField="label"
            valueField="value"
            placeholder="Select an item"
            value={mode}
            onChange={(item) => {
              setMode(item);
              setModeBlank(false);
            }}
            renderSelectedItem={(item, unSelect) => (
              <TouchableOpacity
                onPress={() => {
                  unSelect(item);
                }}
              >
                <View style={styles.pickerSelected}>
                  <Text style={styles.pickerSelectedText}>{item.label}</Text>
                  <FontAwesomeIcon icon={faXmarkCircle} size={17} />
                </View>
              </TouchableOpacity>
            )}
          />
          {modeBlank ? (
            <>
              <Text style={[styles.dangerText, styles.smallText]}>
                Please specify the mode of bullying.
              </Text>
            </>
          ) : (
            <></>
          )}

          {mode.includes("IP") ? (
            <>
              <Text style={styles.smallText}>
                If you were bullied in person, where were you bullied?
                <Text style={[styles.dangerText, styles.smallText]}>*</Text>
              </Text>
              <MultiSelect
                style={[
                  styles.inputPicker,
                  {
                    borderColor: "#B90000",
                    borderWidth: locationBlank ? 2 : 0,
                  },
                ]}
                data={locationItems}
                maxHeight={500}
                labelField="label"
                valueField="value"
                placeholder="Select an item"
                value={location}
                onChange={(item) => {
                  setLocation(item);
                  setLocationBlank(false);
                }}
                renderSelectedItem={(item, unSelect) => (
                  <TouchableOpacity
                    onPress={() => {
                      unSelect(item);
                    }}
                  >
                    <View style={styles.pickerSelected}>
                      <Text style={styles.pickerSelectedText}>
                        {item.label}
                      </Text>
                      <FontAwesomeIcon icon={faXmarkCircle} size={17} />
                    </View>
                  </TouchableOpacity>
                )}
              />
              {locationBlank ? (
                <>
                  <Text style={[styles.dangerText, styles.smallText]}>
                    Please specify the location of bullying.
                  </Text>
                </>
              ) : (
                <></>
              )}
            </>
          ) : (
            <></>
          )}

          <Text style={styles.smallText}>
            How were you being bullied?
            <Text style={[styles.dangerText, styles.smallText]}>*</Text>
          </Text>
          <MultiSelect
            style={[
              styles.inputPicker,
              { borderColor: "#B90000", borderWidth: categoryBlank ? 2 : 0 },
            ]}
            mode="modal"
            data={categoryItems}
            maxHeight={500}
            labelField="label"
            valueField="value"
            placeholder="Select an item"
            value={category}
            onChange={(item) => {
              setCategory(item);
              setCategoryBlank(false);
            }}
            renderSelectedItem={(item, unSelect) => (
              <TouchableOpacity
                onPress={() => {
                  unSelect(item);
                }}
              >
                <View style={styles.pickerSelected}>
                  <Text style={styles.pickerSelectedText}>{item.label}</Text>
                  <FontAwesomeIcon icon={faXmarkCircle} size={17} />
                </View>
              </TouchableOpacity>
            )}
          />
          {categoryBlank ? (
            <>
              <Text style={[styles.dangerText, styles.smallText]}>
                Please specify the category of bullying.
              </Text>
            </>
          ) : (
            <></>
          )}

          {category.includes("other") ? (
            <>
              <Text style={styles.smallText}>
                Describe the type of bullying if it does not fit into the other
                categories.
                <Text style={[styles.dangerText, styles.smallText]}>*</Text>
              </Text>
              <TextInput
                value={otherCategory}
                onChangeText={setOtherCategory}
                style={[
                  styles.input,
                  {
                    borderColor: "#B90000",
                    borderWidth: otherCategoryBlank ? 2 : 0,
                  },
                ]}
                maxLength={100}
                onChange={() => setOtherCategoryBlank(false)}
              />
              {otherCategoryBlank ? (
                <>
                  <Text style={[styles.dangerText, styles.smallText]}>
                    Please specify the category of bullying.
                  </Text>
                </>
              ) : (
                <></>
              )}
            </>
          ) : (
            <></>
          )}

          <Text style={styles.smallText}>
            Were you being bullied during a specific time period?
          </Text>
          <TouchableOpacity
            style={[
              styles.inputPicker,
              {
                padding: 10,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: datePickerOpen ? 20 : 0,
              },
            ]}
            onPress={() => setDatePickerOpen(!datePickerOpen)}
          >
            <Text>
              {bullyingTimeStartDate
                ? getFullDate(bullyingTimeStartDate) +
                  " - " +
                  getFullDate(bullyingTimeEndDate)
                : "Choose date..."}
            </Text>
            <FontAwesomeIcon icon={faCalendarDays} size={20} />
          </TouchableOpacity>
          {datePickerOpen ? (
            <>
              <CalendarPicker
                startFromMonday={true}
                allowRangeSelection={true}
                allowBackwardRangeSelect={true}
                minDate={new Date() - 31556952000}
                maxDate={new Date()}
                todayBackgroundColor="#7FA1C3"
                selectedDayColor="#6482AD"
                selectedDayTextColor="#FFFFFF"
                onDateChange={(date, type) => {
                  if (type === "END_DATE") {
                    setBullyingTimeEndDate(date);
                  } else {
                    setBullyingTimeStartDate(date);
                  }
                }}
                selectedStartDate={bullyingTimeStartDate}
                selectedEndDate={bullyingTimeEndDate}
              />
              <TouchableOpacity
                onPress={() => {
                  setBullyingTimeStartDate(null);
                  setBullyingTimeEndDate(null);
                }}
                style={{
                  width: "100%",
                  padding: 7,
                  borderRadius: 24,
                  borderWidth: 1,
                  marginTop: 5,
                  marginBottom: 20,
                }}
              >
                <Text style={{ width: "100%", textAlign: "center" }}>
                  Clear
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <></>
          )}

          <Text style={styles.smallText}>
            List the name(s) of the bully(ies).
            <Text style={[styles.dangerText, styles.smallText]}>*</Text>
          </Text>
          <TextInput
            value={bullyName}
            onChangeText={setBullyName}
            style={[
              styles.input,
              { borderColor: "#B90000", borderWidth: bullyNameBlank ? 2 : 0 },
            ]}
            maxLength={100}
            onChange={() => setBullyNameBlank(false)}
          />
          {bullyNameBlank ? (
            <>
              <Text style={[styles.dangerText, styles.smallText]}>
                Please specify the name(s) of the bully(ies). Enter unknown if
                you are unaware of their name.
              </Text>
            </>
          ) : (
            <></>
          )}

          <Text style={styles.smallText}>
            List the name(s) of the victim(s).
            <Text style={[styles.dangerText, styles.smallText]}>*</Text>
          </Text>
          <TextInput
            value={victimName}
            onChangeText={setVictimName}
            style={[
              styles.input,
              { borderColor: "#B90000", borderWidth: victimNameBlank ? 2 : 0 },
            ]}
            maxLength={100}
            onChange={() => setVictimNameBlank(false)}
          />
          {victimNameBlank ? (
            <>
              <Text style={[styles.dangerText, styles.smallText]}>
                Please specify the name(s) of the victim(s). Enter unknown if
                you are unaware of their name.
              </Text>
            </>
          ) : (
            <></>
          )}

          <Text style={styles.smallText}>
            List the name(s) of the witness(es), if any.
          </Text>
          <TextInput
            value={witnesses}
            onChangeText={setWitnesses}
            style={styles.input}
            maxLength={100}
          />

          <Text style={styles.smallText}>
            Which grades were involved?
            <Text style={[styles.dangerText, styles.smallText]}>*</Text>
          </Text>
          <MultiSelect
            style={[
              styles.inputPicker,
              {
                borderColor: "#B90000",
                borderWidth: gradesInvolvedBlank ? 2 : 0,
              },
            ]}
            mode="modal"
            data={gradesInvolvedItems}
            search
            maxHeight={500}
            labelField="label"
            valueField="value"
            placeholder="Select an item"
            searchPlaceholder="Search..."
            value={gradesInvolved}
            onChange={(item) => {
              setGradesInvolved(item);
              setGradesInvolvedBlank(false);
            }}
            renderSelectedItem={(item, unSelect) => (
              <TouchableOpacity
                onPress={() => {
                  unSelect(item);
                }}
              >
                <View style={styles.pickerSelected}>
                  <Text style={styles.pickerSelectedText}>{item.label}</Text>
                  <FontAwesomeIcon icon={faXmarkCircle} size={17} />
                </View>
              </TouchableOpacity>
            )}
          />
          {gradesInvolvedBlank === true ? (
            <>
              <Text style={[styles.dangerText, styles.smallText]}>
                Please specify which grades were involved.
              </Text>
            </>
          ) : (
            <></>
          )}

          <Text style={styles.smallText}>
            Were any adults/teachers present?
            <Text style={[styles.dangerText, styles.smallText]}>*</Text>
          </Text>
          <Dropdown
            style={[
              styles.inputPicker,
              {
                borderColor: "#B90000",
                borderWidth: adultsPresentBlank ? 2 : 0,
              },
            ]}
            data={yesNoItems}
            maxHeight={500}
            labelField="label"
            valueField="value"
            placeholder="Select an item"
            value={adultsPresent}
            onChange={(item) => {
              setAdultsPresent(item.value);
              setAdultsPresentBlank(false);
            }}
          />
          {adultsPresentBlank ? (
            <>
              <Text style={[styles.dangerText, styles.smallText]}>
                Please specify if any adults/teachers were present.
              </Text>
            </>
          ) : (
            <></>
          )}

          <Text style={styles.smallText}>
            Would you like to include your name as the reporter of this
            incident?
            <Text style={[styles.dangerText, styles.smallText]}>*</Text>
          </Text>
          <Dropdown
            style={[
              styles.inputPicker,
              { borderColor: "#B90000", borderWidth: includeNameBlank ? 2 : 0 },
            ]}
            data={yesNoItems}
            maxHeight={500}
            labelField="label"
            valueField="value"
            placeholder="Select an item"
            value={includeName}
            onChange={(item) => {
              setIncludeName(item.value);
              setIncludeNameBlank(false);
            }}
          />
          {includeNameBlank ? (
            <>
              <Text style={[styles.dangerText, styles.smallText]}>
                Please choose whether to include your name in this report.
              </Text>
            </>
          ) : (
            <></>
          )}

          <Text style={styles.smallText}>
            Please add any additional details here.
          </Text>
          <TextInput
            value={additionalDetails}
            onChangeText={setAdditionalDetails}
            style={[
              styles.input,
              {
                height: 200,
                textAlignVertical: "top",
                paddingVertical: 15,
              },
            ]}
            maxLength={1000}
            multiline={true}
          />

          <Text style={[styles.dangerText, styles.smallText]}>
            {errorMessage}
          </Text>

          <TouchableOpacity
            onPress={() => submit()}
            style={[
              styles.reportButton,
              {
                padding: 20,
                marginBottom: 30,
                width: "100%",
                paddingHorizontal: 30,
              },
            ]}
          >
            <Text style={[styles.section]}>Report</Text>
            <FontAwesomeIcon icon={faCircleChevronRight} size={20} />
          </TouchableOpacity>
        </SafeAreaView>
      </ScrollView>
    </>
  );
}
