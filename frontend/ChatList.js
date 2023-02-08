import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

const styles = StyleSheet.create({
    noteContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 0,
        marginBottom: 10,
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
});


const ChatList = ({ conversation, toggleTranslation, showTranslation, setModalMessage, setModalIndex, setModalVisible, loading}) => {
  return (
    <View style={{ padding: 10 }}>
      {conversation.map((item, index) => (
        <View key={index}>
          {item.chatbot && item.chatbot.note !== "No errors." && (
            <View style={styles.noteContainer}>
              <Text style={{ fontSize: 12, color: "gray" }}>
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
            onPress={() => toggleTranslation(index)}
          >
            <View
              style={[
                styles.chatBubble,
                item.user
                  ? styles.userChatBubble
                  : styles.chatbotChatBubble,
              ]}
            >
              <Text style={{ fontSize: 16 }}>
                {item.chatbot ? item.chatbot.message : item.user}
              </Text>
              {item.chatbot && showTranslation === index && (
                <Text
                  style={{
                    fontSize: 12,
                    fontStyle: "italic",
                    color: "gray",
                  }}
                >
                  {"(" + item.chatbot.translation + ")"}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

export default ChatList;
