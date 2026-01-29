import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Platform,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";

import WrapperContainer from "../../../../utils/WrapperContainer";
import InnerHeader from "../../../../components/InnerHeader";
import DropDown from "../../../../components/DropDown";
import Colors from "../../../../utils/Colors";
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from "../../../../utils/responsiveSize";
import FontFamily from "../../../../utils/FontFamily";
import { decryptAES, encryptWholeObject } from "../../../../utils/decryptData";
import { apiRequest } from "../../../../services/APIRequest";
import { API_ROUTES } from "../../../../services/APIRoutes";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { getUserData } from "../../../../utils/Storage";

/* ================= COMPONENT ================= */

const CreateDealerIndent = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  /* ================= STATES ================= */

  const [advancedReceived, setAdvancedReceived] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activeDateField, setActiveDateField] = useState(null);

  const [indentDateObj, setIndentDateObj] = useState(null);
  const [expectedDateObj, setExpectedDateObj] = useState(null);

  const [form, setForm] = useState({
    party: null,
    communication: null,
    communicationValue: "",
    indentDate: "",
    expectedDate: "",
    season: null,
    existingIndent: null,
    materialType: null,
    paymentMode: null,
    paymentDate: "",
    amount: "",
    indentNumber: null,
  });

  const [items, setItems] = useState([{ id: Date.now(), item: null, qty: "" }]);

  /* ================= DUMMY DATA ================= */
  const modeList = [
    { id: 1, name: "Phone" },
    { id: 2, name: "Email" },
    { id: 3, name: "Direct" },
  ];
  const materialTypeList = [
    { id: 1, name: "SEED" },
    { id: 2, name: "VALUE_ADDED" },
    { id: 3, name: "SAPLING" },
  ];
  const paymentModeList = [
    { id: 1, name: "CASH" },
    { id: 2, name: "UPI" },
    { id: 3, name: "CHEQUE" },
    { id: 4, name: "CARD" },
    { id: 5, name: "BANK" },
  ];

  const [seasonList, setseasonList] = useState([]);
  const [materialList, setmaterialList] = useState([]);
  const [partyList, setpartyList] = useState([]);
  const [indentNumbers, setIndentNumbers] = useState("");

  useEffect(() => {
    fetchSeasonList();
    fetchMaterialList();
    fetchPartyList();
  }, []);

  const fetchPartyList = async () => {
    setLoading(true);
    const userData = await getUserData();

    try {
      const payloadData = {
        roId: userData?.roId,
        partyType: "DEALER",
      };

      const encryptedPayload = encryptWholeObject(payloadData);

      const response = await apiRequest(
        API_ROUTES.PARTY_LIST_DEALER_INDENT,
        "post",
        encryptedPayload,
      );

      const decrypted = decryptAES(response);
      const parsed = JSON.parse(decrypted);

      if (parsed?.status === "SUCCESS" && parsed?.statusCode === "200") {
        const newData = parsed?.data;

        setpartyList(newData);
      } else {
        showErrorMessage(parsed?.message || "Invalid response");
      }
    } catch (err) {
      console.log("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMaterialList = async () => {
    setLoading(true);

    try {
      const payloadData = {
        materialType: "",
      };

      const encryptedPayload = encryptWholeObject(payloadData);

      const response = await apiRequest(
        API_ROUTES.MATERIAL_LIST,
        "post",
        encryptedPayload,
      );

      const decrypted = decryptAES(response);
      const parsed = JSON.parse(decrypted);

      if (parsed?.status === "SUCCESS" && parsed?.statusCode === "200") {
        const newData = parsed?.data;

        setmaterialList(newData);
      } else {
        showErrorMessage(parsed?.message || "Invalid response");
      }
    } catch (err) {
      console.log("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSeasonList = async () => {
    setLoading(true);

    try {
      const payloadData = {};

      const encryptedPayload = encryptWholeObject(payloadData);

      const response = await apiRequest(
        API_ROUTES.SEASON,
        "post",
        encryptedPayload,
      );

      const decrypted = decryptAES(response);
      const parsed = JSON.parse(decrypted);

      if (parsed?.status === "SUCCESS" && parsed?.statusCode === "200") {
        const newData = parsed?.data;

        setseasonList(newData);
      } else {
        showErrorMessage(parsed?.message || "Invalid response");
      }
    } catch (err) {
      console.log("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const getIndentNumber = async (item) => {
    setLoading(true);

    try {
      const payloadData = {
        dealerId: item?.id,
      };

      const encryptedPayload = encryptWholeObject(payloadData);

      const response = await apiRequest(
        API_ROUTES.GET_INDENT_NUMBER,
        "post",
        encryptedPayload,
      );

      const decrypted = decryptAES(response);
      const parsed = JSON.parse(decrypted);

      if (parsed?.status === "SUCCESS" && parsed?.statusCode === "200") {
        const newData = parsed?.data;

        setIndentNumbers(newData);
      } else {
        showErrorMessage(parsed?.message || "Invalid response");
      }
    } catch (err) {
      console.log("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);

    if (!selectedDate) return;

    if (activeDateField === "INDENT") {
      setIndentDateObj(selectedDate);
      setForm((p) => ({
        ...p,
        indentDate: formatDate(selectedDate),
      }));
    }

    if (activeDateField === "EXPECTED") {
      setExpectedDateObj(selectedDate);
      setForm((p) => ({
        ...p,
        expectedDate: formatDate(selectedDate),
      }));
    }
  };

  /* ================= ITEM HANDLERS ================= */

  const addItem = () => {
    setItems((p) => [...p, { id: Date.now(), item: null, qty: "" }]);
  };

  const removeItem = (id) => {
    setItems((p) => p.filter((i) => i.id !== id));
  };

  const getCommPlaceholder = () => {
    switch (form.communication?.name) {
      case "Phone":
        return "Enter phone number";
      case "Email":
        return "Enter email address";
      case "Direct":
        return "Enter remarks";
      default:
        return "";
    }
  };

  const toApiDate = (ddmmyyyy) => {
    if (!ddmmyyyy) return null;
    const [dd, mm, yyyy] = ddmmyyyy.split("/");
    return `${yyyy}-${mm}-${dd}`;
  };

  const buildPayload = async () => {
    const userData = await getUserData();
    return {
      materialType: form.materialType?.name || null,

      dealerId: form.party?.id,
      dealerName: form.party?.payeeName,
      dealerCode: form.party?.partyCode,

      indentDate: toApiDate(form.indentDate),
      deliveryDate: toApiDate(form.expectedDate),
      paymentDate: advancedReceived ? toApiDate(form.paymentDate) : null,

      advanceReceived: advancedReceived,

      paymentMode: advancedReceived ? form.paymentMode?.name : null,

      modeOfCommunication: form.communication?.name?.toUpperCase(),
      communicationValue: form.communicationValue,

      seasonId: form.season?.id,
      seasonName: form.season?.seasonType || "",

      existingIndentNo: form.indentNumber?.dealerIndentNo || null,

      receivedAmount: advancedReceived ? form.amount : null,
      chequeNo:
        form.paymentMode?.name === "CHEQUE" ? form.communicationValue : null,

      dealerIndentItems: items.map((it) => ({
        itemName: it.item?.itemName,
        qty: Number(it.qty),
        uom: it.item?.uom || "Kg",
        hsnShortName: it.item?.hsnShortName,
        packingSize: it.item?.packingSize,
        qtyAvailableForInvoice: Number(it.qty),
        itemCode: it.item?.itemCode,
      })),

      aoId: userData?.aoId,
      roId: userData?.roId,
      unitName: "LUCKNOW AO",
      unitType: "AO",

      indentStatus: "PENDING",
    };
  };

  const onSubmit = async () => {
    try {
      setLoading(true);

      const payload = buildPayload();

      console.log("FINAL SUBMIT PAYLOAD 👉", payload);

      const encryptedPayload = encryptWholeObject(payload);

      const response = await apiRequest(
        API_ROUTES.SAVE_DEALER_INDENT,
        "POST",
        encryptedPayload,
      );

      const decrypted = decryptAES(response);
      const parsed = JSON.parse(decrypted);

      console.log("onSubmit", parsed);

      if (parsed?.status === "SUCCESS") {
        alert("Dealer Indent Created Successfully");
        navigation.goBack();
      } else {
        alert(parsed?.message || "Submission failed");
      }
    } catch (e) {
      console.log("onSubmit", e);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <WrapperContainer isLoading={loading}>
      <InnerHeader title="Create Dealer Indent" />

      {Platform.OS === "android" && showDatePicker && (
        <DateTimePicker
          value={
            activeDateField === "INDENT"
              ? indentDateObj || new Date()
              : expectedDateObj || new Date()
          }
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}

      {Platform.OS === "ios" && showDatePicker && (
        <Modal transparent animationType="slide">
          <View style={styles.iosModalOverlay}>
            <View style={styles.iosModalContainer}>
              <TouchableOpacity
                style={{ alignSelf: "flex-end" }}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.doneText}>Done</Text>
              </TouchableOpacity>

              <DateTimePicker
                value={
                  activeDateField === "INDENT"
                    ? indentDateObj || new Date()
                    : expectedDateObj || new Date()
                }
                mode="date"
                display="spinner"
                onChange={onChangeDate}
              />
            </View>
          </View>
        </Modal>
      )}

      <ScrollView contentContainerStyle={styles.container}>
        {/* BASIC DETAILS */}
        <Card title="Basic Details">
          <DropDown
            label="Party Name"
            data={partyList}
            value={form.party?.payeeName || ""}
            selectItem={(item) => {
              getIndentNumber(item);
              setForm((p) => ({ ...p, party: item }));
            }}
          />

          <DropDown
            label="Mode of Communication"
            data={modeList}
            value={form.communication?.name || ""}
            selectItem={(item) =>
              setForm((p) => ({
                ...p,
                communication: item,
                communicationValue: "", // 👈 reset on change
              }))
            }
          />
          {form.communication && (
            <Input
              label={getCommPlaceholder()}
              value={form.communicationValue}
              onChangeText={(v) =>
                setForm((p) => ({ ...p, communicationValue: v }))
              }
            />
          )}

          <TouchableOpacity
            onPress={() => {
              setActiveDateField("INDENT");
              setShowDatePicker(true);
            }}
          >
            <Input
              label="Indent Date"
              placeholder="DD/MM/YYYY"
              value={form.indentDate}
              editable={false}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setActiveDateField("EXPECTED");
              setShowDatePicker(true);
            }}
          >
            <Input
              label="Expected Delivery Date"
              placeholder="DD/MM/YYYY"
              value={form.expectedDate}
              editable={false}
            />
          </TouchableOpacity>

          <DropDown
            label="Season"
            data={seasonList}
            value={form.season?.seasonType || ""}
            selectItem={(item) => setForm((p) => ({ ...p, season: item }))}
          />
          <DropDown
            label="Existing Indent Number"
            data={indentNumbers}
            value={form.indentNumber?.dealerIndentNo || ""}
            selectItem={(item) =>
              setForm((p) => ({ ...p, indentNumber: item }))
            }
          />

          <DropDown
            label="Material Type"
            data={materialTypeList}
            value={form.materialType?.name || ""}
            selectItem={(item) =>
              setForm((p) => ({ ...p, materialType: item }))
            }
          />

          <View style={styles.switchRow}>
            <Switch
              value={advancedReceived}
              onValueChange={setAdvancedReceived}
            />
            <Text style={styles.switchText}>Advanced Received</Text>
          </View>
        </Card>

        {/* PAYMENT DETAILS */}
        {advancedReceived && (
          <Card title="Payment Details">
            <Input
              label="Money Received"
              keyboardType="numeric"
              value={form.amount}
              onChangeText={(v) => setForm((p) => ({ ...p, amount: v }))}
            />

            <DropDown
              label="Payment Mode"
              data={paymentModeList}
              value={form.paymentMode?.name || ""}
              selectItem={(item) =>
                setForm((p) => ({ ...p, paymentMode: item }))
              }
            />

            <Input
              label="Payment Received Date"
              placeholder="dd/mm/yyyy"
              value={form.paymentDate}
              onChangeText={(v) => setForm((p) => ({ ...p, paymentDate: v }))}
            />
          </Card>
        )}

        {/* ITEMS */}
        <Card title="Items" rightIcon onRightPress={addItem}>
          {items.map((it, index) => (
            <View key={it.id} style={styles.itemBox}>
              <Text style={styles.sn}>Item {index + 1}</Text>

              <DropDown
                label="Item"
                data={materialList}
                value={it.item?.itemName || ""}
                selectItem={(item) =>
                  setItems((prev) =>
                    prev.map((x) => (x.id === it.id ? { ...x, item } : x)),
                  )
                }
              />

              <Input
                label="Qty"
                keyboardType="numeric"
                value={it.qty}
                onChangeText={(v) =>
                  setItems((prev) =>
                    prev.map((x) => (x.id === it.id ? { ...x, qty: v } : x)),
                  )
                }
              />

              {items.length > 1 && (
                <TouchableOpacity
                  onPress={() => removeItem(it.id)}
                  style={styles.removeBtn}
                >
                  <Icon name="remove-circle" size={22} color="red" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </Card>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Btn outline text="Cancel" onPress={navigation.goBack} />
          <Btn outline text="Save Draft" />
          <Btn fill onPress={onSubmit} text="Submit" />
        </View>
      </ScrollView>
    </WrapperContainer>
  );
};

export default CreateDealerIndent;

/* ================= SMALL COMPONENTS ================= */

const Card = ({ title, children, rightIcon, onRightPress }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle}>{title}</Text>
      {rightIcon && (
        <TouchableOpacity onPress={onRightPress}>
          <Icon name="add-circle" size={26} color={Colors.greenColor} />
        </TouchableOpacity>
      )}
    </View>
    {children}
  </View>
);

const Input = ({ label, ...props }) => (
  <View style={styles.inputBox}>
    <Text style={styles.label}>{label}</Text>
    <TextInput style={styles.input} {...props} />
  </View>
);

const Btn = ({ text, outline, fill, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.btn, outline && styles.outlineBtn, fill && styles.fillBtn]}
  >
    <Text style={[styles.btnText, outline && { color: Colors.greenColor }]}>
      {text}
    </Text>
  </TouchableOpacity>
);

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    padding: moderateScale(12),
    paddingBottom: 30,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  cardTitle: {
    fontSize: textScale(15),
    fontFamily: FontFamily.PoppinsSemiBold,
    color: Colors.greenColor,
  },

  inputBox: {
    marginBottom: 10,
  },

  label: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
  },

  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  switchText: {
    marginLeft: 8,
    fontSize: 14,
  },

  itemBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },

  sn: {
    fontWeight: "700",
    marginBottom: 4,
  },

  removeBtn: {
    alignItems: "flex-end",
    marginTop: 4,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  btn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },

  outlineBtn: {
    borderWidth: 1,
    borderColor: Colors.greenColor,
  },

  fillBtn: {
    backgroundColor: Colors.greenColor,
  },

  btnText: {
    fontWeight: "700",
    color: "#fff",
  },

  iosModalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  iosModalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  doneText: {
    fontSize: 16,
    color: Colors.greenColor,
    marginBottom: 10,
    fontWeight: "600",
  },
});
