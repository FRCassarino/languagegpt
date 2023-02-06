import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";

const flags = {
  spanish: require("./assets/spanish.png"),
  italian: require("./assets/italian.png"),
  french: require("./assets/french.png"),
  german: require("./assets/german.png"),
  portuguese: require("./assets/portuguese.png"),
  dutch: require("./assets/dutch.png"),
  swedish: require("./assets/swedish.png"),
  turkish: require("./assets/turkish.png"),
  russian: require("./assets/russian.png"),
  danish: require("./assets/danish.png"),
  norwegian: require("./assets/norwegian.png"),
  polish: require("./assets/polish.png"),
  arabic: require("./assets/arabic.png"),
  greek: require("./assets/greek.png"),
  czech: require("./assets/czech.png"),
};

const languages = [
  { code: "spanish", name: "Spanish" },
  { code: "italian", name: "Italian" },
  { code: "french", name: "French" },
  { code: "german", name: "German" },
  { code: "portuguese", name: "Portuguese" },
  { code: "dutch", name: "Dutch" },
  { code: "swedish", name: "Swedish" },
  { code: "turkish", name: "Turkish" },
  { code: "russian", name: "Russian" },
  { code: "danish", name: "Danish" },
  { code: "norwegian", name: "Norwegian" },
  { code: "polish", name: "Polish" },
  { code: "arabic", name: "Arabic" },
  { code: "greek", name: "Greek" },
  { code: "czech", name: "Czech" },
];

const LanguageSelectionScreen = ({ navigation }) => {
  const [selectedLanguageIndex, setSelectedLanguageIndex] = useState(0);
  const animation = useRef(new Animated.Value(0)).current;

  const handleLeftArrowPress = () => {
    Animated.timing(animation, {
      toValue: -1,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setSelectedLanguageIndex(
        selectedLanguageIndex === 0
          ? languages.length - 1
          : selectedLanguageIndex - 1
      );
      animation.setValue(1);
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleRightArrowPress = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setSelectedLanguageIndex(
        selectedLanguageIndex === languages.length - 1
          ? 0
          : selectedLanguageIndex + 1
      );
      animation.setValue(-1);
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select a Language</Text>
      <View style={styles.languageContainer}>
        <TouchableOpacity onPress={handleLeftArrowPress}>
          <Text style={[styles.arrow, styles.leftArrow]}>{"<"}</Text>
        </TouchableOpacity>
        <Animated.View
          style={[
            styles.flagContainer,
            {
              transform: [
                {
                  translateX: animation.interpolate({
                    inputRange: [-1, 0, 1],
                    outputRange: [-200, 0, 200],
                  }),
                },
              ],
            },
          ]}
        >
          <Image
            source={flags[languages[selectedLanguageIndex].code]}
            style={[styles.flag, styles.largeFlag]}
          />
          <Text style={[styles.language, styles.centeredText]}>
            {languages[selectedLanguageIndex].name}
          </Text>
        </Animated.View>
        <TouchableOpacity onPress={handleRightArrowPress}>
          <Text style={[styles.arrow, styles.rightArrow]}>{">"}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[styles.selectButton, styles.modernButton]}
        onPress={() =>
          navigation.navigate("Chat", {
            language: languages[selectedLanguageIndex].code,
          })
        }
      >
        <Text style={[styles.selectText, styles.modernText]}>Select</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
  },
  languageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  arrow: {
    fontSize: 30,
  },
  flagContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
  },
  flag: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  language: {
    fontSize: 20,
    marginTop: 20,
    textAlign: "center",
  },
  selectButton: {
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 50,
    marginTop: 20,
  },
  selectText: {
    color: "#fff",
    fontSize: 20,
  },
  modernButton: {
    backgroundColor: "#2196f3",
    padding: 15,
    borderRadius: 50,
  },
  modernText: {
    color: "#fff",
    fontSize: 25,
  },
  leftArrow: {
    transform: [{ rotate: "0deg" }],
  },
  rightArrow: {
    transform: [{ rotate: "0deg" }],
  },
});

export default LanguageSelectionScreen;
