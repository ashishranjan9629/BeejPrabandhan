import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { moderateScale, scale, textScale } from "../utils/responsiveSize";
import Colors from "../utils/Colors";
import Feather from "react-native-vector-icons/Feather";
import FontFamily from "../utils/FontFamily";

const CustomHeader = ({ data }) => {
  // Function to get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // Function to format date as "Day, DD Month, YYYY"
  const getFormattedDate = () => {
    const date = new Date();
    const options = {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <View style={styles.main}>
      <View style={styles.container}>
        <View style={{ gap: moderateScale(3) }}>
          <Text style={styles.textStyle}>
            Hello
            <Text style={{ fontFamily: FontFamily.PoppinsMedium }}>
              , {getGreeting()}
            </Text>
          </Text>
          <Text style={styles.textStyle}>{getFormattedDate()}</Text>
        </View>
        <View style={styles.leftHolder}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.notificationHolder}
          >
            {/* Notification Icon */}
            <Feather
              name="bell"
              size={moderateScale(25)}
              color={Colors.black}
            />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.6}>
            <Image
              source={data?.userProfileImage}
              resizeMode="cover"
              style={styles.userProfileHolder}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CustomHeader;

// ... keep your existing styles ...

const styles = StyleSheet.create({
  main: {
    padding: moderateScale(10),
    paddingHorizontal: moderateScale(15),
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftHolder: {
    gap: moderateScale(10),
    flexDirection: "row",
  },
  notificationHolder: {
    borderWidth: 2,
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    backgroundColor: Colors.bg3,
    borderColor: Colors.bg3,
    alignItems: "center",
    justifyContent: "center",
  },
  userProfileHolder: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    backgroundColor: Colors.bg3,
  },
  textStyle: {
    fontFamily: FontFamily.PoppinsRegular,
    fontSize: textScale(13),
    color: Colors.black,
    letterSpacing: scale(0.2),
  },
});
