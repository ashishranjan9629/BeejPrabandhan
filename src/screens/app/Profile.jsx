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
import { useNavigation } from "@react-navigation/native";
import en from "../../constants/en";
import PropTypes from "prop-types";

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
  }, [index, rowFadeAnim, rowSlideAnim]);

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

DetailRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  index: PropTypes.number.isRequired,
};

const NavigationTab = ({
  fadeAnim,
  slideAnim,
  activeSection,
  handleTabChange,
  en,
  styles,
}) => (
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
        {en.PROFILE.NAVIGATION.PERSONAL}
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
        {en.PROFILE.NAVIGATION.PROFESSIONAL}
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
        {en.PROFILE.NAVIGATION.CONTACT}
      </Animated.Text>
    </TouchableOpacity>
  </Animated.View>
);

NavigationTab.propTypes = {
  fadeAnim: PropTypes.object.isRequired,
  slideAnim: PropTypes.object.isRequired,
  activeSection: PropTypes.string.isRequired,
  handleTabChange: PropTypes.func.isRequired,
  en: PropTypes.object.isRequired,
  styles: PropTypes.object.isRequired,
};

const SectionCard = ({ title, details }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    {details.map((item, index) => (
      <DetailRow
        key={item.id || item.label}
        label={item.label}
        value={item.value}
        index={index}
      />
    ))}
  </View>
);

SectionCard.propTypes = {
  title: PropTypes.string.isRequired,
  details: PropTypes.array.isRequired,
};

const Profile = () => {
  const [activeSection, setActiveSection] = useState("personal");
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const tabScaleAnim = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation();

  useEffect(() => {
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
    try {
      const payloadData = {
        id: userData?.employeeId,
      };
      setLoading(true);
      const encryptedPayload = encryptWholeObject(payloadData);
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
      } else {
        showErrorMessage(en.PROFILE.ERROR);
      }
    } catch (error) {
      console.log(error, "line Error in Catch Bloack");
    } finally {
      setLoading(false);
    }
  };

  // Profile data organized in arrays for mapping
  const profileDetails = [
    {
      label: en.PROFILE.EMPLOYEE_ID,
      value: profileData?.empCode || en.PROFILE.NOT_AVAILABLE,
    },
    {
      label: en.PROFILE.EMAIL,
      value: profileData?.emailId || en.PROFILE.NOT_AVAILABLE,
    },
  ];

  const personalDetails = [
    {
      label: en.PROFILE.DETAILS.FULL_NAME,
      value: profileData?.firstName || en.PROFILE.NOT_AVAILABLE,
    },
    {
      label: en.PROFILE.DETAILS.GENDER,
      value: profileData?.gender || en.PROFILE.NOT_AVAILABLE,
    },
    {
      label: en.PROFILE.DETAILS.DATE_OF_BIRTH,
      value: profileData?.dob || en.PROFILE.NOT_AVAILABLE,
    },
    {
      label: en.PROFILE.DETAILS.CONTACT,
      value: profileData?.mobileNo || en.PROFILE.NOT_AVAILABLE,
    },
    {
      label: en.PROFILE.DETAILS.BLOOD_GROUP,
      value: profileData?.bloodGroup || en.PROFILE.NOT_AVAILABLE,
    },
    {
      label: en.PROFILE.DETAILS.RELIGION,
      value: profileData?.religion || en.PROFILE.NOT_AVAILABLE,
    },
    {
      label: en.PROFILE.DETAILS.STATE,
      value: profileData?.stateName || en.PROFILE.NOT_AVAILABLE,
    },
    {
      label: en.PROFILE.DETAILS.NATIONALITY,
      value: profileData?.nationName || en.PROFILE.NOT_AVAILABLE,
    },
    {
      label: en.PROFILE.DETAILS.CATEGORY,
      value: profileData?.empCategory || en.PROFILE.NOT_AVAILABLE,
    },
    {
      label: en.PROFILE.DETAILS.FATHERS_NAME,
      value: profileData?.fatherName || en.PROFILE.NOT_AVAILABLE,
    },
    {
      label: en.PROFILE.DETAILS.SPOUSE_NAME,
      value: profileData?.spouseName || en.PROFILE.NOT_AVAILABLE,
    },
    {
      label: en.PROFILE.DETAILS.IDENTIFICATION_MARK_1,
      value: profileData?.identificationMarkOne || en.PROFILE.NOT_AVAILABLE,
    },
    {
      label: en.PROFILE.DETAILS.IDENTIFICATION_MARK_2,
      value: profileData?.identificationMarkTwo || en.PROFILE.NOT_AVAILABLE,
    },
  ];

  const professionalDetails = [
    {
      label: en.PROFILE.EMPLOYEE_ID,
      value: profileData?.empCode || en.PROFILE.NOT_AVAILABLE,
    },
    {
      label: en.PROFILE.DETAILS.EMPLOYMENT_TYPE,
      value: profileData?.employmentType || en.PROFILE.NOT_AVAILABLE,
    },
    {
      label: en.PROFILE.DETAILS.GRADE_ID,
      value: profileData?.gradeId || en.PROFILE.NOT_AVAILABLE,
    },
    {
      label: en.PROFILE.DETAILS.GRADE_NAME,
      value: profileData?.gradeName || en.PROFILE.NOT_AVAILABLE,
    },
    {
      label: en.PROFILE.DETAILS.GRADE_SHORT_NAME,
      value: profileData?.gradeShortName || en.PROFILE.NOT_AVAILABLE,
    },
    {
      label: en.PROFILE.DETAILS.DESIGNATION,
      value: profileData?.designation?.name || en.PROFILE.NOT_AVAILABLE,
    },
    {
      label: en.PROFILE.DETAILS.DEPARTMENT,
      value: profileData?.department?.name || en.PROFILE.NOT_AVAILABLE,
    },
    {
      label: en.PROFILE.DETAILS.DATE_OF_APPOINTMENT,
      value: profileData?.dateOfAppointment || en.PROFILE.NOT_AVAILABLE,
    },
    {
      label: en.PROFILE.DETAILS.UNIT_TYPE,
      value: profileData?.unitType || en.PROFILE.NOT_AVAILABLE,
    },
    {
      label: en.PROFILE.DETAILS.OFFICE_PHONE,
      value: profileData?.officePhone || en.PROFILE.NOT_AVAILABLE,
    },
    {
      label: en.PROFILE.DETAILS.DOJ_THE_DESIGNATION,
      value: profileData?.designationDate || en.PROFILE.NOT_AVAILABLE,
    },
    {
      label: en.PROFILE.DETAILS.DOJ_THE_DEPARTMENT,
      value: profileData?.departmentDate || en.PROFILE.NOT_AVAILABLE,
    },
    {
      label: en.PROFILE.DETAILS.UNIT_DATE,
      value: profileData?.unitDate || en.PROFILE.NOT_AVAILABLE,
    },
    {
      label: en.PROFILE.DETAILS.RO_NAME,
      value: profileData?.roName || en.PROFILE.NOT_AVAILABLE,
    },
    {
      label: en.PROFILE.DETAILS.AO_NAME,
      value: profileData?.aoName || en.PROFILE.NOT_AVAILABLE,
    },
  ];

  const contactDetails = [
    {
      label: en.PROFILE.DETAILS.PHONE,
      value: profileData?.mobileNo || en.PROFILE.NOT_AVAILABLE,
    },
    {
      label: en.PROFILE.DETAILS.OFFICE_PHONE,
      value: profileData?.officePhone || en.PROFILE.NOT_AVAILABLE,
    },
    {
      label: en.PROFILE.DETAILS.RESIDENCE_PHONE,
      value: profileData?.residancePhone || en.PROFILE.NOT_AVAILABLE,
    },
    {
      label: en.PROFILE.DETAILS.PERMANENT_ADDRESS,
      value: profileData?.permanentAdd || en.PROFILE.NOT_AVAILABLE,
    },
    {
      label: en.PROFILE.DETAILS.PERMANENT_ADDRESS_PINCODE,
      value: profileData?.pinCode || en.PROFILE.NOT_AVAILABLE,
    },
    {
      label: en.PROFILE.DETAILS.RESIDENTIAL_ADDRESS,
      value: profileData?.temporaryAddress || en.PROFILE.NOT_AVAILABLE,
    },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case "personal":
        return (
          <SectionCard
            title={en.PROFILE.SECTIONS.PERSONAL_DETAILS}
            details={personalDetails}
          />
        );
      case "professional":
        return (
          <SectionCard
            title={en.PROFILE.SECTIONS.PROFESSIONAL_DETAILS}
            details={professionalDetails}
          />
        );
      case "contact":
        return (
          <SectionCard
            title={en.PROFILE.SECTIONS.CONTACT_DETAILS}
            details={contactDetails}
          />
        );
      default:
        return null;
    }
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

  return (
    <WrapperContainer isLoading={loading}>
      <CustomHeader data={userData} />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
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
              {profileData?.firstName
                ? profileData?.firstName
                : en.PROFILE.NOT_AVAILABLE}{" "}
              {profileData?.lastName
                ? profileData?.lastName
                : en.PROFILE.NOT_AVAILABLE}
            </Text>
            {profileDetails.map((item) => (
              <Animated.Text
                key={item.id || item.label}
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
        <NavigationTab
          fadeAnim={fadeAnim}
          slideAnim={slideAnim}
          activeSection={activeSection}
          handleTabChange={handleTabChange}
          en={en}
          styles={styles}
        />
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {renderSection()}
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
    fontFamily: FontFamily.PoppinsMedium,
    color: Colors.greenColor,
    marginBottom: moderateScaleVertical(4),
    textTransform: "capitalize",
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
    fontFamily: FontFamily.PoppinsRegular,
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
    fontSize: textScale(14),
    fontFamily: FontFamily.PoppinsMedium,
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
    color: Colors.gray,
    fontFamily: FontFamily.PoppinsRegular,
    letterSpacing: scale(0.1),
    textTransform: "capitalize",
    flex: 1,
  },
  value: {
    fontSize: textScale(12),
    color: Colors.black,
    fontFamily: FontFamily.PoppinsRegular,
    flex: 1,
    textAlign: "right",
    letterSpacing: scale(0.1),
  },
});
