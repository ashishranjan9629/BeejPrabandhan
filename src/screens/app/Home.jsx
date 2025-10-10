import { ScrollView, StyleSheet, View, Animated, Easing } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import WrapperContainer from "../../utils/WrapperContainer";
import CustomHeader from "../../components/CustomHeader";
import ImagePath from "../../utils/ImagePath";
import CustomSearchBox from "../../components/CustomSearchBox";
import {
  moderateScale,
  moderateScaleVertical,
} from "../../utils/responsiveSize";
import SwiperImage from "../../components/SwiperImage";
import BrowseProduct from "./home/BrowseProduct";
import Colors from "../../utils/Colors";

const Home = () => {
  const [searchText, setSearchText] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const headerSlideAnim = useRef(new Animated.Value(-100)).current;
  const searchSlideAnim = useRef(new Animated.Value(100)).current;
  const productOpacityAnim = useRef(new Animated.Value(0)).current;
  const productTranslateAnim = useRef(new Animated.Value(20)).current;

  const userData = {
    name: "Ashish Ranjan",
    userProfileImage: ImagePath.userProfile,
  };

  const bannerImageList = [
    {
      id: 1,
      name: "Ashish Ranjan",
      image: ImagePath.bannerImage,
    },
    {
      id: 2,
      name: "Ashish Ranjan",
      image: ImagePath.bannerImage,
    },
    {
      id: 3,
      name: "Ashish Ranjan",
      image: ImagePath.bannerImage,
    },
    {
      id: 4,
      name: "Ashish Ranjan",
      image: ImagePath.bannerImage,
    },
    {
      id: 5,
      name: "Ashish Ranjan",
      image: ImagePath.bannerImage,
    },
    {
      id: 6,
      name: "Ashish Ranjan",
      image: ImagePath.bannerImage,
    },
  ];

  const browseProductList = [
    {
      id: 1,
      name: "Field Inspection Reports",
      icon: ImagePath.complaint,
      backgroundColor: Colors.bg1,
      navigationScreenName: "FieldInspectionReport",
    },
    {
      id: 2,
      name: "Daily Progress Reports",
      icon: ImagePath.registrationIcon,
      backgroundColor: Colors.bg2,
      navigationScreenName: "DailyProgressReportList",
    },
    {
      id: 3,
      name: "Crop",
      icon: ImagePath.complaint,
      backgroundColor: Colors.bg3,
      // navigationScreenName: "Crop",
    },
    {
      id: 4,
      name: "Daily Progress Reports",
      icon: ImagePath.registrationIcon,
      backgroundColor: Colors.bg4,
      // navigationScreenName: "FieldInspectionReport",
    },
  ];

  useEffect(() => {
    // Sequence of animations when component mounts
    Animated.parallel([
      // Header animation
      Animated.timing(headerSlideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp),
      }),

      // Search box animation
      Animated.timing(searchSlideAnim, {
        toValue: 0,
        duration: 600,
        delay: 100,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp),
      }),

      // Banner animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          delay: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          delay: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          delay: 200,
          useNativeDriver: true,
        }),
      ]),

      // Product list animation
      Animated.parallel([
        Animated.timing(productOpacityAnim, {
          toValue: 1,
          duration: 1000,
          delay: 400,
          useNativeDriver: true,
        }),
        Animated.timing(productTranslateAnim, {
          toValue: 0,
          duration: 1000,
          delay: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <WrapperContainer isLoading={false}>
      <View style={styles.main}>
        <Animated.View
          style={{
            transform: [{ translateY: headerSlideAnim }],
          }}
        >
          <CustomHeader data={userData} />
        </Animated.View>

        <Animated.View
          style={{
            transform: [{ translateX: searchSlideAnim }],
          }}
        >
          <CustomSearchBox
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
            resetSearchText={() => setSearchText("")}
          />
        </Animated.View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Banner Images with animation */}
          <Animated.View
            style={{
              height: moderateScale(175),
              marginVertical: moderateScaleVertical(10),
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            }}
          >
            <SwiperImage bannerImageList={bannerImageList} />
          </Animated.View>

          {/* Browse Product with animation */}
          <Animated.View
            style={{
              marginTop: moderateScaleVertical(25),
              marginHorizontal: moderateScale(10),
              opacity: productOpacityAnim,
              transform: [{ translateY: productTranslateAnim }],
            }}
          >
            <BrowseProduct
              browseProductList={browseProductList}
              animated={true}
            />
          </Animated.View>
        </ScrollView>

        <View style={{ marginBottom: moderateScaleVertical(80) }}>
          {/* <LowerBanner /> */}
        </View>
      </View>
    </WrapperContainer>
  );
};

export default Home;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    gap: moderateScaleVertical(5),
  },
});
