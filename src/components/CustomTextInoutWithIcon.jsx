import { Image, StyleSheet, Text, TextInput, View,TouchableOpacity } from "react-native";
import React from "react";
import ImagePath from "../utils/ImagePath";
import Colors from "../utils/Colors";
import { moderateScale, scale, textScale } from "../utils/responsiveSize";
import FontFamily from "../utils/FontFamily";
import AntDesign from 'react-native-vector-icons/AntDesign'
const CustomTextInoutWithIcon = ({
  label,
  leftIcon,
  placeholder,
  value,
  onChangeText,
  keyboardType,
  rightIcon,
  resetvalue,
  props,
  secureTextEntry=false
}) => {
  return (
    <View style={styles.formHolder}>
      <Text style={styles.labelText}>{label}</Text>
      <View style={styles.inputBoxView}>
        <Image
          source={leftIcon}
          resizeMode="contain"
          tintColor={Colors.labelcolor}
          style={styles.icon}
        />
        <Text
          style={[styles.labelText, { marginHorizontal: moderateScale(5) }]}
        >
          |
        </Text>
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          multiline={false}
          style={styles.inputBox}
          secureTextEntry={secureTextEntry}
        />
        {value?.length > 0 && (
          <TouchableOpacity onPress={resetvalue}>
            <AntDesign
              name={rightIcon}
              size={moderateScale(25)}
              color={Colors.black}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CustomTextInoutWithIcon;

const styles = StyleSheet.create({
  formHolder: {
    width: "95%",
    alignSelf: "center",
  },
  inputBoxView: {
    borderBottomWidth: moderateScale(2),
    borderColor: Colors.greenColor,
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(5),
    paddingHorizontal: moderateScale(5),
    padding: moderateScale(5),
  },
  icon: {
    width: moderateScale(25),
    height: moderateScale(25),
  },
  inputBox: {
    padding: moderateScale(10),
    width: "75%",
    color: Colors.black,
    fontFamily: FontFamily.PoppinsMedium,
    fontSize: textScale(12),
    letterSpacing: scale(0.3),
    textTransform: "lowercase",
  },
  labelText: {
    fontFamily: FontFamily.RubikMedium,
    color: Colors.labelcolor,
    fontSize: textScale(15),
    textAlign: "left",
    textTransform: "capitalize",
    letterSpacing: scale(0.3),
  },
});
