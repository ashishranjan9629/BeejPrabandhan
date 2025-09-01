import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import WrapperContainer from "../../utils/WrapperContainer";
import InnerHeader from "../../components/InnerHeader";
import Colors from "../../utils/Colors";
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from "../../utils/responsiveSize";
import FontFamily from "../../utils/FontFamily";
import { showErrorMessage } from "../../utils/HelperFunction";
import { getUserData } from "../../utils/Storage";
import { decryptAES, encryptWholeObject } from "../../utils/decryptData";
import { apiRequest } from "../../services/APIRequest";
import { API_ROUTES } from "../../services/APIRoutes";

const EditUserProfile = () => {
  const [loading, setLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const onSubmit = async () => {
    let valid = true;
    if (oldPassword.length === 0) {
      showErrorMessage("Please Entere the old Password");
      return null;
    }
    if (newPassword.length < 6) {
      showErrorMessage("Password must be at least 6 characters long.");
      valid = false;
    }
    if (newPassword !== confirmNewPassword) {
      showErrorMessage("Passwords do not match.");
      valid = false;
    }
    if (valid) {
      try {
        const userData = await getUserData();
        const payloadData = {
          newpwdKey: newPassword,
          pwdKey: oldPassword,
          userId: userData?.userId,
        };
        console.log(payloadData, "payloadData");
        const encryptedPayloadData = encryptWholeObject(payloadData);
        console.log(encryptedPayloadData, "line encryptedPayloadData");
        const response = await apiRequest(
          API_ROUTES.CHANGE_PASSWORD,
          "post",
          encryptedPayloadData
        );
        console.log(response, "line 63");
        const decrypted = decryptAES(response);
        const parsedDecrypted = JSON.parse(decrypted);
        console.log(parsedDecrypted, "line 63");
        if (parsedDecrypted?.status === 200 && parsedDecrypted) {
          console.log("Success", parsedDecrypted?.data);
        } else {
          showErrorMessage("Error");
        }
      } catch (error) {
        console.log(error, "line error block");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <WrapperContainer isLoading={loading}>
      <InnerHeader title={"Change Password"} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.main}
        keyboardVerticalOffset={Platform.OS === "ios" ? moderateScale(40) : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Old Password</Text>
            <TextInput
              style={styles.input}
              value={oldPassword}
              onChangeText={setOldPassword}
              placeholder="Enter old password"
              secureTextEntry
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>New Password</Text>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter new password"
              secureTextEntry
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm New Password</Text>
            <TextInput
              style={styles.input}
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
              placeholder="Confirm new password"
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={onSubmit}
            activeOpacity={0.8}
          >
            <Text style={styles.submitText}>Change Password</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </WrapperContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: moderateScale(20),
    paddingTop: moderateScaleVertical(20),
    paddingBottom: moderateScaleVertical(40),
  },
  inputContainer: {
    marginBottom: moderateScaleVertical(18),
  },
  label: {
    fontSize: textScale(14),
    color: Colors.textColor,
    marginBottom: moderateScaleVertical(6),
    fontFamily: FontFamily.RubikMedium,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.diabledColor,
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScaleVertical(12),
    fontSize: textScale(15),
    backgroundColor: Colors.white,
    fontFamily: FontFamily.PoppinsRegular,
  },
  submitButton: {
    backgroundColor: Colors.greenColor,
    marginTop: moderateScaleVertical(10),
    borderRadius: moderateScale(10),
    paddingVertical: moderateScaleVertical(14),
    alignItems: "center",
    justifyContent: "center",
  },
  submitText: {
    color: Colors.white,
    fontSize: textScale(16),
    fontFamily: FontFamily.PoppinsMedium,
  },
  errorText: {
    color: Colors.red,
    marginTop: moderateScaleVertical(4),
    fontSize: textScale(12),
    fontFamily: FontFamily.PoppinsRegular,
  },
});

export default EditUserProfile;
