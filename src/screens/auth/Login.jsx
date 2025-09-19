import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import React, { useState } from "react";
import Colors from "../../utils/Colors";
import ImagePath from "../../utils/ImagePath";
import {
  moderateScale,
  moderateScaleVertical,
  scale,
  textScale,
} from "../../utils/responsiveSize";
import FontFamily from "../../utils/FontFamily";
import CustomTextInoutWithIcon from "../../components/CustomTextInoutWithIcon";
import { useNavigation } from "@react-navigation/native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import CustomButton from "../../components/CustomButton";
import {
  showErrorMessage,
  showSuccessMessage,
} from "../../utils/HelperFunction";
import en from "../../constants/en";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/slice/UserSlice";
import { saveUserData, saveUserToken } from "../../utils/Storage";
import { apiRequest } from "../../services/APIRequest";
import { API_ROUTES } from "../../services/APIRoutes";
import { decryptAES, deepDecryptObject } from "../../utils/decryptData";

const Login = () => {
  const [email, setEmail] = useState("7777700001");
  const [password, setPassword] = useState("welcome");
  const [rememberMe, setRememberMe] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleLogin = async () => {
    // if (!validateEmail(email)) {
    //   showErrorMessage(en.LOGIN.VALIDATION.INVALID_EMAIL);
    //   return;
    // }

    // if (!validatePassword(password)) {
    //   showErrorMessage(en.LOGIN.VALIDATION.WEAK_PASSWORD);
    //   return;
    // }
    // const response = {
    //   name: "Ashish Ranjan",
    //   email: email,
    //   password: password,
    // };
    try {
      const payloadData = {
        clientId: email,
        secretKey: password,
      };
      console.log(payloadData, "line 73");
      setLoading(true);
      const response = await apiRequest(
        API_ROUTES.AUTHORIZE_LOGIN,
        "post",
        payloadData
      );
      if (
        response &&
        response?.status === "Success" &&
        response?.statusCode === "200"
      ) {
        saveUserToken(response?.authToken);
        try {
          const response2 = await apiRequest(
            API_ROUTES.GET_PROFILE,
            "POST",
            null,
            response?.authToken
          );
          const decrypted = decryptAES(response2);
          const parsedDecrypted = JSON.parse(decrypted);
          console.log(parsedDecrypted, "userData");
          if (
            parsedDecrypted &&
            parsedDecrypted?.status === "Success" &&
            parsedDecrypted?.statusCode === "200"
          ) {
            console.log(parsedDecrypted.data,"line 103")
            const decryptedData = deepDecryptObject(parsedDecrypted.data);
             console.log(decryptedData,"decryptedData user Data");
            dispatch(setUserData(decryptedData));
            saveUserData(decryptedData);
          } else {
            showErrorMessage("Unable to Fetch User Data");
          }
        } catch (error) {
          console.log(error, "Error in Catch Block");
        }
        showSuccessMessage("Login Success");
      } else {
        showErrorMessage(response?.errorMsg);
      }
    } catch (error) {
      showErrorMessage(error?.message)
      console.log(error, "Error In Login API");
    } finally {
      console.log("Finally Block");
      setLoading(false);
      setEmail("");
      setPassword("");
    }
  };
  

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.main}
      keyboardVerticalOffset={Platform.OS === "ios" ? moderateScale(40) : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          <Image
            source={ImagePath.logoBgImage}
            resizeMode="stretch"
            style={{ width: "100%" }}
          />
          <View style={styles.logoImageHolder}>
            <Image
              source={ImagePath.logoImage}
              resizeMode="contain"
              style={styles.imageIcon}
            />
          </View>
          <View style={styles.formContainer}>
            <Text style={styles.signInText}>{en.LOGIN.SIGN_IN}</Text>

            <CustomTextInoutWithIcon
              label={en.LOGIN.EMAIL.LABEL}
              leftIcon={ImagePath.emailIcon}
              placeholder={en.LOGIN.EMAIL.PLACEHOLDER}
              value={email}
              onChangeText={(text) => setEmail(text)}
              keyboardType={"email-address"}
              rightIcon={"close"}
              resetvalue={() => setEmail("")}
              secureTextEntry={false}
            />
            <CustomTextInoutWithIcon
              label={en.LOGIN.PASSWORD.LABEL}
              leftIcon={ImagePath.password}
              placeholder={en.LOGIN.PASSWORD.PLACEHOLDER}
              value={password}
              onChangeText={(text) => setPassword(text)}
              keyboardType={"default"}
              rightIcon={"eye"}
              resetvalue={() => setPassword("")}
              secureTextEntry={true}
            />
            <View style={styles.rememberView}>
              <TouchableOpacity
                style={styles.rmView}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View style={styles.rmIconView}>
                  {rememberMe && (
                    <FontAwesome
                      name="square"
                      color={Colors.greenColor}
                      size={moderateScale(16)}
                    />
                  )}
                </View>
                <Text style={styles.forgotPasswordText}>
                  {en.LOGIN.REMEMBER_ME}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("ForgotPassword")}
              >
                <Text style={styles.forgotPasswordText}>
                  {en.LOGIN.FORGOT_PASSWORD}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton
            text={en.LOGIN.LOGIN_BUTTON}
            disabled={!email || !password || !rememberMe}
            buttonStyle={styles.buttonHolder}
            textStyle={styles.buttonText}
            handleAction={handleLogin}
            isloading={loading}
          />
          {/* <TouchableOpacity>
            <Text style={styles.dontHaveAccountText}>
              {en.LOGIN.NO_ACCOUNT}
              <Text style={styles.textGreen}>{en.LOGIN.SIGN_UP}</Text>
            </Text>
          </TouchableOpacity> */}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
  },
  formContainer: {
    marginTop: moderateScaleVertical(-120),
    padding: moderateScale(10),
    gap: moderateScale(20),
    paddingBottom: moderateScale(100),
  },
  buttonContainer: {
    paddingHorizontal: moderateScale(10),
    paddingBottom: moderateScale(35),
  },
  logoImageHolder: {
    position: "absolute",
    top: moderateScaleVertical(125),
    right: 0,
    left: 0,
    alignItems: "center",
  },
  imageIcon: {
    width: moderateScale(81),
    height: moderateScale(133),
  },
  signInText: {
    fontFamily: FontFamily.RubikMedium,
    fontSize: textScale(14),
    alignSelf: "flex-start",
    padding: moderateScale(5),
    borderBottomWidth: moderateScale(4),
    borderColor: Colors.greenColor,
  },
  forgotPasswordText: {
    fontFamily: FontFamily.RubikSemiBold,
    color: Colors.greenColor,
    fontSize: textScale(14),
  },
  rememberView: {
    width: "95%",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rmView: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(10),
  },
  rmIconView: {
    borderWidth: moderateScale(3),
    width: moderateScale(25),
    height: moderateScale(25),
    borderRadius: moderateScale(5),
    borderColor: Colors.greenColor,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonHolder: {
    backgroundColor: Colors.greenColor,
    width: "100%",
    alignSelf: "center",
    height: moderateScale(50),
  },
  buttonText: {
    fontFamily: FontFamily.RubikMedium,
    color: Colors.white,
    textTransform: "capitalize",
    letterSpacing: scale(0.4),
  },
  dontHaveAccountText: {
    fontFamily: FontFamily.RubikRegular,
    color: Colors.unhighlightColor,
    fontSize: textScale(13),
    letterSpacing: scale(0.3),
    textAlign: "center",
    marginTop: moderateScale(10),
  },
  textGreen: {
    color: Colors.greenColor,
    fontFamily: FontFamily.RubikMedium,
  },
});
