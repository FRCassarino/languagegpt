
import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const styles = StyleSheet.create({
    inputContainer: {
        height: 60,
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        marginBottom: 30,
      },
      textInput: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        flex: 1,
        padding: 10,
        borderRadius: 10,
      },
      submitButton: {
        marginLeft: 10,
      },
  });

  const ChatInput = ({ input, setInput, handleSubmit, loading }) => {
    return (
      <View style={styles.inputContainer}>
       <TextInput
            style={styles.textInput}
            onChangeText={(text) => setInput(text)}
            value={input}
            autoCorrect={false}
            editable={!loading}
          />
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} >
          {loading ? (
           <ActivityIndicator
           size="small"
           color="#228B22"
           style={{ marginRight: 10 }}
         />
          ) : (
            <MaterialCommunityIcons name="send" size={26} color="#228B22" />
          )}
        </TouchableOpacity>
      </View>
    );
  };
  
  export default ChatInput;