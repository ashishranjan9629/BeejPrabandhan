import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
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
import LowerBanner from "../../components/LowerBanner";

const Home = () => {
  const [searchText, setSearchText] = useState("");

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
    },
    {
      id: 2,
      name: "Daily Progress Reports",
      icon: ImagePath.registrationIcon,
      backgroundColor: Colors.bg2,
    },
    {
      id: 3,
      name: "Daily Progress Reports",
      icon: ImagePath.complaint,
      backgroundColor: Colors.bg3,
    },
    {
      id: 4,
      name: "Daily Progress Reports",
      icon: ImagePath.registrationIcon,
      backgroundColor: Colors.bg4,
    },
    {
      id: 5,
      name: "Daily Progress Reports",
      icon: ImagePath.complaint,
      backgroundColor: Colors.bg1,
    },
    {
      id: 6,
      name: "Daily Progress Reports",
      icon: ImagePath.registrationIcon,
      backgroundColor: Colors.bg2,
    },
  ];

  return (
    <WrapperContainer isLoading={false}>
      <View style={styles.main}>
        <CustomHeader data={userData} />
        <CustomSearchBox
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
          resetSearchText={() => setSearchText("")}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          // style={{ marginBottom: moderateScaleVertical(75) }}
        >
          {/* Banner Images */}
          <View
            style={{
              height: moderateScale(175),
              marginVertical: moderateScaleVertical(10),
            }}
          >
            <SwiperImage bannerImageList={bannerImageList} />
          </View>
          {/* Browse Product */}
          <View
            style={{
              marginTop: moderateScaleVertical(25),
              marginHorizontal: moderateScale(10),
            }}
          >
            <BrowseProduct browseProductList={browseProductList} />
          </View>
        </ScrollView>
        <View style={{ marginBottom: moderateScaleVertical(75) }}>
          <LowerBanner />
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
