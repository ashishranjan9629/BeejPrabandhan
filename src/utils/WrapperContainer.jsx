import { StatusBar, StyleSheet, Text, View } from "react-native";
import React from "react";
import Colors from "./Colors";
import Loader from "./Loader";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const WrapperContainer = ({ children, isLoading = false }) => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
        <StatusBar barStyle={"dark-content"} backgroundColor={Colors.white} />
        <Loader isLoading={isLoading} />
        {children}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default WrapperContainer;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});
