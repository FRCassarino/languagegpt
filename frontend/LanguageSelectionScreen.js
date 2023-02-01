import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const flags = {
  spanish: require('./spanish.png'),
  italian: require('./italian.png'),
};

const languages = [
  { code: 'spanish', name: 'Spanish' },
  { code: 'italian', name: 'Italian' },
];

const LanguageSelectionScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select a Language</Text>
      {languages.map(language => (
        <TouchableOpacity
          key={language.code}
          style={styles.languageContainer}
          onPress={() => navigation.navigate('Chat', { language: language.code })}
        >
          <Image source={flags[language.code]} style={styles.flag} />
          <Text style={styles.language}>{language.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  languageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  flag: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  language: {
    fontSize: 18,
  },
});

export default LanguageSelectionScreen;
