import {
  Alert,
  BackHandler,
  LogBox,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import JailMonkey from "jail-monkey";
import Splash from "./src/screens/auth/Splash";
import NoInternet from "./src/screens/auth/NoInternet";
import FlashMessage from "react-native-flash-message";
import RootedDevice from "./src/components/RootedDevice";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigation from "./src/navigation/AuthNavigation";

const App = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [isRooted, setIsRooted] = useState(false);
  LogBox.ignoreLogs(["Warning: ..."]);
  LogBox.ignoreAllLogs();
  LogBox.ignoreLogs(["Remote debugger"]);

  useEffect(() => {
    const checkNetwork = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });
    checkPhoneRooted();
    return () => checkNetwork();
  });

  const checkPhoneRooted = () => {
    if (JailMonkey.isJailBroken()) {
      setIsRooted(true);
    }
  };

  if (isRooted) {
    return <RootedDevice />;
  }

  return (
    <View style={styles.main}>
      {isConnected ? (
        <NavigationContainer>
          <AuthNavigation />
        </NavigationContainer>
      ) : (
        <NoInternet />
      )}
      <FlashMessage
        position={"top"}
        animated={true}
        titleStyle={{ textTransform: "capitalize" }}
      />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
});
