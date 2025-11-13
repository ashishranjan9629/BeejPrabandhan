import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  ScrollView,
  FlatList,
  Switch,
  Alert,
  KeyboardAvoidingView,
  CheckBox,
} from "react-native";
import React, { useState, useEffect } from "react";
import WrapperContainer from "../../../../utils/WrapperContainer";
import InnerHeader from "../../../../components/InnerHeader";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {
  moderateScale,
  moderateScaleVertical,
  scale,
  textScale,
} from "../../../../utils/responsiveSize";
import FontFamily from "../../../../utils/FontFamily";
import Colors from "../../../../utils/Colors";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import CustomButton from "../../../../components/CustomButton";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { apiRequest } from "../../../../services/APIRequest";
import { API_ROUTES } from "../../../../services/APIRoutes";
import { getUserData } from "../../../../utils/Storage";
import { decryptAES, encryptWholeObject } from "../../../../utils/decryptData";
import {
  showErrorMessage,
  showSuccessMessage,
} from "../../../../utils/HelperFunction";
import en from "../../../../constants/en";
import CustomBottomSheet from "../../../../components/CustomBottomSheet";
import DropDown from "../../../../components/DropDown";
import EditDpr from "./EditDpr";
// import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function DprProcessAllocation({ route }) {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [activityList, setactivityList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  const [showAddNewForm, setshowAddNewForm] = useState(false);
  const [userData, setUserData] = useState([]);
  const [noOfLabour, setnoOfLabour] = useState(0);
  const [editNoOfLabour, seteditNoOfLabour] = useState(0);
  const [debouncedCount, setDebouncedCount] = useState(editNoOfLabour);
  const [showActivityOperation, setshowActivityOperation] = useState(false);
  const [activityOperationVal, setactivityOperationVal] = useState("");
  const [operationList, setOperationList] = useState([]);
  const [equipments, setEquipments] = useState([
    { id: 1, equipment: "", estHours: "", operatorRequired: false },
  ]);

  const [labourOption, setlabourOption] = useState([
    // {
    //   id: 1,
    //   labourName: "",
    //   estimateHours: "0",
    // },
  ]);

  const [showEditActivityOperation, setshowEditActivityOperation] =
    useState(false);
  const [editActivityOperationVal, seteditActivityOperationVal] = useState("");
  const [editDpr, seteditDpr] = useState(false);

  const [equipmentOptions, setequipmentOptions] = useState([
    {
      createdBy: "SYSTEM",
      createdOn: "2025-04-29T12:10:36.310+05:30",
      updatedBy: "SYSTEM",
      updatedOn: "2025-05-01T11:10:39.450+05:30",
      status: "ACTIVE",
      id: 1,
      macShortName: "98",
      macName: "Furniture AND Fixture(Furniture & Fixtures)",
      macDesc: "Furniture AND Fixture",
      costPerHr: 5,
      remarks: "Machine Data Ported",
      machineType: {
        createdBy: "ADMIN",
        createdOn: "2025-04-11T16:31:38.915+05:30",
        updatedBy: "SYSTEM",
        updatedOn: "2025-04-30T19:03:19.231+05:30",
        status: "ACTIVE",
        id: 1,
        macTypeShortName: "FURNITUREANDFIXTURES",
        macTypeName: "FURNITURE AND FIXTURES",
      },
      machineStatus: {
        createdBy: "SYSTEM",
        createdOn: "2025-04-29T12:02:45.593+05:30",
        updatedBy: "SYSTEM",
        updatedOn: "2025-05-20T13:02:07.417+05:30",
        status: "ACTIVE",
        id: 1,
        macStatusCode: 11,
        macStatusName: "WORKING",
      },
    },
    {
      createdBy: "SYSTEM",
      createdOn: "2025-04-29T12:15:08.864+05:30",
      updatedBy: "SYSTEM",
      updatedOn: "2025-05-01T11:12:04.069+05:30",
      status: "ACTIVE",
      id: 2,
      macShortName: "99",
      macName: "Furniture AND Fixture(Air Cooler, Air Conditioner)",
      macDesc: "Furniture AND Fixture",
      costPerHr: 5,
      remarks: "Machine Data Ported",
      machineType: {
        createdBy: "SYSTEM",
        createdOn: "2025-04-28T16:08:10.677+05:30",
        updatedBy: "SYSTEM",
        updatedOn: "2025-04-30T19:01:15.292+05:30",
        status: "ACTIVE",
        id: 2,
        macTypeShortName: "AIRCOOLERAIRCONDITIONERFOROFFICEUSE",
        macTypeName: "AIR COOLER , AIR CONDITIONER FOR OFFICE USE",
      },
      machineStatus: {
        createdBy: "SYSTEM",
        createdOn: "2025-04-29T12:02:45.593+05:30",
        updatedBy: "SYSTEM",
        updatedOn: "2025-05-20T13:02:07.417+05:30",
        status: "ACTIVE",
        id: 1,
        macStatusCode: 11,
        macStatusName: "WORKING",
      },
    },
    {
      createdBy: "SYSTEM",
      createdOn: "2025-05-01T11:13:18.492+05:30",
      updatedBy: "SYSTEM",
      updatedOn: "2025-05-01T11:13:18.492+05:30",
      status: "ACTIVE",
      id: 3,
      macShortName: "100",
      macName: "FIRE EXTINGUISHER",
      macDesc: "FIRE EXTINGUISHER",
      costPerHr: 5,
      remarks: "Machine Data Ported",
      machineType: {
        createdBy: "SYSTEM",
        createdOn: "2025-04-29T12:17:00.230+05:30",
        updatedBy: "SYSTEM",
        updatedOn: "2025-05-20T15:34:58.560+05:30",
        status: "ACTIVE",
        id: 3,
        macTypeShortName: "FIREEXT",
        macTypeName: "FIRE EXTINGUISHER ",
      },
      machineStatus: {
        createdBy: "SYSTEM",
        createdOn: "2025-04-29T12:02:45.593+05:30",
        updatedBy: "SYSTEM",
        updatedOn: "2025-05-20T13:02:07.417+05:30",
        status: "ACTIVE",
        id: 1,
        macStatusCode: 11,
        macStatusName: "WORKING",
      },
    },
    {
      createdBy: "SYSTEM",
      createdOn: "2025-05-20T12:40:56.940+05:30",
      updatedBy: "SYSTEM",
      updatedOn: "2025-05-20T12:40:56.940+05:30",
      status: "ACTIVE",
      id: 4,
      macShortName: "MNO",
      macName: "Mac Name One",
      macDesc: "Machine Desc One",
      costPerHr: 45,
      remarks: "Testing",
      machineType: {
        createdBy: "SYSTEM",
        createdOn: "2025-04-29T12:17:00.230+05:30",
        updatedBy: "SYSTEM",
        updatedOn: "2025-05-20T15:34:58.560+05:30",
        status: "ACTIVE",
        id: 3,
        macTypeShortName: "FIREEXT",
        macTypeName: "FIRE EXTINGUISHER ",
      },
      machineStatus: {
        createdBy: "SYSTEM",
        createdOn: "2025-04-29T12:02:45.593+05:30",
        updatedBy: "SYSTEM",
        updatedOn: "2025-05-20T13:02:07.417+05:30",
        status: "ACTIVE",
        id: 1,
        macStatusCode: 11,
        macStatusName: "WORKING",
      },
    },
    {
      createdBy: "SYSTEM",
      createdOn: "2025-05-20T15:46:20.075+05:30",
      updatedBy: "SYSTEM",
      updatedOn: "2025-05-20T15:46:20.075+05:30",
      status: "ACTIVE",
      id: 5,
      macShortName: "MNT",
      macName: "Mac Name Two",
      macDesc: "Machine Desc Two",
      costPerHr: 47.32,
      remarks: "Test another record",
      machineType: {
        createdBy: "SYSTEM",
        createdOn: "2025-04-28T16:08:10.677+05:30",
        updatedBy: "SYSTEM",
        updatedOn: "2025-04-30T19:01:15.292+05:30",
        status: "ACTIVE",
        id: 2,
        macTypeShortName: "AIRCOOLERAIRCONDITIONERFOROFFICEUSE",
        macTypeName: "AIR COOLER , AIR CONDITIONER FOR OFFICE USE",
      },
      machineStatus: {
        createdBy: "SYSTEM",
        createdOn: "2025-04-29T12:02:45.593+05:30",
        updatedBy: "SYSTEM",
        updatedOn: "2025-05-20T13:02:07.417+05:30",
        status: "ACTIVE",
        id: 1,
        macStatusCode: 11,
        macStatusName: "WORKING",
      },
    },
  ]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [materialList, setMaterialList] = useState([]);
  const isFocused = useIsFocused();
  const landData = route?.params?.landData;
  console.log("landData", landData);

  useEffect(() => {
    if (isFocused) {
      fetchUserData();
    }
  }, [isFocused]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCount(editNoOfLabour);
    }, 500);

    return () => clearTimeout(handler);
  }, [editNoOfLabour]);

  useEffect(() => {
    if (debouncedCount && Number(debouncedCount) > 0) {
      addLabourFieldDynamicaly(Number(debouncedCount));
    }
  }, [debouncedCount]);

  const getActivityOperationData = async () => {
    const operationPayloadData = {};
    const encryptedOperationPayload = encryptWholeObject(operationPayloadData);
    const operationListResponse = await apiRequest(
      API_ROUTES.OPERATION_MASTER_DD,
      "POST",
      encryptedOperationPayload
    );
    const decryptedOperationListData = decryptAES(operationListResponse);
    const parsedDecryptedOperationListData = JSON.parse(
      decryptedOperationListData
    );
    console.log(
      "parsedDecryptedOperationListData",
      parsedDecryptedOperationListData
    );
    if (
      parsedDecryptedOperationListData?.status === "SUCCESS" &&
      parsedDecryptedOperationListData?.statusCode === "200"
    ) {
      setOperationList(parsedDecryptedOperationListData?.data || []);
    } else {
      showErrorMessage("Unable to get the Operation List Data");
    }
  };

  const fetchUserData = async () => {
    setLoading(true);
    const userData = await getUserData();
    console.log("userData", userData);
    setUserData(userData);
    getActivityOperationData();
    await fetchActivityList(userData);
  };

  const fetchMaterialList = async (materialType) => {
    try {
      setLoading(true);
      const payload = {
        materialType: materialType,
      };

      const encryptedPayload = encryptWholeObject(payload);

      const response = await apiRequest(
        API_ROUTES.MATERIAL_LIST,
        "POST",
        encryptedPayload
      );

      const decryptedResponse = decryptAES(response);
      const parsedResponse = JSON.parse(decryptedResponse);
      if (
        parsedResponse?.status === "SUCCESS" &&
        parsedResponse?.statusCode === "200"
      ) {
        setMaterialList(parsedResponse?.data);
      } else {
        showErrorMessage("Unable to fetch material list");
      }
    } catch (error) {
      console.error("Error fetching material list:", error);
      showErrorMessage("Error fetching material list");
    } finally {
      setLoading(false);
    }
  };

  const fetchActivityList = async (userData) => {
    setLoading(false);
    try {
      const payloadData = {
        page: 0,
        pageSize: 100,
        squareId: landData?.squareId,
      };

      // console.log("parsedDecrypted", payloadData);
      const encryptedPayload = encryptWholeObject(payloadData);
      const response = await apiRequest(
        API_ROUTES.GET_DPR_HISTORY,
        "post",
        encryptedPayload
      );

      const decrypted = decryptAES(response);
      const parsedDecrypted = JSON.parse(decrypted);
      console.log("parsedDecrypted", parsedDecrypted);
      if (
        parsedDecrypted?.status === "SUCCESS" &&
        parsedDecrypted?.statusCode === "200"
      ) {
        setactivityList(parsedDecrypted?.data);
      } else {
        showErrorMessage(parsedDecrypted?.message || "Not getting Data");
      }
    } catch (error) {
      console.log("parsedDecrypted", error);
    } finally {
      setLoading(false);
    }
  };

  const onChangeDate = (event, selectedDate) => {
    setShow(false); // hide after selection
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const [rows, setRows] = useState([
    {
      id: 1,
      materialType: "",
      material: "",
      noOfItems: "",
      quantity: "",
      uom: "",
      showMaterialType: false,
      showMaterial: false,
    },
  ]);

  const materialTypeList = [
    "VALUE_ADDED",
    "PACKAGING_MATERIAL",
    "AGRO_CHEMICAL",
    "SEED",
    "SAPLING",
  ];

  const addRow = () => {
    const newId = rows.length + 1;
    setRows([
      ...rows,
      {
        id: newId,
        materialType: "",
        material: "",
        noOfItems: "",
        quantity: "",
        uom: "",
        showMaterialType: false,
        showMaterial: false,
      },
    ]);
  };

  const removeRow = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };
  console.log("handleChange", rows);
  // Handle input change
  const handleChange = (id, field, value) => {
    if (value.uom) {
      setRows((prev) =>
        prev.map((row) =>
          row.id === id
            ? { ...row, [field]: value, uom: value.uom || "emp" }
            : row
        )
      );
    } else {
      setRows((prev) =>
        prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
      );
    }
  };

  // Render dropdown item
  // const renderDropdownItem = ({ item, type, parentId }) => (
  //   <TouchableOpacity
  //     style={styles.dropdownItem}
  //     onPress={() => {
  //       if (type == "materialType") {
  //         fetchMaterialList(item);
  //         handleChange(parentId, type, item);
  //         handleChange(parentId, `show${capitalize(type)}`, false);
  //       } else {
  //         handleChange(parentId, type, item);
  //         handleChange(parentId, `show${capitalize(type)}`, false);
  //       }
  //     }}
  //   >
  //     <Text>{item?.itemName ? item?.itemName : item}</Text>
  //   </TouchableOpacity>
  // );

  const renderDropdownItem = ({ item, type, parentId }) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => {
        if (type === "materialType") {
          fetchMaterialList(item);
          handleChange(parentId, type, item);
          handleChange(parentId, `show${capitalize(type)}`, false);
        } else if (type === "material") {
          handleChange(parentId, type, item);
          handleChange(parentId, `show${capitalize(type)}`, false);
        } else {
          handleChange(parentId, type, item);
          handleChange(parentId, `show${capitalize(type)}`, false);
        }
      }}
    >
      <Text>
        {typeof item === "object" ? item?.itemName || "Unnamed Item" : item}
      </Text>
    </TouchableOpacity>
  );

  // Helper to capitalize field names
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  // Common dropdown component
  const renderDropdown = (
    parentId,
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
          style={[
            styles.dropdownButtonText,
            !value && styles.dropdownButtonPlaceholder,
            { flex: 1, marginRight: 8 },
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {/* {value || `Select ${placeholder}`} */}
          {typeof value === "object"
            ? value?.itemName || `Select ${placeholder}`
            : value || `Select ${placeholder}`}
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
              renderItem={({ item }) =>
                renderDropdownItem({ item, type, parentId })
              }
              style={styles.dropdownList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );

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
      case "REJECTED":
        return Colors.redThemeColor;
      default:
        return Colors.gray;
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleCardPress = (item) => {
    setSelectedItem(item);
    setBottomSheetVisible(true);
  };

  const RenderCard = ({ item, index, getStatusColor, handleCardPress }) => {
    //console.log("RenderCard", item);
    return (
      <TouchableOpacity
        onPress={() => {
          handleCardPress(item);
        }}
        style={styles.itemCard}
      >
        {/* Header Row with Date and Status */}

        <View style={styles.cardHeader}>
          <Text style={styles.dateText}>{item.squareName}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.dprStatus) },
            ]}
          >
            <Text style={styles.statusText}>{item.currentDprStatus}</Text>
            {/* <Text style={styles.statusText}>
              {(item.dprStatus === "SUBMITTED" && "Completed") ||
                (item.dprStatus === "PENDING_WITH_BLOCK_INCHARGE" &&
                  "Pending at Block In") ||
                (item.dprStatus === "PENDING_WITH_MECHANICAL_INCHARGE" &&
                  "Pending at Mech. In") ||
                (item.dprStatus === "PENDING_WITH_CHAK_INCHARGE" &&
                  "In Progress") ||
                (item.dprStatus === "REJECTED" && "Rejected") ||
                (item.dprStatus === "PENDING" && "Pending") ||
                (item.dprStatus === "APPROVED" && "Approved") ||
                (item.dprStatus ===
                  "PENDING_WITH_CHAK_INCHARGE_FOR_CORRECTION" &&
                  "Pending at Chak For Corr.") ||
                "PENDING WITH BLOCK"}
            </Text> */}
          </View>
        </View>

        {/* Main Content */}
        <View>
          {/* Square and Operation Row */}
          <View style={styles.itemRow}>
            <View style={styles.itemColumn}>
              <Text style={styles.itemLabel}>Plan Id</Text>
              <Text style={styles.itemValue}>{item?.planId || "N/A"}</Text>
            </View>
          </View>
          <View style={styles.itemRow}>
            <View style={styles.itemColumn}>
              <Text style={styles.itemLabel}>Square Name</Text>
              <Text style={styles.itemValue}>{item?.squareName || "N/A"}</Text>
            </View>
            <View style={styles.itemColumn}>
              <Text style={styles.itemLabel}>Process Date</Text>
              <Text style={styles.itemValue}>
                {formatDate(item?.reportDate) || "N/A"}
              </Text>
            </View>
          </View>
          <View style={styles.itemRow}>
            <View style={styles.itemColumn}>
              <Text style={styles.itemLabel}>Activity/Oper.</Text>
              <Text style={styles.itemValue}>
                {item?.activityName || "N/A"}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const addNewEquipment = () => {
    const newId = equipments.length + 1;
    setEquipments([
      ...equipments,
      { id: newId, equipment: "", estHours: "", operatorRequired: false },
    ]);
  };

  const removeEquipment = (id) => {
    const updated = equipments.filter((item) => item.id !== id);
    setEquipments(updated);
  };

  const handleUpdateLabourDetail = (id, key, val) => {
    setlabourOption((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [key]: val } : item))
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
    console.log("updatedData", updatedData);
    setSelectedItem(updatedData);
  };

  const handleChangeEqupment = (id, key, value) => {
    const updated = equipments.map((item) => {
      if (value?.id) {
        return item.id === id
          ? {
              ...item,
              [key]: value?.macName ? value?.macName : value,
              equipmentId: value?.id,
            }
          : item;
      } else {
        return item.id === id
          ? { ...item, [key]: value?.macName ? value?.macName : value }
          : item;
      }
    });

    setEquipments(updated);
  };

  // const equipmentOptions = [
  //   "Excavator",
  //   "Bulldozer",
  //   "Crane",
  //   "Truck",
  //   "Loader",
  // ];

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
        {equipments?.length > 1 && (
          <TouchableOpacity onPress={() => removeEquipment(item.id)}>
            <Icon name="delete" size={24} color={Colors.red} />
          </TouchableOpacity>
        )}
      </View>

      <DropDown
        isVisible={activeDropdown === item.id}
        setIsVisible={(visible) => setActiveDropdown(visible ? item.id : null)}
        value={item.equipment}
        selectItem={(selected) => {
          handleChangeEqupment(item.id, "equipment", selected);
          setActiveDropdown(null);
        }}
        data={equipmentOptions}
      />

      <View style={{ marginBottom: 8 }}>
        <Text style={styles.label}>Est. Hours</Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: Colors.border,
            borderRadius: 6,
            paddingHorizontal: 10,
            height: 40,
          }}
          value={item.estHours}
          placeholder="Enter hours"
          keyboardType="numeric"
          onChangeText={(val) => handleChangeEqupment(item.id, "estHours", val)}
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
            value={item.operatorRequired}
            onValueChange={(val) =>
              handleChangeEqupment(item.id, "operatorRequired", val)
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

  const transformRows = (rows) => {
    const dprAgricultures = rows.map((row) => ({
      materialType: row.materialType,
      itemId: row.material?.id,
      itemName: row.material?.itemName,
      uom: row.material?.uom || row.uom,
      noOfItems: row.noOfItems,
      qty: row.quantity,
    }));

    return { dprAgricultures };
  };

  const transformMachanicalTools = (equipments) => {
    const equipmentFormat = equipments.map((equipment) => ({
      equipmentId: equipment?.equipmentId,
      equipmentName: equipment?.equipment,
      operatorName: "",
      cpNumber: "",
      actualHours: "",
      estimatedHours: equipment?.estHours,
      operatorRequired: equipment?.operatorRequired,
    }));

    return { equipmentFormat };
  };

  const submitForm = async () => {
    setLoading(true);
    const formatedRows = transformRows(rows);
    const formatedEquipment = transformMachanicalTools(equipments);
    let data = [
      {
        squareName: landData?.squareName,
        reportDate: date,
        activityId: activityOperationVal?.id,
        noOfLabour: noOfLabour,
        dprAgricultures: formatedRows.dprAgricultures,
        dprMechanicals: formatedEquipment?.equipmentFormat,
        activityName: activityOperationVal?.operationName,
        cultivableArea: landData?.cultivatedArea,
        planId: landData?.planId,
        squareId: landData?.squareId,
        farmPlanId: landData?.farmPlanId,
        totalArea: landData?.squareArea,
        unitType: userData?.unitType,
        chakId: userData?.chakId,
        farmId: landData?.farmId,
        farmBlockId: landData?.farmBlockId,
        chakName: landData?.chakName,
        farmName: landData?.farmName,
        farmBlockName: landData?.farmBlockName,
        currentDprStatus: "PENDING",
        workshopId: landData?.workshopId,
      },
    ];

    console.log("submitForm", data);

    const encryptedPayload = encryptWholeObject(data);
    const response = await apiRequest(
      API_ROUTES.SAVE_DPR,
      "POST",
      encryptedPayload
    );

    const decryptedResponse = decryptAES(response);
    const parsedResponse = JSON.parse(decryptedResponse);
    setLoading(false);

    if (
      parsedResponse?.status === "SUCCESS" &&
      parsedResponse?.statusCode === "200"
    ) {
      showSuccessMessage(`${parsedResponse?.message} `);
      setshowAddNewForm(false);
      fetchUserData();
    } else if (
      parsedResponse?.status === "FAILED" &&
      parsedResponse?.statusCode === "300"
    ) {
      showErrorMessage(`${parsedResponse?.message} `);
    } else {
      showErrorMessage("Error in filling form");
    }
  };

  const addLabourFieldDynamicaly = (noOfLabour) => {
    if (noOfLabour > 0) {
      const newItems = Array.from({ length: noOfLabour }, () => ({
        id: Date.now() + Math.random(), // unique id
        labourName: "",
        estimateHours: "0",
      }));

      // Add all new items to the existing list
      setlabourOption((prev) => [...newItems]);
    } else {
      setlabourOption([]);
    }
  };

  const handleBottomSheetAction = (type) => {
    if (type == "Details") {
      navigation.navigate("ViewDprDetail", { selectedItem: selectedItem });
    }
    // if (type == "Edit") {
    //   addLabourFieldDynamicaly(selectedItem?.noOfLabour);
    //   setBottomSheetVisible(!bottomSheetVisible);
    //   seteditDpr(true);
    // }

    console.log("selectedItem___", selectedItem);
  };

  const approveOrRejectRequest = async (status) => {
    try {
      //setLoading(true);
      const payloadData = {
        ...selectedItem,
        currentDprStatus: status,
      };
      //console.log("payloadData", payloadData);
      const encryptedPayload = encryptWholeObject(payloadData);
      const response = await apiRequest(
        API_ROUTES.DP_REPORT_UPDATE,
        "POST",
        encryptedPayload
      );
      const decrypted = decryptAES(response);
      const parsedDecrypted = JSON.parse(decrypted);
      console.log("payloadData", parsedDecrypted);
      // if (
      //   parsedDecrypted?.status === "SUCCESS" &&
      //   parsedDecrypted?.statusCode === "200"
      // ) {
      //   showSuccessMessage(parsedDecrypted?.message || "success");
      //   await fetchDPRList(userData);
      // } else {
      //   showErrorMessage(`${parsedDecrypted?.message}` || "Error");
      // }
    } catch (error) {
      console.log(error, "payloadData");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateField = (type, val) => {
    const updatedData = {
      ...selectedItem,
      [type]: val,
    };
    setSelectedItem(updatedData);
    seteditNoOfLabour(val);
  };

  const addNewLabour = () => {
    const newItem = {
      id: Date.now(), // unique id
      labourName: "",
      estimateHours: "0",
    };

    setlabourOption((prev) => [...prev, newItem]);
  };

  const removeLabour = (id) => {
    setlabourOption((prev) => prev.filter((item) => item.id !== id));
  };

  const updateDpr = () => {
    alert("ok");
  };
  return (
    <WrapperContainer isLoading={loading}>
      <InnerHeader
        goBack={() => {
          if (!editDpr && !showAddNewForm) {
            navigation.goBack();
          } else {
            if (showAddNewForm) {
              setshowAddNewForm(!showAddNewForm);
            } else if (editDpr) {
              seteditDpr(!editDpr);
            }
          }
        }}
        backHandler={true}
        title={"Process Allocation"}
        rightIcon={
          !editDpr &&
          !showAddNewForm && (
            <TouchableOpacity
              onPress={() => {
                setshowAddNewForm(!showAddNewForm);
              }}
              style={styles.notificationHolder}
            >
              {/* {showAddNewForm ? (
                <>
                  <Icon
                    name="close"
                    size={moderateScale(25)}
                    color={Colors.white}
                  />
                </>
              ) : (
                <>
                  <Icon
                    name="add"
                    size={moderateScale(25)}
                    color={Colors.white}
                  />
                </>
              )} */}
              <Icon name="add" size={moderateScale(25)} color={Colors.white} />
            </TouchableOpacity>
          )
        }
      />

      {/* <View style={{ paddingHorizontal: 15, marginTop: 10 }}>
        {editDpr ? (
          <TouchableOpacity
            onPress={() => {
              seteditDpr(false);
            }}
            style={styles.addParentButton}
          >
            <Icon name="close" size={moderateScale(25)} color={Colors.white} />
            <Text style={styles.addParentButtonText}>Close</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              setshowAddNewForm(!showAddNewForm);
            }}
            style={styles.addParentButton}
          >
            {showAddNewForm ? (
              <>
                <Icon
                  name="close"
                  size={moderateScale(25)}
                  color={Colors.white}
                />
                <Text style={styles.addParentButtonText}>Close</Text>
              </>
            ) : (
              <>
                <Icon
                  name="add"
                  size={moderateScale(25)}
                  color={Colors.white}
                />
                <Text style={styles.addParentButtonText}>Add New</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View> */}

      {showAddNewForm ? (
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
                    style={styles.input}
                    keyboardType="numeric"
                    value={landData?.squareName}
                  />
                </View>

                <TouchableOpacity
                  onPress={() => setShow(true)}
                  style={styles.inputContainer}
                >
                  <Text style={styles.label}>Date</Text>
                  <View style={styles.input}>
                    <Text>{date.toLocaleDateString()}</Text>
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
                    style={styles.input}
                    value={noOfLabour}
                    placeholder="0"
                    onChangeText={(val) => {
                      setnoOfLabour(val);
                    }}
                  />
                </View>
              </View>

              <View style={styles.row}>
                <DropDown
                  isVisible={showActivityOperation}
                  setIsVisible={() => {
                    setshowActivityOperation(!showActivityOperation);
                  }}
                  data={operationList}
                  value={
                    activityOperationVal
                      ? activityOperationVal?.operationName
                      : ""
                  }
                  selectItem={(item) => {
                    setactivityOperationVal(item);
                    setshowActivityOperation(false);
                  }}
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
                      value={landData?.planId}
                      editable={false}
                    />
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Total Area</Text>
                    <TextInput
                      style={styles.input}
                      value={landData?.squareArea.toString()}
                      editable={false}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Cultivable Area</Text>
                    <TextInput
                      style={styles.input}
                      keyboardType="numeric"
                      value={landData?.cultivatedArea.toString()}
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
                      value={landData?.contractors?.[0]?.contractorType || "NA"}
                      editable={false}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Contractor</Text>
                    <TextInput
                      style={styles.input}
                      keyboardType="numeric"
                      value={landData?.contractors?.[0]?.contractorName || "NA"}
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
              <TouchableOpacity style={styles.addBtn} onPress={addRow}>
                <Text style={styles.addText}>+ Add New</Text>
              </TouchableOpacity>
            </View>

            {rows.map((item, index) => (
              <View key={item.id} style={styles.rowContainer}>
                <Text style={styles.serialNo}>S. No {index + 1}</Text>

                <View style={styles.row}>
                  {renderDropdown(
                    item.id,
                    "materialType",
                    materialTypeList,
                    item.showMaterialType,
                    (val) => {
                      handleChange(item.id, "showMaterialType", val);
                      //await fetchMaterialList(val);
                    },
                    "Material Type",
                    item.materialType
                  )}
                </View>
                <View style={styles.row}>
                  {renderDropdown(
                    item.id,
                    "material",
                    materialList,
                    item.showMaterial,
                    (val) => handleChange(item.id, "showMaterial", val),
                    "Material",
                    item.material
                  )}
                </View>

                <View style={styles.row}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>No. of Items</Text>
                    <TextInput
                      style={styles.input}
                      keyboardType="numeric"
                      value={item.noOfItems}
                      onChangeText={(val) =>
                        handleChange(item.id, "noOfItems", val)
                      }
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Quantity</Text>
                    <TextInput
                      style={styles.input}
                      keyboardType="numeric"
                      value={item.quantity}
                      onChangeText={(val) =>
                        handleChange(item.id, "quantity", val)
                      }
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

                {rows.length > 1 && (
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => removeRow(item.id)}
                  >
                    <Icon name="delete" size={24} color={Colors.red} />
                  </TouchableOpacity>
                )}
              </View>
            ))}

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
              <TouchableOpacity style={styles.addBtn} onPress={addNewEquipment}>
                <Text style={styles.addText}>+ Add New</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={equipments}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderEqupmentItem}
            />

            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => {
                submitForm();
              }}
            >
              <Text style={styles.addText}>Submit</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      ) : editDpr ? (
        <EditDpr
          hasEditPerm={
            userData?.unitType == "CHAK" || userData?.unitType == "FARM_BLOCK"
              ? false
              : true
          }
          updateDpr={updateDpr}
          addNewLabour={addNewLabour}
          removeLabour={(id) => {
            removeLabour(id);
          }}
          labourOption={labourOption}
          handleUpdateLabour={(id, key, val) => {
            handleUpdateLabourDetail(id, key, val);
          }}
          removeEquipment={(id) => {
            const filtered = selectedItem.dprMechanicals.filter(
              (item) => item.id !== id
            );
            setSelectedItem((prev) => ({ ...prev, dprMechanicals: filtered }));
          }}
          addNewEquipment={() => {
            const newItem = {
              id: Date.now(),
              equipmentName: "",
              equipmentId: 1,
              operatorRequired: false,
              estimatedHours: 1,
            };
            setSelectedItem((prev) => ({
              ...prev,
              dprMechanicals: [...prev.dprMechanicals, newItem],
            }));
          }}
          handleUpdateEquipment={(id, type, val) => {
            handleUpdateEquipment(id, type, val);
          }}
          equipments={equipmentOptions}
          deleteRow={(id) => {
            const filtered = selectedItem.dprAgricultures.filter(
              (item) => item.id !== id
            );
            setSelectedItem((prev) => ({ ...prev, dprAgricultures: filtered }));
          }}
          handleUpdateField={(type, val) => {
            handleUpdateField(type, val);
          }}
          addAgricultureRow={() => {
            const newItem = {
              id: Date.now(),
              itemName: "",
              materialType: "",
              itemId: "",
              uom: "",
              qty: "",
              date: null,
              remarks: "",
              noOfItems: "",
            };
            setSelectedItem((prev) => ({
              ...prev,
              dprAgricultures: [...prev.dprAgricultures, newItem],
            }));
          }}
          selectedMaterial={(value, id) => {
            const updatedData = {
              ...selectedItem,
              dprAgricultures: selectedItem.dprAgricultures.map((item) =>
                item.id === id
                  ? {
                      ...item,
                      itemName: value?.itemName,
                      itemId: value?.itemId,
                      uom: value?.uom,
                    }
                  : item
              ),
            };
            setSelectedItem(updatedData);
            //await fetchMaterialList(value);
          }}
          handleChange={(id, type, value) => {
            if (type == "noOfItems") {
              const updatedData = {
                ...selectedItem,
                dprAgricultures: selectedItem.dprAgricultures.map((item) =>
                  item.id === id
                    ? {
                        ...item,
                        noOfItems: value,
                      }
                    : item
                ),
              };
              setSelectedItem(updatedData);
            } else if (type == "quantity") {
              const updatedData = {
                ...selectedItem,
                dprAgricultures: selectedItem.dprAgricultures.map((item) =>
                  item.id === id
                    ? {
                        ...item,
                        qty: value,
                      }
                    : item
                ),
              };
              setSelectedItem(updatedData);
            }
          }}
          selectedActivity={async (value, id) => {
            const updatedData = {
              ...selectedItem,
              dprAgricultures: selectedItem.dprAgricultures.map((item) =>
                item.id === id ? { ...item, materialType: value } : item
              ),
            };
            setSelectedItem(updatedData);
            await fetchMaterialList(value);
          }}
          materialTypeList={materialTypeList}
          materialList={materialList}
          editData={selectedItem}
          data={operationList}
          isVisible={showEditActivityOperation}
          closeForm={() => {
            setshowEditActivityOperation(!showEditActivityOperation);
          }}
          value={editActivityOperationVal}
          selectItem={(item) => {
            seteditActivityOperationVal(item);
            setshowEditActivityOperation(!showEditActivityOperation);
          }}
        />
      ) : (
        <>
          <FlatList
            data={activityList}
            renderItem={({ item, index }) => (
              <RenderCard
                getStatusColor={getStatusColor}
                index={index}
                item={item}
                handleCardPress={handleCardPress}
              />
            )}
            keyExtractor={(item) => item.id?.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {en.DAILY_PROGRESS_REPORT.NO_DATA}
                </Text>
              </View>
            }
          />
          <CustomBottomSheet
            visible={bottomSheetVisible}
            onRequestClose={() => setBottomSheetVisible(false)}
          >
            <View style={styles.bottomSheetContent}>
              <Text style={styles.headerText}>
                {en.DAILY_PROGRESS_REPORT.SELECT_ACTION}
              </Text>
              <CustomButton
                text={en.DAILY_PROGRESS_REPORT.VIEW_DETAILS}
                buttonStyle={[
                  styles.bottomSheetButton,
                  { backgroundColor: Colors.lightGray },
                ]}
                textStyle={styles.bottomSheetButtonText}
                handleAction={() => handleBottomSheetAction("Details")}
              />
              {/* <CustomButton
                text={en.DAILY_PROGRESS_REPORT.ACTIVITY_LOG}
                buttonStyle={[
                  styles.bottomSheetButton,
                  { backgroundColor: Colors.gray },
                ]}
                textStyle={styles.bottomSheetButtonText}
                handleAction={() => handleBottomSheetAction("Activity Log")}
              /> */}

              {/* {(selectedItem?.dprStatus === "PENDING_WITH_BLOCK_INCHARGE" ||
                selectedItem?.dprStatus ===
                  "PENDING_WITH_CHAK_INCHARGE_FOR_CORRECTION") &&
                userData?.unitType === "CHAK" && (
                  <CustomButton
                    text={"Edit"}
                    buttonStyle={[
                      styles.bottomSheetButton,
                      { backgroundColor: Colors.primary },
                    ]}
                    textStyle={styles.bottomSheetButtonText}
                    handleAction={() => handleBottomSheetAction("Edit")}
                  />
                )} */}

              {/* {userData?.subUnitType === "WORKSHOP" &&
                selectedItem?.dprStatus ===
                  "PENDING_WITH_MECHANICAL_INCHARGE" && (
                  <CustomButton
                    text={"Submit"}
                    buttonStyle={[
                      styles.bottomSheetButton,
                      { backgroundColor: Colors.purple },
                    ]}
                    textStyle={styles.bottomSheetButtonText}
                    handleAction={() => handleBottomSheetAction("Submit")}
                  />
                )} */}

              {/* {selectedItem?.dprStatus === "PENDING_WITH_BLOCK_INCHARGE" ||
                (selectedItem?.dprStatus === "PENDING_WITH_CHAK_INCHARGE" &&
                  userData?.unitType === "CHAK" && (
                    <CustomButton
                      text={"Submit"}
                      buttonStyle={styles.bottomSheetButton}
                      textStyle={styles.bottomSheetButtonText}
                      handleAction={() => handleBottomSheetAction("Submit")}
                    />
                  ))} */}

              {/* {console.log("selectedItem__", selectedItem)}
              {console.log("selectedItem__", userData?.unitType)} */}

              {userData?.unitType === "FARM_BLOCK" &&
                selectedItem?.currentDprStatus === "PENDING" &&
                userData?.subUnitType != "WORKSHOP" && (
                  <CustomButton
                    text={"Approve"}
                    buttonStyle={styles.bottomSheetButton}
                    textStyle={styles.bottomSheetButtonText}
                    handleAction={() => approveOrRejectRequest("APPROVED")}
                  />
                )}
              {userData?.unitType === "FARM_BLOCK" &&
                selectedItem?.currentDprStatus === "PENDING" &&
                userData?.subUnitType != "WORKSHOP" && (
                  <CustomButton
                    text={"Reject"}
                    buttonStyle={[
                      styles.bottomSheetButton,
                      { backgroundColor: Colors.red },
                    ]}
                    textStyle={styles.bottomSheetButtonText}
                    handleAction={() => approveOrRejectRequest("REJECTED")}
                  />
                )}
            </View>
          </CustomBottomSheet>
        </>
      )}
    </WrapperContainer>
  );
}

const styles = StyleSheet.create({
  addParentButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.greenColor,
    padding: moderateScale(12),
    borderRadius: moderateScale(5),
    //marginBottom: moderateScaleVertical(16),
  },
  addParentButtonText: {
    color: Colors.white,
    fontSize: textScale(14),
    fontFamily: FontFamily.PoppinsMedium,
    marginLeft: moderateScale(8),
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: moderateScale(8),
    paddingBottom: moderateScale(20),
  },
  listContainer: {
    padding: moderateScale(15),
    paddingBottom: moderateScaleVertical(20),
  },
  itemCard: {
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
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: moderateScaleVertical(12),
  },
  itemColumn: {
    flex: 1,
    marginRight: moderateScale(8),
  },
  itemLabel: {
    fontSize: textScale(12),
    fontFamily: FontFamily.PoppinsRegular,
    color: Colors.gray,
    marginBottom: moderateScaleVertical(2),
    textTransform: "capitalize",
  },
  itemValue: {
    fontSize: textScale(14),
    fontFamily: FontFamily.PoppinsMedium,
    color: Colors.textColor,
    textTransform: "capitalize",
  },
  statusBadge: {
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScaleVertical(4),
    borderRadius: moderateScale(5),
  },
  statusText: {
    fontSize: textScale(11),
    fontFamily: FontFamily.PoppinsRegular,
    color: Colors.white,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: moderateScaleVertical(12),
    borderBottomWidth: 1,
    borderBottomColor: Colors.diabledColor,
    paddingBottom: moderateScaleVertical(8),
  },
  dateText: {
    fontSize: textScale(13),
    fontFamily: FontFamily.PoppinsRegular,
    color: Colors.textColor,
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
  notificationHolder: {
    borderWidth: 2,
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    backgroundColor: Colors.bg3,
    borderColor: Colors.bg3,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationHolder: {
    borderWidth: 2,
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    backgroundColor: Colors.greenColor,
    borderColor: Colors.greenColor,
    alignItems: "center",
    justifyContent: "center",
  },

  ////////

  rowContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    position: "relative",
  },
  serialNo: {
    fontWeight: "600",
    marginBottom: 8,
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
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    padding: 10,
  },
  dropdownButtonText: {
    color: "#000",
  },
  dropdownButtonPlaceholder: {
    color: Colors.grey,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownModal: {
    backgroundColor: "#fff",
    width: "80%",
    borderRadius: 10,
    paddingVertical: 10,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
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
  addText: {
    color: Colors.green,
    fontWeight: "600",
  },
  deleteBtn: {
    position: "absolute",
    right: 10,
    top: 10,
  },

  /// equipment
  serial: { fontWeight: "bold", marginBottom: 6 },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 8,
  },
  //label: { fontSize: 12, color: "#555", marginLeft: 5, marginTop: 4 },
  //inputContainer: { marginBottom: 8 },
  // input: {
  //   borderWidth: 1,
  //   borderColor: "#ccc",
  //   borderRadius: 8,
  //   paddingHorizontal: 10,
  //   height: 40,
  // },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
});
