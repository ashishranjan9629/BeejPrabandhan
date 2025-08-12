import {SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Colors from './Colors';
import Loader from './Loader';

const WrapperContainer = ({children, isLoading = false}) => {
  return (
    <View style={styles.main}>
      <SafeAreaView style={{backgroundColor: Colors.blue}} />
      <StatusBar barStyle={'default'} backgroundColor={Colors.blue} />
      <Loader isLoading={isLoading} />
      {children}
    </View>
  );
};

export default WrapperContainer;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});
