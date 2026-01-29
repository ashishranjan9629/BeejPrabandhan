import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";

import WrapperContainer from "../../../../utils/WrapperContainer";
import InnerHeader from "../../../../components/InnerHeader";
import Colors from "../../../../utils/Colors";
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from "../../../../utils/responsiveSize";
import FontFamily from "../../../../utils/FontFamily";
import { decryptAES, encryptWholeObject } from "../../../../utils/decryptData";
import { apiRequest } from "../../../../services/APIRequest";
import { API_ROUTES } from "../../../../services/APIRoutes";
import { showErrorMessage } from "../../../../utils/HelperFunction";
import { getUserData } from "../../../../utils/Storage";

/* ================= SAMPLE DATA (API se replace karein) ================= */

/* ================= COMPONENT ================= */

const DealerIndentsList = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [dealerIndentsList, setDealerIndentsList] = useState([]);

  useEffect(() => {
    fetchDealerIndentsList();
  }, []);

  const fetchDealerIndentsList = async () => {
    setLoading(true);
    const userData = await getUserData();

    try {
      const payloadData = {
        page: 0,
        pageSize: 25,
        seedId: "",
        varietyId: "",
        classId: "",
        stage: "",
        packageSize: "",
        lotno: "",
        dealerIndentNo: "",
        aoId: userData?.aoId,
        indentFromDate: "",
        indentToDate: "",
        dealerId: "",
        materialType: "",
      };

      const encryptedPayload = encryptWholeObject(payloadData);

      const response = await apiRequest(
        API_ROUTES.DEALER_INDENTS_LIST,
        "post",
        encryptedPayload,
      );

      const decrypted = decryptAES(response);
      const parsed = JSON.parse(decrypted);

      if (parsed?.status === "SUCCESS" && parsed?.statusCode === "200") {
        const newData = parsed?.data;

        setDealerIndentsList(newData);
      } else {
        showErrorMessage(parsed?.message || "Invalid response");
      }
    } catch (err) {
      console.log("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= STATUS COLOR ================= */

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "#ff9800";
      case "DISPOSED":
        return "#4caf50";
      default:
        return Colors.gray;
    }
  };

  /* ================= CARD ================= */

  const renderCard = ({ item }) => {
    return (
      <View style={styles.card}>
        {/* HEADER */}
        <View style={styles.cardHeader}>
          <Text style={styles.indentNo}>{item.dealerIndentNo}</Text>

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.indentStatus) },
            ]}
          >
            <Text style={styles.statusText}>{item.indentStatus}</Text>
          </View>
        </View>

        {/* BODY */}
        <View style={styles.row}>
          <Text style={styles.label}>Party Name</Text>
          <Text style={styles.value}>{item.dealerName}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Material Type</Text>
          <Text style={styles.value}>{item.materialType}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Advanced Payment</Text>
          <Text
            style={[
              styles.value,
              {
                color: item.advanceReceived ? "#2e7d32" : "#c62828",
                fontWeight: "700",
              },
            ]}
          >
            {item.advanceReceived ? "Yes" : "No"}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Payment Mode</Text>
          <Text style={styles.value}>{item.paymentMode || "NA"}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Payment Received Date</Text>
          <Text style={styles.value}>{item.paymentDate || "NA"}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Expected Delivery</Text>
          <Text style={styles.value}>{item.deliveryDate || "NA"}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Indent Date</Text>
          <Text style={styles.value}>{item.indentDate}</Text>
        </View>

        {/* <View style={styles.row}>
          <Text style={styles.label}>Created On</Text>
          <Text style={styles.value}>{item.createdOn}</Text>
        </View> */}

        {/* ACTIONS */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("DealerIndentDetail", { item: item });
            }}
            style={styles.actionBtn}
          >
            <Icon name="visibility" size={22} color={Colors.greenColor} />
            <Text style={styles.actionText}>View</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn}>
            <Icon name="edit" size={22} color="#1976d2" />
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn}>
            <Icon name="close" size={22} color="red" />
            <Text style={styles.actionText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  /* ================= UI ================= */

  return (
    <WrapperContainer isLoading={loading}>
      <InnerHeader
        rightIcon={
          <TouchableOpacity
            onPress={() => navigation.navigate("CreateDealerIndent")}
            style={styles.notificationHolder}
          >
            <Icon name="add" size={25} color={Colors.white} />
          </TouchableOpacity>
        }
        title="Dealer Indents"
      />

      <FlatList
        data={dealerIndentsList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </WrapperContainer>
  );
};

export default DealerIndentsList;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  listContainer: {
    padding: moderateScale(12),
    paddingBottom: 30,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: moderateScale(14),
    marginBottom: moderateScaleVertical(12),
    elevation: 4,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  indentNo: {
    fontSize: textScale(13),
    fontFamily: FontFamily.PoppinsSemiBold,
    color: Colors.black,
    flex: 1,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  statusText: {
    color: "#fff",
    fontSize: 11,
    fontFamily: FontFamily.PoppinsMedium,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },

  label: {
    fontSize: textScale(12),
    color: Colors.gray,
    fontFamily: FontFamily.PoppinsRegular,
  },

  value: {
    fontSize: textScale(12),
    color: Colors.black,
    fontFamily: FontFamily.PoppinsMedium,
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingTop: 10,
  },

  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
  },

  actionText: {
    marginLeft: 4,
    fontSize: 12,
    fontFamily: FontFamily.PoppinsMedium,
    color: Colors.black,
  },

  notificationHolder: {
    borderWidth: 2,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.greenColor,
    borderColor: Colors.greenColor,
    alignItems: "center",
    justifyContent: "center",
  },
});
