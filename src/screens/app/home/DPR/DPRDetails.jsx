// import { StyleSheet, Text, View } from "react-native";
// import React, { useEffect, useState } from "react";
// import WrapperContainer from "../../../../utils/WrapperContainer";
// import InnerHeader from "../../../../components/InnerHeader";
// import { decryptAES, encryptWholeObject } from "../../../../utils/decryptData";
// import { apiRequest } from "../../../../services/APIRequest";
// import { API_ROUTES } from "../../../../services/APIRoutes";

// const DPRDetails = ({ route }) => {
//   const { data } = route.params;
//   const [loading, setLoading] = useState(false);
//   const [dprFullDetails, setDprFullDetails] = useState();

//   useEffect(() => {
//     fetchDPRFullDetails();
//   }, []);

//   const fetchDPRFullDetails = async () => {
//     try {
//       setLoading(true);
//       const payloadData = {
//         id: data?.id,
//       };
//       const encryptedPayload = encryptWholeObject(payloadData);
//       const response = await apiRequest(
//         API_ROUTES.DP_REPORT_DETAILS,
//         "POST",
//         encryptedPayload
//       );
//       const decrypted = decryptAES(response);
//       const parsedDecrypted = JSON.parse(decrypted);
//       console.log(parsedDecrypted, "line 43");
//       if (
//         parsedDecrypted?.status === "SUCCESS" &&
//         parsedDecrypted?.statusCode === "200"
//       ) {
//         setDprFullDetails(parsedDecrypted?.data);
//       } else {
//         showErrorMessage(parsedDecrypted?.message || "Not getting Data");
//       }
//     } catch (error) {
//       console.log(error, "Line errror");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <WrapperContainer isLoading={loading}>
//       <InnerHeader title={"DRP Details"} />
//     </WrapperContainer>
//   );
// };

// export default DPRDetails;

// const styles = StyleSheet.create({});



import { StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import WrapperContainer from "../../../../utils/WrapperContainer";
import InnerHeader from "../../../../components/InnerHeader";
import { decryptAES, encryptWholeObject } from "../../../../utils/decryptData";
import { apiRequest } from "../../../../services/APIRequest";
import { API_ROUTES } from "../../../../services/APIRoutes";
import { showErrorMessage } from "../../../../utils/HelperFunction";
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from "../../../../utils/responsiveSize";
import FontFamily from "../../../../utils/FontFamily";
import Colors from "../../../../utils/Colors";

const DPRDetails = ({ route }) => {
  const { data } = route.params;
  const [loading, setLoading] = useState(false);
  const [dprFullDetails, setDprFullDetails] = useState(null);

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
      console.log(parsedDecrypted, "line 43");
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  if (!dprFullDetails) {
    return (
      <WrapperContainer isLoading={loading}>
        <InnerHeader title={"DRP Details"} />
      </WrapperContainer>
    );
  }

  return (
    <WrapperContainer isLoading={loading}>
      <InnerHeader title={"DRP Details"} />
      <ScrollView style={styles.container}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Daily Progress Report Detail</Text>
        </View>

        {/* Process Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Process Details</Text>
          
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Date</Text>
              <Text style={styles.value}>{formatDate(dprFullDetails.reportDate)}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Source Name</Text>
              <Text style={styles.boldValue}>{dprFullDetails.squareName || "N/A"}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Class</Text>
              <Text style={styles.boldValue}>{dprFullDetails.fromSeedClass || "N/A"}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Operation</Text>
              <Text style={styles.boldValue}>{dprFullDetails.operationName || "N/A"}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Stage</Text>
              <Text style={styles.boldValue}>{dprFullDetails.fromSeedStage || "N/A"}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Financial Year</Text>
              <Text style={styles.boldValue}>{dprFullDetails.finYear || "N/A"}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Required Output (ha)</Text>
              <Text style={styles.boldValue}>{dprFullDetails.requiredOutputArea || "N/A"}</Text>
            </View>
          </View>
        </View>

        {/* Agriculture Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Agriculture</Text>
          <View style={styles.placeholderRow}>
            <Text style={styles.placeholderText}>Serial No ↓</Text>
          </View>
        </View>

        {/* Method Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Method</Text>
          <View style={styles.placeholderRow}>
            <Text style={styles.placeholderText}>Serial No ↓</Text>
          </View>
        </View>

        {/* Mechanical Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mechanical</Text>
          <View style={styles.placeholderRow}>
            <Text style={styles.placeholderText}>Serial No ↓</Text>
          </View>
        </View>

        {/* Equipment Details */}
        {dprFullDetails.dprMechanicals && dprFullDetails.dprMechanicals.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Equipment Details</Text>
            {dprFullDetails.dprMechanicals.map((equipment, index) => (
              <View key={index} style={styles.equipmentItem}>
                <Text style={styles.equipmentName}>{equipment.equipmentName || "N/A"}</Text>
                <View style={styles.equipmentDetails}>
                  <Text style={styles.equipmentTime}>08:00</Text>
                  <View style={styles.equipmentSubDetails}>
                    <Text style={styles.equipmentText}>Furn Time</Text>
                    <Text style={styles.equipmentText}>Equipment Name</Text>
                    <Text style={styles.equipmentText}>Mac Name One</Text>
                  </View>
                </View>
                {equipment.operatorName && (
                  <Text style={styles.operatorText}>Operator: {equipment.operatorName}</Text>
                )}
                {equipment.cpNumber && (
                  <Text style={styles.cpText}>CP Number: {equipment.cpNumber}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Labour Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Labour Details</Text>
          <View style={styles.placeholderRow}>
            <Text style={styles.placeholderText}>Serial No ↓</Text>
          </View>
        </View>

        {/* Operation Labour */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Operation</Text>
          <Text style={styles.boldValue}>{dprFullDetails.operationName || "N/A"}</Text>
          <View style={styles.placeholderRow}>
            <Text style={styles.placeholderText}>Labour Name ↓</Text>
          </View>
        </View>

        {/* Material Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Material</Text>
          <View style={styles.placeholderRow}>
            <Text style={styles.placeholderText}>Material ↓</Text>
          </View>
        </View>

        {/* Navigation Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Navigation (hz)</Text>
          <View style={styles.placeholderRow}>
            <Text style={styles.placeholderText}>Operation Name ↓</Text>
          </View>
        </View>

        {/* Controller Name */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Controller Name</Text>
          <View style={styles.placeholderRow}>
            <Text style={styles.placeholderText}>Alcault Nora ↓</Text>
          </View>
        </View>

        {/* Operator Name */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Operator Name</Text>
          <View style={styles.placeholderRow}>
            <Text style={styles.placeholderText}>Operator Name ↓</Text>
          </View>
        </View>

        {/* Additional Sections as per screenshot */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Controller Name</Text>
          <View style={styles.placeholderRow}>
            <Text style={styles.placeholderText}>Alcault Nora ↓</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Labour Details</Text>
          <View style={styles.placeholderRow}>
            <Text style={styles.placeholderText}>Serial No ↓</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Operation</Text>
          <Text style={styles.boldValue}>{dprFullDetails.operationName || "N/A"}</Text>
          <View style={styles.placeholderRow}>
            <Text style={styles.placeholderText}>Labour Name ↓</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Material Time</Text>
          <View style={styles.placeholderRow}>
            <Text style={styles.placeholderText}>GT Time ↓</Text>
          </View>
        </View>
      </ScrollView>
    </WrapperContainer>
  );
};

export default DPRDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: moderateScale(16),
  },
  headerSection: {
    marginBottom: moderateScaleVertical(20),
  },
  headerTitle: {
    fontSize: textScale(18),
    fontFamily: FontFamily.PoppinsBold,
    color: Colors.black,
    textAlign: 'center',
  },
  section: {
    backgroundColor: Colors.white,
    borderRadius: moderateScale(8),
    padding: moderateScale(16),
    marginBottom: moderateScaleVertical(16),
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: textScale(16),
    fontFamily: FontFamily.PoppinsSemiBold,
    color: Colors.primary,
    marginBottom: moderateScaleVertical(12),
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: moderateScaleVertical(8),
  },
  column: {
    flex: 1,
  },
  label: {
    fontSize: textScale(12),
    fontFamily: FontFamily.PoppinsRegular,
    color: Colors.darkGray,
    marginBottom: moderateScaleVertical(4),
  },
  value: {
    fontSize: textScale(14),
    fontFamily: FontFamily.PoppinsMedium,
    color: Colors.black,
  },
  boldValue: {
    fontSize: textScale(14),
    fontFamily: FontFamily.PoppinsSemiBold,
    color: Colors.black,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.lightGray,
    marginVertical: moderateScaleVertical(12),
  },
  placeholderRow: {
    backgroundColor: Colors.lightGray,
    padding: moderateScale(12),
    borderRadius: moderateScale(4),
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: textScale(12),
    fontFamily: FontFamily.PoppinsRegular,
    color: Colors.darkGray,
    fontStyle: 'italic',
  },
  equipmentItem: {
    backgroundColor: Colors.veryLightGray,
    padding: moderateScale(12),
    borderRadius: moderateScale(6),
    marginBottom: moderateScaleVertical(8),
  },
  equipmentName: {
    fontSize: textScale(14),
    fontFamily: FontFamily.PoppinsSemiBold,
    color: Colors.black,
    marginBottom: moderateScaleVertical(8),
  },
  equipmentDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScaleVertical(8),
  },
  equipmentTime: {
    fontSize: textScale(14),
    fontFamily: FontFamily.PoppinsMedium,
    color: Colors.primary,
    marginRight: moderateScale(12),
  },
  equipmentSubDetails: {
    flex: 1,
  },
  equipmentText: {
    fontSize: textScale(12),
    fontFamily: FontFamily.PoppinsRegular,
    color: Colors.darkGray,
    marginBottom: moderateScaleVertical(2),
  },
  operatorText: {
    fontSize: textScale(12),
    fontFamily: FontFamily.PoppinsMedium,
    color: Colors.black,
    marginBottom: moderateScaleVertical(4),
  },
  cpText: {
    fontSize: textScale(12),
    fontFamily: FontFamily.PoppinsRegular,
    color: Colors.darkGray,
  },
});