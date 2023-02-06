import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
import { Asset } from 'expo-asset';


const flags = {
  spanish: require("./assets/flags/spanish.png"),
  italian: require("./assets/flags/italian.png"),
  french: require("./assets/flags/french.png"),
  german: require("./assets/flags/german.png"),
  portuguese: require("./assets/flags/portuguese.png"),
  dutch: require("./assets/flags/dutch.png"),
  swedish: require("./assets/flags/swedish.png"),
  turkish: require("./assets/flags/turkish.png"),
  russian: require("./assets/flags/russian.png"),
  danish: require("./assets/flags/danish.png"),
  norwegian: require("./assets/flags/norwegian.png"),
  polish: require("./assets/flags/polish.png"),
  arabic: require("./assets/flags/arabic.png"),
  greek: require("./assets/flags/greek.png"),
  czech: require("./assets/flags/czech.png"),
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

  useEffect(() => {
    (async () => {
      await Asset.loadAsync(languages.map((language) => flags[language.code]));
    })();
    return () => {};
  }, []);

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
          <Text style={styles.arrow}>{"<"}</Text>
        </TouchableOpacity>
        <Animated.View
          style={[
            styles.flagContainer,
            {
              transform: [
                {
                  translateX: animation.interpolate({
                    inputRange: [-1, 0, 1],
                    outputRange: [-500, 0, 500],
                  }),
                },
              ],
            },
          ]}
        > 
          <View >
            <Image
              source={flags[languages[selectedLanguageIndex].code]}
              style={[styles.flag]}
            />
            <Text style={[styles.language]}>
              {languages[selectedLanguageIndex].name}
            </Text>
          </View>
        </Animated.View>
        <TouchableOpacity onPress={handleRightArrowPress}>
          <Text style={styles.arrow}>{">"}</Text>
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
    fontSize: 50,
    marginBottom: 25,
  },
  flagContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
  },
  flag: {
    width: 200,
    height: 150,
    resizeMode: "aspect-fit",
  },
  language: {
    padding: 10,
    fontSize: 20,
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
});

export default LanguageSelectionScreen;
