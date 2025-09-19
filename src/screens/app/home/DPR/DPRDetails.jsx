import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import WrapperContainer from "../../../../utils/WrapperContainer";
import InnerHeader from "../../../../components/InnerHeader";
import { decryptAES, encryptWholeObject } from "../../../../utils/decryptData";
import { apiRequest } from "../../../../services/APIRequest";
import { API_ROUTES } from "../../../../services/APIRoutes";
import {
  moderateScale,
  moderateScaleVertical,
  scale,
  textScale,
} from "../../../../utils/responsiveSize";
import Colors from "../../../../utils/Colors";
import FontFamily from "../../../../utils/FontFamily";

const DPRDetails = ({ route }) => {
  const { data } = route.params;
  console.log(data, "line 26");
  const [loading, setLoading] = useState(false);
  const [dprFullDetails, setDprFullDetails] = useState();

  useEffect(() => {
    fetchDPRFullDetails();
  }, []);

  const fetchDPRFullDetails = async () => {
    try {
      setLoading(true);
      const payloadData = {
        id: data?.id,
      };
      const encryptedPayload = encryptWholeObject(payloadData);
      const response = await apiRequest(
        API_ROUTES.DP_REPORT_DETAILS,
        "POST",
        encryptedPayload
      );
      const decrypted = decryptAES(response);
      const parsedDecrypted = JSON.parse(decrypted);
      // console.log(parsedDecrypted, "line 43");
      if (
        parsedDecrypted?.status === "SUCCESS" &&
        parsedDecrypted?.statusCode === "200"
      ) {
        setDprFullDetails(parsedDecrypted?.data);
      } else {
        showErrorMessage(parsedDecrypted?.message || "Not getting Data");
      }
    } catch (error) {
      console.log(error, "Line errror");
    } finally {
      setLoading(false);
    }
  };

  const DetailsRow = ({ lable, value }) => {
    return (
      <View style={styles.detailsView}>
        <Text style={styles.label}>{lable}</Text>
        <Text style={styles.value}>{value ? value : "-"}</Text>
      </View>
    );
  };

    const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); 
  };

  return (
    <WrapperContainer isLoading={loading}>
      <InnerHeader title={"DRP Details"} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={moderateScaleVertical(10)}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: moderateScaleVertical(40) }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.filterCard}>
            <Text style={styles.headerText}>Process Details</Text>
            <View style={styles.detailsHolder}>
              <DetailsRow lable={"Date"} value={formatDate(data?.createdOn)} />
              <DetailsRow lable={"Square Name"} value={data?.squareName} />
              <DetailsRow lable={"Operation"} value={data?.operationName} />
              <DetailsRow lable={"Financial Year"} value={data?.finYear} />
              <DetailsRow lable={"Season"} value={data?.season} />
              <DetailsRow lable={"Class"} value={data?.fromSeedClass} />
              <DetailsRow lable={"Stage"} value={data?.toSeedStage} />
              <DetailsRow
                lable={"Required Output (ha)"}
                value={data?.requiredOutputArea}
              />
            </View>
          </View>
          {/* Agriculture */}
          {data?.dprAgricultures.length > 0 ? (
            <View style={styles.filterCard}>
              <Text style={styles.headerText}>Agriculture</Text>
              {data?.dprAgricultures.map((item, index) => (
                <View
                  key={index}
                  style={[styles.detailsHolder, styles.agicultureView]}
                >
                  <DetailsRow lable={"Serial No"} value={index + 1} />
                  <DetailsRow
                    lable={"Material Type"}
                    value={item?.materialType}
                  />
                  <DetailsRow lable={"Material"} value={item?.itemName} />
                  <DetailsRow lable={"Weightage"} value={item?.qty} />
                </View>
              ))}
            </View>
          ) : null}
          {/* Machinincal */}
          {data?.dprMechanicals.length > 0 ? (
            <View style={styles.filterCard}>
              <Text style={styles.headerText}>Mechanical</Text>
              {data?.dprMechanicals.map((item, index) => (
                <View
                  key={index}
                  style={[styles.detailsHolder, styles.agicultureView]}
                >
                  <DetailsRow lable={"Serial No"} value={index + 1} />
                  <DetailsRow
                    lable={"Equipment Name"}
                    value={item?.equipmentName}
                  />
                  <DetailsRow
                    lable={"Est. Hours"}
                    value={item?.estimatedHours}
                  />
                  <DetailsRow
                    lable={"Operator Name"}
                    value={item?.operatorName}
                  />
                  <DetailsRow lable={"CP Number"} value={item?.cpNumber} />
                  <DetailsRow
                    lable={"From Time"}
                    value={item?.fromWorkingHour}
                  />
                  <DetailsRow lable={"To Time"} value={item?.toWorkingHour} />
                  <DetailsRow
                    lable={"Actual Hours"}
                    value={item?.totalWorkingHour}
                  />
                  <DetailsRow
                    lable={"DRP Machine Status"}
                    value={item?.dprMechStatus}
                  />
                  <DetailsRow lable={"Status"} value={item?.status} />
                </View>
              ))}
            </View>
          ) : null}
          {/* Labour */}
          {data?.dprLabour.length > 0 ? (
            <View style={styles.filterCard}>
              <Text style={styles.headerText}>Labour Details</Text>
              {data?.dprLabour.map((item, index) => (
                <View
                  key={index}
                  style={[styles.detailsHolder, styles.agicultureView]}
                >
                  <DetailsRow lable={"Serial No"} value={index + 1} />
                  <DetailsRow lable={"Operation"} value={data?.operationName} />
                  <DetailsRow
                    lable={"Labour Name"}
                    value={item?.name}
                  />
                  <DetailsRow
                    lable={"Actula Time"}
                    value={item?.actualTime}
                  />
                  <DetailsRow lable={"OT Time"} value={item?.otTime} />
                </View>
              ))}
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </WrapperContainer>
  );
};

export default DPRDetails;

const styles = StyleSheet.create({
  filterCard: {
    backgroundColor: Colors.white,
    marginHorizontal: moderateScale(15),
    margin: moderateScaleVertical(10),
    borderRadius: moderateScale(5),
    elevation: moderateScale(5),
    shadowColor: Colors.greenColor,
    shadowOpacity: scale(0.08),
    shadowRadius: moderateScale(5),
    shadowOffset: { width: 0, height: 2 },
  },
  headerText: {
    fontSize: textScale(14),
    fontFamily: FontFamily.PoppinsSemiBold,
    color: Colors.greenColor,
    marginBottom: moderateScaleVertical(4),
    borderLeftWidth: moderateScale(2),
    padding: moderateScale(5),
    paddingHorizontal: moderateScale(10),
    borderColor: Colors.primary,
  },
  label: {
    fontFamily: FontFamily.PoppinsRegular,
    fontSize: textScale(12),
    color: Colors.textColor,
    letterSpacing: scale(0.2),
    textTransform: "capitalize",
  },
  value: {
    fontFamily: FontFamily.PoppinsMedium,
    color: Colors.black,
    fontSize: textScale(14),
    letterSpacing: scale(0.2),
    textTransform: "capitalize",
  },
  detailsHolder: {
    padding: moderateScale(10),
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(10),
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  detailsView: {
    width: "48%",
    gap: moderateScale(5),
    padding: moderateScale(5),
  },
  agicultureView: {
    borderBottomWidth: moderateScale(1),
    marginVertical: moderateScaleVertical(5),
    borderColor: Colors.gray,
  },
});
