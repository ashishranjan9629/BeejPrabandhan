import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import Swiper from "react-native-swiper";
import { moderateScale, width } from "../utils/responsiveSize";
import Colors from "../utils/Colors";

const SwiperImage = ({ bannerImageList }) => {
  return (
    <Swiper
      autoplay={true}
      autoplayTimeout={3}
      showsPagination={true}
      dotColor={Colors.unhighlightColor}
      activeDotColor={Colors.greenColor}
      paginationStyle={{
        bottom: moderateScale(-30),
      }}
      dotStyle={styles.dotStyle}
      activeDotStyle={styles.dotStyle}
      style={styles.swiper}
    >
      {bannerImageList.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.slide}
          onPress={() => {}}
          activeOpacity={0.9}
        >
          <Image source={item?.image} resizeMode="cover" style={styles.image} />
        </TouchableOpacity>
      ))}
    </Swiper>
  );
};

export default SwiperImage;

const styles = StyleSheet.create({
  swiper: {
    height: moderateScale(200), // Add a fixed height to the swiper
    alignItems: "center",
    alignSelf: "center",
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  image: {
    width: width - 20,
    height: "100%", // Use 100% height to fill the slide
    borderRadius: moderateScale(25),
  },
  dotStyle: {
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: moderateScale(4),
    marginHorizontal: moderateScale(4),
  },
});
