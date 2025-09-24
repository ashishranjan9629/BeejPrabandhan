import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import WrapperContainer from "../../../../utils/WrapperContainer";
import InnerHeader from "../../../../components/InnerHeader";
import Colors from "../../../../utils/Colors";
import {
  moderateScale,
  textScale,
  moderateScaleVertical,
} from "../../../../utils/responsiveSize";
import FontFamily from "../../../../utils/FontFamily";
import CustomButton from "../../../../components/CustomButton";
import { apiRequest } from "../../../../services/APIRequest";
import { API_ROUTES } from "../../../../services/APIRoutes";
import { getUserData } from "../../../../utils/Storage";
import { decryptAES, encryptWholeObject } from "../../../../utils/decryptData";
import { showErrorMessage } from "../../../../utils/HelperFunction";
import Icon from "react-native-vector-icons/MaterialIcons";

const DPREdit = ({ route, navigation }) => {
  const { data } = route.params;
  console.log(data, "line 35");
  const [loading, setLoading] = useState(false);
  const [squareList, setSquareList] = useState([]);
  const [operationList, setOperationList] = useState([]);
  const [financialYearList, setFinancialYearList] = useState([]);
  const [seasonList, setSeasonList] = useState([]);
  const [cropList, setCropList] = useState([]);
  const [varietyList, setVarietyList] = useState([]);
  const [userData, setUserData] = useState([]);
  const [equipmentListData, setEquipmentListData] = useState([]);

  // Dropdown states
  const [showSquareDropdown, setShowSquareDropdown] = useState(false);
  const [showOperationDropdown, setShowOperationDropdown] = useState(false);
  const [showFinancialYearDropdown, setShowFinancialYearDropdown] =
    useState(false);
  const [showSeasonDropdown, setShowSeasonDropdown] = useState(false);
  const [showCropDropdown, setShowCropDropdown] = useState(false);
  const [showVarietyDropdown, setShowVarietyDropdown] = useState(false);
  const [showWorkTypeDropdown, setShowWorkTypeDropdown] = useState(false);
  const [showSeedClassDropdown, setShowSeedClassDropdown] = useState(false);
  const [showEquipmentDropdown, setShowEquipmentDropdown] = useState(false); 

  const SEED_CLASSES = ["NS", "BS", "FS", "CS", "TL"];
  const WorkType = ["Contract", "Self"];

  console.log(data, "line 8");

  useEffect(() => {
    fetchDropDownData();
  }, []);

  const fetchDropDownData = async () => {
    setLoading(true);
    try {
      const userData = await getUserData();
      setUserData(userData);
      const payload = {
        chakId: userData?.chakId,
      };
      const encryptedPayload = encryptWholeObject(payload);
      const squareListResp = await apiRequest(
        API_ROUTES.SQUARE_MASTER_DD,
        "POST",
        encryptedPayload
      );
      const decryptedSquareListData = decryptAES(squareListResp);
      const parsedDecryptedSquareListData = JSON.parse(decryptedSquareListData);
      if (
        parsedDecryptedSquareListData?.status === "SUCCESS" &&
        parsedDecryptedSquareListData?.statusCode === "200"
      ) {
        setSquareList(parsedDecryptedSquareListData?.data || []);

        const operationPayloadData = {};
        const encryptedOperationPayload =
          encryptWholeObject(operationPayloadData);
        const operationListResponse = await apiRequest(
          API_ROUTES.OPERATION_MASTER_DD,
          "POST",
          encryptedOperationPayload
        );
        const decryptedOperationListData = decryptAES(operationListResponse);
        const parsedDecryptedOperationListData = JSON.parse(
          decryptedOperationListData
        );
        if (
          parsedDecryptedOperationListData?.status === "SUCCESS" &&
          parsedDecryptedOperationListData?.statusCode === "200"
        ) {
          setOperationList(parsedDecryptedOperationListData?.data || []);

          const fetchFinancialListData = await apiRequest(
            API_ROUTES.FINANCIAL_MASTER_DD,
            "POST"
          );
          const decrypted = decryptAES(fetchFinancialListData);
          const parsedDecrypted = JSON.parse(decrypted);
          if (
            parsedDecrypted?.status === "SUCCESS" &&
            parsedDecrypted?.statusCode === "200"
          ) {
            setFinancialYearList(parsedDecrypted?.data || []);

            const seasonListData = await apiRequest(
              API_ROUTES.SEASON_MASTER_DD,
              "POST"
            );
            const decryptedSeasonListData = decryptAES(seasonListData);
            const parsedDecryptedSeasonList = JSON.parse(
              decryptedSeasonListData
            );
            if (
              parsedDecryptedSeasonList?.status === "SUCCESS" &&
              parsedDecryptedSeasonList?.statusCode === "200"
            ) {
              setSeasonList(parsedDecryptedSeasonList?.data || []);
              if (data.seasonId) {
                await fetchCropsBySeason(data.seasonId);
              }
              if (data.cropId) {
                await fetchSeedVarietiesByCrop(data.cropId);
              }
              const payloadForMachineList = {};
              const encryptedPayloadForEquipmentList = encryptWholeObject(
                payloadForMachineList
              );
              const equipmentListData = await apiRequest(
                API_ROUTES.MACHINE_MASTER_DD,
                "POST",
                encryptedPayloadForEquipmentList
              );
              const decryptedEquipmentListData = decryptAES(equipmentListData);
              const parsedDecryptedEquipmentListData = JSON.parse(
                decryptedEquipmentListData
              );
              if (
                parsedDecryptedEquipmentListData?.status === "SUCCESS" &&
                parsedDecryptedEquipmentListData?.statusCode === "200"
              ) {
                setEquipmentListData(parsedDecryptedEquipmentListData?.data);
              } else {
                showErrorMessage("Unable to get the Equipment Data List");
                setEquipmentListData([]);
              }
            } else {
              showErrorMessage("Unable to fetch the Season List Data");
            }
          } else {
            showErrorMessage("Unable to find the Financial Year List Data");
          }
        } else {
          showErrorMessage("Unable to get the Operation List Data");
        }
      } else {
        showErrorMessage("Unable to get the Square List Data");
      }
    } catch (error) {
      console.log(error, "line error");
      showErrorMessage("Error fetching dropdown data");
    } finally {
      setLoading(false);
    }
  };

  const fetchCropsBySeason = async (selectedSeasonId) => {
    try {
      setLoading(true);
      const payloadDataForCropListMaster = {
        seasons: [selectedSeasonId],
      };
      const encryptedPayload = encryptWholeObject(payloadDataForCropListMaster);
      const cropListResp = await apiRequest(
        API_ROUTES.CROP_MASTER_DD,
        "POST",
        encryptedPayload
      );
      const decryptedCropListData = decryptAES(cropListResp);
      const parsedDecryptedCropListData = JSON.parse(decryptedCropListData);
      if (
        parsedDecryptedCropListData?.status === "SUCCESS" &&
        parsedDecryptedCropListData?.statusCode === "200"
      ) {
        setCropList(parsedDecryptedCropListData?.data || []);
      } else {
        showErrorMessage("Unable to get the crop List Data");
      }
    } catch (e) {
      showErrorMessage("Error fetching crops");
      setCropList([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSeedVarietiesByCrop = async (selectedCropId) => {
    try {
      setLoading(true);
      const payload = { cropId: selectedCropId };
      const encrypted = encryptWholeObject(payload);
      const resp = await apiRequest(
        API_ROUTES.SEED_VARIETY_MASTER,
        "POST",
        encrypted
      );
      const decrypted = decryptAES(resp);
      const parsed = JSON.parse(decrypted);
      if (parsed?.status === "SUCCESS" && parsed?.statusCode === "200") {
        setVarietyList(parsed?.data || []);
      } else {
        showErrorMessage("Unable to get the Seed Variety list");
        setVarietyList([]);
      }
    } catch (e) {
      showErrorMessage("Error fetching Seed Variety");
      setVarietyList([]);
    } finally {
      setLoading(false);
    }
  };

  const [formData, setFormData] = useState({
    workType: data.workType || "",
    seedClass: data.fromSeedClass || "",
    square: data.squareName || "",
    squareId: data.squareId || "",
    operation: data.operationName || "",
    operationId: data.operationId || "",
    financialYear: data.finYear || "",
    financialYearId: data.finYearId || "",
    season: data.season || "",
    seasonId: data.seasonId || "",
    crop: data.crop || "",
    cropId: data.cropId || "",
    variety: data.seedVariety || "",
    varietyId: data.seedVarietyId || "",
    requiredOutput: data.requiredOutputArea?.toString() || "",
    requiredDate: data.reportDate || "",
    equipment: data.equipment || false,
    equipmentList: data.dprMechanicals || [],
  });

  const [newEquipment, setNewEquipment] = useState({
    equipment: "",
    equipmentId: "",
    estimatedHours: "",
    operatorRequired: false,
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEquipmentChange = (field, value) => {
    setNewEquipment((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDropdownSelect = (type, item) => {
    switch (type) {
      case "workType":
        handleInputChange("workType", item);
        setShowWorkTypeDropdown(false);
        break;
      case "seedClass":
        handleInputChange("seedClass", item);
        setShowSeedClassDropdown(false);
        break;
      case "square":
        handleInputChange("square", item.squareName);
        handleInputChange("squareId", item.id);
        setShowSquareDropdown(false);
        break;
      case "operation":
        handleInputChange("operation", item.operationName);
        handleInputChange("operationId", item.id);
        setShowOperationDropdown(false);
        break;
      case "financialYear":
        handleInputChange("financialYear", item.finYearShortName);
        handleInputChange("financialYearId", item.id);
        setShowFinancialYearDropdown(false);
        break;
      case "season":
        handleInputChange("season", item.seasonType);
        handleInputChange("seasonId", item.id);
        setShowSeasonDropdown(false);
        fetchCropsBySeason(item.id);
        break;
      case "crop":
        handleInputChange("crop", item.seedCropName);
        handleInputChange("cropId", item.id);
        setShowCropDropdown(false);
        fetchSeedVarietiesByCrop(item.id);
        break;
      case "variety":
        handleInputChange("variety", item.seedVarietyName);
        handleInputChange("varietyId", item.id);
        setShowVarietyDropdown(false);
        break;
      case "equipment":
        handleEquipmentChange("equipment", item.macName);
        handleEquipmentChange("equipmentId", item.id);
        setShowEquipmentDropdown(false);
        break;
    }
  };

  const addEquipment = () => {
    if (newEquipment.equipment && newEquipment.estimatedHours) {
      setFormData((prev) => ({
        ...prev,
        equipmentList: [
          ...prev.equipmentList,
          {
            id: Date.now(),
            equipmentName: newEquipment.equipment,
            equipmentId: newEquipment.equipmentId,
            estimatedHours: parseInt(newEquipment.estimatedHours),
            operator: newEquipment.operatorRequired,
            operatorName: "",
          },
        ],
      }));
      setNewEquipment({
        equipment: "",
        equipmentId: "",
        estimatedHours: "",
        operatorRequired: false,
      });
    } else {
      Alert.alert("Error", "Please fill all equipment fields");
    }
  };

  const removeEquipment = (id) => {
    setFormData((prev) => ({
      ...prev,
      equipmentList: prev.equipmentList.filter((item) => item.id !== id),
    }));
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert("Success", "DPR details updated successfully");
      navigation.goBack();
    }, 1500);
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const renderDropdownItem = ({ item, type }) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => handleDropdownSelect(type, item)}
    >
      <Text style={styles.dropdownItemText}>
        {type === "square"
          ? item.squareName
          : type === "operation"
          ? item.operationName
          : type === "financialYear"
          ? item.finYearShortName
          : type === "season"
          ? item.seasonType
          : type === "crop"
          ? item.seedCropName
          : type === "variety"
          ? item.seedVarietyName
          : type === "equipment"
          ? item.macName
          : item}
      </Text>
    </TouchableOpacity>
  );

  const renderDropdown = (
    type,
    data,
    isVisible,
    setVisible,
    placeholder,
    value
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{placeholder}</Text>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setVisible(!isVisible)}
      >
        <Text
          style={
            value ? styles.dropdownButtonText : styles.dropdownButtonPlaceholder
          }
        >
          {value || `Select ${placeholder}`}
        </Text>
        <Icon name="arrow-drop-down" size={24} color={Colors.grey} />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={styles.dropdownModal}>
            <FlatList
              data={data}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => renderDropdownItem({ item, type })}
              style={styles.dropdownList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );

  return (
    <WrapperContainer isLoading={loading}>
      <InnerHeader title={"Edit DPR Details"} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={moderateScaleVertical(
          Platform.OS === "ios" ? 90 : 10
        )}
      >
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Basic Information Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>

            <View style={styles.row}>
              {renderDropdown(
                "workType",
                WorkType,
                showWorkTypeDropdown,
                setShowWorkTypeDropdown,
                "Work Type",
                formData.workType
              )}

              {renderDropdown(
                "seedClass",
                SEED_CLASSES,
                showSeedClassDropdown,
                setShowSeedClassDropdown,
                "Seed Class",
                formData.seedClass
              )}
            </View>

            <View style={styles.row}>
              {renderDropdown(
                "square",
                squareList,
                showSquareDropdown,
                setShowSquareDropdown,
                "Square",
                formData.square
              )}

              {renderDropdown(
                "operation",
                operationList,
                showOperationDropdown,
                setShowOperationDropdown,
                "Operation",
                formData.operation
              )}
            </View>

            <View style={styles.row}>
              {renderDropdown(
                "financialYear",
                financialYearList,
                showFinancialYearDropdown,
                setShowFinancialYearDropdown,
                "Financial Year",
                formData.financialYear
              )}

              {renderDropdown(
                "season",
                seasonList,
                showSeasonDropdown,
                setShowSeasonDropdown,
                "Season",
                formData.season
              )}
            </View>

            <View style={styles.row}>
              {renderDropdown(
                "crop",
                cropList,
                showCropDropdown,
                setShowCropDropdown,
                "Crop",
                formData.crop
              )}

              {renderDropdown(
                "variety",
                varietyList,
                showVarietyDropdown,
                setShowVarietyDropdown,
                "Seed Variety",
                formData.variety
              )}
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.fullWidth]}>
                <Text style={styles.label}>Required Output (ha)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.requiredOutput}
                  onChangeText={(text) =>
                    handleInputChange("requiredOutput", text)
                  }
                  keyboardType="numeric"
                  placeholder="Enter required output"
                  placeholderTextColor={Colors.grey}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.fullWidth]}>
                <Text style={styles.label}>Required Date</Text>
                <TextInput
                  style={styles.input}
                  value={formData.requiredDate}
                  onChangeText={(text) =>
                    handleInputChange("requiredDate", text)
                  }
                  placeholder="dd/mm/yyyy"
                  placeholderTextColor={Colors.grey}
                />
              </View>
            </View>
          </View>

          {/* Equipment Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Required Equipment</Text>

            <View style={styles.equipmentToggle}>
              <Text style={styles.label}>Equipment Required</Text>
              <Switch
                value={formData.equipment}
                onValueChange={(value) => handleInputChange("equipment", value)}
                trackColor={{ false: Colors.grey, true: Colors.greenColor }}
                thumbColor={Colors.white}
              />
            </View>

            {formData.equipment && (
              <>
                {/* Add New Equipment Form */}
                <View style={styles.addEquipmentCard}>
                  <Text style={styles.subSectionTitle}>Add Equipment</Text>
                  
                  {/* Equipment Dropdown */}
                  {renderDropdown(
                    "equipment",
                    equipmentListData,
                    showEquipmentDropdown,
                    setShowEquipmentDropdown,
                    "Equipment",
                    newEquipment.equipment
                  )}

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Estimated Hours</Text>
                    <TextInput
                      style={styles.input}
                      value={newEquipment.estimatedHours}
                      onChangeText={(text) =>
                        handleEquipmentChange("estimatedHours", text)
                      }
                      keyboardType="numeric"
                      placeholder="Enter estimated hours"
                      placeholderTextColor={Colors.grey}
                    />
                  </View>

                  <View style={styles.operatorToggle}>
                    <Text style={styles.label}>Operator Required</Text>
                    <Switch
                      value={newEquipment.operatorRequired}
                      onValueChange={(value) =>
                        handleEquipmentChange("operatorRequired", value)
                      }
                      trackColor={{
                        false: Colors.grey,
                        true: Colors.greenColor,
                      }}
                      thumbColor={Colors.white}
                    />
                  </View>

                  <CustomButton
                    text={"Add Equipment"}
                    buttonStyle={styles.addButton}
                    handleAction={addEquipment}
                    textStyle={styles.addButtonText}
                  />
                </View>

                {/* Equipment List */}
                {formData.equipmentList.length > 0 && (
                  <View style={styles.equipmentList}>
                    <Text style={styles.subSectionTitle}>Added Equipment</Text>
                    {formData.equipmentList.map((item, index) => (
                      <View key={item.id || index} style={styles.equipmentItem}>
                        <View style={styles.equipmentInfo}>
                          <Text style={styles.equipmentName}>
                            {item.equipmentName}
                          </Text>
                          <Text style={styles.equipmentHours}>
                            {item.estimatedHours} hours
                          </Text>
                          <Text style={styles.operatorText}>
                            Operator:{" "}
                            {item.operator ? "Required" : "Not Required"}
                          </Text>
                          {item.operatorName && (
                            <Text style={styles.operatorName}>
                              Operator: {item.operatorName}
                            </Text>
                          )}
                        </View>
                        <TouchableOpacity
                          style={styles.removeButton}
                          onPress={() => removeEquipment(item.id)}
                        >
                          <Text style={styles.removeButtonText}>×</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
              </>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <CustomButton
              text={"Cancel"}
              buttonStyle={styles.cancelButton}
              textStyle={styles.cancelButtonText}
              handleAction={handleCancel}
            />
            <CustomButton
              text={"Save"}
              buttonStyle={styles.saveButton}
              textStyle={styles.saveButtonText}
              handleAction={handleSubmit}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </WrapperContainer>
  );
};

export default DPREdit;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: moderateScale(16),
    paddingBottom: moderateScale(20),
  },
  section: {
    marginBottom: moderateScaleVertical(24),
    backgroundColor: Colors.white,
    borderRadius: moderateScale(8),
    padding: moderateScale(16),
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
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
  subSectionTitle: {
    fontSize: textScale(14),
    fontFamily: FontFamily.PoppinsMedium,
    color: Colors.textColor,
    marginBottom: moderateScaleVertical(12),
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: moderateScaleVertical(12),
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: moderateScale(4),
    gap: moderateScaleVertical(5),
    marginBottom: moderateScale(10),
  },
  fullWidth: {
    flex: 1,
    marginHorizontal: 0,
  },
  label: {
    fontSize: textScale(12),
    fontFamily: FontFamily.PoppinsRegular,
    color: Colors.textColor,
    marginBottom: moderateScaleVertical(4),
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: moderateScale(6),
    padding: moderateScale(12),
    fontSize: textScale(14),
    color: Colors.black,
    backgroundColor: Colors.white,
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: moderateScale(6),
    padding: moderateScale(12),
    backgroundColor: Colors.white,
  },
  dropdownButtonText: {
    fontSize: textScale(14),
    color: Colors.black,
  },
  dropdownButtonPlaceholder: {
    fontSize: textScale(14),
    color: Colors.grey,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownModal: {
    width: "80%",
    maxHeight: "60%",
    backgroundColor: Colors.white,
    borderRadius: moderateScale(8),
    padding: moderateScale(10),
  },
  dropdownList: {
    maxHeight: moderateScaleVertical(300),
  },
  dropdownItem: {
    padding: moderateScale(12),
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  dropdownItemText: {
    fontSize: textScale(14),
    color: Colors.black,
    fontFamily: FontFamily.PoppinsRegular,
  },
  equipmentToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: moderateScale(12),
    backgroundColor: Colors.lightBackground,
    borderRadius: moderateScale(6),
    marginBottom: moderateScaleVertical(16),
  },
  operatorToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: moderateScale(12),
    backgroundColor: Colors.lightBackground,
    borderRadius: moderateScale(6),
    marginBottom: moderateScaleVertical(16),
  },
  addEquipmentCard: {
    backgroundColor: Colors.white,
    borderRadius: moderateScale(8),
    padding: moderateScale(16),
    marginBottom: moderateScaleVertical(16),
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  addButton: {
    backgroundColor: Colors.greenColor,
    padding: moderateScale(12),
    borderRadius: moderateScale(6),
    alignItems: "center",
  },
  addButtonText: {
    color: Colors.white,
    fontSize: textScale(14),
    fontFamily: FontFamily.PoppinsRegular,
  },
  equipmentList: {
    marginBottom: moderateScaleVertical(16),
  },
  equipmentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: moderateScale(6),
    padding: moderateScale(12),
    marginBottom: moderateScaleVertical(8),
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  equipmentInfo: {
    flex: 1,
  },
  equipmentName: {
    fontSize: textScale(14),
    fontFamily: FontFamily.PoppinsMedium,
    color: Colors.black,
    marginBottom: moderateScaleVertical(4),
  },
  equipmentHours: {
    fontSize: textScale(12),
    color: Colors.textColor,
    fontFamily: FontFamily.PoppinsRegular,
    marginBottom: moderateScaleVertical(2),
  },
  operatorText: {
    fontSize: textScale(12),
    color: Colors.textColor,
    fontFamily: FontFamily.PoppinsRegular,
  },
  operatorName: {
    fontSize: textScale(12),
    color: Colors.primary,
    fontFamily: FontFamily.PoppinsRegular,
    marginTop: moderateScaleVertical(4),
  },
  removeButton: {
    padding: moderateScale(8),
  },
  removeButtonText: {
    fontSize: textScale(20),
    color: Colors.error,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: moderateScaleVertical(16),
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
  saveButton: {
    backgroundColor: Colors.greenColor,
    width: "48%",
    borderRadius: moderateScale(8),
    alignItems: "center",
    padding: moderateScale(12),
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: textScale(14),
    fontFamily: FontFamily.PoppinsMedium,
  },
  buttonStyle: {
    backgroundColor: Colors.greenColor,
    height: moderateScale(50),
    width: "95%",
    alignSelf: "center",
    marginTop: moderateScaleVertical(16),
  },
});