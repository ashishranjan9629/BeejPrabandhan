import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import WrapperContainer from "../../../../utils/WrapperContainer";
import InnerHeader from "../../../../components/InnerHeader";
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from "../../../../utils/responsiveSize";
import Colors from "../../../../utils/Colors";
import FontFamily from "../../../../utils/FontFamily";
import DateTimePicker from "@react-native-community/datetimepicker";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";

const InspectionForm = ({ route }) => {
  const { data } = route.params;
  const navigation = useNavigation();
  console.log(data, "line 7");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentDateField, setCurrentDateField] = useState(null);

  // Helper function to create field names
  const createFieldName = (text) => {
    return text.replace(/\s+/g, "").toLowerCase();
  };

  // Form state
  const [formData, setFormData] = useState({
    // Step 1 fields
    dateOfSowing: "",
    expectedHarvestFrom: "",
    expectedHarvestTo: "",
    dateOfInspection: "",
    // Initialize all text input fields
    natureofprogramme: "",
    labeoffarm: "",
    acreageoffieldnoinspectedinha: "",
    stageofgrowthofcontaminant: "",
    reportnumber: "",
    seedsource: "",
    previouscrop: "",
    stageofseedcropatthisinspection: "",
    totalacreageunderproductioninha: "",
    isolationdistance: "",

    // Step 2 fields
    counts: Array(10)
      .fill()
      .map(() => ({
        offType: "",
        otherCrops: "",
        weeds: "",
        disease: "",
      })),

    // Step 3 fields
    offTypePercentage: "",
    inseparableOtherCropsPercentage: "",
    objectionableWeedsPercentage: "",
    seedBorneDiseasesPercentage: "",
    seedBorneDiseasesName: "",
    inseparableOtherCropsName: "",
    objectionableWeedsName: "",
    nonSeedBorneDiseases: "",
    confirmsToStandards: false,
    estimatedSeedField: "",
    productionQuality: "",
    growerPresent: false,
    isFinalReport: false,
    growerName: "",
    conditionOfCrop: "",
    designation: "",
    remarks: "",
    submittedBy: "",
  });

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleCountChange = (index, field, value) => {
    const newCounts = [...formData.counts];
    newCounts[index][field] = value;
    setFormData({ ...formData, counts: newCounts });
  };

  const showDatePickerModal = (field) => {
    setCurrentDateField(field);
    setShowDatePicker(true);
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = formatDate(selectedDate);
      handleInputChange(currentDateField, formattedDate);
    }
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const renderStep1 = () => (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={moderateScaleVertical(10)}
    >
      <ScrollView
        style={styles.stepContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Basic Information</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date of Sowing</Text>
          <View style={styles.dateViewHolder}>
            <TextInput
              style={[styles.input, { width: "80%" }]}
              placeholder="dd/mm/yyyy"
              value={formData.dateOfSowing}
              editable={false}
            />
            <TouchableOpacity
              style={styles.calendarView}
              onPress={() => showDatePickerModal("dateOfSowing")}
            >
              <FontAwesome
                name="calendar"
                size={moderateScale(25)}
                color={Colors.black}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Expected date of harvest (From)</Text>
          <View style={styles.dateViewHolder}>
            <TextInput
              style={[styles.input, { width: "80%" }]}
              placeholder="dd/mm/yyyy"
              value={formData.expectedHarvestFrom}
              editable={false}
            />
            <TouchableOpacity
              style={styles.calendarView}
              onPress={() => showDatePickerModal("expectedHarvestFrom")}
            >
              <FontAwesome
                name="calendar"
                size={moderateScale(25)}
                color={Colors.black}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Expected date of harvest (To)</Text>
          <View style={styles.dateViewHolder}>
            <TextInput
              style={[styles.input, { width: "80%" }]}
              placeholder="dd/mm/yyyy"
              value={formData.expectedHarvestTo}
              editable={false}
            />
            <TouchableOpacity
              style={styles.calendarView}
              onPress={() => showDatePickerModal("expectedHarvestTo")}
            >
              <FontAwesome
                name="calendar"
                size={moderateScale(25)}
                color={Colors.black}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date of inspection</Text>
          <View style={styles.dateViewHolder}>
            <TextInput
              style={[styles.input, { width: "80%" }]}
              placeholder="dd/mm/yyyy"
              value={formData.dateOfInspection}
              editable={false}
            />
            <TouchableOpacity
              style={styles.calendarView}
              onPress={() => showDatePickerModal("dateOfInspection")}
            >
              <FontAwesome
                name="calendar"
                size={moderateScale(25)}
                color={Colors.black}
              />
            </TouchableOpacity>
          </View>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onDateChange}
          />
        )}

        <Text style={styles.sectionTitle}>Checklist Items</Text>
        {[
          {
            label: "Nature of Programme",
            field: "natureofprogramme",
            placeholder: "Enter nature of programme",
          },
          {
            label: "Report Number",
            field: "reportnumber",
            placeholder: "Enter report number",
          },
          {
            label: "Label of Farm",
            field: "labeoffarm",
            placeholder: "Enter farm label",
          },
          {
            label: "Seed Source",
            field: "seedsource",
            placeholder: "Enter seed source",
          },
          {
            label: "Total Acreage under Production (in Ha)",
            field: "totalacreageunderproductioninha",
            placeholder: "Enter total acreage",
            keyboardType: "numeric",
          },
          {
            label: "Acreage of Field No. Inspected (in Ha)",
            field: "acreageoffieldnoinspectedinha",
            placeholder: "Enter acreage",
            keyboardType: "numeric",
          },
          {
            label: "Previous crop",
            field: "previouscrop",
            placeholder: "Enter previous crop",
          },
          {
            label: "Isolation Distance",
            field: "isolationdistance",
            placeholder: "Enter isolation distance",
          },
          {
            label: "Stage of growth of contaminant",
            field: "stageofgrowthofcontaminant",
            placeholder: "Enter growth stage",
          },

          {
            label: "Stage of seed crop at this inspection",
            field: "stageofseedcropatthisinspection",
            placeholder: "Enter crop stage",
          },
        ].map((item, index) => (
          <View key={index} style={styles.inputGroup}>
            <Text style={styles.label}>{item.label}</Text>
            <TextInput
              style={styles.input}
              placeholder={item.placeholder}
              value={formData[item.field]}
              onChangeText={(text) => handleInputChange(item.field, text)}
              keyboardType={item.keyboardType || "default"}
            />
          </View>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );

  const renderStep2 = () => (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={moderateScaleVertical(10)}
    >
      <ScrollView
        style={styles.stepContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Count Details</Text>

        <View style={styles.tableHeader}>
          <Text style={[styles.tableCell, styles.headerCell, { flex: 0.5 }]}>
            Count No.
          </Text>
          <Text style={[styles.tableCell, styles.headerCell]}>
            Plants/heads of off-type
          </Text>
          <Text style={[styles.tableCell, styles.headerCell]}>
            Inseparable other crops
          </Text>
          <Text style={[styles.tableCell, styles.headerCell]}>
            Objectionable weeds
          </Text>
          <Text style={[styles.tableCell, styles.headerCell]}>
            Affected by seed borne Disease
          </Text>
        </View>

        {formData.counts.map((count, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.countCell, { flex: 0.5 }]}>
              {index + 1}
            </Text>
            <TextInput
              style={[styles.tableCell, styles.inputCell]}
              value={count.offType}
              onChangeText={(text) => handleCountChange(index, "offType", text)}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.tableCell, styles.inputCell]}
              value={count.otherCrops}
              onChangeText={(text) =>
                handleCountChange(index, "otherCrops", text)
              }
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.tableCell, styles.inputCell]}
              value={count.weeds}
              onChangeText={(text) => handleCountChange(index, "weeds", text)}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.tableCell, styles.inputCell]}
              value={count.disease}
              onChangeText={(text) => handleCountChange(index, "disease", text)}
              keyboardType="numeric"
            />
          </View>
        ))}

        <View style={styles.tableFooter}>
          <Text style={[styles.tableCell, styles.footerCell, { flex: 0.5 }]}>
            TOTAL
          </Text>
          <Text style={[styles.tableCell, styles.footerCell]}>0.00</Text>
          <Text style={[styles.tableCell, styles.footerCell]}>0.00</Text>
          <Text style={[styles.tableCell, styles.footerCell]}>0.00</Text>
          <Text style={[styles.tableCell, styles.footerCell]}>0.00</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  const renderStep3 = () => (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={moderateScaleVertical(10)}
    >
      <ScrollView
        style={styles.stepContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Summary & Assessment</Text>

        <View style={styles.column}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Percentage of Off-Types plants</Text>
            <TextInput
              style={styles.input}
              value={formData.offTypePercentage}
              onChangeText={(text) =>
                handleInputChange("offTypePercentage", text)
              }
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Percentage of Inseparable Other Crops
            </Text>
            <TextInput
              style={styles.input}
              value={formData.inseparableOtherCropsPercentage}
              onChangeText={(text) =>
                handleInputChange("inseparableOtherCropsPercentage", text)
              }
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Percentage of Objectionable Weed Plants
            </Text>
            <TextInput
              style={styles.input}
              value={formData.objectionableWeedsPercentage}
              onChangeText={(text) =>
                handleInputChange("objectionableWeedsPercentage", text)
              }
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Percentage of Seed-Borne Diseases</Text>
            <TextInput
              style={styles.input}
              value={formData.seedBorneDiseasesPercentage}
              onChangeText={(text) =>
                handleInputChange("seedBorneDiseasesPercentage", text)
              }
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Name of Inseparable Other Crop Plants
            </Text>
            <TextInput
              style={styles.input}
              value={formData.inseparableOtherCropsName}
              onChangeText={(text) =>
                handleInputChange("inseparableOtherCropsName", text)
              }
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name of Objectionable Weed Plants</Text>
            <TextInput
              style={styles.input}
              value={formData.objectionableWeedsName}
              onChangeText={(text) =>
                handleInputChange("objectionableWeedsName", text)
              }
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name of Objectionable Weed Plants</Text>
            <TextInput
              style={styles.input}
              value={formData.objectionableWeedsName}
              onChangeText={(text) =>
                handleInputChange("objectionableWeedsName", text)
              }
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name of Seed-Borne Diseases</Text>
            <TextInput
              style={styles.input}
              value={formData.seedBorneDiseasesName}
              onChangeText={(text) =>
                handleInputChange("seedBorneDiseasesName", text)
              }
            />
          </View>
        </View>

        <View style={styles.column}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name of Non-seed Borne Disease(s)</Text>
            <TextInput
              style={styles.input}
              value={formData.nonSeedBorneDiseases}
              onChangeText={(text) =>
                handleInputChange("nonSeedBorneDiseases", text)
              }
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Condition of Crop</Text>
            <TextInput
              style={styles.input}
              value={formData.conditionOfCrop}
              onChangeText={(text) =>
                handleInputChange("conditionOfCrop", text)
              }
            />
          </View>
        </View>

        <View
          style={[
            styles.switchRow,
            { alignSelf: "flex-start", alignItems: "center" },
          ]}
        >
          <View style={styles.switchContainer}>
            <Switch
              value={formData.confirmsToStandards}
              onValueChange={(value) =>
                handleInputChange("confirmsToStandards", value)
              }
              trackColor={{ false: "#767577", true: Colors.lightGreen }}
              thumbColor={
                formData.confirmsToStandards ? Colors.greenColor : "#f4f3f4"
              }
            />
            <Text
              style={[
                styles.label,
                { marginLeft: moderateScale(5), width: "85%" },
              ]}
            >
              Does this crop confirm to standards of cert?
            </Text>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Quality of Production Work</Text>
          <TextInput
            style={styles.input}
            value={formData.productionQuality}
            onChangeText={(text) =>
              handleInputChange("productionQuality", text)
            }
          />
        </View>

        <View
          style={[
            styles.switchRow,
            { alignSelf: "flex-start", alignItems: "center" },
          ]}
        >
          <View style={styles.switchContainer}>
            <Switch
              value={formData.isFinalReport}
              onValueChange={(value) =>
                handleInputChange("isFinalReport", value)
              }
              trackColor={{ false: "#767577", true: Colors.lightGreen }}
              thumbColor={
                formData.isFinalReport ? Colors.greenColor : "#f4f3f4"
              }
            />
            <Text style={[styles.label, { marginLeft: moderateScale(5) }]}>
              Is this the final report?
            </Text>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Estimated Bow Seed Field (Rq/Netc)</Text>
          <TextInput
            style={styles.input}
            value={formData.estimatedSeedField}
            onChangeText={(text) =>
              handleInputChange("estimatedSeedField", text)
            }
          />
        </View>

        <View style={styles.switchRow}>
          <View style={styles.switchContainer}>
            <Switch
              value={formData.growerPresent}
              onValueChange={(value) =>
                handleInputChange("growerPresent", value)
              }
              trackColor={{ false: "#767577", true: Colors.lightGreen }}
              thumbColor={
                formData.growerPresent ? Colors.greenColor : "#f4f3f4"
              }
            />
            <Text
              style={[
                styles.label,
                { width: "90%", marginLeft: moderateScale(5) },
              ]}
            >
              Was Grower or his representative present at the time of
              inspection?
            </Text>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Submitted for (Grower Name)</Text>
          <TextInput
            style={styles.input}
            value={formData.growerName}
            onChangeText={(text) => handleInputChange("growerName", text)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Submitted By (Name of Inspecting Official)
          </Text>
          <TextInput
            style={styles.input}
            value={formData.submittedBy}
            onChangeText={(text) => handleInputChange("submittedBy", text)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Designation</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.designation}
            onChangeText={(text) => handleInputChange("designation", text)}
            multiline
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Remarks</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.remarks}
            onChangeText={(text) => handleInputChange("remarks", text)}
            multiline
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  return (
    <WrapperContainer isLoading={loading}>
      <InnerHeader title={"Inspection Form"} />
      <View style={styles.stepIndicator}>
        <Text style={styles.stepText}>Step {step} of 3</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: `${(step / 3) * 100}%` }]} />
        </View>
      </View>

      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}

      <View style={styles.navigation}>
        {step === 1 && (
          <TouchableOpacity
            style={[styles.navButton, styles.nextButton, styles.nextButton2]}
            onPress={nextStep}
          >
            <Text style={styles.navButtonText}>Next</Text>
          </TouchableOpacity>
        )}
        {step === 2 && (
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity style={styles.navButton} onPress={prevStep}>
              <Text style={styles.navButtonText}>Previous</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.navButton, styles.nextButton]}
              onPress={nextStep}
            >
              <Text style={styles.navButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        )}
        {step == 3 && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <TouchableOpacity style={styles.navButton} onPress={prevStep}>
              <Text style={styles.navButtonText}>Previous</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.navButton, styles.submitButton]}>
              <Text style={styles.navButtonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.navButton, styles.rejectButton]}>
              <Text style={styles.navButtonText}>Preview</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.navButton, styles.cancelButton]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.navButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </WrapperContainer>
  );
};

export default InspectionForm;

const styles = StyleSheet.create({
  stepContainer: {
    flex: 1,
    padding: moderateScale(16),
  },
  stepIndicator: {
    padding: moderateScale(16),
    backgroundColor: Colors.lightBackground,
  },
  stepText: {
    fontSize: textScale(13),
    fontFamily: FontFamily.PoppinsMedium,
    marginBottom: moderateScaleVertical(8),
  },
  progressBar: {
    height: moderateScale(10),
    backgroundColor: Colors.veryLightGrey,
    borderRadius: moderateScale(5),
    overflow: "hidden",
  },
  progress: {
    height: "100%",
    backgroundColor: Colors.lightGreen,
  },
  sectionTitle: {
    fontSize: textScale(15),
    fontFamily: FontFamily.PoppinsMedium,
    marginBottom: moderateScaleVertical(15),
    marginTop: moderateScaleVertical(8),
  },
  inputGroup: {
    marginBottom: moderateScaleVertical(20),
    gap: moderateScaleVertical(5),
  },
  label: {
    fontSize: textScale(12),
    // marginBottom: moderateScaleVertical(8),
    fontFamily: FontFamily.PoppinsMedium,
    color: Colors.textColor,
  },
  input: {
    borderWidth: moderateScale(1),
    borderColor: Colors.lightGray,
    borderRadius: moderateScale(5),
    padding: moderateScale(12),
    fontSize: textScale(14),
    color: Colors.black,
  },
  textArea: {
    minHeight: moderateScale(80),
    textAlignVertical: "top",
  },
  checklistItem: {
    marginBottom: moderateScaleVertical(16),
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: moderateScaleVertical(10),
    overflow: "hidden",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: moderateScale(16),
  },
  switchLabel: {
    marginRight: moderateScale(8),
    fontSize: textScale(13),
    fontFamily: FontFamily.PoppinsRegular,
    color: Colors.textColor,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: moderateScale(1),
    borderColor: Colors.lightGray,
    paddingBottom: moderateScale(5),
    marginBottom: moderateScale(5),
  },
  tableRow: {
    flexDirection: "row",
    marginBottom: moderateScaleVertical(8),
  },
  tableFooter: {
    flexDirection: "row",
    borderTopWidth: moderateScale(1),
    borderColor: Colors.lightGray,
    paddingTop: moderateScale(6),
    marginTop: moderateScale(6),
    marginBottom: moderateScaleVertical(10),
  },
  tableCell: {
    flex: 1,
    padding: moderateScale(4),
    justifyContent: "center",
    alignItems: "center",
  },
  headerCell: {
    fontFamily: FontFamily.PoppinsRegular,
    fontSize: textScale(9),
    textAlign: "center",
    color: Colors.textColor,
  },
  countCell: {
    fontFamily: FontFamily.PoppinsRegular,
    textAlign: "center",
    color: Colors.textColor,
    fontSize: textScale(12),
  },
  inputCell: {
    borderWidth: moderateScale(1),
    borderColor: Colors.veryLightGrey,
    borderRadius: moderateScale(5),
    padding: moderateScale(4),
    textAlign: "center",
    height: moderateScale(40),
  },
  footerCell: {
    fontFamily: FontFamily.PoppinsRegular,
    textAlign: "center",
    fontSize: textScale(12),
  },
  twoColumnLayout: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  column: {
    flex: 1,
    marginRight: moderateScale(8),
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: moderateScale(5),
    borderTopWidth: moderateScale(1),
    borderColor: Colors.lightGray,
  },
  navButton: {
    borderRadius: moderateScale(5),
    padding: moderateScale(10),
    width: moderateScale(70),
    alignItems: "center",
    backgroundColor: Colors.lightGray,
  },
  nextButton: {
    backgroundColor: Colors.greenColor,
  },
  submitButton: {
    backgroundColor: Colors.lightGreen,
  },
  rejectButton: {
    backgroundColor: Colors.red,
  },
  cancelButton: {
    backgroundColor: Colors.lightGray,
  },
  navButtonText: {
    color: Colors.white,
    fontFamily: FontFamily.PoppinsMedium,
    fontSize: textScale(10),
  },
  calendarView: {
    borderWidth: 2,
    width: moderateScale(50),
    padding: moderateScale(10),
    backgroundColor: Colors.veryLightGrey,
    borderColor: Colors.veryLightGrey,
    borderRadius: moderateScale(10),
    alignItems: "center",
    justifyContent: "center",
  },
  dateViewHolder: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
