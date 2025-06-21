import React from 'react';
import {StyleSheet, View} from 'react-native';
import CameraOCRScreen from './src/CameraOCRScreen';

const App = () => {
  return (
    <View style={styles.container}>
      <CameraOCRScreen />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
