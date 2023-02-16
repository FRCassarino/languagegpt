import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { FontAwesome } from '@expo/vector-icons';

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
    maxWidth: '70%',
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
    paddingVertical: 5,
  },
  listenIcon: {
    color: "gray",
    paddingVertical: 5,
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
}) => {
  return (
    <View style={{ padding: 10 }}>
      {conversation.map((item, index) => (
        <View key={index}>
          {item.chatbot && item.chatbot.note !== "No errors." && (
            <View style={styles.noteContainer}>
              <FontAwesome name="warning" size={16} color="indianred" style={styles.warningIcon} />
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
              <TouchableOpacity onPress={() => toggleTranslation(index)}>
                <FontAwesome name="language" size={20} color="gray" style={styles.translateIcon} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

export default ChatList;
