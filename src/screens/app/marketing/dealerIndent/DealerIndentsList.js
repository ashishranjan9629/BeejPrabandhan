import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Modal,
  TextInput,
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
import DropDown from "../../../../components/DropDown";

/* ================= SAMPLE DATA (API se replace karein) ================= */

/* ================= COMPONENT ================= */

const DealerIndentsList = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [dealerIndentsList, setDealerIndentsList] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelRemark, setCancelRemark] = useState("");
  const [selectedIndent, setSelectedIndent] = useState(null);
  const [showFilter, setShowFilter] = useState(false);

  const [filter, setFilter] = useState({
    indentNo: "",
    party: null,
    fromDate: "",
    toDate: "",
    materialType: null,
  });

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

  const submitCancelIndent = async () => {
    if (!cancelRemark.trim()) {
      alert("Please enter cancel remark");
      return;
    }

    setLoading(true);
    try {
      const userData = await getUserData();

      const payloadData = {
        id: selectedIndent.id,
        disposalRemark: cancelRemark,
      };

      const encryptedPayload = encryptWholeObject(payloadData);

      const response = await apiRequest(
        API_ROUTES.CANCEL_DEALER_INDENT,
        "post",
        encryptedPayload,
      );

      const decrypted = decryptAES(response);
      const parsed = JSON.parse(decrypted);

      if (parsed?.status === "SUCCESS") {
        alert("Indent cancelled successfully ✅");
        setShowCancelModal(false);
        setCancelRemark("");
        setSelectedIndent(null);
        fetchDealerIndentsList(); // 🔁 refresh list
      } else {
        showErrorMessage(parsed?.message || "Cancel failed");
      }
    } catch (err) {
      console.log("Cancel error", err);
      showErrorMessage("Something went wrong");
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

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("CreateDealerIndent", {
                indent: item,
                isEdit: true,
              });
            }}
            style={styles.actionBtn}
          >
            <Icon name="edit" size={22} color="#1976d2" />
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>

          {item.indentStatus === "PENDING" && (
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => {
                setSelectedIndent(item);
                setShowCancelModal(true);
              }}
            >
              <Icon name="close" size={22} color="red" />
              <Text style={[styles.actionText, { color: "red" }]}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  /* ================= UI ================= */

  return (
    <WrapperContainer isLoading={loading}>
      <Modal
        transparent
        animationType="fade"
        visible={showCancelModal}
        onRequestClose={() => setShowCancelModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.cancelModalBox}>
            <Text style={styles.modalTitle}>Cancel Indent</Text>

            <TextInput
              placeholder="Enter cancel remark"
              value={cancelRemark}
              onChangeText={setCancelRemark}
              multiline
              style={styles.remarkInput}
            />

            <View style={styles.modalActionRow}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#ccc" }]}
                onPress={() => {
                  setShowCancelModal(false);
                  setCancelRemark("");
                }}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "red" }]}
                onPress={submitCancelIndent}
              >
                <Text style={{ color: "#fff" }}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        animationType="slide"
        visible={showFilter}
        onRequestClose={() => setShowFilter(false)}
      >
        <View style={styles.filterOverlay}>
          <View style={styles.filterBox}>
            <Text style={styles.filterTitle}>Filter</Text>

            {/* Indent No */}
            <TextInput
              placeholder="Indent No"
              value={filter.indentNo}
              onChangeText={(v) => setFilter((p) => ({ ...p, indentNo: v }))}
              style={styles.filterInput}
            />

            {/* Party */}
            <DropDown
              label="Party Name"
              data={[]}
              value={filter.party?.payeeName || ""}
              selectItem={(item) => setFilter((p) => ({ ...p, party: item }))}
            />

            {/* From Date */}
            <TextInput
              placeholder="From Date (DD/MM/YYYY)"
              value={filter.fromDate}
              onChangeText={(v) => setFilter((p) => ({ ...p, fromDate: v }))}
              style={styles.filterInput}
            />

            {/* To Date */}
            <TextInput
              placeholder="To Date (DD/MM/YYYY)"
              value={filter.toDate}
              onChangeText={(v) => setFilter((p) => ({ ...p, toDate: v }))}
              style={styles.filterInput}
            />

            {/* Material Type */}
            <DropDown
              label="Material Type"
              data={[
                { name: "SEED" },
                { name: "VALUE_ADDED" },
                { name: "SAPLING" },
              ]}
              value={filter.materialType?.name || ""}
              selectItem={(item) =>
                setFilter((p) => ({ ...p, materialType: item }))
              }
            />

            {/* ACTIONS */}
            <View style={styles.filterActionRow}>
              <TouchableOpacity
                style={styles.resetBtn}
                onPress={() => {
                  setFilter({
                    indentNo: "",
                    party: null,
                    fromDate: "",
                    toDate: "",
                    materialType: null,
                  });
                }}
              >
                <Text style={{ color: Colors.greenColor }}>Reset</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.searchBtn}
                onPress={() => {
                  setShowFilter(false);
                  fetchDealerIndentsList(filter); // 👈 use filter
                }}
              >
                <Text style={{ color: "#fff" }}>Search</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <InnerHeader
        rightIcon={
          <TouchableOpacity
            onPress={() => setShowFilter(true)}
            style={styles.filterBtn}
          >
            <Icon name="filter-list" size={24} color="#fff" />
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
      {/* FLOATING ADD BUTTON */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreateDealerIndent")}
      >
        <Icon name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </WrapperContainer>
  );
};

export default DealerIndentsList;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  listContainer: {
    padding: moderateScale(12),
    paddingBottom: 90,
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
  cancelModalBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "85%",
    elevation: 6, // Android shadow
  },

  remarkInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    minHeight: 80,
    padding: 10,
    marginTop: 10,
    textAlignVertical: "top",
  },

  modalActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },

  modalBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  filterBtn: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: Colors.greenColor,
    justifyContent: "center",
    alignItems: "center",
  },

  filterOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },

  filterBox: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },

  filterTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    color: Colors.greenColor,
  },

  filterInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },

  filterActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },

  resetBtn: {
    borderWidth: 1,
    borderColor: Colors.greenColor,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },

  searchBtn: {
    backgroundColor: Colors.greenColor,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.greenColor,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
