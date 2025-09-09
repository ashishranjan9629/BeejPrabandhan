import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import WrapperContainer from "../../../../utils/WrapperContainer";
import InnerHeader from "../../../../components/InnerHeader";
import {
  moderateScale,
  moderateScaleVertical,
  scale,
  textScale,
} from "../../../../utils/responsiveSize";
import Colors from "../../../../utils/Colors";
import FontFamily from "../../../../utils/FontFamily";
import { decryptAES, encryptWholeObject } from "../../../../utils/decryptData";
import { apiRequest } from "../../../../services/APIRequest";
import { API_ROUTES } from "../../../../services/APIRoutes";
import { showErrorMessage } from "../../../../utils/HelperFunction";
import CustomButton from "../../../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";

const FiledInspectionReportDetails = ({ route }) => {
  const { item } = route.params;
  console.log(item?.productionStatus, "line 30");
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [detailsData, setDetailsData] = useState();
  const [expandedId, setExpandedId] = useState("1");
  console.log(detailsData?.productionInspection?.[0], "line 31aaa");
  useEffect(() => {
    fethcProgramListDetails();
  }, []);

  const fethcProgramListDetails = async () => {
    console.log(item?.id, "line 40");
    const payloadData = {
      id: item?.id,
    };
    try {
      setLoading(true);
      const encryptedPayload = encryptWholeObject(payloadData);
      const response = await apiRequest(
        API_ROUTES.PROGRAMME_LIST_DETAILS,
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
        const inspectionLandIds = Array.isArray(
          parsedDecrypted?.data?.schedule?.landDetails
        )
          ? parsedDecrypted.data.schedule.landDetails.map((ld) => ld.landId)
          : [];

        try {
          const payloadData2 = {
            id: parsedDecrypted?.data?.growerId,
          };
          const encryptedPayload2 = encryptWholeObject(payloadData2);
          const growerResponse = await apiRequest(
            API_ROUTES.GROWER_DETAILS,
            "post",
            encryptedPayload2
          );
          const growerDecrypted = decryptAES(growerResponse);
          const growerParsedDecrypted = JSON.parse(growerDecrypted);

          if (
            growerParsedDecrypted &&
            growerParsedDecrypted?.status === "SUCCESS" &&
            growerParsedDecrypted?.statusCode === "200"
          ) {
            const cropFirId = parsedDecrypted?.data?.crop?.cropFirType?.id;
            const scheduleId = parsedDecrypted?.data?.schedule?.id;

            const inspectionPayloadData = { scheduleId };
            const encryptedInspectionPayloadData = encryptWholeObject(
              inspectionPayloadData
            );

            const inspectionResponseData = await apiRequest(
              (cropFirId === 1 && API_ROUTES.PRODUCTION_INSPECTION_A) ||
                (cropFirId === 2 && API_ROUTES.PRODUCTION_INSPECTION_B) ||
                (cropFirId === 3 && API_ROUTES.PRODUCTION_INSPECTION_C),
              "post",
              encryptedInspectionPayloadData
            );
            const inspectionDecrypted = decryptAES(inspectionResponseData);
            const inspectionParsedDecrypted = JSON.parse(inspectionDecrypted);

            if (
              inspectionParsedDecrypted &&
              inspectionParsedDecrypted?.status === "SUCCESS" &&
              inspectionParsedDecrypted?.statusCode === "200"
            ) {
              let growerData =
                growerParsedDecrypted?.data &&
                Array.isArray(growerParsedDecrypted.data)
                  ? growerParsedDecrypted.data[0]
                  : growerParsedDecrypted.data;

              if (
                growerData &&
                Array.isArray(growerData.landDetails) &&
                inspectionLandIds.length > 0
              ) {
                growerData = {
                  ...growerData,
                  landDetails: growerData.landDetails.filter((ld) =>
                    inspectionLandIds.includes(ld.id)
                  ),
                };
              }

              setDetailsData({
                inspection: parsedDecrypted?.data,
                grower: growerData,
                productionInspection: inspectionParsedDecrypted?.data, // <-- added here
              });
            } else {
              showErrorMessage("Error in getting Inspection Data");
            }
          } else {
            showErrorMessage("Error in Getting Grower Data");
          }
        } catch (error) {
          console.log(error, "Error in Getting Grower Data");
          setDetailsData({
            inspection: parsedDecrypted?.data,
            grower: null,
            productionInspection: null,
          });
        }
      } else {
        showErrorMessage("Error");
      }
    } catch (error) {
      console.log(error, "line 133");
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    Alert.alert("Render MEthod");
    return (
      <View>
        <Text>Ashish Ranjan</Text>
      </View>
    );
  };

  const Details = ({ label, value }) => {
    return (
      <View style={styles.detailsHolderView}>
        <Text style={styles.labelText}>{label}</Text>
        <Text style={styles.valueText}>{value}</Text>
      </View>
    );
  };

  return (
    <WrapperContainer isLoading={loading}>
      <InnerHeader title={"Program Inspection"} />

      {Array.isArray(detailsData) ? (
        <FlatList
          data={detailsData}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{
            padding: moderateScale(14),
            paddingBottom: moderateScaleVertical(20),
          }}
          renderItem={renderItem}
        />
      ) : (
        <ScrollView style={styles.main} showsVerticalScrollIndicator={false}>
          {/* Grower Programm Details */}
          <View style={styles.containerStyle}>
            <Text style={styles.headerText}>Program Details</Text>
            <Details
              label={"Programme Id"}
              value={detailsData?.inspection?.productionPlan?.planId || "N/A"}
            />
            <Details
              label={"Grower Name"}
              value={detailsData?.inspection?.schedule?.growerName || "N/A"}
            />
            <Details
              label={"Area to be planted (ha)"}
              value={
                detailsData?.inspection?.schedule?.areaToBePlanted || "N/A"
              }
            />
            <Details
              label={"GOT Required"}
              value={detailsData?.inspection?.schedule?.gotRequired || "N/A"}
            />
            <Details
              label={"Qty Raw Seed (Kg)"}
              value={
                detailsData?.inspection?.schedule?.estimatedRawSeed || "N/A"
              }
            />
            <Details
              label={"Qty Good Seed (Kg)"}
              value={
                detailsData?.inspection?.schedule?.estimatedGoodSeed || "N/A"
              }
            />
          </View>
          {/* Grower Loaction Details */}
          <View style={styles.containerStyle}>
            <Text style={styles.headerText}>Grower Location Details</Text>
            <ScrollView
              horizontal
              style={{ flex: 1, borderWidth: 1, borderColor: Colors.white }}
            >
              <View>
                {/* Table Headers */}
                <View style={styles.tableRowHeader}>
                  <Text style={[styles.tableCell, styles.cellSerial]}>
                    Sl. No.
                  </Text>
                  <Text style={[styles.tableCell, styles.cellAddress]}>
                    Address
                  </Text>
                  <Text style={[styles.tableCell, styles.cellType]}>Type</Text>
                  <Text style={[styles.tableCell, styles.cellArea]}>
                    Area (Ha)
                  </Text>
                </View>

                {/* Table Rows */}
                {detailsData?.grower?.landDetails?.map((item, index) => (
                  <View style={styles.tableRow} key={item.id || index}>
                    <Text style={[styles.tableCell, styles.cellSerial]}>
                      {index + 1}
                    </Text>
                    <Text style={[styles.tableCell, styles.cellAddress]}>
                      {item.landAddress}
                    </Text>
                    <Text style={[styles.tableCell, styles.cellType]}>
                      {item.typeOfLand}
                    </Text>
                    <Text style={[styles.tableCell, styles.cellArea]}>
                      {item.landArea}
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
          {/* Inspection Details */}
          {detailsData?.productionInspection?.map((item, index) => (
            <View style={styles.containerStyle} key={index}>
              <Text style={styles.headerText}>
                Inspection Details {index + 1}
              </Text>
              <Details
                label={"Name of the Producer/Grower"}
                value={item.growerName || "N/A"}
              />
              <Details
                label={"Village"}
                value={
                  detailsData?.grower?.entityRegNo?.villageId?.villageName ||
                  "NA"
                }
              />
              <Details
                label={"Taluqs"}
                value={
                  detailsData?.grower?.entityRegNo?.block?.taluqs?.talukaName ||
                  "NA"
                }
              />
              <Details
                label={"District"}
                value={
                  detailsData?.grower?.entityRegNo?.districtId?.districtName ||
                  "NA"
                }
              />
              <Details
                label={"State"}
                value={
                  detailsData?.grower?.entityRegNo?.stateId?.stateName || "NA"
                }
              />
              <Details
                label={"Inspection Status"}
                value={item?.inspectionStatus || "N/A"}
              />
              <Details label={"Season"} value={item?.season || "N/A"} />
              <Details label={"Seed Class"} value={item?.seedClass || "N/A"} />
              <Details
                label={"Inspected Area"}
                value={item?.areaOfInspectionField || "N/A"}
              />
              <Details
                label={
                  "Total acres under seed production of this hybrid/variety"
                }
                value={item?.totalAcreUnderSeedProd || "N/A"}
              />
              <Details
                label={"Seed Source"}
                value={item?.seedSource || "N/A"}
              />
              <Details
                label={"Female Parent"}
                value={item?.femaleParent || "N/A"}
              />
              <Details
                label={"Male Parent"}
                value={item?.maleParent || "N/A"}
              />
              <Details
                label={"Code / Hybrid Designation"}
                value={item?.hybridCodeDesignation || "N/A"}
              />
              <Details
                label={"Date of Showing"}
                value={item?.dateOfSowing || "N/A"}
              />
              <Details
                label={"Expected Date of Harvest"}
                value={item?.expectedDateOfHarvest || "N/A"}
              />
              <Details
                label={"Report Number"}
                value={item?.reportNo || "N/A"}
              />
              <Details label={"Time From"} value={item?.timeFrom || "N/A"} />
              <Details label={"Time To"} value={item?.timeTo || "N/A"} />
              <Details
                label={"Date of Inspection"}
                value={item?.dateOfInspection || "N/A"}
              />
              <Details
                label={"Planting Ratio"}
                value={item?.plantingRatio || "N/A"}
              />
              <Details
                label={"Prevoius Crop"}
                value={item?.previousCrop || "N/A"}
              />
              <Details
                label={"Are Both End Marked"}
                value={item?.areBothEndMarked || "N/A"}
              />
              <Details
                label={"Method of marking mole rows"}
                value={item?.methodOfMarkingMaleRows || "N/A"}
              />
              <Details
                label={"Stage of crop growth at this inspection"}
                value={item?.stageOfGrowthOfAtTheInspection || "N/A"}
              />
              <Details
                label={"Stage Of Growth Of Contaminant"}
                value={item?.stageOfGrowthOfContaminant || "N/A"}
              />
              <Details
                label={"North"}
                value={item?.isolationDistanceNorth || "N/A"}
              />
              <Details
                label={"South"}
                value={item?.isolationDistanceSouth || "N/A"}
              />
              <Details
                label={"East"}
                value={item?.isolationDistanceEast || "N/A"}
              />
              <Details
                label={"West"}
                value={item?.isolationDistanceWest || "N/A"}
              />
              <Details
                label={"No of Border Row"}
                value={item?.noOfBorderRows || "N/A"}
              />
              <Details
                label={"Crop Condition"}
                value={item?.cropCondition || "N/A"}
              />

              <Details
                label={"No of times Pollen Shedders"}
                value={item?.noOfTimesPollenShedders || "N/A"}
              />
              <Details
                label={"Frequency of Pollen Shedders"}
                value={item?.frequencyOfPollenShedders || "N/A"}
              />
              <Details
                label={"Was it done at inspection time?"}
                value={item?.wasItDoneAtInspectionTime || "N/A"}
              />
              <Details
                label={
                  "Does this crop conform to the standards for certification"
                }
                value={item?.doesThisCropConfirmToStandard || "N/A"}
              />

              <Details
                label={"Estimated seed yield (Kgs/ Hect.)"}
                value={item?.estimatedSeedYield || "N/A"}
              />
              <Details
                label={
                  "Was the Grower or his representatives present at inspection time?"
                }
                value={item?.wasTheGrowerPresent || "N/A"}
              />
              <Details
                label={"Is this the final report?"}
                value={item?.isFinal || "N/A"}
              />
              <Details
                label={"Area rejected (in Ha)"}
                value={item?.areaRejected || "N/A"}
              />
              <Details
                label={"Area certified (in Ha)"}
                value={item?.areaCertified || "N/A"}
              />
              <Details label={"Name"} value={item?.name || "N/A"} />
              <Details
                label={"Designation"}
                value={item?.designation || "N/A"}
              />
              <Details label={"Address"} value={item?.address || "N/A"} />
              <Details label={"Remarks"} value={item?.remarks || "N/A"} />
            </View>
          ))}
        </ScrollView>
      )}
      {item?.productionStatus === "ISSUED" ||
        (item?.productionStatus === "INSPECTED" && (
          <CustomButton
            text={"Start Inspection"}
            buttonStyle={styles.buttonStyle}
            textStyle={styles.buttonText}
            disabled={loading}
            handleAction={() =>
              navigation.navigate("StartInspection", { data: detailsData })
            }
          />
        ))}
    </WrapperContainer>
  );
};

export default FiledInspectionReportDetails;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  containerStyle: {
    borderWidth: 2,
    backgroundColor: Colors.white,
    width: "95%",
    alignSelf: "center",
    marginVertical: moderateScaleVertical(10),
    borderRadius: moderateScale(5),
    borderColor: Colors.white,
    padding: moderateScale(10),
    elevation: moderateScale(5),
    shadowColor: Colors.greenColor,
    shadowOpacity: scale(0.09),
    shadowRadius: moderateScale(5),
    shadowOffset: { width: 0, height: 3 },
  },
  labelText: {
    fontFamily: FontFamily.PoppinsMedium,
    color: Colors.gray,
    fontSize: textScale(13),
    letterSpacing: scale(0.2),
    textTransform: "capitalize",
    flex: 1,
    textAlign: "left",
  },
  valueText: {
    fontFamily: FontFamily.PoppinsRegular,
    color: Colors.textColor,
    fontSize: textScale(14),
    letterSpacing: scale(0.2),
    flex: 1,
    textAlign: "right",
  },
  detailsHolderView: {
    // borderBottomWidth: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: moderateScale(5),
    borderBottomColor: Colors.diabledColor,
    flex: 1,
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
  tableRowHeader: {
    flexDirection: "row",
    backgroundColor: Colors.lightBackground,
    paddingVertical: moderateScaleVertical(8),
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: moderateScale(1),
    borderColor: Colors.white,
    paddingVertical: moderateScaleVertical(8),
  },
  tableCell: {
    paddingHorizontal: moderateScale(12),
    fontSize: textScale(12),
    color: Colors.textColor,
    textAlign: "centers",
    textTransform: "capitalize",
    fontFamily: FontFamily.PoppinsMedium,
  },
  cellSerial: {
    minWidth: moderateScale(75),
    textAlign: "centers",
    fontFamily: FontFamily.PoppinsMedium,
  },
  cellAddress: {
    minWidth: moderateScale(150),
  },
  cellType: {
    minWidth: moderateScale(100),
    textAlign: "center",
  },
  cellArea: {
    minWidth: moderateScale(90),
    textAlign: "right",
  },
  buttonStyle: {
    backgroundColor: Colors.greenColor,
    width: "95%",
    alignSelf: "center",
    marginVertical: moderateScaleVertical(10),
    height: moderateScale(50),
  },
  buttonText: {
    fontFamily: FontFamily.PoppinsMedium,
    color: Colors.white,
    fontSize: textScale(14),
    letterSpacing: scale(0.2),
    textTransform: "capitalize",
  },
});
