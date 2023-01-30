import React, { useState } from 'react'
import { TextInput, Text, Button, View, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native'
import axios from 'axios'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  chatContainer: {
    flex: 1,
    padding: 10,
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
    padding: 10
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

const App = () => {
  const [input, setInput] = useState('')
  const [conversation, setConversation] = useState([])
  const [loading, setLoading] = useState(false)
  const [showTranslation, setShowTranslation] = useState(null)

  async function handleSubmit() {
    try {
      setLoading(true)
      setConversation(conversation => [...conversation, { user: input }])
      setInput('')

      const res = await axios.post(
        'http://languagegptbackend-dev.us-west-2.elasticbeanstalk.com/chat',
        {
          message: input
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
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  function toggleTranslation(index) {
    setShowTranslation(showTranslation === index ? null : index)
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.chatContainer}>
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
      </ScrollView>
      <View style={styles.inputContainer}>
        {loading && (
          <ActivityIndicator size="small" color="#228B22" style={{ marginRight: 10 }} />
        )}
        <TextInput
          style={styles.textInput}
          onChangeText={text => setInput(text)}
          value={input}
          autoCorrect={false}
        />
        <TouchableOpacity onPress={handleSubmit} style={{ marginLeft: 10 }}>
          <MaterialCommunityIcons name="send" size={26} color="#228B22" />
        </TouchableOpacity>

      </View>
    </View>
  )
}
          
export default App


