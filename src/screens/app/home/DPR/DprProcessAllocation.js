// import {
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   FlatList,
// } from "react-native";
// import React, { useState, useEffect } from "react";
// import WrapperContainer from "../../../../utils/WrapperContainer";
// import InnerHeader from "../../../../components/InnerHeader";
// import {
//   moderateScale,
//   moderateScaleVertical,
//   scale,
//   textScale,
// } from "../../../../utils/responsiveSize";
// import FontFamily from "../../../../utils/FontFamily";
// import Colors from "../../../../utils/Colors";
// import CustomButton from "../../../../components/CustomButton";
// import { useIsFocused, useNavigation } from "@react-navigation/native";
// import Icon from "react-native-vector-icons/MaterialIcons";
// import { apiRequest } from "../../../../services/APIRequest";
// import { API_ROUTES } from "../../../../services/APIRoutes";
// import { getUserData } from "../../../../utils/Storage";
// import { decryptAES, encryptWholeObject } from "../../../../utils/decryptData";
// import {
//   showErrorMessage,
//   showSuccessMessage,
// } from "../../../../utils/HelperFunction";
// import en from "../../../../constants/en";
// import CustomBottomSheet from "../../../../components/CustomBottomSheet";

// export default function DprProcessAllocation({ route }) {
//   const navigation = useNavigation();
//   const [loading, setLoading] = useState(false);
//   const [activityList, setactivityList] = useState([]);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
//   const [userData, setUserData] = useState([]);
//   const [showAddNewButton, setshowAddNewButton] = useState(false);

//   const isFocused = useIsFocused();
//   const landData = route?.params?.landData;
//   console.log("landData", landData);

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
//     //getActivityOperationData();
//     await fetchActivityList(userData);
//   };

//   const fetchActivityList = async (userData) => {
//     setLoading(false);
//     try {
//       const payloadData = {
//         page: 0,
//         pageSize: 100,
//         squareId: landData?.squareId,
//       };

//       // console.log("parsedDecrypted", payloadData);
//       const encryptedPayload = encryptWholeObject(payloadData);
//       const response = await apiRequest(
//         API_ROUTES.GET_DPR_HISTORY,
//         "post",
//         encryptedPayload
//       );

//       const decrypted = decryptAES(response);
//       const parsedDecrypted = JSON.parse(decrypted);

//       if (
//         parsedDecrypted?.status === "SUCCESS" &&
//         parsedDecrypted?.statusCode === "200"
//       ) {
//         setactivityList(parsedDecrypted?.data);
//         if (parsedDecrypted?.data.length > 0 && userData?.unitType == "CHAK") {
//           let findPendingAct = parsedDecrypted?.data.find(
//             (item) => item?.currentDprStatus == "PENDING"
//           );

//           if (findPendingAct) {
//             setshowAddNewButton(false);
//           } else {
//             setshowAddNewButton(true);
//           }
//         } else {
//           setshowAddNewButton(false);
//         }
//       } else {
//         showErrorMessage(parsedDecrypted?.message || "Not getting Data");
//       }
//     } catch (error) {
//       console.log("parsedDecrypted", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "SUBMITTED":
//         return Colors.greenColor;
//       case "APPROVED":
//         return Colors.orange;
//       case "PENDING":
//         return Colors.blue;
//       case "DONE":
//         return Colors.greenThemeColor;
//       case "REJECTED":
//         return Colors.redThemeColor;
//       default:
//         return Colors.gray;
//     }
//   };

//   const formatDate = (isoString) => {
//     const date = new Date(isoString);
//     const day = String(date.getDate()).padStart(2, "0");
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const year = date.getFullYear();
//     return `${day}-${month}-${year}`;
//   };

//   const handleCardPress = (item) => {
//     setSelectedItem(item);
//     setBottomSheetVisible(true);
//   };

//   const RenderCard = ({ item, index, getStatusColor, handleCardPress }) => {
//     return (
//       <TouchableOpacity
//         onPress={() => {
//           handleCardPress(item);
//         }}
//         style={styles.itemCard}
//       >
//         <View style={styles.cardHeader}>
//           <Text style={styles.dateText}>{item.squareName}</Text>
//           <View
//             style={[
//               styles.statusBadge,
//               { backgroundColor: getStatusColor(item.currentDprStatus) },
//             ]}
//           >
//             <Text style={styles.statusText}>{item.currentDprStatus}</Text>
//           </View>
//         </View>

//         <View>
//           <View style={styles.itemRow}>
//             <View style={styles.itemColumn}>
//               <Text style={styles.itemLabel}>Plan Id</Text>
//               <Text style={styles.itemValue}>{item?.planId || "N/A"}</Text>
//             </View>
//           </View>
//           <View style={styles.itemRow}>
//             <View style={styles.itemColumn}>
//               <Text style={styles.itemLabel}>Square Name</Text>
//               <Text style={styles.itemValue}>{item?.squareName || "N/A"}</Text>
//             </View>
//             <View style={styles.itemColumn}>
//               <Text style={styles.itemLabel}>Process Date</Text>
//               <Text style={styles.itemValue}>
//                 {formatDate(item?.reportDate) || "N/A"}
//               </Text>
//             </View>
//           </View>
//           <View style={styles.itemRow}>
//             <View style={styles.itemColumn}>
//               <Text style={styles.itemLabel}>Activity/Oper.</Text>
//               <Text style={styles.itemValue}>
//                 {item?.activityName || "N/A"}
//               </Text>
//             </View>
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const handleBottomSheetAction = (type) => {
//     if (type == "Details") {
//       setBottomSheetVisible(!bottomSheetVisible);
//       navigation.navigate("ViewDprDetail", { selectedItem: selectedItem });
//     }

//     console.log("selectedItem___", selectedItem);
//   };

//   const approveOrRejectRequest = async (status) => {
//     try {
//       setLoading(true);
//       const payloadData = [
//         {
//           ...selectedItem,
//           currentDprStatus: status,
//           equipment: status === "APPROVED" ? true : null,
//           unitType: userData?.unitType,
//         },
//       ];
//       console.log("payloadData", payloadData);
//       const encryptedPayload = encryptWholeObject(payloadData);
//       const response = await apiRequest(
//         API_ROUTES.UPDATE_DPR,
//         "POST",
//         encryptedPayload
//       );
//       const decrypted = decryptAES(response);
//       const parsedDecrypted = JSON.parse(decrypted);
//       console.log("payloadData", parsedDecrypted);
//       if (
//         parsedDecrypted?.status === "SUCCESS" &&
//         parsedDecrypted?.statusCode === "200"
//       ) {
//         showSuccessMessage(parsedDecrypted?.message || "success");
//         setBottomSheetVisible(!bottomSheetVisible);
//         fetchUserData();
//       } else {
//         showErrorMessage(`${parsedDecrypted?.message}` || "Error");
//       }
//     } catch (error) {
//       console.log(error, "payloadData");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <WrapperContainer isLoading={loading}>
//       <InnerHeader
//         title={"Process Allocation"}
//         rightIcon={
//           showAddNewButton && (
//             <TouchableOpacity
//               onPress={() => {
//                 navigation.navigate("AddNewDpr", {
//                   landData: landData,
//                 });
//               }}
//               style={styles.notificationHolder}
//             >
//               <Icon name="add" size={moderateScale(25)} color={Colors.white} />
//             </TouchableOpacity>
//           )
//         }
//       />

//       <>
//         <FlatList
//           data={activityList}
//           renderItem={({ item, index }) => (
//             <RenderCard
//               getStatusColor={getStatusColor}
//               index={index}
//               item={item}
//               handleCardPress={handleCardPress}
//             />
//           )}
//           keyExtractor={(item) => item.id?.toString()}
//           contentContainerStyle={styles.listContainer}
//           showsVerticalScrollIndicator={false}
//           ListEmptyComponent={
//             <View style={styles.emptyContainer}>
//               <Text style={styles.emptyText}>
//                 {en.DAILY_PROGRESS_REPORT.NO_DATA}
//               </Text>
//             </View>
//           }
//         />
//         <CustomBottomSheet
//           visible={bottomSheetVisible}
//           onRequestClose={() => setBottomSheetVisible(false)}
//         >
//           <View style={styles.bottomSheetContent}>
//             <Text style={styles.headerText}>
//               {en.DAILY_PROGRESS_REPORT.SELECT_ACTION}
//             </Text>
//             <CustomButton
//               text={en.DAILY_PROGRESS_REPORT.VIEW_DETAILS}
//               buttonStyle={[
//                 styles.bottomSheetButton,
//                 { backgroundColor: Colors.lightGray },
//               ]}
//               textStyle={styles.bottomSheetButtonText}
//               handleAction={() => handleBottomSheetAction("Details")}
//             />

//             {userData?.unitType === "FARM_BLOCK" &&
//               selectedItem?.currentDprStatus === "PENDING" &&
//               userData?.subUnitType != "WORKSHOP" && (
//                 <CustomButton
//                   text={"Approve"}
//                   buttonStyle={styles.bottomSheetButton}
//                   textStyle={styles.bottomSheetButtonText}
//                   handleAction={() => approveOrRejectRequest("APPROVED")}
//                 />
//               )}
//             {userData?.unitType === "FARM_BLOCK" &&
//               selectedItem?.currentDprStatus === "PENDING" &&
//               userData?.subUnitType != "WORKSHOP" && (
//                 <CustomButton
//                   text={"Reject"}
//                   buttonStyle={[
//                     styles.bottomSheetButton,
//                     { backgroundColor: Colors.red },
//                   ]}
//                   textStyle={styles.bottomSheetButtonText}
//                   handleAction={() => approveOrRejectRequest("REJECTED")}
//                 />
//               )}
//           </View>
//         </CustomBottomSheet>
//       </>
//     </WrapperContainer>
//   );
// }

// const styles = StyleSheet.create({
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
//   // notificationHolder: {
//   //   borderWidth: 2,
//   //   width: moderateScale(50),
//   //   height: moderateScale(50),
//   //   borderRadius: moderateScale(25),
//   //   backgroundColor: Colors.bg3,
//   //   borderColor: Colors.bg3,
//   //   alignItems: "center",
//   //   justifyContent: "center",
//   // },
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
// });

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import WrapperContainer from "../../../../utils/WrapperContainer";
import InnerHeader from "../../../../components/InnerHeader";
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from "../../../../utils/responsiveSize";
import FontFamily from "../../../../utils/FontFamily";
import Colors from "../../../../utils/Colors";
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

export default function DprProcessAllocation({ route }) {
  const navigation = useNavigation();

  // ------------------- STATES -------------------
  const [loading, setLoading] = useState(false);
  const [activityList, setActivityList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [userData, setUserData] = useState([]);
  const [showAddNewButton, setShowAddNewButton] = useState(false);

  // Pagination States
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const isFocused = useIsFocused();
  const landData = route?.params?.landData;

  // ------------------- INITIAL FETCH -------------------
  useEffect(() => {
    if (isFocused) {
      resetPaginationAndFetch();
    }
  }, [isFocused]);

  const resetPaginationAndFetch = async () => {
    setPage(0);
    setHasMore(true);
    setActivityList([]);
    await fetchUserData(0, false);
  };

  const fetchUserData = async (currentPage = 0, isLoadMore = false) => {
    const data = await getUserData();
    setUserData(data);
    fetchActivityList(data, currentPage, isLoadMore);
  };

  // ------------------- API: FETCH ACTIVITY LIST -------------------
  const fetchActivityList = async (uData, currentPage, isLoadMore) => {
    if (isLoadMore) setIsFetchingMore(true);
    else setLoading(true);

    try {
      const payloadData = {
        page: currentPage,
        pageSize: 10,
        squareId: landData?.squareId,
      };

      const encryptedPayload = encryptWholeObject(payloadData);

      const response = await apiRequest(
        API_ROUTES.GET_DPR_HISTORY,
        "post",
        encryptedPayload
      );

      const decrypted = decryptAES(response);
      const parsed = JSON.parse(decrypted);

      if (parsed?.status === "SUCCESS" && parsed?.statusCode === "200") {
        const newData = parsed?.data || [];

        if (isLoadMore) {
          setActivityList((prev) => [...prev, ...newData]);
        } else {
          setActivityList(newData);
        }

        // NO MORE DATA?
        if (newData.length < 10) setHasMore(false);

        // CHAK RULE FOR ADD BUTTON
        if (!isLoadMore) {
          if (newData.length > 0 && uData?.unitType === "CHAK") {
            const findPending = newData.find(
              (i) => i?.currentDprStatus === "PENDING"
            );
            setShowAddNewButton(!findPending);
          } else {
            setShowAddNewButton(false);
          }
        }
      } else {
        showErrorMessage(parsed?.message || "Invalid response");
      }
    } catch (err) {
      console.log("Fetch error", err);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  // ------------------- STATUS COLOR -------------------
  const getStatusColor = (status) => {
    switch (status) {
      case "SUBMITTED":
        return Colors.greenColor;
      case "APPROVED":
        return Colors.orange;
      case "PENDING":
        return Colors.blue;
      case "DONE":
        return Colors.greenThemeColor;
      case "REJECTED":
        return Colors.redThemeColor;
      default:
        return Colors.gray;
    }
  };

  // ------------------- DATE FORMAT -------------------
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;
  };

  // ------------------- CARD PRESS -------------------
  const handleCardPress = (item) => {
    setSelectedItem(item);
    setBottomSheetVisible(true);
  };

  // ------------------- BOTTOM SHEET ACTION -------------------
  const handleBottomSheetAction = (type) => {
    if (type === "Details") {
      setBottomSheetVisible(false);
      navigation.navigate("ViewDprDetail", { selectedItem });
    }
  };

  // ------------------- APPROVE / REJECT -------------------
  const approveOrRejectRequest = async (status) => {
    try {
      setLoading(true);

      const payload = [
        {
          ...selectedItem,
          currentDprStatus: status,
          equipment: status === "APPROVED" ? true : null,
          unitType: userData?.unitType,
        },
      ];

      const encrypted = encryptWholeObject(payload);

      const response = await apiRequest(
        API_ROUTES.UPDATE_DPR,
        "POST",
        encrypted
      );

      const decrypted = decryptAES(response);
      const parsed = JSON.parse(decrypted);

      if (parsed?.status === "SUCCESS" && parsed?.statusCode === "200") {
        showSuccessMessage(parsed?.message || "Success");
        setBottomSheetVisible(false);
        resetPaginationAndFetch();
      } else {
        showErrorMessage(parsed?.message || "Error");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // ------------------- CARD RENDER -------------------
  const RenderCard = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleCardPress(item)}
      style={styles.itemCard}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.dateText}>{item.squareName}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.currentDprStatus) },
          ]}
        >
          <Text style={styles.statusText}>{item.currentDprStatus}</Text>
        </View>
      </View>

      <View>
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
            <Text style={styles.itemValue}>{formatDate(item?.reportDate)}</Text>
          </View>
        </View>

        <View style={styles.itemRow}>
          <View style={styles.itemColumn}>
            <Text style={styles.itemLabel}>Activity/Oper.</Text>
            <Text style={styles.itemValue}>{item?.activityName || "N/A"}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  // ------------------- ON END REACHED -------------------
  const loadMoreData = () => {
    if (hasMore && !isFetchingMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchActivityList(userData, nextPage, true);
    }
  };

  // ------------------- UI -------------------
  return (
    <WrapperContainer isLoading={loading}>
      <InnerHeader
        title={"Process Allocation"}
        rightIcon={
          showAddNewButton && (
            <TouchableOpacity
              onPress={() => navigation.navigate("AddNewDpr", { landData })}
              style={styles.notificationHolder}
            >
              <Icon name="add" size={25} color={Colors.white} />
            </TouchableOpacity>
          )
        }
      />

      <FlatList
        data={activityList}
        renderItem={({ item }) => <RenderCard item={item} />}
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
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingMore ? (
            <View style={{ padding: 15, alignItems: "center" }}>
              <Text>Loading more...</Text>
            </View>
          ) : null
        }
      />

      {/* Bottom Sheet */}
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

          {userData?.unitType === "FARM_BLOCK" &&
            selectedItem?.currentDprStatus === "PENDING" &&
            userData?.subUnitType !== "WORKSHOP" && (
              <>
                <CustomButton
                  text={"Approve"}
                  buttonStyle={styles.bottomSheetButton}
                  textStyle={styles.bottomSheetButtonText}
                  handleAction={() => approveOrRejectRequest("APPROVED")}
                />
                <CustomButton
                  text={"Reject"}
                  buttonStyle={[
                    styles.bottomSheetButton,
                    { backgroundColor: Colors.red },
                  ]}
                  textStyle={styles.bottomSheetButtonText}
                  handleAction={() => approveOrRejectRequest("REJECTED")}
                />
              </>
            )}
        </View>
      </CustomBottomSheet>
    </WrapperContainer>
  );
}

const styles = StyleSheet.create({
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
    elevation: 5,
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
  },
  itemValue: {
    fontSize: textScale(14),
    fontFamily: FontFamily.PoppinsMedium,
    color: Colors.textColor,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 5,
  },
  statusText: {
    color: Colors.white,
    fontSize: 11,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.diabledColor,
    paddingBottom: 8,
  },
  dateText: {
    fontSize: 13,
    color: Colors.textColor,
  },
  bottomSheetContent: {
    gap: 10,
  },
  bottomSheetButton: {
    backgroundColor: Colors.greenColor,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  bottomSheetButtonText: {
    color: "#fff",
    fontSize: 14,
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
