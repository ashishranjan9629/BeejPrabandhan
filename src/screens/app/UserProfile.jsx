import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import WrapperContainer from "../../utils/WrapperContainer";
import InnerHeader from "../../components/InnerHeader";
import Feather from "react-native-vector-icons/Feather";
import { moderateScale } from "../../utils/responsiveSize";
import Colors from "../../utils/Colors";

const UserProfile = () => {
  return (
    <WrapperContainer>
      <InnerHeader
        title={"Profile"}
        rightIcon={
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.notificationHolder}
          >
            <Feather
              name="settings"
              size={moderateScale(25)}
              color={Colors.black}
            />
          </TouchableOpacity>
        }
      />
    </WrapperContainer>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
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
});
