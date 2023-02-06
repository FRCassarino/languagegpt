import React, { useState, useEffect, useRef } from 'react'
import { TextInput, Text, View, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView } from 'react-native'
import axios from 'axios'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import Loader from 'react-native-three-dots';



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  chatContainer: {
    flex: 1,
    marginTop: 10,
    
  },
  chatBubble: {
    padding: 10,
    borderRadius: 10,
    maxWidth: '70%',
  },
  userChatBubble: {
    backgroundColor: '#F0FFFF',
    alignSelf: 'flex-end'
  },
  chatbotChatBubble: {
    backgroundColor: '#F5F5DC',
    alignSelf: 'flex-start'
  },
  message: {
    fontSize: 16
  },
  translation: {
    fontSize: 14,
    fontStyle: 'italic'
  },
  note: {
    fontSize: 12,
    fontWeight: 'bold'
  },
  inputContainer: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 30,
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    flex: 1,
    padding: 10,
    borderRadius: 10
  },
  submitButton: {
    backgroundColor: '#228B22',
    padding: 10,
    borderRadius: 10
  },
  submitButtonText: {
    color: '#FFFFFF'
  },
  noteContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 10,
    },
})

const ChatScreen = ({ navigation, route }) => {
  const { language } = route.params;
  const [input, setInput] = useState('')
  const [conversation, setConversation] = useState([])
  const [loading, setLoading] = useState(false)
  const [showTranslation, setShowTranslation] = useState(null)
  const scrollViewRef = useRef(null)
  


  useEffect(() => {
    setConversation([]);
    setInput('');
    axios.get('http://127.0.0.1:8000/reset')
  }, [])

  async function handleSubmit() {
    if (!input || loading) {
      return;
    }
    try {
      setLoading(true)
      setConversation(conversation => [...conversation, { user: input }])
      setInput('')
      setTimeout(() => {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }, 100);

      const res = await axios.post(
        'http://127.0.0.1:8000/chat',
        {
          message: input,
          language: language
        }
      )
      const responseString = res.data.response.trim()
      const responseMessage = responseString.split(' (')[0]
      const responseTranslation = responseString.split(' (')[1].split(')\n')[0]
      const responseNote = responseString.split('Note: ')[1]
      
      
      setConversation(conversation => [...conversation, { 
        chatbot: {
          message: responseMessage,
          translation: responseTranslation,
          note: responseNote
        }
      
      }])
      setLoading(false)
      setTimeout(() => {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }, 100)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }


  function toggleTranslation(index) {
    setShowTranslation(showTranslation === index ? null : index)
  }

  return (
    <View style={{ height: '100%' }}>
    <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={60} style={styles.container}>
      <ScrollView style={styles.chatContainer} ref={scrollViewRef}>
        <View style={{padding: 10}}>
        {conversation.map((item, index) => (
          <View key={index}>
            {item.chatbot && item.chatbot.note !== 'No errors.' && (
              <View style={styles.noteContainer}>
                <Text style={{ fontSize: 12, color: 'gray' }}> {item.chatbot.note}</Text>
              </View>
            )}
            <TouchableOpacity onPress={() => toggleTranslation(index)}>
              <View style={[styles.chatBubble, item.user ? styles.userChatBubble : styles.chatbotChatBubble]}>
                <Text style={{ fontSize: 16 }}>{item.chatbot ? item.chatbot.message : item.user}</Text>
                {item.chatbot && showTranslation === index && (
                  <Text style={{ fontSize: 12, fontStyle: 'italic',  color: 'gray' }}>{'(' + item.chatbot.translation + ')'}</Text>
                )}
              </View>
             
            </TouchableOpacity>
          </View>
          
        ))}
         {loading && <View  style={[styles.chatBubble, styles.chatbotChatBubble]}>
                <Loader color={'gray'} size={2} />
              </View>}
        </View>
      </ScrollView>
      <View  style={styles.inputContainer}>
        {loading && (
          <ActivityIndicator size="small" color="#228B22" style={{ marginRight: 10 }} />
        )}
        <TextInput
          style={styles.textInput}
          onChangeText={text => setInput(text)}
          value={input}
          autoCorrect={false}
          editable={!loading}
        />
        <TouchableOpacity onPress={handleSubmit} style={{ marginLeft: 10 }} disabled={loading || !input}>
          <MaterialCommunityIcons name="send" size={26} color="#228B22" />
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
    </View>
  )
}
          
export default ChatScreen


