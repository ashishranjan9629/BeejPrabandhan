// import {
//   View,
//   Text,
//   StyleSheet,
//   KeyboardAvoidingView,
//   ScrollView,
//   TextInput,
//   TouchableOpacity,
//   Platform,
//   Modal,
//   FlatList,
//   Switch,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import { useIsFocused, useNavigation } from "@react-navigation/native";
// import {
//   moderateScale,
//   moderateScaleVertical,
//   textScale,
// } from "../../../../utils/responsiveSize";
// import DateTimePicker, {
//   DateTimePickerAndroid,
// } from "@react-native-community/datetimepicker";
// import DropDown from "../../../../components/DropDown";
// import { decryptAES, encryptWholeObject } from "../../../../utils/decryptData";
// import { apiRequest } from "../../../../services/APIRequest";
// import { API_ROUTES } from "../../../../services/APIRoutes";
// import {
//   showErrorMessage,
//   showSuccessMessage,
// } from "../../../../utils/HelperFunction";
// import WrapperContainer from "../../../../utils/WrapperContainer";
// import InnerHeader from "../../../../components/InnerHeader";
// import Colors from "../../../../utils/Colors";
// import FontFamily from "../../../../utils/FontFamily";
// import Icon from "react-native-vector-icons/MaterialIcons";
// import { getUserData } from "../../../../utils/Storage";

// export default function AddNewDpr({ route }) {
//   const navigation = useNavigation();
//   const [loading, setLoading] = useState(false);
//   const [date, setDate] = useState(new Date());
//   const [show, setShow] = useState(false);
//   const [noOfLabour, setnoOfLabour] = useState(0);
//   const [editNoOfLabour, seteditNoOfLabour] = useState(0);
//   const [debouncedCount, setDebouncedCount] = useState(editNoOfLabour);
//   const [operationList, setOperationList] = useState([]);
//   const [showActivityOperation, setshowActivityOperation] = useState(false);
//   const [userData, setUserData] = useState([]);
//   const [activityOperationVal, setactivityOperationVal] = useState("");
//   const [materialList, setMaterialList] = useState([]);
//   const [activeDropdown, setActiveDropdown] = useState(null);
//   const [materialTypeList, setmaterialTypeList] = useState([
//     "VALUE_ADDED",
//     "PACKAGING_MATERIAL",
//     "AGRO_CHEMICAL",
//     "SEED",
//     "SAPLING",
//   ]);
//   const [rows, setRows] = useState([
//     {
//       id: 1,
//       materialType: "",
//       material: "",
//       noOfItems: "",
//       quantity: "",
//       uom: "",
//       showMaterialType: false,
//       showMaterial: false,
//     },
//   ]);
//   const [equipments, setEquipments] = useState([
//     { id: 1, equipment: "", estHours: "", operatorRequired: false },
//   ]);

//   const [labourOption, setlabourOption] = useState([
//     // {
//     //   id: 1,
//     //   labourName: "",
//     //   estimateHours: "0",
//     // },
//   ]);
//   const [equipmentOptions, setequipmentOptions] = useState([
//     {
//       createdBy: "SYSTEM",
//       createdOn: "2025-04-29T12:10:36.310+05:30",
//       updatedBy: "SYSTEM",
//       updatedOn: "2025-05-01T11:10:39.450+05:30",
//       status: "ACTIVE",
//       id: 1,
//       macShortName: "98",
//       macName: "Furniture AND Fixture(Furniture & Fixtures)",
//       macDesc: "Furniture AND Fixture",
//       costPerHr: 5,
//       remarks: "Machine Data Ported",
//       machineType: {
//         createdBy: "ADMIN",
//         createdOn: "2025-04-11T16:31:38.915+05:30",
//         updatedBy: "SYSTEM",
//         updatedOn: "2025-04-30T19:03:19.231+05:30",
//         status: "ACTIVE",
//         id: 1,
//         macTypeShortName: "FURNITUREANDFIXTURES",
//         macTypeName: "FURNITURE AND FIXTURES",
//       },
//       machineStatus: {
//         createdBy: "SYSTEM",
//         createdOn: "2025-04-29T12:02:45.593+05:30",
//         updatedBy: "SYSTEM",
//         updatedOn: "2025-05-20T13:02:07.417+05:30",
//         status: "ACTIVE",
//         id: 1,
//         macStatusCode: 11,
//         macStatusName: "WORKING",
//       },
//     },
//     {
//       createdBy: "SYSTEM",
//       createdOn: "2025-04-29T12:15:08.864+05:30",
//       updatedBy: "SYSTEM",
//       updatedOn: "2025-05-01T11:12:04.069+05:30",
//       status: "ACTIVE",
//       id: 2,
//       macShortName: "99",
//       macName: "Furniture AND Fixture(Air Cooler, Air Conditioner)",
//       macDesc: "Furniture AND Fixture",
//       costPerHr: 5,
//       remarks: "Machine Data Ported",
//       machineType: {
//         createdBy: "SYSTEM",
//         createdOn: "2025-04-28T16:08:10.677+05:30",
//         updatedBy: "SYSTEM",
//         updatedOn: "2025-04-30T19:01:15.292+05:30",
//         status: "ACTIVE",
//         id: 2,
//         macTypeShortName: "AIRCOOLERAIRCONDITIONERFOROFFICEUSE",
//         macTypeName: "AIR COOLER , AIR CONDITIONER FOR OFFICE USE",
//       },
//       machineStatus: {
//         createdBy: "SYSTEM",
//         createdOn: "2025-04-29T12:02:45.593+05:30",
//         updatedBy: "SYSTEM",
//         updatedOn: "2025-05-20T13:02:07.417+05:30",
//         status: "ACTIVE",
//         id: 1,
//         macStatusCode: 11,
//         macStatusName: "WORKING",
//       },
//     },
//     {
//       createdBy: "SYSTEM",
//       createdOn: "2025-05-01T11:13:18.492+05:30",
//       updatedBy: "SYSTEM",
//       updatedOn: "2025-05-01T11:13:18.492+05:30",
//       status: "ACTIVE",
//       id: 3,
//       macShortName: "100",
//       macName: "FIRE EXTINGUISHER",
//       macDesc: "FIRE EXTINGUISHER",
//       costPerHr: 5,
//       remarks: "Machine Data Ported",
//       machineType: {
//         createdBy: "SYSTEM",
//         createdOn: "2025-04-29T12:17:00.230+05:30",
//         updatedBy: "SYSTEM",
//         updatedOn: "2025-05-20T15:34:58.560+05:30",
//         status: "ACTIVE",
//         id: 3,
//         macTypeShortName: "FIREEXT",
//         macTypeName: "FIRE EXTINGUISHER ",
//       },
//       machineStatus: {
//         createdBy: "SYSTEM",
//         createdOn: "2025-04-29T12:02:45.593+05:30",
//         updatedBy: "SYSTEM",
//         updatedOn: "2025-05-20T13:02:07.417+05:30",
//         status: "ACTIVE",
//         id: 1,
//         macStatusCode: 11,
//         macStatusName: "WORKING",
//       },
//     },
//     {
//       createdBy: "SYSTEM",
//       createdOn: "2025-05-20T12:40:56.940+05:30",
//       updatedBy: "SYSTEM",
//       updatedOn: "2025-05-20T12:40:56.940+05:30",
//       status: "ACTIVE",
//       id: 4,
//       macShortName: "MNO",
//       macName: "Mac Name One",
//       macDesc: "Machine Desc One",
//       costPerHr: 45,
//       remarks: "Testing",
//       machineType: {
//         createdBy: "SYSTEM",
//         createdOn: "2025-04-29T12:17:00.230+05:30",
//         updatedBy: "SYSTEM",
//         updatedOn: "2025-05-20T15:34:58.560+05:30",
//         status: "ACTIVE",
//         id: 3,
//         macTypeShortName: "FIREEXT",
//         macTypeName: "FIRE EXTINGUISHER ",
//       },
//       machineStatus: {
//         createdBy: "SYSTEM",
//         createdOn: "2025-04-29T12:02:45.593+05:30",
//         updatedBy: "SYSTEM",
//         updatedOn: "2025-05-20T13:02:07.417+05:30",
//         status: "ACTIVE",
//         id: 1,
//         macStatusCode: 11,
//         macStatusName: "WORKING",
//       },
//     },
//     {
//       createdBy: "SYSTEM",
//       createdOn: "2025-05-20T15:46:20.075+05:30",
//       updatedBy: "SYSTEM",
//       updatedOn: "2025-05-20T15:46:20.075+05:30",
//       status: "ACTIVE",
//       id: 5,
//       macShortName: "MNT",
//       macName: "Mac Name Two",
//       macDesc: "Machine Desc Two",
//       costPerHr: 47.32,
//       remarks: "Test another record",
//       machineType: {
//         createdBy: "SYSTEM",
//         createdOn: "2025-04-28T16:08:10.677+05:30",
//         updatedBy: "SYSTEM",
//         updatedOn: "2025-04-30T19:01:15.292+05:30",
//         status: "ACTIVE",
//         id: 2,
//         macTypeShortName: "AIRCOOLERAIRCONDITIONERFOROFFICEUSE",
//         macTypeName: "AIR COOLER , AIR CONDITIONER FOR OFFICE USE",
//       },
//       machineStatus: {
//         createdBy: "SYSTEM",
//         createdOn: "2025-04-29T12:02:45.593+05:30",
//         updatedBy: "SYSTEM",
//         updatedOn: "2025-05-20T13:02:07.417+05:30",
//         status: "ACTIVE",
//         id: 1,
//         macStatusCode: 11,
//         macStatusName: "WORKING",
//       },
//     },
//   ]);

//   const isFocused = useIsFocused();
//   const landData = route?.params?.landData;

//   useEffect(() => {
//     if (isFocused) {
//       fetchUserData();
//     }
//   }, [isFocused]);

//   const fetchUserData = async () => {
//     setLoading(true);
//     const userData = await getUserData();
//     console.log("userData", userData);
//     setUserData(userData);
//     getActivityOperationData();
//   };

//   const onChangeDate = (event, selectedDate) => {
//     setShow(false); // hide after selection
//     if (selectedDate) {
//       setDate(selectedDate);
//     }
//   };
//   const getActivityOperationData = async () => {
//     try {
//       const operationPayloadData = {};
//       const encryptedOperationPayload =
//         encryptWholeObject(operationPayloadData);
//       const operationListResponse = await apiRequest(
//         API_ROUTES.OPERATION_MASTER_DD,
//         "POST",
//         encryptedOperationPayload
//       );
//       const decryptedOperationListData = decryptAES(operationListResponse);
//       const parsedDecryptedOperationListData = JSON.parse(
//         decryptedOperationListData
//       );
//       console.log(
//         "parsedDecryptedOperationListData",
//         parsedDecryptedOperationListData
//       );
//       if (
//         parsedDecryptedOperationListData?.status === "SUCCESS" &&
//         parsedDecryptedOperationListData?.statusCode === "200"
//       ) {
//         setOperationList(parsedDecryptedOperationListData?.data || []);
//       } else {
//         showErrorMessage("Unable to get the Operation List Data");
//       }
//     } catch (error) {
//       console.log("parsedDecryptedOperationListData", error);
//       showErrorMessage("Unable to get the Operation List Data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addRow = () => {
//     const newId = rows.length + 1;
//     setRows([
//       ...rows,
//       {
//         id: newId,
//         materialType: "",
//         material: "",
//         noOfItems: "",
//         quantity: "",
//         uom: "",
//         showMaterialType: false,
//         showMaterial: false,
//       },
//     ]);
//   };

//   const removeRow = (id) => {
//     setRows(rows.filter((row) => row.id !== id));
//   };
//   const renderDropdown = (
//     parentId,
//     type,
//     data,
//     isVisible,
//     setVisible,
//     placeholder,
//     value
//   ) => (
//     <View style={styles.inputContainer}>
//       <Text style={styles.label}>{placeholder}</Text>
//       <TouchableOpacity
//         style={styles.dropdownButton}
//         onPress={() => setVisible(!isVisible)}
//       >
//         <Text
//           style={[
//             styles.dropdownButtonText,
//             !value && styles.dropdownButtonPlaceholder,
//             { flex: 1, marginRight: 8 },
//           ]}
//           numberOfLines={1}
//           ellipsizeMode="tail"
//         >
//           {/* {value || `Select ${placeholder}`} */}
//           {typeof value === "object"
//             ? value?.itemName || `Select ${placeholder}`
//             : value || `Select ${placeholder}`}
//         </Text>
//         <Icon name="arrow-drop-down" size={24} color={Colors.grey} />
//       </TouchableOpacity>

//       <Modal
//         visible={isVisible}
//         transparent={true}
//         animationType="fade"
//         onRequestClose={() => setVisible(false)}
//       >
//         <TouchableOpacity
//           style={styles.modalOverlay}
//           activeOpacity={1}
//           onPress={() => setVisible(false)}
//         >
//           <View style={styles.dropdownModal}>
//             <FlatList
//               data={data}
//               keyExtractor={(item, index) => index.toString()}
//               renderItem={({ item }) =>
//                 renderDropdownItem({ item, type, parentId })
//               }
//               style={styles.dropdownList}
//             />
//           </View>
//         </TouchableOpacity>
//       </Modal>
//     </View>
//   );
//   const renderDropdownItem = ({ item, type, parentId }) => (
//     <TouchableOpacity
//       style={styles.dropdownItem}
//       onPress={() => {
//         if (type === "materialType") {
//           fetchMaterialList(item);
//           handleChange(parentId, type, item);
//           handleChange(parentId, `show${capitalize(type)}`, false);
//         } else if (type === "material") {
//           handleChange(parentId, type, item);
//           handleChange(parentId, `show${capitalize(type)}`, false);
//         } else {
//           handleChange(parentId, type, item);
//           handleChange(parentId, `show${capitalize(type)}`, false);
//         }
//       }}
//     >
//       <Text>
//         {typeof item === "object" ? item?.itemName || "Unnamed Item" : item}
//       </Text>
//     </TouchableOpacity>
//   );
//   const handleChange = (id, field, value) => {
//     if (value.uom) {
//       setRows((prev) =>
//         prev.map((row) =>
//           row.id === id
//             ? { ...row, [field]: value, uom: value.uom || "emp" }
//             : row
//         )
//       );
//     } else {
//       setRows((prev) =>
//         prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
//       );
//     }
//   };
//   const fetchMaterialList = async (materialType) => {
//     try {
//       setLoading(true);
//       const payload = {
//         materialType: materialType,
//       };

//       const encryptedPayload = encryptWholeObject(payload);

//       const response = await apiRequest(
//         API_ROUTES.MATERIAL_LIST,
//         "POST",
//         encryptedPayload
//       );

//       const decryptedResponse = decryptAES(response);
//       const parsedResponse = JSON.parse(decryptedResponse);
//       console.log("fetchMaterialList", parsedResponse);
//       if (
//         parsedResponse?.status === "SUCCESS" &&
//         parsedResponse?.statusCode === "200"
//       ) {
//         setMaterialList(parsedResponse?.data);
//       } else {
//         showErrorMessage("Unable to fetch material list");
//       }
//     } catch (error) {
//       console.log("fetchMaterialList", error);
//       console.error("Error fetching material list:", error);
//       showErrorMessage("Error fetching material list");
//     } finally {
//       setLoading(false);
//     }
//   };
//   const addNewEquipment = () => {
//     const newId = equipments.length + 1;
//     setEquipments([
//       ...equipments,
//       { id: newId, equipment: "", estHours: "", operatorRequired: false },
//     ]);
//   };
//   const removeEquipment = (id) => {
//     const updated = equipments.filter((item) => item.id !== id);
//     setEquipments(updated);
//   };

//   const renderEqupmentItem = ({ item, index }) => (
//     <View
//       style={{
//         borderWidth: 1,
//         borderColor: "#ccc",
//         borderRadius: 10,
//         marginBottom: 10,
//       }}
//     >
//       <View
//         style={{
//           flexDirection: "row",
//           justifyContent: "space-between",
//           alignItems: "center",
//           paddingHorizontal: 10,
//           marginVertical: 5,
//         }}
//       >
//         <Text style={styles.serial}>S. No {index + 1}</Text>
//         {equipments?.length > 1 && (
//           <TouchableOpacity onPress={() => removeEquipment(item.id)}>
//             <Icon name="delete" size={24} color={Colors.red} />
//           </TouchableOpacity>
//         )}
//       </View>
//       <View style={styles.devider} />
//       <View style={{ marginHorizontal: 10 }}>
//         <DropDown
//           isVisible={activeDropdown === item.id}
//           setIsVisible={(visible) =>
//             setActiveDropdown(visible ? item.id : null)
//           }
//           value={item.equipment}
//           selectItem={(selected) => {
//             handleChangeEqupment(item.id, "equipment", selected);
//             setActiveDropdown(null);
//           }}
//           data={equipmentOptions}
//         />

//         <View style={{ marginBottom: 8 }}>
//           <Text style={styles.label}>Est. Hours</Text>
//           <TextInput
//             style={{
//               borderWidth: 1,
//               borderColor: Colors.border,
//               borderRadius: 6,
//               paddingHorizontal: 10,
//               height: 40,
//             }}
//             value={item.estHours}
//             placeholder="Enter hours"
//             keyboardType="numeric"
//             onChangeText={(val) =>
//               handleChangeEqupment(item.id, "estHours", val)
//             }
//           />
//         </View>

//         <View
//           style={{
//             flexDirection: "row",
//             alignItems: "center",
//             marginBottom: 8,
//             justifyContent: "space-between",
//           }}
//         >
//           <View
//             style={{
//               flexDirection: "row",
//               alignItems: "center",
//               width: "80%",
//             }}
//           >
//             <Switch
//               value={item.operatorRequired}
//               onValueChange={(val) =>
//                 handleChangeEqupment(item.id, "operatorRequired", val)
//               }
//               trackColor={{ false: "#ccc", true: "lightgreen" }}
//               thumbColor={item.operatorRequired ? "green" : "#f4f3f4"}
//             />
//             <Text
//               style={{
//                 marginLeft: 10,
//                 fontSize: 14,
//                 color: "#333",
//               }}
//             >
//               Operator Required
//             </Text>
//           </View>
//         </View>
//       </View>
//     </View>
//   );
//   const handleChangeEqupment = (id, key, value) => {
//     const updated = equipments.map((item) => {
//       if (value?.id) {
//         return item.id === id
//           ? {
//               ...item,
//               [key]: value?.macName ? value?.macName : value,
//               equipmentId: value?.id,
//             }
//           : item;
//       } else {
//         return item.id === id
//           ? { ...item, [key]: value?.macName ? value?.macName : value }
//           : item;
//       }
//     });

//     setEquipments(updated);
//   };
//   const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

//   const transformRows = (rows) => {
//     const dprAgricultures = rows.map((row) => ({
//       materialType: row.materialType,
//       itemId: row.material?.id,
//       itemName: row.material?.itemName,
//       uom: row.material?.uom || row.uom,
//       noOfItems: row.noOfItems,
//       qty: row.quantity,
//     }));

//     return { dprAgricultures };
//   };

//   const transformMachanicalTools = (equipments) => {
//     const equipmentFormat = equipments.map((equipment) => ({
//       equipmentId: equipment?.equipmentId,
//       equipmentName: equipment?.equipment,
//       operatorName: "",
//       cpNumber: "",
//       actualHours: "",
//       estimatedHours: equipment?.estHours,
//       operatorRequired: equipment?.operatorRequired,
//     }));

//     return { equipmentFormat };
//   };

//   const submitForm = async () => {
//     setLoading(true);
//     const formatedRows = transformRows(rows);
//     const formatedEquipment = transformMachanicalTools(equipments);
//     let data = [
//       {
//         squareName: landData?.squareName,
//         reportDate: date,
//         activityId: activityOperationVal?.id,
//         noOfLabour: noOfLabour,
//         dprAgricultures: formatedRows.dprAgricultures,
//         dprMechanicals: formatedEquipment?.equipmentFormat,
//         activityName: activityOperationVal?.operationName,
//         cultivableArea: landData?.cultivatedArea,
//         planId: landData?.planId,
//         squareId: landData?.squareId,
//         farmPlanId: landData?.farmPlanId,
//         totalArea: landData?.squareArea,
//         unitType: userData?.unitType,
//         chakId: userData?.chakId,
//         farmId: landData?.farmId,
//         farmBlockId: landData?.farmBlockId,
//         chakName: landData?.chakName,
//         farmName: landData?.farmName,
//         farmBlockName: landData?.farmBlockName,
//         currentDprStatus: "PENDING",
//         workshopId: landData?.workshopId,
//       },
//     ];

//     const encryptedPayload = encryptWholeObject(data);
//     const response = await apiRequest(
//       API_ROUTES.SAVE_DPR,
//       "POST",
//       encryptedPayload
//     );

//     const decryptedResponse = decryptAES(response);
//     const parsedResponse = JSON.parse(decryptedResponse);
//     setLoading(false);
//     console.log("parsedResponse___", parsedResponse);

//     if (
//       parsedResponse?.status === "SUCCESS" &&
//       parsedResponse?.statusCode === "200"
//     ) {
//       console.log("parsedResponse___", "if");
//       navigation.goBack();
//       showSuccessMessage(`${parsedResponse?.message} `);
//     } else if (
//       parsedResponse?.status === "FAILED" &&
//       parsedResponse?.statusCode === "300"
//     ) {
//       console.log("parsedResponse___", "else if");
//       showErrorMessage(`${parsedResponse?.message} `);
//     } else {
//       console.log("parsedResponse___", "else");
//       showErrorMessage("Error in filling form");
//     }
//   };
//   return (
//     <WrapperContainer isLoading={loading}>
//       <InnerHeader title={"Add Process Allocation"} />
//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         keyboardVerticalOffset={moderateScaleVertical(
//           Platform.OS === "ios" ? 90 : 10
//         )}
//       >
//         <ScrollView
//           style={styles.container}
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={styles.scrollContent}
//         >
//           <View style={[styles.rowContainer]}>
//             <View style={styles.row}>
//               <View style={styles.inputContainer}>
//                 <Text style={styles.label}>Square</Text>
//                 <TextInput
//                   editable={false}
//                   style={styles.input}
//                   keyboardType="numeric"
//                   value={landData?.squareName}
//                 />
//               </View>

//               <TouchableOpacity
//                 onPress={() => setShow(true)}
//                 style={styles.inputContainer}
//               >
//                 <Text style={styles.label}>Date</Text>
//                 <View style={styles.input}>
//                   <Text>{date.toLocaleDateString()}</Text>
//                 </View>
//               </TouchableOpacity>

//               {show && (
//                 <DateTimePicker
//                   value={date}
//                   mode="date" // "time" or "datetime"
//                   display={Platform.OS === "ios" ? "spinner" : "default"}
//                   onChange={onChangeDate}
//                   maximumDate={new Date(2030, 11, 31)}
//                   minimumDate={new Date(2020, 0, 1)}
//                 />
//               )}

//               <View style={styles.inputContainer}>
//                 <Text style={styles.label}>No. Of Labour</Text>
//                 <TextInput
//                   style={styles.input}
//                   value={noOfLabour}
//                   placeholder="0"
//                   onChangeText={(val) => {
//                     setnoOfLabour(val);
//                   }}
//                 />
//               </View>
//             </View>

//             <View style={styles.row}>
//               <DropDown
//                 isVisible={showActivityOperation}
//                 setIsVisible={() => {
//                   setshowActivityOperation(!showActivityOperation);
//                 }}
//                 data={operationList}
//                 value={
//                   activityOperationVal
//                     ? activityOperationVal?.operationName
//                     : ""
//                 }
//                 selectItem={(item) => {
//                   setactivityOperationVal(item);
//                   setshowActivityOperation(false);
//                 }}
//               />
//             </View>
//             <View
//               style={{
//                 backgroundColor: "#e8f5e9",
//                 padding: 10,
//                 borderRadius: 10,
//                 borderWidth: 2,
//                 borderColor: "#2e7d32",
//                 borderStyle: "dotted",
//                 margin: 10,
//               }}
//             >
//               <View style={styles.row}>
//                 <Text
//                   style={{
//                     color: Colors.black,
//                     fontSize: 18,
//                     marginBottom: 10,
//                   }}
//                 >
//                   Square Detail
//                 </Text>
//               </View>
//               <View style={styles.row}>
//                 <View style={styles.inputContainer}>
//                   <Text style={styles.label}>Production Plan</Text>
//                   <TextInput
//                     style={styles.input}
//                     keyboardType="numeric"
//                     value={landData?.planId}
//                     editable={false}
//                   />
//                 </View>
//               </View>
//               <View style={styles.row}>
//                 <View style={styles.inputContainer}>
//                   <Text style={styles.label}>Total Area</Text>
//                   <TextInput
//                     style={styles.input}
//                     value={landData?.squareArea.toString()}
//                     editable={false}
//                   />
//                 </View>

//                 <View style={styles.inputContainer}>
//                   <Text style={styles.label}>Cultivable Area</Text>
//                   <TextInput
//                     style={styles.input}
//                     keyboardType="numeric"
//                     value={landData?.cultivatedArea.toString()}
//                     editable={false}
//                   />
//                 </View>
//               </View>
//               <View style={styles.row}>
//                 <View style={styles.inputContainer}>
//                   <Text style={styles.label}>Contractor Type</Text>
//                   <TextInput
//                     style={styles.input}
//                     keyboardType="numeric"
//                     value={landData?.contractors?.[0]?.contractorType || "NA"}
//                     editable={false}
//                   />
//                 </View>

//                 <View style={styles.inputContainer}>
//                   <Text style={styles.label}>Contractor</Text>
//                   <TextInput
//                     style={styles.input}
//                     keyboardType="numeric"
//                     value={landData?.contractors?.[0]?.contractorName || "NA"}
//                     editable={false}
//                   />
//                 </View>
//               </View>
//             </View>
//           </View>

//           <View
//             style={{
//               flexDirection: "row",
//               justifyContent: "space-between",
//               alignItems: "center",
//               marginBottom: 20,
//               padding: 10,
//             }}
//           >
//             <Text
//               style={{
//                 color: Colors.greenColor,
//                 fontSize: 18,
//                 fontWeight: "bold",
//               }}
//             >
//               Agriculture Inputs
//             </Text>
//             <TouchableOpacity style={styles.addBtn} onPress={addRow}>
//               <Text style={styles.addText}>+ Add New</Text>
//             </TouchableOpacity>
//           </View>

//           {rows.map((item, index) => (
//             <View key={item.id} style={styles.rowContainer}>
//               <Text style={[styles.serialNo, { margin: 10 }]}>
//                 S. No {index + 1}
//               </Text>
//               <View style={styles.devider} />

//               <View style={styles.row}>
//                 {renderDropdown(
//                   item.id,
//                   "materialType",
//                   materialTypeList,
//                   item.showMaterialType,
//                   (val) => {
//                     handleChange(item.id, "showMaterialType", val);
//                     //await fetchMaterialList(val);
//                   },
//                   "Material Type",
//                   item.materialType
//                 )}
//               </View>
//               <View style={styles.row}>
//                 {renderDropdown(
//                   item.id,
//                   "material",
//                   materialList,
//                   item.showMaterial,
//                   (val) => handleChange(item.id, "showMaterial", val),
//                   "Material",
//                   item.material
//                 )}
//               </View>

//               <View style={styles.row}>
//                 <View style={styles.inputContainer}>
//                   <Text style={styles.label}>No. of Items</Text>
//                   <TextInput
//                     style={styles.input}
//                     keyboardType="numeric"
//                     value={item.noOfItems}
//                     onChangeText={(val) =>
//                       handleChange(item.id, "noOfItems", val)
//                     }
//                   />
//                 </View>

//                 <View style={styles.inputContainer}>
//                   <Text style={styles.label}>Quantity</Text>
//                   <TextInput
//                     style={styles.input}
//                     keyboardType="numeric"
//                     value={item.quantity}
//                     onChangeText={(val) =>
//                       handleChange(item.id, "quantity", val)
//                     }
//                   />
//                 </View>

//                 <View style={styles.inputContainer}>
//                   <Text style={styles.label}>UOM</Text>
//                   <TextInput
//                     editable={false}
//                     style={styles.input}
//                     value={item.uom}
//                     //onChangeText={(val) => handleChange(item.id, "uom", val)}
//                   />
//                 </View>
//               </View>

//               {rows.length > 1 && (
//                 <TouchableOpacity
//                   style={styles.deleteBtn}
//                   onPress={() => removeRow(item.id)}
//                 >
//                   <Icon name="delete" size={24} color={Colors.red} />
//                 </TouchableOpacity>
//               )}
//             </View>
//           ))}

//           <View
//             style={{
//               flexDirection: "row",
//               justifyContent: "space-between",
//               alignItems: "center",
//               marginBottom: 20,
//             }}
//           >
//             <Text
//               style={{
//                 color: Colors.greenColor,
//                 fontSize: 18,
//                 fontWeight: "bold",
//               }}
//             >
//               Equipment & Mechanical Details
//             </Text>
//             <TouchableOpacity style={styles.addBtn} onPress={addNewEquipment}>
//               <Text style={styles.addText}>+ Add New</Text>
//             </TouchableOpacity>
//           </View>
//           <FlatList
//             data={equipments}
//             keyExtractor={(item) => item.id.toString()}
//             renderItem={renderEqupmentItem}
//           />

//           <TouchableOpacity
//             style={styles.addBtn}
//             onPress={() => {
//               submitForm();
//             }}
//           >
//             <Text style={styles.addText}>Submit</Text>
//           </TouchableOpacity>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </WrapperContainer>
//   );
// }

// const styles = StyleSheet.create({
//   addParentButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: Colors.greenColor,
//     padding: moderateScale(12),
//     borderRadius: moderateScale(5),
//     //marginBottom: moderateScaleVertical(16),
//   },
//   addParentButtonText: {
//     color: Colors.white,
//     fontSize: textScale(14),
//     fontFamily: FontFamily.PoppinsMedium,
//     marginLeft: moderateScale(8),
//   },
//   container: {
//     flex: 1,
//   },
//   scrollContent: {
//     padding: moderateScale(8),
//     paddingBottom: moderateScale(20),
//   },
//   listContainer: {
//     padding: moderateScale(15),
//     paddingBottom: moderateScaleVertical(20),
//   },

//   itemCard: {
//     backgroundColor: Colors.white,
//     borderRadius: moderateScale(8),
//     padding: moderateScale(16),
//     marginBottom: moderateScaleVertical(16),
//     shadowColor: Colors.black,
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 3.84,
//     elevation: moderateScale(5),
//   },
//   itemRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: moderateScaleVertical(12),
//   },
//   itemColumn: {
//     flex: 1,
//     marginRight: moderateScale(8),
//   },
//   itemLabel: {
//     fontSize: textScale(12),
//     fontFamily: FontFamily.PoppinsRegular,
//     color: Colors.gray,
//     marginBottom: moderateScaleVertical(2),
//     textTransform: "capitalize",
//   },
//   itemValue: {
//     fontSize: textScale(14),
//     fontFamily: FontFamily.PoppinsMedium,
//     color: Colors.textColor,
//     textTransform: "capitalize",
//   },
//   statusBadge: {
//     paddingHorizontal: moderateScale(12),
//     paddingVertical: moderateScaleVertical(4),
//     borderRadius: moderateScale(5),
//   },
//   statusText: {
//     fontSize: textScale(11),
//     fontFamily: FontFamily.PoppinsRegular,
//     color: Colors.white,
//   },
//   cardHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: moderateScaleVertical(12),
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.diabledColor,
//     paddingBottom: moderateScaleVertical(8),
//   },
//   dateText: {
//     fontSize: textScale(13),
//     fontFamily: FontFamily.PoppinsRegular,
//     color: Colors.textColor,
//     textTransform: "capitalize",
//   },
//   bottomSheetContent: {
//     gap: moderateScaleVertical(8),
//   },
//   bottomSheetButton: {
//     backgroundColor: Colors.greenColor,
//     padding: moderateScaleVertical(12),
//     borderRadius: moderateScale(8),
//     alignItems: "center",
//   },
//   bottomSheetButtonText: {
//     color: Colors.white,
//     fontSize: textScale(14),
//     fontFamily: FontFamily.PoppinsMedium,
//   },
//   notificationHolder: {
//     borderWidth: 2,
//     width: moderateScale(50),
//     height: moderateScale(50),
//     borderRadius: moderateScale(25),
//     backgroundColor: Colors.bg3,
//     borderColor: Colors.bg3,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   notificationHolder: {
//     borderWidth: 2,
//     width: moderateScale(50),
//     height: moderateScale(50),
//     borderRadius: moderateScale(25),
//     backgroundColor: Colors.greenColor,
//     borderColor: Colors.greenColor,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   ////////

//   devider: {
//     backgroundColor: "#ddd",
//     height: 1,
//     width: "100%",
//   },

//   rowContainer: {
//     backgroundColor: "#fff",
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 10,
//     marginBottom: 12,
//     position: "relative",
//   },
//   serialNo: {
//     fontWeight: "600",
//     marginBottom: 8,
//   },
//   row: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingHorizontal: 10,
//   },
//   inputContainer: {
//     flex: 1,
//     marginRight: 8,
//     marginBottom: 10,
//   },
//   label: {
//     fontSize: 14,
//     color: Colors.grey,
//     marginBottom: 4,
//     fontWeight: "700",
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: Colors.border,
//     borderRadius: 6,
//     padding: 8,
//   },
//   dropdownButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: Colors.border,
//     borderRadius: 6,
//     padding: 10,
//   },
//   dropdownButtonText: {
//     color: "#000",
//   },
//   dropdownButtonPlaceholder: {
//     color: Colors.grey,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.3)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   dropdownModal: {
//     backgroundColor: "#fff",
//     width: "80%",
//     borderRadius: 10,
//     paddingVertical: 10,
//   },
//   dropdownItem: {
//     padding: 12,
//     borderBottomWidth: 1,
//     borderColor: "#eee",
//   },
//   addBtn: {
//     backgroundColor: "#e8f5e9",
//     borderColor: Colors.green,
//     borderWidth: 1,
//     borderRadius: 10,
//     alignItems: "center",
//     padding: 12,
//     marginTop: 10,
//   },
//   addText: {
//     color: Colors.green,
//     fontWeight: "600",
//   },
//   deleteBtn: {
//     position: "absolute",
//     right: 10,
//     top: 10,
//   },

//   /// equipment
//   serial: { fontWeight: "bold", marginBottom: 6 },
//   pickerContainer: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 8,
//     marginBottom: 8,
//   },
//   //label: { fontSize: 12, color: "#555", marginLeft: 5, marginTop: 4 },
//   //inputContainer: { marginBottom: 8 },
//   // input: {
//   //   borderWidth: 1,
//   //   borderColor: "#ccc",
//   //   borderRadius: 8,
//   //   paddingHorizontal: 10,
//   //   height: 40,
//   // },
//   checkboxContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 8,
//   },
// });

import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  Modal,
  FlatList,
  Switch,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from "../../../../utils/responsiveSize";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import DropDown from "../../../../components/DropDown";
import { decryptAES, encryptWholeObject } from "../../../../utils/decryptData";
import { apiRequest } from "../../../../services/APIRequest";
import { API_ROUTES } from "../../../../services/APIRoutes";
import {
  showErrorMessage,
  showSuccessMessage,
} from "../../../../utils/HelperFunction";
import WrapperContainer from "../../../../utils/WrapperContainer";
import InnerHeader from "../../../../components/InnerHeader";
import Colors from "../../../../utils/Colors";
import FontFamily from "../../../../utils/FontFamily";
import Icon from "react-native-vector-icons/MaterialIcons";
import { getUserData } from "../../../../utils/Storage";

export default function AddNewDpr({ route }) {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [noOfLabour, setnoOfLabour] = useState("0"); // keep as string for TextInput
  const [editNoOfLabour, seteditNoOfLabour] = useState(0);
  const [debouncedCount, setDebouncedCount] = useState(editNoOfLabour);
  const [operationList, setOperationList] = useState([]);
  const [showActivityOperation, setshowActivityOperation] = useState(false);
  const [userData, setUserData] = useState([]);
  const [activityOperationVal, setactivityOperationVal] = useState("");
  const [materialList, setMaterialList] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [materialTypeList, setmaterialTypeList] = useState([
    "VALUE_ADDED",
    "PACKAGING_MATERIAL",
    "AGRO_CHEMICAL",
    "SEED",
    "SAPLING",
  ]);
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
  const [equipments, setEquipments] = useState([
    { id: 1, equipment: "", estHours: "", operatorRequired: false },
  ]);

  const [labourOption, setlabourOption] = useState([]);
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

  const isFocused = useIsFocused();
  const landData = route?.params?.landData;

  // errors object to store validation messages
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isFocused) {
      fetchUserData();
    }
  }, [isFocused]);

  const fetchUserData = async () => {
    setLoading(true);
    const userData = await getUserData();
    console.log("userData", userData);
    setUserData(userData);
    getActivityOperationData();
  };

  const onChangeDate = (event, selectedDate) => {
    setShow(false); // hide after selection
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const getActivityOperationData = async () => {
    try {
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
    } catch (error) {
      console.log("parsedDecryptedOperationListData", error);
      showErrorMessage("Unable to get the Operation List Data");
    } finally {
      setLoading(false);
    }
  };

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
    // remove any errors associated with that row
    setErrors((prev) => {
      const copy = { ...prev };
      Object.keys(copy).forEach((k) => {
        if (k.includes(`_${id - 1}`) || k.includes(`_${id}`)) {
          // remove keys matching pattern - best-effort
          delete copy[k];
        }
      });
      return copy;
    });
  };

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
        style={[
          styles.dropdownButton,
          // apply red border if error exists for corresponding field
          (type === "materialType" &&
            errors[`materialType_${parentId}`] &&
            styles.inputError) ||
            (type === "material" &&
              errors[`material_${parentId}`] &&
              styles.inputError),
        ]}
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

      {/* inline error */}
      {type === "materialType" && errors[`materialType_${parentId}`] && (
        <Text style={styles.errorText}>
          {errors[`materialType_${parentId}`]}
        </Text>
      )}
      {type === "material" && errors[`material_${parentId}`] && (
        <Text style={styles.errorText}>{errors[`material_${parentId}`]}</Text>
      )}
    </View>
  );

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

  const handleChange = (id, field, value) => {
    // Clear field-specific error when user changes it
    setErrors((prev) => {
      const copy = { ...prev };
      const key = `${field}_${id}`;
      if (copy[key]) delete copy[key];
      return copy;
    });

    if (value && value.uom) {
      setRows((prev) =>
        prev.map((row) =>
          row.id === id
            ? { ...row, [field]: value, uom: value.uom || row.uom || "" }
            : row
        )
      );
    } else {
      setRows((prev) =>
        prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
      );
    }
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
      console.log("fetchMaterialList", parsedResponse);
      if (
        parsedResponse?.status === "SUCCESS" &&
        parsedResponse?.statusCode === "200"
      ) {
        setMaterialList(parsedResponse?.data);
      } else {
        showErrorMessage("Unable to fetch material list");
      }
    } catch (error) {
      console.log("fetchMaterialList", error);
      console.error("Error fetching material list:", error);
      showErrorMessage("Error fetching material list");
    } finally {
      setLoading(false);
    }
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
    // remove related errors
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[`equipment_${id}`];
      delete copy[`estHours_${id}`];
      return copy;
    });
  };

  const renderEqupmentItem = ({ item, index }) => (
    <View
      style={{
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        marginBottom: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 10,
          marginVertical: 5,
        }}
      >
        <Text style={styles.serial}>S. No {index + 1}</Text>
        {equipments?.length > 1 && (
          <TouchableOpacity onPress={() => removeEquipment(item.id)}>
            <Icon name="delete" size={24} color={Colors.red} />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.devider} />
      <View style={{ marginHorizontal: 10 }}>
        <DropDown
          isVisible={activeDropdown === item.id}
          setIsVisible={(visible) =>
            setActiveDropdown(visible ? item.id : null)
          }
          value={item.equipment}
          selectItem={(selected) => {
            handleChangeEqupment(item.id, "equipment", selected);
            setActiveDropdown(null);
          }}
          data={equipmentOptions}
        />

        {errors[`equipment_${item.id}`] && (
          <Text style={styles.errorText}>{errors[`equipment_${item.id}`]}</Text>
        )}

        <View style={{ marginBottom: 8 }}>
          <Text style={styles.label}>Est. Hours</Text>
          <TextInput
            style={[
              {
                borderWidth: 1,
                borderColor: Colors.border,
                borderRadius: 6,
                paddingHorizontal: 10,
                height: 40,
              },
              errors[`estHours_${item.id}`] && styles.inputError,
            ]}
            value={item.estHours}
            placeholder="Enter hours"
            keyboardType="numeric"
            onChangeText={(val) =>
              handleChangeEqupment(item.id, "estHours", val)
            }
          />
          {errors[`estHours_${item.id}`] && (
            <Text style={styles.errorText}>
              {errors[`estHours_${item.id}`]}
            </Text>
          )}
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
    </View>
  );

  const handleChangeEqupment = (id, key, value) => {
    // clear errors for equipment field
    setErrors((prev) => {
      const copy = { ...prev };
      const eqKey = `${key}_${id}`;
      if (copy[eqKey]) delete copy[eqKey];
      return copy;
    });

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

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

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

  const validateForm = () => {
    let tempErrors = {};

    // Activity must be selected
    if (!activityOperationVal?.id) {
      tempErrors.activity = "Please select activity";
    }

    // No of labour
    const labourNum = Number(noOfLabour);
    if (
      noOfLabour === "" ||
      isNaN(labourNum) ||
      !isFinite(labourNum) ||
      labourNum <= 0
    ) {
      tempErrors.noOfLabour = "Enter valid labour count (greater than 0)";
    }

    // Agriculture rows
    rows.forEach((row, idx) => {
      const id = row.id;
      if (!row.materialType) {
        tempErrors[`materialType_${id}`] = "Select Material Type";
      }
      if (!row.material || !row.material?.id) {
        tempErrors[`material_${id}`] = "Select Material";
      }
      if (!row.noOfItems || Number(row.noOfItems) <= 0) {
        tempErrors[`noOfItems_${id}`] = "Enter valid No. of items";
      }
      if (!row.quantity || Number(row.quantity) <= 0) {
        tempErrors[`quantity_${id}`] = "Enter valid Quantity";
      }
    });

    // Equipment rows
    equipments.forEach((eq, idx) => {
      const id = eq.id;
      if (!eq.equipment || !eq.equipmentId) {
        tempErrors[`equipment_${id}`] = "Select equipment";
      }
      if (!eq.estHours || Number(eq.estHours) <= 0) {
        tempErrors[`estHours_${id}`] = "Enter valid estimated hours";
      }
    });

    setErrors(tempErrors);

    // scroll/ focus logic could be added here to focus first error
    return Object.keys(tempErrors).length === 0;
  };

  const submitForm = async () => {
    if (!validateForm()) {
      showErrorMessage("Please fix all errors");
      return;
    }

    setLoading(true);
    const formatedRows = transformRows(rows);
    const formatedEquipment = transformMachanicalTools(equipments);
    let data = [
      {
        squareName: landData?.squareName,
        reportDate: date,
        activityId: activityOperationVal?.id,
        noOfLabour: Number(noOfLabour),
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

    try {
      const encryptedPayload = encryptWholeObject(data);
      const response = await apiRequest(
        API_ROUTES.SAVE_DPR,
        "POST",
        encryptedPayload
      );

      const decryptedResponse = decryptAES(response);
      const parsedResponse = JSON.parse(decryptedResponse);
      setLoading(false);
      console.log("parsedResponse___", parsedResponse);

      if (
        parsedResponse?.status === "SUCCESS" &&
        parsedResponse?.statusCode === "200"
      ) {
        console.log("parsedResponse___", "if");
        navigation.goBack();
        showSuccessMessage(`${parsedResponse?.message} `);
      } else if (
        parsedResponse?.status === "FAILED" &&
        parsedResponse?.statusCode === "300"
      ) {
        console.log("parsedResponse___", "else if");
        showErrorMessage(`${parsedResponse?.message} `);
      } else {
        console.log("parsedResponse___", "else");
        showErrorMessage("Error in filling form");
      }
    } catch (err) {
      setLoading(false);
      console.log("submit error", err);
      showErrorMessage("Error submitting form");
    }
  };

  return (
    <WrapperContainer isLoading={loading}>
      <InnerHeader title={"Add Process Allocation"} />
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
                  style={[styles.input, errors.noOfLabour && styles.inputError]}
                  value={noOfLabour}
                  placeholder="0"
                  keyboardType="numeric"
                  onChangeText={(val) => {
                    // allow only numbers and decimal point
                    const cleaned = val.replace(/[^0-9.]/g, "");
                    setnoOfLabour(cleaned);
                    if (errors.noOfLabour) {
                      setErrors((prev) => {
                        const copy = { ...prev };
                        delete copy.noOfLabour;
                        return copy;
                      });
                    }
                  }}
                />
                {errors.noOfLabour && (
                  <Text style={styles.errorText}>{errors.noOfLabour}</Text>
                )}
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
                  // clear activity error
                  setErrors((prev) => {
                    const copy = { ...prev };
                    delete copy.activity;
                    return copy;
                  });
                }}
              />
            </View>
            {errors.activity && (
              <Text style={[styles.errorText, { marginLeft: 12 }]}>
                {errors.activity}
              </Text>
            )}
            <View
              style={{
                backgroundColor: "#e8f5e9",
                padding: 10,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: "#2e7d32",
                borderStyle: "dotted",
                margin: 10,
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
                    value={landData?.squareArea?.toString()}
                    editable={false}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Cultivable Area</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={landData?.cultivatedArea?.toString()}
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
              padding: 10,
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
              <Text style={[styles.serialNo, { margin: 10 }]}>
                S. No {index + 1}
              </Text>
              <View style={styles.devider} />

              <View style={styles.row}>
                {renderDropdown(
                  item.id,
                  "materialType",
                  materialTypeList,
                  item.showMaterialType,
                  (val) => {
                    handleChange(item.id, "showMaterialType", val);
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
                    style={[
                      styles.input,
                      errors[`noOfItems_${item.id}`] && styles.inputError,
                    ]}
                    keyboardType="numeric"
                    value={item.noOfItems}
                    onChangeText={(val) => {
                      const cleaned = val.replace(/[^0-9.]/g, "");
                      handleChange(item.id, "noOfItems", cleaned);
                    }}
                  />
                  {errors[`noOfItems_${item.id}`] && (
                    <Text style={styles.errorText}>
                      {errors[`noOfItems_${item.id}`]}
                    </Text>
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Quantity</Text>
                  <TextInput
                    style={[
                      styles.input,
                      errors[`quantity_${item.id}`] && styles.inputError,
                    ]}
                    keyboardType="numeric"
                    value={item.quantity}
                    onChangeText={(val) => {
                      const cleaned = val.replace(/[^0-9.]/g, "");
                      handleChange(item.id, "quantity", cleaned);
                    }}
                  />
                  {errors[`quantity_${item.id}`] && (
                    <Text style={styles.errorText}>
                      {errors[`quantity_${item.id}`]}
                    </Text>
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>UOM</Text>
                  <TextInput
                    editable={false}
                    style={styles.input}
                    value={item.uom}
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

  devider: {
    backgroundColor: "#ddd",
    height: 1,
    width: "100%",
  },

  rowContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
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
    paddingHorizontal: 10,
  },
  inputContainer: {
    flex: 1,
    marginRight: 8,
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: Colors.grey,
    marginBottom: 4,
    fontWeight: "700",
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

  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  // Error styles
  inputError: {
    borderColor: Colors.red,
    borderWidth: 1.6,
  },
  errorText: {
    color: Colors.red,
    fontSize: 12,
    marginTop: 4,
  },
});
