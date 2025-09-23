import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import WrapperContainer from "../../../../utils/WrapperContainer";
import InnerHeader from "../../../../components/InnerHeader";
import Colors from "../../../../utils/Colors";
import FontFamily from "../../../../utils/FontFamily";
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from "../../../../utils/responsiveSize";
import CustomButton from "../../../../components/CustomButton";
import {
  showErrorMessage,
  showSuccessMessage,
} from "../../../../utils/HelperFunction";
import { apiRequest } from "../../../../services/APIRequest";
import { API_ROUTES } from "../../../../services/APIRoutes";
import { decryptAES, encryptWholeObject } from "../../../../utils/decryptData";
import { getUserData } from "../../../../utils/Storage";

const DPRSubmit = ({ route, navigation }) => {
  const { data } = route.params;
  const [userData, setUserData] = useState();
  const [mechanicalData, setMechanicalData] = useState([]);
  console.log(userData,"userData")
  // Initialize mechanical data state

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const userData = await getUserData();
    setUserData(userData);
  };

  useEffect(() => {
    if (data.dprMechanicals && data.dprMechanicals.length > 0) {
      const initialMechanicalData = data.dprMechanicals.map((mech, index) => ({
        id: mech.id || index,
        operatorName: mech.operatorName || "",
        cpNumber: mech.cpNumber || "",
      }));
      setMechanicalData(initialMechanicalData);
    }
  }, [data.dprMechanicals]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const updateMechanicalField = (index, field, value) => {
    setMechanicalData((prev) => {
      const newData = [...prev];
      newData[index] = {
        ...newData[index],
        [field]: value,
      };
      return newData;
    });
  };

  const handleSubmit = () => {
    // Validate all CP Numbers
    for (let i = 0; i < mechanicalData.length; i++) {
      if (!mechanicalData[i].cpNumber.trim()) {
        showErrorMessage(`Please Enter the CP Number for Equipment ${i + 1}`);
        return;
      }
    }

    Alert.alert("Issue DPR", "Are you sure you want to issue this DPR?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Issue",
        onPress: async () => {
          const submitData = {
            ...data,
            unitId:userData?.unitType==="BLOCK"?userData?.blockId:null,
            unitType:userData?.unitType,
            dprMechanicals: data.dprMechanicals.map((mech, index) => ({
              ...mech,
              operatorName: mechanicalData[index]?.operatorName || "",
              cpNumber: mechanicalData[index]?.cpNumber || "",
            })),
          };
          console.log(submitData,"submitData")
          const encryptedPayload = encryptWholeObject(submitData);
          const response = await apiRequest(
            API_ROUTES.DP_REPORT_UPDATE,
            "post",
            encryptedPayload
          );
          const decrypted = decryptAES(response);
          const parsedDecrypted = JSON.parse(decrypted);
          console.log(parsedDecrypted, "line 543");
          if (
            parsedDecrypted?.status === "SUCCESS" &&
            parsedDecrypted?.statusCode === "200"
          ) {
            showSuccessMessage(
              parsedDecrypted?.message || "Success,DPR Updated successfully "
            );
            navigation.goBack();
          } else {
            showErrorMessage(parsedDecrypted?.message || "Error");
          }
          // console.log("Final Submit Data:", submitData);
        },
      },
    ]);
  };

  const renderProcessDetails = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Process Details</Text>

      {/* First Row */}
      <View style={styles.row}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Date</Text>
          <Text style={styles.detailValue}>{formatDate(data.reportDate)}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Square Name</Text>
          <Text style={styles.detailValue}>{data.squareName || "N/A"}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Operation</Text>
          <Text style={styles.detailValue}>{data.operationName || "N/A"}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Financial Year</Text>
          <Text style={styles.detailValue}>{data.finYear || "N/A"}</Text>
        </View>
      </View>

      {/* Second Row */}
      <View style={styles.row}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Season</Text>
          <Text style={styles.detailValue}>{data.season || "N/A"}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Class</Text>
          <Text style={styles.detailValue}>{data.fromSeedClass || "N/A"}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Stage</Text>
          <Text style={styles.detailValue}>{data.fromSeedStage || "-"}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Required Output (ha)</Text>
          <Text style={styles.detailValue}>
            {data.requiredOutputArea || "N/A"}
          </Text>
        </View>
      </View>

      {/* Additional Info */}
      <View style={styles.additionalInfo}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Crop:</Text>
          <Text style={styles.infoValue}>{data.crop || "N/A"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Seed Variety:</Text>
          <Text style={styles.infoValue}>{data.seedVariety || "N/A"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Work Type:</Text>
          <Text style={styles.infoValue}>
            {data.workType
              ? data.workType.charAt(0).toUpperCase() + data.workType.slice(1)
              : "N/A"}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Sub Unit:</Text>
          <Text style={styles.infoValue}>{data.subUnitName || "N/A"}</Text>
        </View>
      </View>
    </View>
  );

  const renderMechanicalSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Mechanical</Text>

      {data.dprMechanicals &&
        data.dprMechanicals.map((mech, index) => {
          const currentMechData = mechanicalData[index] || {};

          return (
            <View key={mech.id || index} style={styles.mechContainer}>
              <View style={styles.serialContainer}>
                <Text style={styles.serialLabel}>Serial No</Text>
                <Text style={styles.serialNumber}>{index + 1}</Text>
              </View>

              <View style={styles.mechDetails}>
                <View style={styles.mechRow}>
                  <Text style={styles.mechLabel}>Equipment Name</Text>
                  <Text style={styles.mechValue}>
                    {mech.equipmentName || "N/A"}
                  </Text>
                </View>

                <View style={styles.mechRow}>
                  <Text style={styles.mechLabel}>Est. Hours</Text>
                  <Text style={styles.mechValue}>
                    {mech.estimatedHours || "N/A"}
                  </Text>
                </View>

                {mech.operator && (
                  <>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Operator Name</Text>
                      <TextInput
                        style={styles.textInput}
                        value={currentMechData.operatorName || ""}
                        onChangeText={(text) =>
                          updateMechanicalField(index, "operatorName", text)
                        }
                        placeholder="Enter operator name"
                        placeholderTextColor={Colors.grey}
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>CP Number *</Text>
                      <TextInput
                        style={styles.textInput}
                        value={currentMechData.cpNumber || ""}
                        onChangeText={(text) =>
                          updateMechanicalField(index, "cpNumber", text)
                        }
                        placeholder="Enter CP number"
                        placeholderTextColor={Colors.grey}
                        keyboardType="numeric"
                      />
                    </View>
                  </>
                )}
              </View>
            </View>
          );
        })}
    </View>
  );

  return (
    <WrapperContainer>
      <InnerHeader title={"DPR Submit"} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? moderateScale(40) : 0}
      >
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {renderProcessDetails()}
          {renderMechanicalSection()}

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <CustomButton
              text={"Cancel"}
              buttonStyle={styles.cancelButton}
              textStyle={styles.cancelButtonText}
              handleAction={handleCancel}
            />
            <CustomButton
              text={"Submit"}
              buttonStyle={styles.issueButton}
              textStyle={styles.issueButtonText}
              handleAction={handleSubmit}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </WrapperContainer>
  );
};

export default DPRSubmit;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: moderateScale(16),
    paddingBottom: moderateScale(20),
  },
  section: {
    backgroundColor: Colors.white,
    borderRadius: moderateScale(8),
    // padding: moderateScale(16),
    marginBottom: moderateScaleVertical(16),
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: moderateScale(5),
  },
  sectionTitle: {
    fontSize: textScale(16),
    fontFamily: FontFamily.PoppinsSemiBold,
    color: Colors.greenColor,
    marginBottom: moderateScaleVertical(16),
    borderLeftWidth: moderateScale(3),
    paddingLeft: moderateScale(10),
    borderColor: Colors.primary,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: moderateScaleVertical(12),
    padding: moderateScale(5),
  },
  detailItem: {
    flex: 1,
    marginHorizontal: moderateScale(4),
  },
  detailLabel: {
    fontSize: textScale(11),
    fontFamily: FontFamily.PoppinsMedium,
    color: Colors.textColor,
    marginBottom: moderateScaleVertical(4),
  },
  detailValue: {
    fontSize: textScale(13),
    fontFamily: FontFamily.PoppinsRegular,
    color: Colors.black,
    backgroundColor: Colors.lightBackground,
    padding: moderateScale(10),
    borderRadius: moderateScale(6),
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  additionalInfo: {
    marginTop: moderateScaleVertical(8),
    paddingTop: moderateScaleVertical(12),
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    padding: moderateScale(10),
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: moderateScaleVertical(5),
  },
  infoLabel: {
    fontSize: textScale(12),
    fontFamily: FontFamily.PoppinsRegular,
    color: Colors.textColor,
    flex: 1,
  },
  infoValue: {
    fontSize: textScale(13),
    fontFamily: FontFamily.PoppinsMedium,
    color: Colors.black,
    flex: 1,
    textAlign: "right",
  },
  mechContainer: {
    backgroundColor: Colors.white,
    borderRadius: moderateScale(6),
    padding: moderateScale(12),
    marginBottom: moderateScaleVertical(8),
  },
  serialContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: moderateScaleVertical(8),
    paddingBottom: moderateScaleVertical(8),
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  serialLabel: {
    fontSize: textScale(14),
    fontFamily: FontFamily.PoppinsRegular,
    color: Colors.textColor,
  },
  serialNumber: {
    fontSize: textScale(12),
    fontFamily: FontFamily.PoppinsSemiBold,
    color: Colors.textColor,
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(4),
    borderWidth: moderateScale(1),
    borderColor: Colors.textColor,
  },
  mechDetails: {
    paddingHorizontal: moderateScale(4),
    gap: moderateScaleVertical(5),
  },
  mechRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: moderateScaleVertical(8),
  },
  mechLabel: {
    fontSize: textScale(12),
    fontFamily: FontFamily.PoppinsMedium,
    color: Colors.textColor,
    flex: 1,
  },
  mechValue: {
    fontSize: textScale(12),
    fontFamily: FontFamily.PoppinsRegular,
    color: Colors.black,
    flex: 1,
    textAlign: "right",
    padding: moderateScale(8),
    borderRadius: moderateScale(4),
  },
  inputContainer: {
    marginBottom: moderateScaleVertical(12),
  },
  inputLabel: {
    fontSize: textScale(12),
    fontFamily: FontFamily.PoppinsMedium,
    color: Colors.textColor,
    marginBottom: moderateScaleVertical(4),
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: moderateScale(6),
    padding: moderateScale(12),
    fontSize: textScale(14),
    color: Colors.black,
    backgroundColor: Colors.white,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: moderateScale(10),
  },
  cancelButton: {
    backgroundColor: Colors.white,
    width: "48%",
    borderRadius: moderateScale(8),
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.gray,
    padding: moderateScale(12),
  },
  cancelButtonText: {
    color: Colors.textColor,
    fontSize: textScale(14),
    fontFamily: FontFamily.PoppinsMedium,
  },
  issueButton: {
    backgroundColor: Colors.greenColor,
    width: "48%",
    borderRadius: moderateScale(8),
    alignItems: "center",
    padding: moderateScale(12),
  },
  issueButtonText: {
    color: Colors.white,
    fontSize: textScale(14),
    fontFamily: FontFamily.PoppinsMedium,
  },
});
