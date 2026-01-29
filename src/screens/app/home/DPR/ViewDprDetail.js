import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Switch,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "../../../../utils/Colors";
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from "../../../../utils/responsiveSize";
import WrapperContainer from "../../../../utils/WrapperContainer";
import InnerHeader from "../../../../components/InnerHeader";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { decryptAES, encryptWholeObject } from "../../../../utils/decryptData";
import { apiRequest } from "../../../../services/APIRequest";
import { API_ROUTES } from "../../../../services/APIRoutes";
import { showErrorMessage } from "../../../../utils/HelperFunction";
import DropDown from "../../../../components/DropDown";
import FontFamily from "../../../../utils/FontFamily";
import CustomButton from "../../../../components/CustomButton";

/* ================= MATERIAL TYPE ================= */

const materialTypeList = [
  { id: 1, name: "SEED" },
  { id: 2, name: "VALUE_ADDED" },
  { id: 3, name: "PACKAGING_MATERIAL" },
  { id: 4, name: "AGRO_CHEMICAL" },
  { id: 5, name: "SAPLING" },
  { id: 6, name: "FIXED" },
  { id: 7, name: "CONSUMABLE_PARTS" },
];

/* ================= COMPONENT ================= */

export default function ViewDprDetail({ route }) {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const dprId = route?.params?.item?.id;
  const userData = route?.params?.userData;

  const [loading, setLoading] = useState(false);
  const [dprData, setDprData] = useState(null);
  const [activityGroups, setActivityGroups] = useState([]);
  const [expandedActivityId, setExpandedActivityId] = useState(null);
  const [materialList, setmaterialList] = useState([]);
  const [materialTableData, setMaterialTableData] = useState([]);
  const [showMaterialModal, setShowMaterialModal] = useState(false);

  //console.log("userData", userData);

  //const USER_ROLE = userData?.roleName?.includes("FARM_BLOCK_ENGG_INCHARGE");
  const USER_ROLE = userData?.unitType == "FARM_BLOCK";

  useEffect(() => {
    if (isFocused && dprId) {
      fetchDprDetail();
    }
  }, [isFocused, dprId]);

  /* ================= API ================= */

  const fetchDprDetail = async () => {
    try {
      setLoading(true);
      const payload = encryptWholeObject({ id: dprId });
      const res = await apiRequest(API_ROUTES.DPR_FIND_BY_ID, "POST", payload);
      const parsed = JSON.parse(decryptAES(res));

      console.log("dprDetail", parsed);

      if (parsed?.status === "SUCCESS") {
        setDprData(parsed.data);
        groupByActivity(parsed.data);
      } else {
        showErrorMessage(parsed?.message || "Failed to load DPR");
      }
    } catch (e) {
      console.log("DPR Error", e);
      showErrorMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ================= GROUP DATA ================= */

  const groupByActivity = (data) => {
    const map = {};

    data.activities.forEach((a) => {
      const existingLabour =
        data.dprLabour?.filter((l) => l.activityId === a.activityId) || [];

      const labours =
        existingLabour.length > 0
          ? existingLabour.map((l) => ({
              id: l.id,
              activityId: a.activityId,
              labourName: l.labourName || "",
              workingHours: l.workingHours || "",
            }))
          : Array.from({ length: a.noOfLabour || 0 }).map((_, i) => ({
              id: `${a.id}-${i}`, // 🔥 use a.id
              activityId: a.activityId,
              labourName: "",
              workingHours: "",
            }));

      map[a.id] = {
        id: a.id, // 🔥 UNIQUE
        activityId: a.activityId,
        activityName: a.activityName,
        basic: a,
        agricultures: [],
        mechanicals: [],
        labours,
      };
    });

    data.dprAgricultures?.forEach((ag) => {
      const act = Object.values(map).find(
        (x) => x.activityId === ag.activityId,
      );
      act?.agricultures.push(ag);
    });

    data.dprMechanicals?.forEach((me) => {
      const act = Object.values(map).find(
        (x) => x.activityId === me.activityId,
      );
      act?.mechanicals.push(me);
    });

    setActivityGroups(Object.values(map));
  };

  const updateLabourField = (activityId, labourId, key, value) => {
    setActivityGroups((prev) =>
      prev.map((act) =>
        act.activityId === activityId
          ? {
              ...act,
              labours: act.labours.map((l) =>
                l.id === labourId ? { ...l, [key]: value } : l,
              ),
            }
          : act,
      ),
    );
  };

  /* ================= LABOUR GENERATOR ================= */

  const getLabourRows = (activity) => {
    if (activity.labours?.length > 0) return activity.labours;

    const count = activity.basic?.noOfLabour || 0;
    return Array.from({ length: count }).map((_, i) => ({
      id: `${activity.activityId}-${i}`,
      labourName: "",
      workingHours: "",
    }));
  };

  const addAgriculture = (activityId) => {
    setActivityGroups((prev) =>
      prev.map((act) =>
        act.activityId === activityId
          ? {
              ...act,
              agricultures: [
                ...act.agricultures,
                {
                  id: `new-${Date.now()}`,
                  activityId: act.activityId,
                  materialType: "",
                  materialList: [],
                  itemCode: "",
                  qty: "",
                },
              ],
            }
          : act,
      ),
    );
  };

  const removeAgriculture = (activityId, agId) => {
    setActivityGroups((prev) =>
      prev.map((act) =>
        act.activityId === activityId
          ? {
              ...act,
              agricultures: act.agricultures.filter((ag) => ag.id !== agId),
            }
          : act,
      ),
    );
  };

  const getMaterialItem = async (activityId, agId, val) => {
    setLoading(true);
    try {
      const payloadData = { materialType: val.name };
      const encryptPayloadData = encryptWholeObject(payloadData);
      const res = await apiRequest(
        API_ROUTES.MATERIAL_LIST,
        "POST",
        encryptPayloadData,
      );

      const parsed = JSON.parse(decryptAES(res));

      if (parsed?.status === "SUCCESS") {
        setActivityGroups((prev) =>
          prev.map((act) =>
            act.activityId === activityId
              ? {
                  ...act,
                  agricultures: act.agricultures.map((x) =>
                    x.id === agId
                      ? {
                          ...x,
                          materialType: val.name,
                          materialList: parsed.data || [],
                          material: null, // reset item
                        }
                      : x,
                  ),
                }
              : act,
          ),
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchMaterialList = async (item) => {
    setLoading(true);
    try {
      const payloadData = {
        itemCode: item?.itemCode,
        itemSubType: item?.itemSubType,
      };
      const encryptPayloadData = encryptWholeObject(payloadData);
      const getMaterialItem = await apiRequest(
        API_ROUTES.MATERIAL_LIST_DPR,
        "POST",
        encryptPayloadData,
      );
      const decryptedMaterialItemList = decryptAES(getMaterialItem);
      const parsedDecryptedMaterialItemList = JSON.parse(
        decryptedMaterialItemList,
      );

      console.log(
        "parsedDecryptedMaterialList",
        parsedDecryptedMaterialItemList,
      );
      if (
        (parsedDecryptedMaterialItemList?.status === "SUCCESS" &&
          parsedDecryptedMaterialItemList?.statusCode === "200") ||
        (parsedDecryptedMaterialItemList?.status === "200" &&
          parsedDecryptedMaterialItemList?.statusCode === "200")
      ) {
        setMaterialTableData(parsedDecryptedMaterialItemList?.data || []);
      } else {
        showErrorMessage("Unable to get the Subgroup List Data");
      }
    } catch (error) {
      console.log(error, "line error");
      showErrorMessage("Error fetching dropdown data");
    } finally {
      setLoading(false);
    }
  };

  /* ================= RENDER ACTIVITY ================= */

  const renderActivity = ({ item, index }) => {
    const isOpen = expandedActivityId === item.activityId;
    // console.log("renderActivity", item);

    return (
      <View style={styles.activityCard}>
        <TouchableOpacity
          style={styles.activityHeader}
          onPress={() => setExpandedActivityId(isOpen ? null : item.activityId)}
        >
          <Text style={styles.activityTitle}>
            Activity {index + 1} · {item.activityName}
          </Text>
          <Icon
            name={isOpen ? "expand-less" : "expand-more"}
            size={26}
            color={Colors.greenColor}
          />
        </TouchableOpacity>

        {isOpen && (
          <View style={styles.activityBody}>
            {/* BASIC */}
            <DropDown disabled label="Activity" value={item.activityName} />
            <DropDown
              disabled
              label="Contractor Type"
              value={item.basic?.contractorType}
            />
            <DropDown
              disabled
              label="Contractor Name"
              value={item.basic?.contractorName}
            />
            <TextInput
              style={styles.disabledInput}
              editable={false}
              value={String(item.basic?.noOfLabour || 0)}
              placeholder="No of Labour"
            />

            {/* AGRICULTURE */}
            {item.agricultures.length > 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Agriculture Inputs</Text>
                  <TouchableOpacity
                    onPress={() => addAgriculture(item.activityId)}
                  >
                    <Text style={styles.addText}>+ Add New</Text>
                  </TouchableOpacity>
                </View>

                {item.agricultures.map((ag, i) => (
                  <View key={ag.id} style={styles.rowBox}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.serial}>S.N. {i + 1}</Text>
                      <TouchableOpacity
                        onPress={() =>
                          removeAgriculture(item.activityId, ag.id)
                        }
                      >
                        <Icon name="delete" size={20} color="red" />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.divider} />
                    <DropDown
                      label="Material Type"
                      data={materialTypeList}
                      value={ag.materialType}
                      selectItem={(val) => {
                        getMaterialItem(item.activityId, ag.id, val);
                        setActivityGroups((prev) =>
                          prev.map((act) =>
                            act.activityId === item.activityId
                              ? {
                                  ...act,
                                  agricultures: act.agricultures.map((x) =>
                                    x.id === ag.id
                                      ? { ...x, materialType: val.name }
                                      : x,
                                  ),
                                }
                              : act,
                          ),
                        );
                      }}
                    />

                    <DropDown
                      label="Item"
                      data={ag.materialList || []}
                      value={ag.material?.itemName || ""}
                      selectItem={(selectedItem) => {
                        fetchMaterialList(item);
                        setActivityGroups((prev) =>
                          prev.map((act) =>
                            act.activityId === item.activityId
                              ? {
                                  ...act,
                                  agricultures: act.agricultures.map((x) =>
                                    x.id === ag.id
                                      ? { ...x, material: selectedItem }
                                      : x,
                                  ),
                                }
                              : act,
                          ),
                        );
                      }}
                    />
                    <TouchableOpacity
                      style={styles.selectMaterialBtn}
                      onPress={() => {
                        setShowMaterialModal(true);
                      }}
                    >
                      <Text style={styles.selectMaterialText}>
                        Select / View Material(s)
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </>
            )}

            {/* MECHANICAL */}
            {item.mechanicals.length > 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>
                    Equipment & Mechanical Details
                  </Text>
                </View>

                {item.mechanicals.map((eq, i) => (
                  <View key={eq.id} style={styles.rowBox}>
                    <Text style={styles.serial}>S.N. {i + 1}</Text>
                    <View style={styles.divider} />
                    <DropDown
                      disabled
                      label="Equipment"
                      value={eq.equipmentName}
                    />
                    <DropDown
                      disabled
                      label="Sub Group"
                      value={eq.subGroupName}
                    />
                    <View style={styles.inputContainer}>
                      <Text style={styles.label}>Estimated Hours</Text>
                      <TextInput
                        editable={false}
                        style={styles.disabledInput}
                        value={String(eq.estimatedHours || "")}
                        placeholder="Estimated Hours"
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.label}>Actual Hours</Text>
                      <TextInput
                        editable={false}
                        style={styles.disabledInput}
                        value={String(eq.actualHours || "")}
                        placeholder="Actual Hours"
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.label}>Operator Name</Text>
                      <TextInput
                        editable={false}
                        style={styles.disabledInput}
                        value={String(eq.operatorName || "")}
                        placeholder="Operator Name"
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.label}>CP Number</Text>
                      <TextInput
                        editable={false}
                        style={styles.disabledInput}
                        value={String(eq.cpNumber || "")}
                        placeholder="CP Number"
                      />
                    </View>

                    <View style={styles.switchRow}>
                      <Text>Operator Required</Text>
                      <Switch value={eq.operatorRequired} disabled />
                    </View>
                  </View>
                ))}
              </>
            )}

            {/* LABOUR */}
            {/* {item.labours.length > 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Labour Details</Text>
                </View>

                {item.labours.map((lab, i) => (
                  <View key={lab.id} style={styles.rowBox}>
                    <Text style={styles.serial}>S.N. {i + 1}</Text>
                    <View style={styles.divider} />

                    <TextInput
                      style={styles.input}
                      placeholder="Labour Name"
                      value={lab.labourName}
                      onChangeText={(val) =>
                        updateLabourField(
                          item.activityId,
                          lab.id,
                          "labourName",
                          val,
                        )
                      }
                    />

                    <TextInput
                      style={styles.input}
                      placeholder="Working Hours"
                      keyboardType="numeric"
                      value={lab.workingHours}
                      onChangeText={(val) =>
                        updateLabourField(
                          item.activityId,
                          lab.id,
                          "workingHours",
                          val,
                        )
                      }
                    />
                  </View>
                ))}
              </>
            )} */}
          </View>
        )}
      </View>
    );
  };

  /* ================= UI ================= */

  return (
    <WrapperContainer isLoading={loading}>
      <InnerHeader title="Crop DPR" />

      {showMaterialModal && (
        <Modal visible={showMaterialModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              {/* HEADER */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Materials</Text>
                <TouchableOpacity onPress={() => setShowMaterialModal(false)}>
                  <Icon name="close" size={24} />
                </TouchableOpacity>
              </View>

              {/* BODY */}
              <ScrollView contentContainerStyle={{ padding: 10 }}>
                {materialTableData.map((item, index) => (
                  <View key={index} style={styles.materialCard}>
                    {/* TOP ROW */}
                    <View style={styles.cardHeader}>
                      <Switch
                        value={item.selected}
                        onValueChange={(v) => {
                          const copy = [...materialTableData];
                          copy[index].selected = v;
                          if (!v) copy[index].issueQty = "";
                          setMaterialTableData(copy);
                        }}
                      />

                      <Text style={styles.materialTitle}>
                        {item.materialName}
                      </Text>
                    </View>

                    {/* DETAILS */}
                    <View style={styles.cardRow}>
                      <Text style={styles.label}>Lot No:</Text>
                      <Text style={styles.value}>{item.lotNo}</Text>
                    </View>

                    <View style={styles.cardRow}>
                      <Text style={styles.label}>Packing Size:</Text>
                      <Text style={styles.value}>{item.packingSize}</Text>
                    </View>

                    <View style={styles.cardRow}>
                      <Text style={styles.label}>No. of Bags:</Text>
                      <Text style={styles.value}>{item.noOfBags}</Text>
                    </View>

                    <View style={styles.cardRow}>
                      <Text style={styles.label}>Available Qty:</Text>
                      <Text style={styles.value}>{item.availableQty}</Text>
                    </View>

                    {/* ISSUE QTY */}
                    <TextInput
                      style={[
                        styles.issueInput,
                        { backgroundColor: item.selected ? "#fff" : "#eee" },
                      ]}
                      placeholder="Enter Issue Qty"
                      keyboardType="numeric"
                      editable={item.selected}
                      value={item.issueQty}
                      onChangeText={(v) => {
                        const copy = [...materialTableData];
                        copy[index].issueQty = v;
                        setMaterialTableData(copy);
                      }}
                    />
                  </View>
                ))}
              </ScrollView>

              {/* FOOTER */}
              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setShowMaterialModal(false)}
                >
                  <Text>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={() => {
                    setShowMaterialModal(false);
                    console.log("Selected Materials", materialTableData);
                  }}
                >
                  <Text style={{ color: "#fff" }}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={moderateScaleVertical(
          Platform.OS === "ios" ? 80 : 10,
        )}
      >
        <ScrollView style={styles.container}>
          {dprData && (
            <View style={styles.basicCard}>
              <Text style={styles.basicTitle}>Basic Details</Text>
              <Text>Square: {dprData.squareName}</Text>
              <Text>Status: {dprData.currentDprStatus}</Text>
              <Text>DPR Type: {dprData.dprType}</Text>
            </View>
          )}

          <FlatList
            data={activityGroups}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderActivity}
          />

          <CustomButton
            text="Submit"
            buttonStyle={styles.buttonStyle}
            textStyle={styles.buttonTextStyle}
            handleAction={() => navigation.goBack()}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </WrapperContainer>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { padding: moderateScale(10) },

  basicCard: {
    backgroundColor: "#e8f5e9",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#2e7d32",
  },
  basicTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.greenColor,
    marginBottom: 8,
  },

  activityCard: { marginBottom: 12 },
  activityHeader: {
    backgroundColor: "#f1f8e9",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#c8e6c9",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  activityTitle: {
    fontSize: textScale(14),
    fontWeight: "700",
    color: Colors.greenColor,
  },
  activityBody: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderTopWidth: 0,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.disableFieldColor,
    //backgroundColor: Colors.disableFieldColor,
    borderRadius: 6,
    padding: 8,
    marginVertical: 6,
  },

  disabledInput: {
    borderWidth: 1,
    borderColor: Colors.disableFieldColor,
    backgroundColor: Colors.disableFieldColor,
    borderRadius: 6,
    padding: 8,
    marginVertical: 6,
    paddingVertical: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    alignItems: "center",
  },
  sectionTitle: {
    fontWeight: "700",
    borderLeftWidth: moderateScale(3),
    borderColor: Colors.primary,
    fontSize: textScale(14),
    fontFamily: FontFamily.PoppinsSemiBold,
    color: Colors.greenColor,
    paddingLeft: 5,
  },
  addText: { color: Colors.green },
  rowBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 8,
    marginVertical: 6,
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 6,
  },
  serial: {
    fontWeight: "700",
    color: "#000",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonStyle: {
    backgroundColor: Colors.greenColor,
    padding: moderateScaleVertical(12),
    borderRadius: moderateScale(8),
    marginVertical: 20,
  },
  buttonTextStyle: {
    color: Colors.white,
    fontSize: textScale(14),
    fontFamily: FontFamily.PoppinsMedium,
  },

  // materialvactivity style
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 10,
  },

  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    maxHeight: "85%",
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },

  materialCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  materialTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 8,
    flex: 1,
  },

  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2,
  },

  label: {
    fontSize: 14,
    color: Colors.grey,
    marginBottom: 2,
    fontWeight: "700",
  },

  value: {
    fontSize: 12,
    fontWeight: "600",
    color: "#000",
  },

  issueInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginTop: 10,
    textAlign: "center",
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
  },

  cancelBtn: {
    padding: 10,
  },

  saveBtn: {
    backgroundColor: Colors.greenColor,
    padding: 10,
    borderRadius: 6,
  },
  inputContainer: {
    flex: 1,
    marginRight: 8,
    marginBottom: 5,
  },
});
