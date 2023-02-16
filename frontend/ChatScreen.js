import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  Modal,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";
import axios from "axios";
import { BlurView } from "expo-blur";
import ChatInput from "./ChatInput";
import ChatList from "./ChatList";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import Loader from "react-native-three-dots";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
  },
  chatContainer: {
    flex: 1,
    marginTop: 10,
  },
  chatBubble: {
    padding: 10,
    borderRadius: 10,
    maxWidth: "70%",
  },
  popupChatBubble: {
    backgroundColor: "#F0FFFF",
  },
  chatbotChatBubble: {
    backgroundColor: "#F5F5DC",
    alignSelf: "flex-start",
  },
  noteContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 0,
    marginBottom: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 5,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    color: "black",
    textAlign: "center",
    paddingVertical: 5,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});

const BACKEND_URL = "http://languagegptbackend-dev.us-west-2.elasticbeanstalk.com/"
const DEV_URL = "http://127.0.0.1:8000/"

const ChatScreen = ({ navigation, route }) => {
  const { language } = route.params;
  const [input, setInput] = useState("");
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTranslation, setShowTranslation] = useState(null);
  const [modalIndex, setModalIndex] = useState(null);
  const scrollViewRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(null);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    setInput("");
    const res = axios
      .post(BACKEND_URL + "reset", {
        language: language,
      })
      .then((res) => {
        console.log(res.data);
        const icebreaker = res.data.response.trim();
        const icebreakerMessage = icebreaker.split(" (")[0];
        const icebreakerTranslation = icebreaker.split(" (")[1].split(")\n")[0];
        setConversation((conversation) => [
          {
            chatbot: {
              message: icebreakerMessage,
              translation: icebreakerTranslation,
              note: "No errors.",
            },
          },
        ]);
      });
  }, [language]);

  async function handleSubmit() {
    if (!input || loading) {
      return;
    }
    try {
      setLoading(true);
      setInput("");

      setConversation((conversation) => [...conversation, { user: input }]);

      setTimeout(() => {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }, 100);

      const res = await axios.post(BACKEND_URL + "chat", {
        message: input,
        language: language,
      });

      const responseString = res.data.response.trim();
      const responseMessage = responseString.split(" (")[0];
      const responseTranslation = responseString.split(" (")[1].split(")\n")[0];
      const responseNote = responseString.split("Note: ")[1];

      setConversation((conversation) => [
        ...conversation,
        {
          chatbot: {
            message: responseMessage,
            translation: responseTranslation,
            note: responseNote,
          },
        },
      ]);
      setLoading(false);
      setTimeout(() => {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  async function editMessage(index) {
    const message = conversation[index].user;

    let updatedConversation = [...conversation];
    updatedConversation = updatedConversation.slice(0, modalIndex);
    setConversation(updatedConversation);

    res = await axios.post(BACKEND_URL + "deletelast", {
      language: language,
    });
    setInput(message);
    setModalIndex(null);
  }

  function toggleTranslation(index) {
    setShowTranslation(showTranslation === index ? null : index);
  }

  return (
    <View style={{ height: "100%" }}>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={60}
        style={styles.container}
      >
        <ScrollView
          style={styles.chatContainer}
          ref={scrollViewRef}
          bounces={true}
        >
          <View style={{ padding: 10 }}>
            <View style={styles.noteContainer}>
              <Text style={{ fontSize: 12, color: "gray" }}>
                Chat with the bot to practice your{" "}
                {language.charAt(0).toUpperCase() + language.slice(1)}. The bot
                will point out and explain any mistakes you make. Let's start
                with an icebreaker!
              </Text>
            </View>
            <ChatList
              conversation={conversation}
              toggleTranslation={toggleTranslation}
              showTranslation={showTranslation}
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              modalMessage={modalMessage}
              setModalMessage={setModalMessage}
              modalIndex={modalIndex}
              setModalIndex={setModalIndex}
              editMessage={editMessage}
              loading={loading}
              language={language}
            />
            {loading && (
              <View style={[styles.chatBubble, styles.chatbotChatBubble]}>
                <Loader color={"gray"} size={2} />
              </View>
            )}
          </View>
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false);
            }}
          >
            <View style={[styles.centeredView]}>
              <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                <BlurView style={styles.modalOverlay} intensity={20} />
              </TouchableWithoutFeedback>
              <View style={[styles.chatBubble, styles.popupChatBubble]}>
                <Text style={{ fontSize: 16 }}>{modalMessage}</Text>
              </View>
              <View style={styles.modalView}>
                <TouchableHighlight
                  style={{
                    paddingHorizontal: 10,
                  }}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                    editMessage(modalIndex);
                  }}
                >
                  <Text style={styles.modalText}>Edit</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>
        </ScrollView>
        <ChatInput
          loading={loading}
          input={input}
          handleSubmit={handleSubmit}
          setInput={setInput}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChatScreen;
