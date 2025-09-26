import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from "react-native";
import WrapperContainer from "../../../../utils/WrapperContainer";
import InnerHeader from "../../../../components/InnerHeader";
import { decryptAES, encryptWholeObject } from "../../../../utils/decryptData";
import { apiRequest } from "../../../../services/APIRequest";
import { API_ROUTES } from "../../../../services/APIRoutes";
import { getUserData } from "../../../../utils/Storage";
import { showErrorMessage } from "../../../../utils/HelperFunction";
import Colors from "../../../../utils/Colors";
import {
  moderateScale,
  moderateScaleVertical,
  scale,
  textScale,
} from "../../../../utils/responsiveSize";
import FontFamily from "../../../../utils/FontFamily";
import Octicons from "react-native-vector-icons/Octicons";

const SeedsIntakeHistory = ({ route }) => {
  const { item } = route.params;
  const [loading, setLoading] = useState(false);
  const [seedsData, setSeedsData] = useState();
  // console.log(seedsData, "line 30");
  useEffect(() => {
    fetchSeedsIntakeHistory();
  }, []);

  const fetchSeedsIntakeHistory = async () => {
    try {
      setLoading(true);
      const userData = await getUserData();
      const payloadDataForProgramListDetails = { id: item?.id };
      const encryptedPayloadForProgramListDetails = encryptWholeObject(
        payloadDataForProgramListDetails
      );
      const responseForProgramListDetails = await apiRequest(
        API_ROUTES.PROGRAMME_LIST_DETAILS,
        "post",
        encryptedPayloadForProgramListDetails
      );
      const decryptedForProgramListDetails = decryptAES(
        responseForProgramListDetails
      );
      const parsedDecryptedForProgramListDetails = JSON.parse(
        decryptedForProgramListDetails
      );

      if (
        parsedDecryptedForProgramListDetails &&
        parsedDecryptedForProgramListDetails?.status === "SUCCESS" &&
        parsedDecryptedForProgramListDetails?.statusCode === "200"
      ) {
        const payloadData = {
          pcId: userData?.pcId,
          scheduleId: parsedDecryptedForProgramListDetails?.data?.schedule?.id,
        };
        const encryptedPayload = encryptWholeObject(payloadData);
        const response = await apiRequest(
          API_ROUTES.SEEDS_INTAKE_HISTORY,
          "post",
          encryptedPayload
        );
        const decrypted = decryptAES(response);
        const parsedDecrypted = JSON.parse(decrypted);
        if (
          parsedDecrypted &&
          parsedDecrypted?.status === "SUCCESS" &&
          parsedDecrypted?.statusCode === "200"
        ) {
          setSeedsData(parsedDecrypted?.data);
        } else {
          showErrorMessage("Error in fetching Seeds Intake History");
        }
      } else {
        showErrorMessage("Error in fetching Schedule Id");
      }
    } catch (error) {
      showErrorMessage("Unexpected Error");
    } finally {
      setLoading(false);
    }
  };

  // Format Date
  const formatMobileDate = (dt) => {
    if (!dt) return "-";
    const d = new Date(dt);
    return (
      d.toLocaleDateString() +
      " " +
      d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.circle}>
          <Octicons
            name="history"
            color={Colors.white}
            size={moderateScale(25)}
          />
        </View>
        <View style={{ flex: 1, marginLeft: 16 }}>
          <Text style={styles.seedTitle}>
            Raw Seeds:{" "}
            <Text style={styles.seedValue}>{item.rawSeed ?? "-"}</Text>
          </Text>
          <Text style={styles.seedTitle}>
            Bags:{" "}
            <Text style={styles.seedValue}>
              {item.noOfBags ?? item.bagSize ?? "-"}
            </Text>
          </Text>
        </View>
        <View
          style={[
            styles.badge,
            {
              backgroundColor:
                item.status === "ACTIVE" ? Colors.lightGreen : Colors.red,
            },
          ]}
        >
          <Text style={styles.badgeText}>
            {(item.status ?? "-").toUpperCase()}
          </Text>
        </View>
      </View>
      <Text style={styles.dateRow}>
        Last update: {formatMobileDate(item.updatedOn)}
      </Text>
      <View style={styles.sectionDivider} />

      {/* Spacious Info Section */}
      <View style={styles.infoRow}>
        <InfoBox label="Moisture (%)" value={item.moisture ?? "-"} />
        <InfoBox label="Unproc. Qty" value={item.unprocessedSeedQty ?? "-"} />
      </View>
      <View style={styles.infoRow}>
        <InfoBox
          label="Exp Proc. Dt"
          value={item.expectedProceedingDate?.split("T")[0] ?? "-"}
        />
        <InfoBox label="Lustre" value={item.lusture ?? "-"} />
      </View>
      <View style={styles.sectionDivider} />
      <View style={styles.infoRow}>
        <InfoBox
          label="Physical Appr."
          value={item.physicalAppearance ?? "-"}
        />
      </View>
      <View style={styles.infoRow}>
        <InfoBox label="Rain Damage" value={item.rainDamage ?? "-"} />
        <InfoBox label="Insect Damage" value={item.insectDamage ?? "-"} />
      </View>
      <View style={styles.infoRow}>
        <InfoBox label="Remarks" value={item.remarks ?? "-"} />
      </View>
    </View>
  );

  const InfoBox = ({ label, value }) => (
    <View style={styles.infoBox}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  const SummaryCard = ({ totalRawSeed, totalBagSize }) => (
    <View
      style={[
        styles.card,
        { flexDirection: "row", gap: moderateScale(12), alignItems: "center" },
      ]}
    >
      <View style={styles.circle}>
        <Octicons
          name="history"
          color={Colors.white}
          size={moderateScale(25)}
        />
      </View>
      <View style={{ gap: moderateScaleVertical(10) }}>
        <Text style={styles.infoLabel}>Total Raw Seed (KG)</Text>
        <Text style={styles.infoValue}>{totalRawSeed}</Text>
      </View>
      <View style={{ gap: moderateScaleVertical(10) }}>
        <Text style={styles.infoLabel}>Total No of bags</Text>
        <Text style={styles.infoValue}>{totalBagSize}</Text>
      </View>
    </View>
  );

  const totalRawSeed =
    seedsData?.reduce((acc, curr) => acc + (Number(curr.rawSeed) || 0), 0) || 0;
  const totalBagSize =
    seedsData?.reduce(
      (acc, curr) => acc + (Number(curr.noOfBags ?? curr.bagSize) || 0),
      0
    ) || 0;

  return (
    <WrapperContainer isLoading={loading}>
      <InnerHeader title="Seeds Intake History" />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={seedsData}
        renderItem={renderItem}
        keyExtractor={(_, idx) => idx.toString()}
        contentContainerStyle={{ padding: 14 }}
        ListEmptyComponent={
          <Text
            style={{
              textAlign: "center",
              margin: moderateScale(64),
              fontSize: textScale(16),
              color: Colors.textColor,
            }}
          >
            No history found.
          </Text>
        }
        ListFooterComponent={
          <SummaryCard
            totalRawSeed={totalRawSeed}
            totalBagSize={totalBagSize}
          />
        }
      />
    </WrapperContainer>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: moderateScale(10),
    shadowColor: Colors.black,
    shadowOpacity: scale(0.06),
    shadowRadius: moderateScale(12),
    elevation: moderateScale(5),
    marginBottom: moderateScaleVertical(20),
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScaleVertical(20),
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: moderateScaleVertical(10),
  },
  circle: {
    backgroundColor: Colors.greenColor,
    borderRadius: moderateScale(25),
    height: moderateScale(50),
    width: moderateScale(50),
    justifyContent: "center",
    alignItems: "center",
    elevation: moderateScale(2),
    shadowColor: Colors.black,
    shadowOpacity: scale(0.06),
    shadowRadius: moderateScale(12),
  },
  circleText: {
    color: Colors.white,
    fontFamily: FontFamily.ManropeMedium,
    fontSize: textScale(20),
  },
  seedTitle: {
    fontSize: textScale(13),
    color: Colors.textColor,
    marginBottom: moderateScaleVertical(3),
    fontFamily: FontFamily.PoppinsRegular,
  },
  seedValue: {
    color: Colors.black,
    fontSize: textScale(16),
    fontFamily: FontFamily.PoppinsMedium,
  },
  badge: {
    borderRadius: moderateScale(30),
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScaleVertical(6),
    alignItems: "center",
    minWidth: moderateScale(90),
    justifyContent: "center",
    marginLeft: moderateScale(10),
  },
  badgeText: {
    color: Colors.white,
    fontWeight: "500",
    fontSize: textScale(14),
  },
  dateRow: {
    color: Colors.gray,
    fontSize: textScale(11),
    marginBottom: moderateScaleVertical(10),
    textAlign: "right",
    fontStyle: "italic",
  },
  sectionDivider: {
    marginVertical: moderateScaleVertical(12),
    borderBottomColor: Colors.diabledColor,
    borderBottomWidth: 1,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  infoBox: {
    backgroundColor: Colors.background,
    borderRadius: moderateScale(5),
    flex: 1,
    margin: moderateScale(7),
    padding: moderateScale(12),
    alignItems: "flex-start",
    elevation: 1,
    gap: moderateScaleVertical(5),
  },
  infoLabel: {
    color: Colors.textColor,
    fontSize: textScale(12),
    marginBottom: moderateScaleVertical(3),
    fontFamily: FontFamily.RubikRegular,
  },
  infoValue: {
    color: Colors.greenColor,
    fontSize: textScale(14),
    fontFamily: FontFamily.PoppinsRegular,
  },
  summaryCard: {
    backgroundColor: Colors.background,
    borderRadius: moderateScale(8),
    padding: moderateScale(16),
    marginHorizontal: moderateScale(8),
    marginTop: moderateScaleVertical(8),
    marginBottom: moderateScaleVertical(20),
    elevation: 2,
    shadowColor: Colors.black,
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(12),
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: moderateScaleVertical(4),
  },
  summaryLabel: {
    color: Colors.textColor,
    fontSize: textScale(15),
    fontFamily: FontFamily.PoppinsMedium,
  },
  summaryValue: {
    color: Colors.greenColor,
    fontSize: textScale(17),
    fontFamily: FontFamily.PoppinsSemiBold,
  },
});

export default SeedsIntakeHistory;
