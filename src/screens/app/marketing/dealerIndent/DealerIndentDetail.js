import { StyleSheet, Text, View, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import WrapperContainer from "../../../../utils/WrapperContainer";
import InnerHeader from "../../../../components/InnerHeader";
import Colors from "../../../../utils/Colors";
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from "../../../../utils/responsiveSize";
import FontFamily from "../../../../utils/FontFamily";
import { apiRequest } from "../../../../services/APIRequest";
import { API_ROUTES } from "../../../../services/APIRoutes";
import { decryptAES, encryptWholeObject } from "../../../../utils/decryptData";
import { showErrorMessage } from "../../../../utils/HelperFunction";

/* ================= COMPONENT ================= */

const DealerIndentDetail = ({ route }) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [indentDetail, setindentDetail] = useState("");

  useEffect(() => {
    fetchDealerIndentsDetail();
  }, []);

  const fetchDealerIndentsDetail = async () => {
    setLoading(true);

    try {
      const payloadData = {
        id: route?.params?.item?.id,
      };

      const encryptedPayload = encryptWholeObject(payloadData);

      const response = await apiRequest(
        API_ROUTES.DEALER_INDENTS_FIND_BY_ID,
        "post",
        encryptedPayload,
      );

      const decrypted = decryptAES(response);
      const parsed = JSON.parse(decrypted);

      if (parsed?.status === "SUCCESS" && parsed?.statusCode === "200") {
        const newData = parsed?.data;

        setindentDetail(newData);
      } else {
        showErrorMessage(parsed?.message || "Invalid response");
      }
    } catch (err) {
      console.log("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <WrapperContainer isLoading={loading}>
      <InnerHeader title="Indent details" />

      {/* INDENT DETAILS */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Indent details</Text>

        <View style={styles.row}>
          <Info label="Indent No" value={indentDetail.dealerIndentNo} />
          <Info label="Dealer" value={indentDetail.dealerName} />
        </View>

        <View style={styles.row}>
          <Info label="Material Type" value={indentDetail.materialType} />
          <Info
            label="Mapped Indent No."
            value={indentDetail?.mappedIndentNo || "--"}
          />
        </View>

        <Info
          label="Expected Delivery Date"
          value={indentDetail.deliveryDate}
        />
      </View>

      {/* ADVANCE DETAILS */}

      {indentDetail?.paymentMode && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Advance Details</Text>

          <View style={styles.row}>
            <Info label="Amount" value={indentDetail.receivedAmount} />
            <Info label="Payment Mode" value={indentDetail.paymentMode} />
          </View>

          <View style={styles.row}>
            <Info label="Ref No." value={indentDetail.refNo} />
            <Info label="Paid Date" value={indentDetail.paymentDate} />
          </View>
        </View>
      )}

      {/* ITEM LIST */}
      <View style={styles.card}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeadText, { flex: 2 }]}>Item Name</Text>
          <Text style={[styles.tableHeadText, { flex: 1 }]}>Qty</Text>
        </View>

        <FlatList
          data={indentDetail.dealerIndentItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              <Text style={[styles.tableText, { flex: 2 }]}>
                {item.itemName}
              </Text>
              <Text style={[styles.tableText, { flex: 1 }]}>{item.qty}</Text>
            </View>
          )}
        />
      </View>
    </WrapperContainer>
  );
};

/* ================= REUSABLE INFO ================= */

const Info = ({ label, value }) => (
  <View style={styles.infoBox}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value || "NA"}</Text>
  </View>
);

export default DealerIndentDetail;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    margin: moderateScale(12),
    borderRadius: 10,
    padding: moderateScale(12),
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },

  cardTitle: {
    fontSize: textScale(16),
    fontFamily: FontFamily.PoppinsSemiBold,
    color: Colors.greenColor,
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  infoBox: {
    flex: 1,
    marginBottom: moderateScaleVertical(10),
  },

  label: {
    fontSize: textScale(12),
    color: "#777",
    fontFamily: FontFamily.PoppinsRegular,
  },

  value: {
    fontSize: textScale(14),
    color: "#000",
    fontFamily: FontFamily.PoppinsMedium,
    marginTop: 2,
  },

  /* TABLE */
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingBottom: 6,
    marginBottom: 6,
  },

  tableHeadText: {
    fontSize: textScale(13),
    fontFamily: FontFamily.PoppinsSemiBold,
    color: "#333",
  },

  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  tableText: {
    fontSize: textScale(13),
    color: "#000",
  },
});
