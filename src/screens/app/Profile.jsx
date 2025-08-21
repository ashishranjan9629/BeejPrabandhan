import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
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

const Profile = () => {
  const [activeSection, setActiveSection] = useState("personal");
  
  // Animation values
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
      })
    ]).start();
  }, []);

  const userData = {
    name: "Ashish Ranjan",
    userProfileImage: ImagePath.userProfile,
  };

  // Profile data organized in arrays for mapping
  const profileDetails = [
    { label: "Employee ID", value: "52565" },
    { label: "Email", value: "kumar.sumit@velocis.co.in" },
  ];

  const personalDetails = [
    { label: "Full Name", value: "Ashish Ranjan" },
    { label: "Gender", value: "MALE" },
    { label: "Date of Birth", value: "1992-11-01" },
    { label: "Contact|", value: "8130236107" },
    { label: "Blood Group", value: "B+" },
    { label: "Religion", value: "HINDU" },
    { label: "Nationality", value: "INDIA" },
    { label: "Category", value: "GENERAL" },
    { label: "Father's Name", value: "test father" },
    { label: "Spouse's Name", value: "test spouse" },
    { label: "Identification Mark 1", value: "Mole on right forehead" },
    { label: "Identification Mark 2", value: "NA" },
  ];

  const professionalDetails = [
    { label: "Employee ID", value: "117812001" },
    { label: "Employment Type", value: "PERMANENT" },
    { label: "Grade", value: "G4" },
    { label: "Designation", value: "CONTRACTOR WORKER" },
    { label: "Department", value: "QUALITY CONTROL" },
    { label: "Date Of Appointment", value: "2020-06-01" },
    { label: "Unit Type", value: "AO" },
    { label: "Office Phone", value: "011-23456789" },
    { label: "DOJ the Designation", value: "2020-07-01" },
    { label: "DOJ the Department", value: "2020-08-01" },
    { label: "Unit Date", value: "2020-09-01" },
    { label: "RO Name", value: "NA" },
    { label: "AO Name", value: "NA" },
  ];

  const contactDetails = [
    { label: "Phone", value: "8130236107" },
    { label: "Office Phone", value: "011-23456789" },
    { label: "Permanent Address", value: "456 Permanent St, Hometown" },
    { label: "Permanent Address Pincode", value: "127306" },
    { label: "Residential Address", value: "123 Street Name, Temporary City" },
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
        })
      ]).start();
    }, []);

    return (
      <Animated.View style={[
        styles.row,
        {
          opacity: rowFadeAnim,
          transform: [{ translateY: rowSlideAnim }]
        }
      ]}>
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
      })
    ]).start(() => {
      setActiveSection(section);
    });
  };

  // Navigation tabs with animation
  const NavigationTab = () => (
    <Animated.View style={[
      styles.navContainer,
      {
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }]
      }
    ]}>
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
    <WrapperContainer>
      <CustomHeader data={userData} />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile Section with Animation */}
        <Animated.View style={[
          styles.profileCard,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim }
            ]
          }
        ]}>
          <Animated.Image 
            source={ImagePath.userProfile} 
            style={[
              styles.profileImage,
              {
                transform: [{
                  rotate: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg']
                  })
                }]
              }
            ]} 
          />
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>Mr. ADMIN</Text>
            {profileDetails.map((item, index) => (
              <Animated.Text 
                key={index} 
                style={[
                  styles.userDetail,
                  {
                    opacity: fadeAnim,
                    transform: [{
                      translateX: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0]
                      })
                    }]
                  }
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
            transform: [{ translateY: slideAnim }]
          }}
        >
          {activeSection === "personal" && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Personal Details</Text>
              {personalDetails.map((item, index) => (
                <DetailRow key={index} label={item.label} value={item.value} index={index} />
              ))}
            </View>
          )}

          {activeSection === "professional" && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Professional Details</Text>
              {professionalDetails.map((item, index) => (
                <DetailRow key={index} label={item.label} value={item.value} index={index} />
              ))}
            </View>
          )}

          {activeSection === "contact" && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Contact Details</Text>
              {contactDetails.map((item, index) => (
                <DetailRow key={index} label={item.label} value={item.value} index={index} />
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