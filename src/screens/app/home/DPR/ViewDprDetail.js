import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Switch,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "../../../../utils/Colors";
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from "../../../../utils/responsiveSize";
import DropDown from "../../../../components/DropDown";
import WrapperContainer from "../../../../utils/WrapperContainer";
import InnerHeader from "../../../../components/InnerHeader";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { getUserData } from "../../../../utils/Storage";
import CustomButton from "../../../../components/CustomButton";
import FontFamily from "../../../../utils/FontFamily";
import Icon from "react-native-vector-icons/MaterialIcons";
import { decryptAES, encryptWholeObject } from "../../../../utils/decryptData";
import { apiRequest } from "../../../../services/APIRequest";
import { API_ROUTES } from "../../../../services/APIRoutes";
import { showSuccessMessage } from "../../../../utils/HelperFunction";

export default function ViewDprDetail({ route }) {
  const getData = route?.params?.selectedItem;
  const navigation = useNavigation();
  console.log("getData", getData);
  const isFocused = useIsFocused();
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setselectedItem] = useState(getData);
  const [labourOption, setlabourOption] = useState([
    // {
    //   id: 1,
    //   labourName: "",
    //   estimateHours: "0",
    // },
  ]);

  useEffect(() => {
    if (isFocused) {
      fetchUserData();
      addLabourFieldDynamicaly(selectedItem?.noOfLabour);
    }
  }, [isFocused]);
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const fetchUserData = async () => {
    setLoading(true);
    const userData = await getUserData();
    console.log("userData", userData);
    setUserData(userData);
    setLoading(false);
  };

  const addLabourFieldDynamicaly = (noOfLabour) => {
    if (noOfLabour > 0) {
      const newItems = Array.from({ length: noOfLabour }, () => ({
        id: Date.now() + Math.random(), // unique id
        labourName: "",
        estimatedHours: "0",
        actualHours: "0",
      }));

      // Add all new items to the existing list
      setlabourOption((prev) => [...newItems]);
    } else {
      setlabourOption([]);
    }
  };

  const handleUpdateLabour = (id, key, val) => {
    if (selectedItem?.dprLabour?.length > 0) {
      const updatedData = {
        ...selectedItem,
        dprLabour: selectedItem.dprLabour.map((item) =>
          item.id === id
            ? {
                ...item,
                [type]: val,
              }
            : item
        ),
      };
      //console.log("updatedData", updatedData);
      setselectedItem(updatedData);
    } else {
      setlabourOption((prev) =>
        prev.map((item) => (item.id === id ? { ...item, [key]: val } : item))
      );
    }
  };

  const renderLabourItem = ({ item, index }) => {
    return (
      <View
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 10,
          padding: 10,
          marginBottom: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={styles.serial}>S. No {index + 1}</Text>
          {/* {labourOption?.length > 1 && (
            <TouchableOpacity onPress={() => removeLabour(item.id)}>
              <Icon name="delete" size={24} color={Colors.red} />
            </TouchableOpacity>
          )} */}
        </View>
        <View style={{ marginBottom: 8 }}>
          <Text style={styles.label}>Labour Name</Text>
          <TextInput
            editable={
              userData?.unitType === "CHAK" &&
              selectedItem?.dprMechanicalSubmit &&
              selectedItem?.currentDprStatus == "APPROVED" &&
              selectedItem?.dprStatus == "PENDING_WITH_CHAK_INCHARGE"
                ? true
                : false
            }
            style={
              userData?.unitType === "CHAK" &&
              selectedItem?.dprMechanicalSubmit &&
              selectedItem?.currentDprStatus == "APPROVED" &&
              selectedItem?.dprStatus == "PENDING_WITH_CHAK_INCHARGE"
                ? styles.input
                : styles.disabledInput
            }
            value={item?.labourName}
            placeholder="Enter Name"
            //keyboardType="numeric"
            onChangeText={(val) =>
              handleUpdateLabour(item.id, "labourName", val)
            }
          />
        </View>
        <View style={{ marginBottom: 8 }}>
          <Text style={styles.label}>Est. Hours</Text>
          <TextInput
            editable={
              userData?.unitType === "CHAK" &&
              selectedItem?.dprMechanicalSubmit &&
              selectedItem?.currentDprStatus == "APPROVED" &&
              selectedItem?.dprStatus == "PENDING_WITH_CHAK_INCHARGE"
                ? true
                : false
            }
            style={
              userData?.unitType === "CHAK" &&
              selectedItem?.dprMechanicalSubmit &&
              selectedItem?.currentDprStatus == "APPROVED" &&
              selectedItem?.dprStatus == "PENDING_WITH_CHAK_INCHARGE"
                ? styles.input
                : styles.disabledInput
            }
            value={item?.estimatedHours ? item?.estimatedHours.toString() : ""}
            placeholder="Enter hours"
            keyboardType="numeric"
            onChangeText={(val) =>
              handleUpdateLabour(item.id, "estimatedHours", val)
            }
          />
        </View>
        <View style={{ marginBottom: 8 }}>
          <Text style={styles.label}>Actual Hours</Text>
          <TextInput
            editable={
              userData?.unitType === "CHAK" &&
              selectedItem?.dprMechanicalSubmit &&
              selectedItem?.currentDprStatus == "APPROVED" &&
              selectedItem?.dprStatus == "PENDING_WITH_CHAK_INCHARGE"
                ? true
                : false
            }
            style={
              userData?.unitType === "CHAK" &&
              selectedItem?.dprMechanicalSubmit &&
              selectedItem?.currentDprStatus == "APPROVED" &&
              selectedItem?.dprStatus == "PENDING_WITH_CHAK_INCHARGE"
                ? styles.input
                : styles.disabledInput
            }
            value={item?.actualHours ? item?.actualHours.toString() : ""}
            placeholder="Enter hours"
            keyboardType="numeric"
            onChangeText={(val) =>
              handleUpdateLabour(item.id, "actualHours", val)
            }
          />
        </View>
      </View>
    );
  };

  const handleUpdateEquipment = (id, type, val) => {
    const updatedData = {
      ...selectedItem,
      dprMechanicals: selectedItem.dprMechanicals.map((item) =>
        item.id === id
          ? {
              ...item,
              [type]: val?.macName ? val?.macName : val,
            }
          : item
      ),
    };
    setselectedItem(updatedData);
  };
  const renderEqupmentItem = ({ item, index }) => (
    <View
      style={{
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={styles.serial}>S. No {index + 1}</Text>
      </View>

      <DropDown disabled={true} isVisible={false} value={item.equipmentName} />

      <View style={{ marginBottom: 8 }}>
        <Text style={styles.label}>Est. Hours</Text>
        <TextInput
          editable={false}
          style={styles.disabledInput}
          value={item?.estimatedHours ? item?.estimatedHours.toString() : ""}
          placeholder="Enter hours"
          keyboardType="numeric"
        />
      </View>

      {userData?.unitType == "FARM" ? (
        <>
          <View style={{ marginBottom: 8 }}>
            <Text style={styles.label}>Operator Name</Text>
            <TextInput
              editable={
                userData?.unitType == "FARM" &&
                selectedItem?.currentDprStatus == "APPROVED" &&
                item?.operatorRequired &&
                !selectedItem?.dprMechanicalSubmit
                  ? true
                  : false
              }
              style={
                userData?.unitType == "FARM" &&
                selectedItem?.currentDprStatus == "APPROVED" &&
                item?.operatorRequired &&
                !selectedItem?.dprMechanicalSubmit
                  ? styles.input
                  : styles.disabledInput
              }
              value={item?.operatorName ? item?.operatorName : ""}
              placeholder="Enter Operator Name"
              //keyboardType="numeric"
              onChangeText={(val) =>
                handleUpdateEquipment(item.id, "operatorName", val)
              }
            />
          </View>
          <View style={{ marginBottom: 8 }}>
            <Text style={styles.label}>CP Number</Text>
            <TextInput
              editable={
                userData?.unitType == "FARM" &&
                selectedItem?.currentDprStatus == "APPROVED" &&
                !selectedItem?.dprMechanicalSubmit
                  ? true
                  : false
              }
              style={
                userData?.unitType == "FARM" &&
                selectedItem?.currentDprStatus == "APPROVED" &&
                !selectedItem?.dprMechanicalSubmit
                  ? styles.input
                  : styles.disabledInput
              }
              value={item?.cpNumber ? item?.cpNumber.toString() : ""}
              placeholder="Enter"
              keyboardType="numeric"
              onChangeText={(val) =>
                handleUpdateEquipment(item.id, "cpNumber", val)
              }
            />
          </View>

          {userData?.unitType == "FARM" &&
            selectedItem?.currentDprStatus == "DONE" &&
            !selectedItem?.dprMechanicalSubmit && (
              <View style={{ marginBottom: 8 }}>
                <Text style={styles.label}>Actual Machanical Hours</Text>
                <TextInput
                  editable={
                    userData?.unitType == "FARM" &&
                    selectedItem?.currentDprStatus == "DONE" &&
                    !selectedItem?.dprMechanicalSubmit
                      ? true
                      : false
                  }
                  style={
                    userData?.unitType == "FARM" &&
                    selectedItem?.currentDprStatus == "DONE" &&
                    !selectedItem?.dprMechanicalSubmit
                      ? styles.input
                      : styles.disabledInput
                  }
                  value={
                    item?.actualMechHour ? item?.actualMechHour.toString() : ""
                  }
                  placeholder="Enter"
                  keyboardType="numeric"
                  onChangeText={(val) =>
                    handleUpdateEquipment(item.id, "actualMechHour", val)
                  }
                />
              </View>
            )}
        </>
      ) : userData?.unitType == "CHAK" ? (
        <>
          <View style={{ marginBottom: 8 }}>
            <Text style={styles.label}>Operator Name</Text>
            <TextInput
              editable={
                userData?.unitType == "FARM" &&
                selectedItem?.currentDprStatus == "APPROVED" &&
                item?.operatorRequired &&
                !selectedItem?.dprMechanicalSubmit
                  ? true
                  : false
              }
              style={
                userData?.unitType == "FARM" &&
                selectedItem?.currentDprStatus == "APPROVED" &&
                item?.operatorRequired &&
                !selectedItem?.dprMechanicalSubmit
                  ? styles.input
                  : styles.disabledInput
              }
              value={item?.operatorName ? item?.operatorName : ""}
              placeholder="Enter Operator Name"
              //keyboardType="numeric"
              onChangeText={(val) =>
                handleUpdateEquipment(item.id, "operatorName", val)
              }
            />
          </View>
          <View style={{ marginBottom: 8 }}>
            <Text style={styles.label}>CP Number</Text>
            <TextInput
              editable={
                userData?.unitType == "FARM" &&
                selectedItem?.currentDprStatus == "APPROVED" &&
                !selectedItem?.dprMechanicalSubmit
                  ? true
                  : false
              }
              style={
                userData?.unitType == "FARM" &&
                selectedItem?.currentDprStatus == "APPROVED" &&
                !selectedItem?.dprMechanicalSubmit
                  ? styles.input
                  : styles.disabledInput
              }
              value={item?.cpNumber ? item?.cpNumber.toString() : ""}
              placeholder="Enter"
              keyboardType="numeric"
              onChangeText={(val) =>
                handleUpdateEquipment(item.id, "cpNumber", val)
              }
            />
          </View>

          <View style={{ marginBottom: 8 }}>
            <Text style={styles.label}>Actual Hours</Text>
            <TextInput
              editable={
                userData?.unitType == "CHAK" &&
                selectedItem?.currentDprStatus == "APPROVED"
                  ? true
                  : false
              }
              style={
                userData?.unitType == "CHAK" &&
                selectedItem?.currentDprStatus == "APPROVED"
                  ? styles.input
                  : styles.disabledInput
              }
              value={item?.actualHours ? item?.actualHours.toString() : ""}
              placeholder="Enter"
              keyboardType="numeric"
              onChangeText={(val) =>
                handleUpdateEquipment(item.id, "actualHours", val)
              }
            />
          </View>

          {userData?.unitType == "FARM" &&
            selectedItem?.currentDprStatus == "DONE" &&
            !selectedItem?.dprMechanicalSubmit && (
              <View style={{ marginBottom: 8 }}>
                <Text style={styles.label}>Actual Machanical Hours</Text>
                <TextInput
                  editable={
                    userData?.unitType == "FARM" &&
                    selectedItem?.currentDprStatus == "DONE" &&
                    !selectedItem?.dprMechanicalSubmit
                      ? true
                      : false
                  }
                  style={
                    userData?.unitType == "FARM" &&
                    selectedItem?.currentDprStatus == "DONE" &&
                    !selectedItem?.dprMechanicalSubmit
                      ? styles.input
                      : styles.disabledInput
                  }
                  value={
                    item?.actualMechHour ? item?.actualMechHour.toString() : ""
                  }
                  placeholder="Enter"
                  keyboardType="numeric"
                  onChangeText={(val) =>
                    handleUpdateEquipment(item.id, "actualMechHour", val)
                  }
                />
              </View>
            )}
        </>
      ) : null}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 8,
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "80%",
          }}
        >
          <Switch
            disabled={true}
            value={item?.operatorRequired}
            trackColor={{ false: "#ccc", true: "lightgreen" }}
            thumbColor={item.operatorRequired ? "green" : "#f4f3f4"}
          />
          <Text
            style={{
              marginLeft: 10,
              fontSize: 14,
              color: "#333",
            }}
          >
            Operator Required
          </Text>
        </View>
      </View>
    </View>
  );

  const updateData = async (type) => {
    if (type) {
      let payloadData;
      if (type == "update") {
        payloadData = [
          {
            ...selectedItem,
            dprMechanicalSubmit: true,
          },
        ];
      } else if (type == "ReviewANDProceed") {
        const updatedArray = labourOption.map((item) => {
          const { id, ...rest } = item;
          return rest;
        });
        payloadData = [
          {
            ...selectedItem,
            dprMechanicalSubmit: false,
            currentDprStatus: "DONE",
            unitType: userData?.unitType,
            dprLabour: updatedArray,
          },
        ];
      } else if (type == "updateByMach") {
        payloadData = [
          {
            ...selectedItem,
            dprStatus: "SUBMITTED",
            dprMechanicalSubmit: true,
          },
        ];
      }
      try {
        setLoading(true);
        console.log("payloadData", payloadData);
        const encryptedPayload = encryptWholeObject(payloadData);
        const response = await apiRequest(
          API_ROUTES.UPDATE_DPR,
          "POST",
          encryptedPayload
        );
        const decrypted = decryptAES(response);
        const parsedDecrypted = JSON.parse(decrypted);
        console.log("payloadData", parsedDecrypted);
        if (
          parsedDecrypted?.status === "SUCCESS" &&
          parsedDecrypted?.statusCode === "200"
        ) {
          showSuccessMessage(parsedDecrypted?.message || "success");
          // setBottomSheetVisible(!bottomSheetVisible);
          // getActivityOperationData();
          navigation.goBack();
        } else {
          showErrorMessage(`${parsedDecrypted?.message}` || "Error");
        }
      } catch (error) {
        console.log(error, "payloadData");
      } finally {
        setLoading(false);
      }
    } else {
      alert("else");
    }
  };
  return (
    <WrapperContainer isLoading={loading}>
      <InnerHeader title={"Process Allocation"} />
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
          <View style={[styles.rowContainer]}>
            <View style={styles.row}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Square</Text>
                <TextInput
                  editable={false}
                  style={styles.disabledInput}
                  keyboardType="numeric"
                  value={selectedItem?.squareName}
                />
              </View>

              <TouchableOpacity disabled={true} style={styles.inputContainer}>
                <Text style={styles.label}>Date</Text>
                <View style={styles.disabledInput}>
                  <Text>{formatDate(selectedItem?.reportDate)}</Text>
                </View>
              </TouchableOpacity>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>No. Of Labour</Text>
                <TextInput
                  editable={false}
                  style={styles.disabledInput}
                  value={selectedItem?.noOfLabour}
                  placeholder="0"
                  maxLength={3}
                />
              </View>
            </View>

            <View style={styles.row}>
              <DropDown
                disabled={true}
                isVisible={false}
                // setIsVisible={closeForm}
                //data={data}
                value={
                  selectedItem?.activityName ? selectedItem?.activityName : ""
                }
                //selectItem={selectItem}
              />
            </View>
            <View
              style={{
                backgroundColor: "#e8f5e9",
                padding: 10,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: "#2e7d32",
                borderStyle: "dotted",
                marginTop: 10,
              }}
            >
              <View style={styles.row}>
                <Text
                  style={{
                    color: Colors.black,
                    fontSize: 18,
                    marginBottom: 10,
                  }}
                >
                  Square Detail
                </Text>
              </View>
              <View style={styles.row}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Production Plan</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={selectedItem?.planId}
                    editable={false}
                  />
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Total Area</Text>
                  <TextInput
                    style={styles.input}
                    value={selectedItem?.totalArea.toString()}
                    editable={false}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Cultivable Area</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={selectedItem?.cultivableArea.toString()}
                    editable={false}
                  />
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Contractor Type</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={
                      selectedItem?.contractors?.[0]?.contractorType || "NA"
                    }
                    editable={false}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Contractor</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={
                      selectedItem?.contractors?.[0]?.contractorName || "NA"
                    }
                    editable={false}
                  />
                </View>
              </View>
            </View>
          </View>

          {(userData?.unitType == "CHAK" ||
            userData?.unitType == "FARM_BLOCK") &&
            selectedItem?.dprAgricultures?.length > 0 && (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 20,
                  }}
                >
                  <Text
                    style={{
                      color: Colors.greenColor,
                      fontSize: 18,
                      fontWeight: "bold",
                    }}
                  >
                    Agriculture Inputs
                  </Text>
                </View>
                {selectedItem?.dprAgricultures.map((item, index) => (
                  <>
                    <View key={item.id} style={styles.rowContainer}>
                      <Text style={styles.serialNo}>S. No {index + 1}</Text>
                      <View style={styles.row}>
                        <DropDown
                          disabled={true}
                          isVisible={false}
                          // setIsVisible={() => {
                          //   setshowMeterialDropdown(!showMeterialDropdown);
                          // }}
                          //data={materialTypeList}
                          value={item?.materialType ? item?.materialType : ""}
                          // selectItem={(val) => {
                          //   selectedActivity(val, item.id);
                          //   setshowMeterialDropdown(false);
                          // }}
                        />
                      </View>
                      <View style={styles.row}>
                        <DropDown
                          disabled={true}
                          isVisible={false}
                          //   setIsVisible={() => {
                          //     setshowMaterialList(!showMaterialList);
                          //   }}
                          //   data={materialList}
                          value={item?.itemName ? item?.itemName : ""}
                          //   selectItem={(val) => {
                          //     setshowMaterialList(!showMaterialList);
                          //     selectedMaterial(val, item.id);
                          //   }}
                        />
                      </View>
                      <View style={styles.row}>
                        <View style={styles.inputContainer}>
                          <Text style={styles.label}>No. of Items</Text>
                          <TextInput
                            editable={false}
                            style={styles.disabledInput}
                            keyboardType="numeric"
                            value={item.noOfItems.toString()}
                          />
                        </View>

                        <View style={styles.inputContainer}>
                          <Text style={styles.label}>Quantity</Text>
                          <TextInput
                            editable={false}
                            style={styles.disabledInput}
                            keyboardType="numeric"
                            value={item.qty.toString()}
                          />
                        </View>

                        <View style={styles.inputContainer}>
                          <Text style={styles.label}>UOM</Text>
                          <TextInput
                            editable={false}
                            style={styles.disabledInput}
                            value={item.uom}
                          />
                        </View>
                      </View>
                    </View>
                  </>
                ))}
              </>
            )}

          {selectedItem?.dprMechanicals?.length > 0 ? (
            <>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <Text
                  style={{
                    color: Colors.greenColor,
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  Equipment & Mechanical Details
                </Text>
              </View>
              <FlatList
                data={selectedItem?.dprMechanicals}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderEqupmentItem}
              />
            </>
          ) : null}

          {selectedItem?.noOfLabour > 0 && userData?.unitType == "CHAK" && (
            <>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <Text
                  style={{
                    color: Colors.greenColor,
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  Labour Details
                </Text>
                {/* <TouchableOpacity
                style={styles.addBtn}
                //onPress={addNewLabour}
              >
                <Text style={styles.addText}>+ Add New</Text>
              </TouchableOpacity> */}
              </View>
              <FlatList
                data={
                  selectedItem?.dprLabour?.length > 0
                    ? selectedItem?.dprLabour
                    : labourOption
                }
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderLabourItem}
              />
            </>
          )}

          {userData?.unitType == "FARM" &&
            selectedItem?.currentDprStatus == "APPROVED" &&
            !selectedItem?.dprMechanicalSubmit && (
              <CustomButton
                text={"Update"}
                buttonStyle={[
                  styles.buttonStyle,
                  { backgroundColor: Colors.greenColor },
                ]}
                textStyle={styles.buttonTextStyle}
                handleAction={() => updateData("update")}
              />
            )}

          {userData?.unitType == "CHAK" &&
            selectedItem?.currentDprStatus == "APPROVED" && (
              <CustomButton
                text={"Review & Proceed"}
                buttonStyle={[
                  styles.buttonStyle,
                  { backgroundColor: Colors.greenColor },
                ]}
                textStyle={styles.buttonTextStyle}
                handleAction={() => updateData("ReviewANDProceed")}
              />
            )}

          {userData?.unitType == "FARM" &&
            selectedItem?.currentDprStatus == "DONE" &&
            !selectedItem?.dprMechanicalSubmit && (
              <CustomButton
                text={"Update"}
                buttonStyle={[
                  styles.buttonStyle,
                  { backgroundColor: Colors.greenColor },
                ]}
                textStyle={styles.buttonTextStyle}
                handleAction={() => updateData("updateByMach")}
              />
            )}
        </ScrollView>
      </KeyboardAvoidingView>
    </WrapperContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: moderateScale(8),
    paddingBottom: moderateScale(20),
    //marginBottom: 50,
  },
  rowContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    position: "relative",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputContainer: {
    flex: 1,
    marginRight: 8,
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    color: Colors.grey,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    padding: 8,
  },
  disabledInput: {
    borderWidth: 1,
    borderColor: Colors.disableFieldColor,
    borderRadius: 6,
    padding: 8,
    backgroundColor: Colors.disableFieldColor,
  },
  addBtn: {
    backgroundColor: "#e8f5e9",
    borderColor: Colors.green,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",
    padding: 12,
    marginTop: 10,
  },
  buttonStyle: {
    backgroundColor: Colors.greenColor,
    padding: moderateScaleVertical(12),
    borderRadius: moderateScale(8),
    alignItems: "center",
  },
  buttonTextStyle: {
    color: Colors.white,
    fontSize: textScale(14),
    fontFamily: FontFamily.PoppinsMedium,
  },
});
