import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Switch,
} from "react-native";
import React, { useState } from "react";
import {
  moderateScale,
  moderateScaleVertical,
} from "../../../../utils/responsiveSize";
import DropDown from "../../../../components/DropDown";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import Colors from "../../../../utils/Colors";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function EditDpr({
  hasEditPerm,
  editData,
  data,
  isVisible,
  closeForm,
  value,
  selectItem,
  materialTypeList,
  selectedActivity,
  materialList,
  selectedMaterial,
  handleChange,
  addAgricultureRow,
  deleteRow,
  equipments,
  addNewEquipment,
  removeEquipment,
  handleUpdateEquipment,
  handleUpdateField,
  labourOption,
  handleUpdateLabour,
  addNewLabour,
  removeLabour,
  updateDpr,
}) {
  console.log("editData", editData);
  const [date, setDate] = useState();
  const [show, setShow] = useState(false);
  const [showMeterialDropdown, setshowMeterialDropdown] = useState(false);
  const [showMaterialList, setshowMaterialList] = useState(false);
  const [isEquipmentDropdownVisible, setisEquipmentDropdownVisible] =
    useState(false);
  const onChangeDate = (event, selectedDate) => {
    setShow(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
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
          {labourOption?.length > 1 && hasEditPerm && (
            <TouchableOpacity onPress={() => removeLabour(item.id)}>
              <Icon name="delete" size={24} color={Colors.red} />
            </TouchableOpacity>
          )}
        </View>
        <View style={{ marginBottom: 8 }}>
          <Text style={styles.label}>Labour Name</Text>
          <TextInput
            editable={hasEditPerm}
            style={{
              borderWidth: 1,
              borderColor: Colors.border,
              borderRadius: 6,
              paddingHorizontal: 10,
              height: 40,
            }}
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
            editable={hasEditPerm}
            style={{
              borderWidth: 1,
              borderColor: Colors.border,
              borderRadius: 6,
              paddingHorizontal: 10,
              height: 40,
            }}
            value={item?.estimateHours}
            placeholder="Enter hours"
            keyboardType="numeric"
            onChangeText={(val) =>
              handleUpdateLabour(item.id, "estimateHours", val)
            }
          />
        </View>
      </View>
    );
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
      {console.log("renderEqupmentItem", item)}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={styles.serial}>S. No {index + 1}</Text>
        {equipments?.length > 1 && hasEditPerm && (
          <TouchableOpacity onPress={() => removeEquipment(item.id)}>
            <Icon name="delete" size={24} color={Colors.red} />
          </TouchableOpacity>
        )}
      </View>

      <DropDown
        disabled={!hasEditPerm}
        isVisible={isEquipmentDropdownVisible}
        setIsVisible={(visible) =>
          setisEquipmentDropdownVisible(!isEquipmentDropdownVisible)
        }
        value={item.equipmentName}
        selectItem={(selected) => {
          setisEquipmentDropdownVisible(!isEquipmentDropdownVisible);
          handleUpdateEquipment(item.id, "equipmentName", selected);
        }}
        data={equipments}
      />

      <View style={{ marginBottom: 8 }}>
        <Text style={styles.label}>Est. Hours</Text>
        <TextInput
          editable={hasEditPerm}
          style={{
            borderWidth: 1,
            borderColor: Colors.border,
            borderRadius: 6,
            paddingHorizontal: 10,
            height: 40,
          }}
          value={item?.estimatedHours ? item?.estimatedHours.toString() : ""}
          placeholder="Enter hours"
          keyboardType="numeric"
          onChangeText={(val) =>
            handleUpdateEquipment(item.id, "estimatedHours", val)
          }
        />
      </View>

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
            disabled={!hasEditPerm}
            value={item?.operatorRequired}
            onValueChange={(val) =>
              handleUpdateEquipment(item.id, "operatorRequired", val)
            }
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

  return (
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
                editable={hasEditPerm}
                style={styles.input}
                keyboardType="numeric"
                value={editData?.squareName}
              />
            </View>

            <TouchableOpacity
              disabled={!hasEditPerm}
              onPress={() => setShow(true)}
              style={styles.inputContainer}
            >
              <Text style={styles.label}>Date</Text>
              <View style={styles.input}>
                {date ? (
                  <Text>{date.toLocaleDateString()}</Text>
                ) : (
                  <Text>{formatDate(editData?.reportDate)}</Text>
                )}
              </View>
            </TouchableOpacity>

            {show && (
              <DateTimePicker
                value={date}
                mode="date" // "time" or "datetime"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onChangeDate}
                maximumDate={new Date(2030, 11, 31)}
                minimumDate={new Date(2020, 0, 1)}
              />
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>No. Of Labour</Text>
              <TextInput
                editable={hasEditPerm}
                style={styles.input}
                value={editData?.noOfLabour}
                placeholder="0"
                onChangeText={(val) => {
                  handleUpdateField("noOfLabour", val);
                }}
                maxLength={3}
              />
            </View>
          </View>

          <View style={styles.row}>
            <DropDown
              disabled={!hasEditPerm}
              isVisible={isVisible}
              setIsVisible={closeForm}
              data={data}
              value={
                value
                  ? value?.operationName
                  : editData?.activityName
                  ? editData?.activityName
                  : ""
              }
              selectItem={selectItem}
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
                  value={editData?.planId}
                  editable={false}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Total Area</Text>
                <TextInput
                  style={styles.input}
                  value={editData?.totalArea.toString()}
                  editable={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Cultivable Area</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={editData?.cultivableArea.toString()}
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
                  value={editData?.contractors?.[0]?.contractorType || "NA"}
                  editable={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Contractor</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={editData?.contractors?.[0]?.contractorName || "NA"}
                  editable={false}
                />
              </View>
            </View>
          </View>
        </View>

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
          {hasEditPerm && (
            <TouchableOpacity style={styles.addBtn} onPress={addAgricultureRow}>
              <Text style={styles.addText}>+ Add New</Text>
            </TouchableOpacity>
          )}
        </View>

        {editData?.dprAgricultures.map((item, index) => (
          <View key={item.id} style={styles.rowContainer}>
            <Text style={styles.serialNo}>S. No {index + 1}</Text>

            <View style={styles.row}>
              <DropDown
                disabled={!hasEditPerm}
                isVisible={showMeterialDropdown}
                setIsVisible={() => {
                  setshowMeterialDropdown(!showMeterialDropdown);
                }}
                data={materialTypeList}
                value={item?.materialType ? item?.materialType : ""}
                selectItem={(val) => {
                  selectedActivity(val, item.id);
                  setshowMeterialDropdown(false);
                }}
              />
            </View>
            <View style={styles.row}>
              <DropDown
                disabled={!hasEditPerm}
                isVisible={showMaterialList}
                setIsVisible={() => {
                  setshowMaterialList(!showMaterialList);
                }}
                data={materialList}
                value={item?.itemName ? item?.itemName : ""}
                selectItem={(val) => {
                  setshowMaterialList(!showMaterialList);
                  selectedMaterial(val, item.id);
                }}
              />
            </View>

            <View style={styles.row}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>No. of Items</Text>
                <TextInput
                  editable={hasEditPerm}
                  style={styles.input}
                  keyboardType="numeric"
                  value={item.noOfItems.toString()}
                  onChangeText={(val) =>
                    handleChange(item.id, "noOfItems", val)
                  }
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Quantity</Text>
                <TextInput
                  editable={hasEditPerm}
                  style={styles.input}
                  keyboardType="numeric"
                  value={item.qty.toString()}
                  onChangeText={(val) => handleChange(item.id, "quantity", val)}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>UOM</Text>
                <TextInput
                  editable={false}
                  style={styles.input}
                  value={item.uom}
                  //onChangeText={(val) => handleChange(item.id, "uom", val)}
                />
              </View>
            </View>

            {editData?.dprAgricultures.length > 1 && hasEditPerm && (
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => {
                  deleteRow(item.id);
                }}
              >
                <Icon name="delete" size={24} color={Colors.red} />
              </TouchableOpacity>
            )}
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
              {hasEditPerm && (
                <TouchableOpacity
                  style={styles.addBtn}
                  onPress={addNewEquipment}
                >
                  <Text style={styles.addText}>+ Add New</Text>
                </TouchableOpacity>
              )}
            </View>
            <FlatList
              data={editData?.dprMechanicals}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderEqupmentItem}
            />

            {editData?.noOfLabour > 0 ? (
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
                  {hasEditPerm && (
                    <TouchableOpacity
                      style={styles.addBtn}
                      onPress={addNewLabour}
                    >
                      <Text style={styles.addText}>+ Add New</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <FlatList
                  data={labourOption}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={renderLabourItem}
                />
              </>
            ) : null}

            {hasEditPerm && (
              <TouchableOpacity style={styles.addBtn} onPress={updateDpr}>
                <Text style={styles.addText}>Update</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: moderateScale(8),
    paddingBottom: moderateScale(20),
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
  addBtn: {
    backgroundColor: "#e8f5e9",
    borderColor: Colors.green,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",
    padding: 12,
    marginTop: 10,
  },
  deleteBtn: {
    position: "absolute",
    right: 10,
    top: 10,
  },
});
