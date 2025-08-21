import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DrawerNav from "./DrawerNav";
import Notification from "../screens/app/Notification";
import UserProfile from "../screens/app/UserProfile";
import FieldInspectionReport from "../screens/app/home/fieldInspectionReport/FieldInspectionReport";
import DailyProgressReport from "../screens/app/home/DailyProgressReport";

const Stack = createNativeStackNavigator();
const AppNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DrawerNav" component={DrawerNav} />
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="UserProfile" component={UserProfile} />
      <Stack.Screen name="FieldInspectionReport" component={FieldInspectionReport} />
      <Stack.Screen name="DailyProgressReport" component={DailyProgressReport} />
    </Stack.Navigator>
  );
};

export default AppNavigation;

const styles = StyleSheet.create({});
