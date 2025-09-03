import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Easing,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import WrapperContainer from "../../utils/WrapperContainer";
import InnerHeader from "../../components/InnerHeader";
import Feather from "react-native-vector-icons/Feather";
import {
  moderateScale,
  moderateScaleVertical,
  scale,
  textScale,
} from "../../utils/responsiveSize";
import Colors from "../../utils/Colors";
import { getUserData, removeUserData } from "../../utils/Storage";
import { decryptAES, encryptWholeObject } from "../../utils/decryptData";
import { apiRequest } from "../../services/APIRequest";
import { API_ROUTES } from "../../services/APIRoutes";
import {
  showErrorMessage,
  showSuccessMessage,
} from "../../utils/HelperFunction";
import ImagePath from "../../utils/ImagePath";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontFamily from "../../utils/FontFamily";
import CustomBottomSheet from "../../components/CustomBottomSheet";
import CustomButton from "../../components/CustomButton";
import { useDispatch } from "react-redux";
import { clearUserData } from "../../redux/slice/UserSlice";
import { useNavigation } from "@react-navigation/native";

const UserProfile = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState();
  const [showLogoutBottomSheet, setShowLogoutBottomSheet] = useState(false);
  const dispatch = useDispatch();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    fethchUserprofileData();
  }, []);

  const fethchUserprofileData = async () => {
    const userData = await getUserData();
    console.log(userData?.employeeId, "Line 72 userData");
    try {
      const payloadData = {
        id: userData?.employeeId,
      };
      setLoading(true);
      const encryptedPayload = encryptWholeObject(payloadData);
      console.log(encryptedPayload, "line 77");
      const response = await apiRequest(
        API_ROUTES.PROFILE_DETAILS,
        "post",
        encryptedPayload
      );
      const decrypted = decryptAES(response);
      const parsedDecrypted = JSON.parse(decrypted);

      if (
        parsedDecrypted &&
        parsedDecrypted?.status === "SUCCESS" &&
        parsedDecrypted?.statusCode === "200"
      ) {
        setProfileData(parsedDecrypted?.data);
        console.log(parsedDecrypted?.data, "line 92");
      } else {
        showErrorMessage("Error");
      }
    } catch (error) {
      console.log(error, "line Error in Catch Bloack");
    } finally {
      console.log("Finally Block Run");
      setLoading(false);
    }
  };

  const profileDetails = [
    {
      label: "Employee ID",
      value: profileData?.empCode ? profileData?.empCode : "N/A",
    },
    {
      label: "Email",
      value: profileData?.emailId ? profileData?.emailId : "N/A",
    },
  ];

  const settingsOptions = [
    {
      label: "Privacy Policy",
      icon: "shield-checkmark-outline",
      onPress: () => {
        navigation.navigate("WebViewPreview", {
          title: "Privacy Policy",
          url: "https://www.npmjs.com/package/@wuba/react-native-echarts",
        });
      },
    },
    {
      label: "Terms & Conditions",
      icon: "document-text-outline",
      onPress: () => {
        navigation.navigate("WebViewPreview", {
          title: "Terms & Conditions",
          url: "https://www.npmjs.com/package/@wuba/react-native-echarts",
        });
      },
    },
    {
      label: "About Us",
      icon: "information-circle-outline",
      onPress: () => {
        navigation.navigate("WebViewPreview", {
          title: "About Us",
          url: "https://www.npmjs.com/package/@wuba/react-native-echarts",
        });
      },
    },
    {
      label: "Logout",
      icon: "log-out-outline",
      onPress: () => {
        setShowLogoutBottomSheet(true);
      },
    },
  ];

  const handleLogout = async () => {
    console.log("Clicked on the logout button");
    setLoading(true);
    setTimeout(() => {
      dispatch(clearUserData());
      removeUserData();
      showSuccessMessage("Logout successful");
    }, 500);
  };

  return (
    <WrapperContainer isLoading={loading}>
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
      {/* User Profile Section with Animation */}
      <Animated.View
        style={[
          styles.profileCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          },
        ]}
      >
        <Animated.Image
          source={ImagePath.userProfile}
          style={[
            styles.profileImage,
            {
              transform: [
                {
                  rotate: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
              ],
            },
          ]}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>
            {profileData?.firstName ? profileData?.firstName : "N/A"}
          </Text>
          {profileDetails.map((item, index) => (
            <Animated.Text
              key={index}
              style={[
                styles.userDetail,
                {
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateX: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              {item.label}: {item.value}
            </Animated.Text>
          ))}
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("EditUserProfile")}
        >
          <Ionicons
            name="pencil"
            size={moderateScale(15)}
            color={Colors.white}
          />
        </TouchableOpacity>
      </Animated.View>
      {/* Setting List */}
      <View style={styles.settingsListContainer}>
        <Text style={styles.headerText}>App Setting</Text>
        {settingsOptions.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.settingsItem}
            activeOpacity={0.6}
            onPress={item.onPress}
          >
            <Ionicons
              name={item.icon}
              size={moderateScale(30)}
              color={Colors.greenColor}
              style={styles.settingsIcon}
            />
            <Text style={styles.settingsLabel}>{item.label}</Text>
            <Ionicons
              name="chevron-forward-outline"
              size={moderateScale(18)}
              color={Colors.iconGray}
            />
          </TouchableOpacity>
        ))}
      </View>
      <CustomBottomSheet
        visible={showLogoutBottomSheet}
        onRequestClose={() => setShowLogoutBottomSheet(false)}
      >
        <Text style={styles.headerText}>Confirm Logout</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <CustomButton
            text={"Cancel"}
            buttonStyle={styles.buttonStyle}
            textStyle={styles.buttonText}
            handleAction={() => setShowLogoutBottomSheet(false)}
          />
          <CustomButton
            text={"Logout"}
            textStyle={styles.buttonText}
            buttonStyle={styles.buttonStyle2}
            handleAction={() => handleLogout()}
          />
        </View>
      </CustomBottomSheet>
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
  profileCard: {
    backgroundColor: Colors.white,
    borderRadius: moderateScale(10),
    padding: moderateScale(8),
    marginBottom: moderateScaleVertical(15),
    shadowColor: Colors.black,
    shadowOpacity: scale(0.1),
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: moderateScale(5),
    elevation: moderateScale(3),
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: moderateScale(10),
  },
  profileImage: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
    marginRight: moderateScale(15),
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: textScale(14),
    fontFamily: FontFamily.PoppinsSemiBold,
    color: Colors.greenColor,
    marginBottom: moderateScaleVertical(4),
  },
  userDetail: {
    fontSize: textScale(12),
    fontFamily: FontFamily.PoppinsRegular,
    color: Colors.textGray,
    marginBottom: moderateScaleVertical(2),
  },
  editButton: {
    backgroundColor: Colors.greenColor,
    width: moderateScale(30),
    height: moderateScale(30),
    borderRadius: moderateScale(15),
    justifyContent: "center",
    alignItems: "center",
  },
  settingsListContainer: {
    marginHorizontal: moderateScale(10),
    marginTop: moderateScaleVertical(10),
    padding: moderateScale(5),
    backgroundColor: Colors.white,
    // borderRadius: moderateScale(10),
    shadowColor: Colors.black,
    shadowOpacity: scale(0.1),
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: moderateScale(5),
    elevation: moderateScale(3),
  },

  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: moderateScaleVertical(12),
    borderBottomWidth: 1,
    borderColor: Colors.lightGray,
    paddingHorizontal: moderateScale(10),
  },

  settingsIcon: {
    marginRight: moderateScale(12),
  },

  settingsLabel: {
    flex: 1,
    fontSize: textScale(12),
    fontFamily: FontFamily.PoppinsRegular,
    color: Colors.black,
  },
  headerText: {
    fontSize: textScale(14),
    fontFamily: FontFamily.PoppinsSemiBold,
    color: Colors.greenColor,
    marginBottom: moderateScaleVertical(4),
    borderLeftWidth: moderateScale(2),
    padding: moderateScale(5),
    paddingHorizontal: moderateScale(10),
    borderColor: Colors.primary,
  },
  buttonStyle: {
    borderWidth: 2,
    width: "45%",
    backgroundColor: Colors.lightGreen,
    borderColor: Colors.lightGreen,
    height: moderateScale(50),
  },
  buttonText: {
    fontFamily: FontFamily.PoppinsMedium,
    color: Colors.white,
    fontSize: textScale(14),
    letterSpacing: scale(0.2),
    textTransform: "capitalize",
  },
  buttonStyle2: {
    borderWidth: 2,
    width: "45%",
    backgroundColor: Colors.red,
    borderColor: Colors.red,
    height: moderateScale(50),
  },
});
