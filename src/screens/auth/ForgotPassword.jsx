import {
  Image,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import WrapperContainer from "../../utils/WrapperContainer";
import InnerHeader from "../../components/InnerHeader";
import ImagePath from "../../utils/ImagePath";
import {
  moderateScale,
  moderateScaleVertical,
  scale,
  textScale,
} from "../../utils/responsiveSize";
import CustomTextInoutWithIcon from "../../components/CustomTextInoutWithIcon";
import en from "../../constants/en";
import CustomButton from "../../components/CustomButton";
import Colors from "../../utils/Colors";
import FontFamily from "../../utils/FontFamily";
import { useNavigation } from "@react-navigation/native";
import {
  showErrorMessage,
  showSuccessMessage,
} from "../../utils/HelperFunction";
import { apiRequest } from "../../services/APIRequest";
import { API_ROUTES } from "../../services/APIRoutes";
import { encryptWholeObject } from "../../utils/decryptData";

const ForgotPassword = () => {
  const navigation = useNavigation();
  const [userid, setUserId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const payloadData = { email: userid };
      const encryptionPayload = encryptWholeObject(payloadData);

      const response = await apiRequest(
        API_ROUTES.forgetPassword,
        "POST",
        encryptionPayload
      );

      if (response?.status === "Success" && response?.statusCode === "200") {
        showSuccessMessage(response?.message);
        navigation.goBack();
      } else {
        showErrorMessage(response?.message);
      }
    } catch (error) {
      showErrorMessage(error.message);
    } finally {
      setLoading(false);
      setUserId("");
    }
  };

  return (
    <WrapperContainer isLoading={loading}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={
            Platform.OS === "ios" ? moderateScale(40) : moderateScale(20)
          }
        >
          <InnerHeader title={en.LOGIN.FORGOT_PASSWORD} />

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.contentHolder}>
              <Image
                source={ImagePath.nsclLogo}
                resizeMode="stretch"
                style={styles.imageHolder}
              />
              <Text style={styles.headerText}>{en.LOGIN.FORGOT_PASSWORD}</Text>

              <CustomTextInoutWithIcon
                label={en.LOGIN.EMAIL.LABEL}
                leftIcon={ImagePath.emailIcon}
                placeholder={en.LOGIN.EMAIL.PLACEHOLDER}
                value={userid}
                onChangeText={setUserId}
                keyboardType="email-address"
                rightIcon="close"
                resetvalue={() => setUserId("")}
                secureTextEntry={false}
              />

              <CustomButton
                text={en.FORGOT_PASSWORD.SUBMIT_BUTTON}
                buttonStyle={styles.buttonStyle}
                textStyle={styles.buttonText}
                disabled={loading || userid.length === 0}
                handleAction={handleSubmit}
              />

              <TouchableOpacity
                style={styles.view}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.footerText}>
                 {en.FORGOT_PASSWORD.BACK_TO_LOGIN}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </WrapperContainer>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  imageHolder: {
    width: "90%",
    height: moderateScale(75),
    alignSelf: "center",
    marginBottom: moderateScaleVertical(50),
  },
  contentHolder: {
    width: "95%",
    alignSelf: "center",
    gap: moderateScaleVertical(20),
    justifyContent: "center",
    flex: 1,
    padding: moderateScale(5),
  },
  headerText: {
    fontFamily: FontFamily.PoppinsMedium,
    color: Colors.textColor,
    fontSize: textScale(15),
    textTransform: "capitalize",
    letterSpacing: scale(0.3),
  },
  buttonStyle: {
    backgroundColor: Colors.greenColor,
    height: moderateScale(50),
    width: "100%",
    alignSelf: "center",
  },
  buttonText: {
    fontFamily: FontFamily.PoppinsMedium,
    color: Colors.white,
    fontSize: textScale(14),
    letterSpacing: scale(0.4),
  },
  view: {
    marginVertical: moderateScaleVertical(10),
    padding: moderateScale(10),
    alignItems: "center",
  },
  footerText: {
    fontFamily: FontFamily.PoppinsMedium,
    color: Colors.textColor,
    fontSize: textScale(14),
    letterSpacing: scale(0.3),
  },
});
