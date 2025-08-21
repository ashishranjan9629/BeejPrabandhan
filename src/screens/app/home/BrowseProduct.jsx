import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import {
  moderateScale,
  moderateScaleVertical,
  scale,
  textScale,
} from "../../../utils/responsiveSize";
import FontFamily from "../../../utils/FontFamily";
import Colors from "../../../utils/Colors";
import { useNavigation } from "@react-navigation/native";

const BrowseProduct = ({ browseProductList }) => {
  const navigation = useNavigation();
  return (
    <View style={{ padding: moderateScale(10) }}>
      <Text style={styles.headerText}>Browse Products</Text>
      <View style={styles.main} showsVerticalScrollIndicator={false}>
        {browseProductList?.map((item, index) => (
          <View key={index}>
            <TouchableOpacity
              style={{
                borderWidth: 2,
                borderColor: item?.backgroundColor,
                width: moderateScale(100),
                height: moderateScale(100),
                borderRadius: moderateScale(100),
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: item?.backgroundColor,
                margin: moderateScale(10),
              }}
              onPress={() => {
                if (item?.navigationScreenName) {
                  navigation.navigate(item.navigationScreenName);
                } else {
                  // Optionally handle no navigation case here
                  console.warn(
                    "No navigationScreenName provided for this item"
                  );
                }
              }}
            >
              <Image
                source={item?.icon}
                resizeMode="contain"
                style={{
                  width: moderateScale(50),
                  height: moderateScale(50),
                }}
              />
            </TouchableOpacity>
            <Text style={styles.nameText}>{item?.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default BrowseProduct;

const styles = StyleSheet.create({
  headerText: {
    fontFamily: FontFamily.PoppinsMedium,
    fontSize: textScale(15),
    color: Colors.black,
    letterSpacing: scale(0.3),
    textTransform: "capitalize",
  },
  nameText: {
    fontFamily: FontFamily.PoppinsMedium,
    color: Colors.textColor,
    fontSize: textScale(12),
    width: moderateScale(125),
    textAlign: "center",
    textTransform: "capitalize",
    letterSpacing: scale(0.2),
  },
  main: {
    marginTop: moderateScaleVertical(10),
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "space-around",
  },
});
