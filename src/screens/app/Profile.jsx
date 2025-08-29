import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import WrapperContainer from "../../utils/WrapperContainer";
import ImagePath from "../../utils/ImagePath";
import CustomHeader from "../../components/CustomHeader";
import Colors from "../../utils/Colors";
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  scale,
} from "../../utils/responsiveSize";
import FontFamily from "../../utils/FontFamily";
import Ionicons from "react-native-vector-icons/Ionicons";
import { apiRequest } from "../../services/APIRequest";
import { API_ROUTES } from "../../services/APIRoutes";
import { decryptAES, encryptWholeObject } from "../../utils/decryptData";
import { showErrorMessage } from "../../utils/HelperFunction";
import { getUserData } from "../../utils/Storage";

const Profile = () => {
  const [activeSection, setActiveSection] = useState("personal");
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const tabScaleAnim = useRef(new Animated.Value(1)).current;

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

  const userData = {
    name: "Ashish Ranjan",
    userProfileImage: ImagePath.userProfile,
  };

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

  // Profile data organized in arrays for mapping
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

  const personalDetails = [
    {
      label: "Full Name",
      value: profileData?.firstName ? profileData?.firstName : "N/A",
    },
    {
      label: "Gender",
      value: profileData?.gender ? profileData?.gender : "N/A",
    },
    {
      label: "Date of Birth",
      value: profileData?.dob ? profileData?.dob : "N/A",
    },
    {
      label: "Contact",
      value: profileData?.mobileNo ? profileData?.mobileNo : "N/A",
    },
    {
      label: "Blood Group",
      value: profileData?.bloodGroup ? profileData?.bloodGroup : "N/A",
    },
    {
      label: "Religion",
      value: profileData?.religion ? profileData?.religion : "N/A",
    },
    {
      label: "State",
      value: profileData?.stateName ? profileData?.stateName : "N/A",
    },
    {
      label: "Nationality",
      value: profileData?.nationName ? profileData?.nationName : "N/A",
    },
    {
      label: "Category",
      value: profileData?.empCategory ? profileData?.empCategory : "N/A",
    },
    {
      label: "Father's Name",
      value: profileData?.fatherName ? profileData?.fatherName : "N/A",
    },
    {
      label: "Spouse's Name",
      value: profileData?.spouseName ? profileData?.spouseName : "N/A",
    },
    {
      label: "Identification Mark 1",
      value: profileData?.identificationMarkOne
        ? profileData?.identificationMarkOne
        : "N/A",
    },
    {
      label: "Identification Mark 2",
      value: profileData?.identificationMarkTwo
        ? profileData?.identificationMarkTwo
        : "N/A",
    },
  ];

  const professionalDetails = [
    {
      label: "Employee ID",
      value: profileData?.empCode ? profileData?.empCode : "N/A",
    },
    {
      label: "Employment Type",
      value: profileData?.employmentType ? profileData?.employmentType : "N/A",
    },
    {
      label: "Grade Id",
      value: profileData?.gradeId ? profileData?.gradeId : "N/A",
    },
    {
      label: "Grade Name",
      value: profileData?.gradeName ? profileData?.gradeName : "N/A",
    },
    {
      label: "Grade Short Name",
      value: profileData?.gradeShortName ? profileData?.gradeShortName : "N/A",
    },
    {
      label: "Designation",
      value: profileData?.desigName ? profileData?.desigName : "N/A",
    },
    {
      label: "Department",
      value: profileData?.departmentName ? profileData?.departmentName : "N/A",
    },
    {
      label: "Date Of Appointment",
      value: profileData?.dateOfAppointment
        ? profileData?.dateOfAppointment
        : "N/A",
    },
    {
      label: "Unit Type",
      value: profileData?.unitType ? profileData?.unitType : "N/A",
    },
    {
      label: "Office Phone",
      value: profileData?.officePhone ? profileData?.officePhone : "N/A",
    },
    {
      label: "DOJ the Designation",
      value: profileData?.designationDate
        ? profileData?.designationDate
        : "N/A",
    },
    {
      label: "DOJ the Department",
      value: profileData?.departmentDate ? profileData?.departmentDate : "N/A",
    },
    {
      label: "Unit Date",
      value: profileData?.unitDate ? profileData?.unitDate : "N/A",
    },
    {
      label: "RO Name",
      value: profileData?.roName ? profileData?.roName : "N/A",
    },
    {
      label: "AO Name",
      value: profileData?.aoName ? profileData?.aoName : "N/A",
    },
  ];

  const contactDetails = [
    {
      label: "Phone",
      value: profileData?.mobileNo ? profileData?.mobileNo : "N/A",
    },
    {
      label: "Office Phone",
      value: profileData?.officePhone ? profileData?.officePhone : "N/A",
    },
    {
      label: "Residence Phone",
      value: profileData?.residancePhone ? profileData?.residancePhone : "N/A",
    },
    {
      label: "Permanent Address",
      value: profileData?.permanentAdd ? profileData?.permanentAdd : "N/A",
    },
    {
      label: "Permanent Address Pincode",
      value: profileData?.pinCode ? profileData?.pinCode : "N/A",
    },
    {
      label: "Residential Address",
      value: profileData?.temporaryAddress
        ? profileData?.temporaryAddress
        : "N/A",
    },
  ];

  // Helper component to render detail rows with animation
  const DetailRow = ({ label, value, index }) => {
    const rowFadeAnim = useRef(new Animated.Value(0)).current;
    const rowSlideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
      Animated.parallel([
        Animated.timing(rowFadeAnim, {
          toValue: 1,
          duration: 400,
          delay: index * 50,
          useNativeDriver: true,
        }),
        Animated.timing(rowSlideAnim, {
          toValue: 0,
          duration: 400,
          delay: index * 50,
          useNativeDriver: true,
        }),
      ]).start();
    }, []);

    return (
      <Animated.View
        style={[
          styles.row,
          {
            opacity: rowFadeAnim,
            transform: [{ translateY: rowSlideAnim }],
          },
        ]}
      >
        <Text style={styles.label}>{label}:</Text>
        <Text style={styles.value}>{value}</Text>
      </Animated.View>
    );
  };

  // Handle tab change with animation
  const handleTabChange = (section) => {
    // Animate tab press
    Animated.sequence([
      Animated.timing(tabScaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(tabScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setActiveSection(section);
    });
  };

  // Navigation tabs with animation
  const NavigationTab = () => (
    <Animated.View
      style={[
        styles.navContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.navItem,
          activeSection === "personal" && styles.activeNavItem,
        ]}
        onPress={() => handleTabChange("personal")}
        activeOpacity={0.7}
      >
        <Animated.Text
          style={[
            styles.navText,
            activeSection === "personal" && styles.activeNavText,
          ]}
        >
          Personal
        </Animated.Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.navItem,
          activeSection === "professional" && styles.activeNavItem,
        ]}
        onPress={() => handleTabChange("professional")}
        activeOpacity={0.7}
      >
        <Animated.Text
          style={[
            styles.navText,
            activeSection === "professional" && styles.activeNavText,
          ]}
        >
          Professional
        </Animated.Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.navItem,
          activeSection === "contact" && styles.activeNavItem,
        ]}
        onPress={() => handleTabChange("contact")}
        activeOpacity={0.7}
      >
        <Animated.Text
          style={[
            styles.navText,
            activeSection === "contact" && styles.activeNavText,
          ]}
        >
          Contact
        </Animated.Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <WrapperContainer isLoading={loading}>
      <CustomHeader data={userData} />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
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
          <TouchableOpacity style={styles.editButton}>
            <Ionicons
              name="pencil"
              size={moderateScale(15)}
              color={Colors.white}
            />
          </TouchableOpacity>
        </Animated.View>

        {/* Navigation Tabs */}
        <NavigationTab />

        {/* Content based on active section with animation */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {activeSection === "personal" && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Personal Details</Text>
              {personalDetails.map((item, index) => (
                <DetailRow
                  key={index}
                  label={item.label}
                  value={item.value}
                  index={index}
                />
              ))}
            </View>
          )}

          {activeSection === "professional" && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Professional Details</Text>
              {professionalDetails.map((item, index) => (
                <DetailRow
                  key={index}
                  label={item.label}
                  value={item.value}
                  index={index}
                />
              ))}
            </View>
          )}

          {activeSection === "contact" && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Contact Details</Text>
              {contactDetails.map((item, index) => (
                <DetailRow
                  key={index}
                  label={item.label}
                  value={item.value}
                  index={index}
                />
              ))}
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </WrapperContainer>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    padding: moderateScale(10),
    paddingBottom: moderateScaleVertical(80),
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
  navContainer: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderRadius: moderateScale(8),
    marginBottom: moderateScaleVertical(15),
    padding: moderateScale(3),
    shadowColor: Colors.black,
    shadowOpacity: scale(0.1),
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: moderateScale(5),
    elevation: moderateScale(3),
  },
  navItem: {
    flex: 1,
    paddingVertical: moderateScaleVertical(10),
    alignItems: "center",
    borderRadius: moderateScale(6),
  },
  activeNavItem: {
    backgroundColor: Colors.greenColor,
  },
  navText: {
    fontSize: textScale(12),
    fontFamily: FontFamily.PoppinsMedium,
    color: Colors.textGray,
  },
  activeNavText: {
    color: Colors.white,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: moderateScale(10),
    padding: moderateScale(15),
    marginBottom: moderateScaleVertical(15),
    shadowColor: Colors.black,
    shadowOpacity: scale(0.1),
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: moderateScale(5),
    elevation: moderateScale(3),
  },
  cardTitle: {
    fontSize: textScale(15),
    fontFamily: FontFamily.PoppinsSemiBold,
    color: Colors.greenColor,
    marginBottom: moderateScaleVertical(10),
    textTransform: "capitalize",
    letterSpacing: scale(0.2),
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: moderateScaleVertical(8),
  },
  label: {
    fontSize: textScale(12),
    color: Colors.textGray,
    fontFamily: FontFamily.PoppinsRegular,
    letterSpacing: scale(0.1),
    textTransform: "capitalize",
    flex: 1,
  },
  value: {
    fontSize: textScale(12),
    color: Colors.textColor,
    fontFamily: FontFamily.PoppinsMedium,
    flex: 1,
    textAlign: "right",
    letterSpacing: scale(0.1),
  },
});
