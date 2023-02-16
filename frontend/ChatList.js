import React, { useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Tts from "react-native-tts";
import { NativeEventEmitter, NativeModules } from "react-native";

const styles = StyleSheet.create({
  noteContainer: {
    flexDirection: "col",
    alignItems: "center",
    marginTop: 0,
    marginBottom: 10,
  },
  warningIcon: {
    marginRight: 5,
  },
  chatBubble: {
    padding: 10,
    borderRadius: 10,
    maxWidth: "70%",
  },
  userChatBubble: {
    backgroundColor: "#F0FFFF",
    alignSelf: "flex-end",
  },
  chatbotChatBubble: {
    backgroundColor: "#F5F5DC",
    alignSelf: "flex-start",
  },
  translateIcon: {
    color: "gray",
    paddingVertical: 10,
  },
  listenIcon: {
    color: "gray",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
});

const ChatList = ({
  conversation,
  toggleTranslation,
  showTranslation,
  setModalMessage,
  setModalIndex,
  setModalVisible,
  loading,
  language,
}) => {

  useEffect(() => {
    if (conversation.length > 0 && conversation[conversation.length - 1].chatbot) {
      const message = conversation[conversation.length - 1].chatbot.message;
      Tts.setDefaultLanguage(languageToCodeMap[language]);
      Tts.speak(message);
    }
  }, [conversation]);

  const languageToCodeMap = {
    english: "en-IE",
    french: "fr-FR",
    german: "de-DE",
    spanish: "es-ES",
    italian: "it-IT",
    portuguese: "pt-BR",
    russian: "ru-RU",
    japanese: "ja-JP",
    chinese: "zh-CN",
    korean: "ko-KR",
    arabic: "ar-SA",
    turkish: "tr-TR",
    dutch: "nl-NL",
    polish: "pl-PL",
    swedish: "sv-SE",
    danish: "da-DK",
    finnish: "fi-FI",
    norwegian: "no-NO",
    czech: "cs-CZ",
    greek: "el-GR",
  };
  
  const ee = new NativeEventEmitter(NativeModules.TextToSpeech);
  ee.addListener("tts-start", () => {});
  ee.addListener("tts-finish", () => {});
  ee.addListener("tts-cancel", () => {});

  const speakMessage = (message) => {
   

    Tts.setDefaultLanguage(languageToCodeMap[language]);
    Tts.speak(message);
  };

  return (
    <View style={{ padding: 10 }}>
      {conversation.map((item, index) => (
        <View key={index}>
          {item.chatbot && item.chatbot.note !== "No errors." && (
            <View style={styles.noteContainer}>
              <FontAwesome
                name="warning"
                size={16}
                color="indianred"
                style={styles.warningIcon}
              />
              <Text style={{ fontSize: 16, color: "gray" }}>
                {" "}
                {item.chatbot.note}
              </Text>
            </View>
          )}
          <TouchableOpacity
            onLongPress={() => {
              //only trigger if the message is from the user and its their last message
              if (item.user && index >= conversation.length - 2 && !loading) {
                console.log("long press");
                setModalVisible(true);
                setModalMessage(item.user);
                setModalIndex(index);
              }
            }}
          >
            <View
              style={[
                styles.chatBubble,
                item.user ? styles.userChatBubble : styles.chatbotChatBubble,
              ]}
            >
              <Text style={{ fontSize: 18 }}>
                {item.chatbot ? item.chatbot.message : item.user}
              </Text>
              {item.chatbot && showTranslation === index && (
                <Text
                  style={{
                    fontSize: 14,
                    fontStyle: "italic",
                    color: "gray",
                  }}
                >
                  {"(" + item.chatbot.translation + ")"}
                </Text>
              )}
              {item.chatbot && (
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity onPress={() => toggleTranslation(index)}>
                    <FontAwesome
                      name="language"
                      size={20}
                      color="gray"
                      style={styles.translateIcon}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => speakMessage(item.chatbot.message)}
                  >
                    <FontAwesome
                      name="volume-up"
                      size={20}
                      color="gray"
                      style={styles.listenIcon}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

export default ChatList;
