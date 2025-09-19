import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
  Animated,
} from "react-native";
import React, { useEffect, useState } from "react";
import WrapperContainer from "../../../../utils/WrapperContainer";
import InnerHeader from "../../../../components/InnerHeader";
import { getUserData } from "../../../../utils/Storage";
import { decryptAES, encryptWholeObject } from "../../../../utils/decryptData";
import { apiRequest } from "../../../../services/APIRequest";
import { API_ROUTES } from "../../../../services/APIRoutes";
import { showErrorMessage } from "../../../../utils/HelperFunction";
import {
  moderateScale,
  moderateScaleVertical,
  scale,
  textScale,
} from "../../../../utils/responsiveSize";
import FontFamily from "../../../../utils/FontFamily";
import Colors from "../../../../utils/Colors";
import CustomBottomSheet from "../../../../components/CustomBottomSheet";
import CustomButton from "../../../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";

const DailyProgressReportList = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState();
  const [dpReportList, setDpReportList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    const userData = await getUserData();
    setUserData(userData);
    await fetchDPRList(userData);
  };

  const fetchDPRList = async (userData) => {
    console.log(userData, "line 23");
    setLoading(false);
    try {
      const payloadData = {
        blockId: userData?.unitType === "BLOCK" ? userData?.blockId : null,
        chakId: userData?.unitType === "CHAK" ? userData?.chakId : null,
        equipment: userData?.subUnitType === "WORKSHOP" ? true : false,
        page: 0,
        pageSize: 25,
      };
      const encryptedPayload = encryptWholeObject(payloadData);
      const response = await apiRequest(
        API_ROUTES.DP_REPORT,
        "post",
        encryptedPayload
      );
      const decrypted = decryptAES(response);
      const parsedDecrypted = JSON.parse(decrypted);
      console.log(parsedDecrypted, "line 43");
      if (
        parsedDecrypted?.status === "SUCCESS" &&
        parsedDecrypted?.statusCode === "200"
      ) {
        setDpReportList(parsedDecrypted?.data);
      } else {
        showErrorMessage(parsedDecrypted?.message || "Not getting Data");
      }
    } catch (error) {
      console.log(error, "line error");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "SUBMITTED":
        return Colors.greenColor;
      case "PENDING_WITH_CHAK_INCHARGE":
        return Colors.orange;
      case "PENDING_WITH_BLOCK_INCHARGE":
        return Colors.blue;
      case "PENDING_WITH_MECHANICAL_INCHARGE":
        return Colors.purple;
      default:
        return Colors.gray;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // DD/MM/YYYY format
  };

  const handleCardPress = (item) => {
    setSelectedItem(item);
    setBottomSheetVisible(true);
  };

  const handleBottomSheetAction = (action) => {
    console.log(`${action} pressed for item:`, selectedItem);
    // Handle different actions here
    switch (action) {
      case "Details":
        navigation.navigate("DPRDetails", { data: selectedItem });
        break;
      case "Edit":
        navigation.navigate("DPREdit", { data: selectedItem });
        break;
      case "Submit":
        navigation.navigate("DPRSubmit", { data: selectedItem });
        break;
      case "Revision":
        navigation.navigate("DPRRevision", { data: selectedItem });
        break;
      default:
        break;
    }
    setBottomSheetVisible(false);
  };

  const AnimatedCard = ({ item, index }) => {
    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const slideAnim = React.useRef(new Animated.Value(20)).current;

    React.useEffect(() => {
      // Simple fade and slide up animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          delay: index * 100,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          delay: index * 100,
          useNativeDriver: true,
        }),
      ]).start();
    }, []);

    return (
      <TouchableOpacity onPress={() => handleCardPress(item)}>
        <Animated.View
          style={[
            styles.card,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header Row with Date and Status */}
          <View style={styles.cardHeader}>
            <Text style={styles.dateText}>{formatDate(item.reportDate)}</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(item.dprStatus) },
              ]}
            >
              <Text style={styles.statusText}>{item.dprStatus || "N/A"}</Text>
            </View>
          </View>

          {/* Main Content */}
          <View style={styles.cardContent}>
            {/* Square and Operation Row */}
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Square Name</Text>
                <Text style={styles.value}>{item.squareName || "N/A"}</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Operation</Text>
                <Text style={styles.value}>{item.operationName || "N/A"}</Text>
              </View>
            </View>

            {/* Financial Year and Crop Row */}
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Financial Year</Text>
                <Text style={styles.value}>{item.finYear || "N/A"}</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Crop</Text>
                <Text style={styles.value}>{item.crop || "N/A"}</Text>
              </View>
            </View>

            {/* Season and Class Row */}
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Season</Text>
                <Text style={styles.value}>{item.season || "N/A"}</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Class</Text>
                <Text style={styles.value}>{item.fromSeedClass || "N/A"}</Text>
              </View>
            </View>

            {/* Required Output and Equipment Row */}
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Required Output (ha)</Text>
                <Text style={styles.value}>
                  {item.requiredOutputArea || "N/A"}
                </Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Equipment</Text>
                <Text style={styles.value}>
                  {item.equipment ? "Yes" : "No"}
                </Text>
              </View>
            </View>

            {/* Equipment Details */}
            {/* {item.dprMechanicals && item.dprMechanicals.length > 0 && (
              <View style={styles.equipmentSection}>
                <Text style={styles.headerText}>Equipment Details</Text>
                {item.dprMechanicals.map((equipment, index) => (
                  <View key={index} style={styles.equipmentItem}>
                    <Text style={styles.equipmentText}>
                      {equipment.equipmentName || "N/A"} -{" "}
                      {equipment.cpNumber || "N/A"}
                    </Text>
                    <Text style={styles.equipmentStatus}>
                      Status: {equipment.dprMechStatus || "N/A"}
                    </Text>
                  </View>
                ))}
              </View>
            )} */}

            {/* Workflow History */}
            {/* {item.workflows && item.workflows.length > 0 && (
              <View style={styles.equipmentSection}>
                <Text style={styles.headerText}>Workflow History</Text>
                {item.workflows.map((workflow, index) => (
                  <View key={index} style={styles.equipmentItem}>
                    <Text style={styles.equipmentText}>
                      {workflow.toStatus} - {formatDate(workflow.updatedDate)}
                    </Text>
                    <Text style={styles.equipmentStatus}>
                      Remarks: {workflow.remarks || "No remarks"}
                    </Text>
                  </View>
                ))}
              </View>
            )} */}
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <WrapperContainer isLoading={loading}>
      <InnerHeader title={"DPR PROCESS"} />
      {/* Create Row */}
      <View style={styles.exportRow}>
        <Text style={styles.headerText}>DPR Report</Text>
        <TouchableOpacity style={styles.exportBtn}>
          <Text style={styles.exportBtnText}>Create New</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={dpReportList}
        renderItem={({ item, index }) => (
          <AnimatedCard item={item} index={index} />
        )}
        keyExtractor={(item) => item.id?.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No DPR reports found</Text>
          </View>
        }
      />
      <CustomBottomSheet
        visible={bottomSheetVisible}
        onRequestClose={() => setBottomSheetVisible(false)}
      >
        <View style={styles.bottomSheetContent}>
          <Text style={styles.headerText}>Select Action</Text>
          <CustomButton
            text={"View Details"}
            buttonStyle={[
              styles.bottomSheetButton,
              { backgroundColor: Colors.lightGray },
            ]}
            textStyle={styles.bottomSheetButtonText}
            handleAction={() => handleBottomSheetAction("Details")}
          />
          <CustomButton
            text={"Edit"}
            buttonStyle={[
              styles.bottomSheetButton,
              { backgroundColor: Colors.primary },
            ]}
            textStyle={styles.bottomSheetButtonText}
            handleAction={() => handleBottomSheetAction("Edit")}
          />
          <CustomButton
            text={"Revision"}
            buttonStyle={[
              styles.bottomSheetButton,
              { backgroundColor: Colors.gray },
            ]}
            textStyle={styles.bottomSheetButtonText}
            handleAction={() => handleBottomSheetAction("Revision")}
          />
          <CustomButton
            text={"Submit"}
            buttonStyle={styles.bottomSheetButton}
            textStyle={styles.bottomSheetButtonText}
            handleAction={() => handleBottomSheetAction("Submit")}
          />
        </View>
      </CustomBottomSheet>
    </WrapperContainer>
  );
};

export default DailyProgressReportList;

const styles = StyleSheet.create({
  exportRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: moderateScale(15),
    margin: moderateScaleVertical(10),
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
  exportBtn: {
    backgroundColor: Colors.greenColor,
    paddingHorizontal: moderateScale(15),
    padding: moderateScaleVertical(7),
    borderRadius: moderateScale(5),
  },
  exportBtnText: {
    color: Colors.white,
    fontFamily: FontFamily.PoppinsRegular,
    fontSize: textScale(14),
    textAlign: "center",
  },
  listContainer: {
    padding: moderateScale(15),
    paddingBottom: moderateScaleVertical(20),
  },
  card: {
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
    elevation: moderateScale(5),
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: moderateScaleVertical(12),
    borderBottomWidth: 1,
    borderBottomColor: Colors.textColor,
    paddingBottom: moderateScaleVertical(8),
  },
  dateText: {
    fontSize: textScale(14),
    fontFamily: FontFamily.PoppinsRegular,
    color: Colors.textColor,
  },
  statusBadge: {
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScaleVertical(4),
    borderRadius: moderateScale(12),
  },
  statusText: {
    fontSize: textScale(10),
    fontFamily: FontFamily.PoppinsRegular,
    color: Colors.white,
  },
  cardContent: {
    marginBottom: moderateScaleVertical(16),
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: moderateScaleVertical(12),
  },
  column: {
    flex: 1,
    marginRight: moderateScale(8),
  },
  label: {
    fontSize: textScale(12),
    fontFamily: FontFamily.PoppinsRegular,
    color: Colors.textColor,
    marginBottom: moderateScaleVertical(2),
    textTransform: "capitalize",
  },
  value: {
    fontSize: textScale(14),
    fontFamily: FontFamily.PoppinsMedium,
    color: Colors.black,
    textTransform: "capitalize",
  },
  equipmentSection: {
    marginVertical: moderateScaleVertical(8),
    gap: moderateScale(5),
  },
  equipmentItem: {
    backgroundColor: Colors.background,
    padding: moderateScale(10),
    borderRadius: moderateScale(5),
    marginBottom: moderateScaleVertical(5),
  },
  equipmentText: {
    fontSize: textScale(12),
    fontFamily: FontFamily.PoppinsMedium,
    color: Colors.textColor,
    textTransform: "capitalize",
  },
  equipmentStatus: {
    fontSize: textScale(12),
    fontFamily: FontFamily.PoppinsRegular,
    color: Colors.greenColor,
    textTransform: "capitalize",
    marginTop: moderateScaleVertical(4),
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: moderateScale(20),
  },
  emptyText: {
    fontSize: textScale(14),
    fontFamily: FontFamily.PoppinsMedium,
    color: Colors.textColor,
    letterSpacing: scale(0.2),
    textTransform: "capitalize",
  },
  bottomSheetContent: {
    gap: moderateScaleVertical(8),
  },
  bottomSheetButton: {
    backgroundColor: Colors.greenColor,
    padding: moderateScaleVertical(12),
    borderRadius: moderateScale(8),
    alignItems: "center",
  },
  bottomSheetButtonText: {
    color: Colors.white,
    fontSize: textScale(14),
    fontFamily: FontFamily.PoppinsMedium,
  },
});
