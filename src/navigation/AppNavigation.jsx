import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DrawerNav from "./DrawerNav";
import Notification from "../screens/app/Notification";
import UserProfile from "../screens/app/UserProfile";
import FieldInspectionReport from "../screens/app/home/fieldInspectionReport/FieldInspectionReport";
import DailyProgressReport from "../screens/app/home/DailyProgressReport";
import WebViewPreview from "../components/WebViewPreview";
import FiledInspectionReportDetails from "../screens/app/home/fieldInspectionReport/FiledInspectionReportDetails";
import SeedsIntakeHistory from "../screens/app/home/fieldInspectionReport/SeedsIntakeHistory";
import EditUserProfile from "../screens/app/EditUserProfile";

const Stack = createNativeStackNavigator();
const AppNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DrawerNav" component={DrawerNav} />
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="UserProfile" component={UserProfile} />
      <Stack.Screen
        name="FieldInspectionReport"
        component={FieldInspectionReport}
      />
      <Stack.Screen
        name="DailyProgressReport"
        component={DailyProgressReport}
      />
      <Stack.Screen name="WebViewPreview" component={WebViewPreview} />
      <Stack.Screen
        name="FiledInspectionReportDetails"
        component={FiledInspectionReportDetails}
      />
      <Stack.Screen
        name="SeedsIntakeHistory"
        component={SeedsIntakeHistory}
      />
       <Stack.Screen
        name="EditUserProfile"
        component={EditUserProfile}
      />
    </Stack.Navigator>
  );
};

export default AppNavigation;

const styles = StyleSheet.create({});
