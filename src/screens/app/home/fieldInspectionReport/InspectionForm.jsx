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
import React, { useState, useEffect } from "react";
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
  console.log(data?.cropFirTypeId, "line 7");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentDateField, setCurrentDateField] = useState(null);

  // Determine crop FIR type id (defaults to 3)
  const cropFirTypeId = data?.cropFirTypeId ?? 3;

  // Helper function to create field names
  const createFieldName = (text) => {
    return text.replace(/\s+/g, "").toLowerCase();
  };

  // Define all possible Step 1 fields (label + field + placeholder)
  const STEP1_ALL_FIELDS = [
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
  ];

  // Visible field sets per crop FIR type
  const STEP1_FIELD_SETS = {
    1: [
      { label: "Seed Source", field: "seedsource" },
      { label: "Female Parent", field: "femaleParent" },
      { label: "Male Parent", field: "maleParent" },
      { label: "Code/Hybrid designation", field: "codeHybridDesignation" },
      { label: "Planting ratio (a:b)", field: "plantingRatio" },
      { label: "Previous crop", field: "previouscrop" },
      { label: "Are both end marked?", field: "areBothEndMarked", type: "switch" },
      { label: "Method of marking male rows", field: "methodOfMarkingMaleRows" },
      { label: "Stage of crop growth at this inspection", field: "stageOfCropGrowthAtInspection" },
      { label: "label.stageOfGrowthOfContaminant", field: "stageofgrowthofcontaminant" },
      { label: "Isolation Distance North", field: "isolationDistanceNorth", keyboardType: "numeric" },
      { label: "Isolation Distance South", field: "isolationDistanceSouth", keyboardType: "numeric" },
      { label: "Isolation Distance East", field: "isolationDistanceEast", keyboardType: "numeric" },
      { label: "Isolation Distance West", field: "isolationDistanceWest", keyboardType: "numeric" },
      { label: "Report Number", field: "reportnumber" },
      { label: "Time From", field: "timeFrom" },
      { label: "Time To", field: "timeTo" },
    ],
    2: STEP1_ALL_FIELDS.map((f) => ({ ...f })),
    3: [
      { label: "Seed Source", field: "seedsource" },
      { label: "Female Parent", field: "femaleParent" },
      { label: "Male Parent", field: "maleParent" },
      { label: "Code/Hybrid designation", field: "codeHybridDesignation" },
      { label: "Planting ratio (a:b)", field: "plantingRatio" },
      { label: "Are both end of male rows marked?", field: "areBothEndOfMaleRowsMarked", type: "switch" },
      { label: "Method of marking male rows", field: "methodOfMarkingMaleRows" },
      { label: "Isolation Distance (in meters)", field: "isolationDistanceMeters", keyboardType: "numeric" },
      { label: "Stage of Growth of Coteminant", field: "stageofgrowthofcontaminant" },
      { label: "Stage of Seed Crop at this Inspection", field: "stageofseedcropatthisinspection" },
    ],
  };

  const visibleStep1Fields = (STEP1_FIELD_SETS[cropFirTypeId] || STEP1_FIELD_SETS[3]);

  // Form state
  const [formData, setFormData] = useState({
    // Step 1 fields
    dateOfSowing: "",
    expectedHarvestFrom: "",
    expectedHarvestTo: "",
    expectedHarvest: "",
    timeFrom: "",
    timeTo: "",
    dateOfInspection: "",
    // Initialize all text input fields
    natureofprogramme: "",
    labeoffarm: "",
    acreageoffieldnoinspectedinha: "",
    stageofgrowthofcontaminant: "",
    stageOfCropGrowthAtInspection: "",
    reportnumber: "",
    seedsource: "",
    femaleParent: "",
    maleParent: "",
    codeHybridDesignation: "",
    plantingRatio: "",
    previouscrop: "",
    areBothEndMarked: false,
    areBothEndOfMaleRowsMarked: false,
    methodOfMarkingMaleRows: "",
    isolationdistance: "",
    isolationDistanceNorth: "",
    isolationDistanceSouth: "",
    isolationDistanceEast: "",
    isolationDistanceWest: "",
    isolationDistanceMeters: "",
    totalacreageunderproductioninha: "",

    // Step 2 fields
    counts: Array(10)
      .fill()
      .map(() => ({
        offType: "",
        otherCrops: "",
        weeds: "",
        disease: "",
      })),

    // Step 3 fields (union of all types)
    offTypePercentage: "",
    inseparableOtherCropsPercentage: "",
    objectionableWeedsPercentage: "",
    seedBorneDiseasesPercentage: "",
    seedBorneDiseasesName: "",
    inseparableOtherCropsName: "",
    objectionableWeedsName: "",
    nonSeedBorneDiseases: "",
    conditionOfCrop: "",
    confirmsToStandards: false,
    doesCropConformToStandards: false,
    productionQuality: "",
    qualityOfSeedProductionWork: "",
    estimatedSeedField: "",
    estimatedRawSeedYield: "",
    estimatedSeedYieldKgPerHa: "",
    estimatedSeedYieldKgsPerAcres: "",
    noOfBorderRow: "",
    noOfTimesPollenSheddersRemoved: "",
    frequencyOfPollenShedders: "",
    noOfTimesDetasselled: "",
    frequencyOfDetasselling: "",
    wasItDoneAtInspectionTime: false,
    detassellingDoneAtInspectionTime: false,
    growerPresent: false,
    wasGrowerPresentAtInspectionTime: false,
    isFinalReport: false,
    areaRejectedHa: "",
    areaCertifiedHa: "",
    sideOfFieldFromWhichInspectionWasStarted: "",
    name: "",
    address: "",
    growerName: "",
    submittedBy: "",
    designation: "",
    remarks: "",
  });

  // Default values per crop type for Step 1
  const STEP1_DEFAULTS_BY_TYPE = {
    1: {
      natureofprogramme: "",
      reportnumber: "",
      seedsource: "",
      previouscrop: "",
    },
    2: {
      labeoffarm: "",
      totalacreageunderproductioninha: String(data?.totalInspectedArea ?? ""),
      acreageoffieldnoinspectedinha: String(data?.totalInspectedArea ?? ""),
      isolationdistance: "",
    },
    3: {},
  };

  // Initialize defaults when component mounts
  useEffect(() => {
    const defaults = STEP1_DEFAULTS_BY_TYPE[cropFirTypeId] || {};
    if (Object.keys(defaults).length > 0) {
      setFormData((prev) => ({ ...prev, ...defaults }));
    }
  }, []);

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

        {cropFirTypeId === 1 && (
          <>
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
              <Text style={styles.label}>Expected Date Of Harvest</Text>
              <View style={styles.dateViewHolder}>
                <TextInput
                  style={[styles.input, { width: "80%" }]}
                  placeholder="dd/mm/yyyy"
                  value={formData.expectedHarvest}
                  editable={false}
                />
                <TouchableOpacity
                  style={styles.calendarView}
                  onPress={() => showDatePickerModal("expectedHarvest")}
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

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Time From</Text>
              <TextInput
                style={styles.input}
                placeholder="HH:MM"
                value={formData.timeFrom}
                onChangeText={(text) => handleInputChange("timeFrom", text)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Time To</Text>
              <TextInput
                style={styles.input}
                placeholder="HH:MM"
                value={formData.timeTo}
                onChangeText={(text) => handleInputChange("timeTo", text)}
              />
            </View>
          </>
        )}

        {cropFirTypeId === 2 && (
          <>
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
          </>
        )}

        {/* Type 3 has no date fields in Step 1 per spec */}

        <Text style={styles.sectionTitle}>Checklist Items</Text>
        {visibleStep1Fields.map((item, index) => (
          <View key={index} style={styles.inputGroup}>
            <Text style={styles.label}>{item.label}</Text>
            {item.type === "switch" ? (
              <View style={[styles.switchRow, { justifyContent: "flex-start" }]}>
                <View style={styles.switchContainer}>
                  <Switch
                    value={!!formData[item.field]}
                    onValueChange={(value) => handleInputChange(item.field, value)}
                    trackColor={{ false: "#767577", true: Colors.lightGreen }}
                    thumbColor={formData[item.field] ? Colors.greenColor : "#f4f3f4"}
                  />
                </View>
              </View>
            ) : (
              <TextInput
                style={styles.input}
                placeholder={item.placeholder || "Enter value"}
                value={String(formData[item.field] ?? "")}
                onChangeText={(text) => handleInputChange(item.field, text)}
                keyboardType={item.keyboardType || "default"}
              />
            )}
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

        {cropFirTypeId === 1 && (
          <>
            {[ 
              { label: "No. of Border Row", field: "noOfBorderRow", keyboardType: "numeric" },
              { label: "Crop Condition", field: "cropCondition" },
              { label: "No. of times pollen shedders / off types were removed", field: "noOfTimesPollenSheddersRemoved", keyboardType: "numeric" },
              { label: "Frequency of pollen shedders, off types etc.", field: "frequencyOfPollenShedders" },
              { label: "Was it done at inspection time?", field: "wasItDoneAtInspectionTime", type: "switch" },
              { label: "Quality of seed production work", field: "qualityOfSeedProductionWork" },
              { label: "Does this crop conform to the standards for certification", field: "doesCropConformToStandards", type: "switch" },
              { label: "Estimated seed yield (Kgs/ Hect.)", field: "estimatedSeedYieldKgPerHa", keyboardType: "numeric" },
              { label: "Was the Grower or his representatives present at inspection time?", field: "wasGrowerPresentAtInspectionTime", type: "switch" },
              { label: "Is this the final report?", field: "isFinalReport", type: "switch" },
              { label: "Area rejected (in Ha)", field: "areaRejectedHa", keyboardType: "numeric" },
              { label: "Area certified (in Ha)", field: "areaCertifiedHa", keyboardType: "numeric" },
              { label: "Name", field: "name" },
              { label: "Designation", field: "designation" },
              { label: "Address", field: "address" },
              { label: "Remarks", field: "remarks", multiline: true },
            ].map((item, idx) => (
              <View key={idx} style={styles.inputGroup}>
                <Text style={styles.label}>{item.label}</Text>
                {item.type === "switch" ? (
                  <View style={[styles.switchRow, { justifyContent: "flex-start" }]}>
                    <View style={styles.switchContainer}>
                      <Switch
                        value={!!formData[item.field]}
                        onValueChange={(value) => handleInputChange(item.field, value)}
                        trackColor={{ false: "#767577", true: Colors.lightGreen }}
                        thumbColor={formData[item.field] ? Colors.greenColor : "#f4f3f4"}
                      />
                    </View>
                  </View>
                ) : (
                  <TextInput
                    style={[styles.input, item.multiline ? styles.textArea : null]}
                    value={String(formData[item.field] ?? "")}
                    onChangeText={(text) => handleInputChange(item.field, text)}
                    keyboardType={item.keyboardType || "default"}
                    multiline={!!item.multiline}
                  />
                )}
              </View>
            ))}
          </>
        )}

        {cropFirTypeId === 2 && (
          <>
            {[ 
              { label: "Percentage of Off-Types plants", field: "offTypePercentage", keyboardType: "numeric" },
              { label: "Percentage of Inseparable Other Crops", field: "inseparableOtherCropsPercentage", keyboardType: "numeric" },
              { label: "Percentage of Objectionable Weed Plants", field: "objectionableWeedsPercentage", keyboardType: "numeric" },
              { label: "Percentage of Seed-borne Diseases", field: "seedBorneDiseasesPercentage", keyboardType: "numeric" },
              { label: "Name of Inseparable Other Crop Plants", field: "inseparableOtherCropsName" },
              { label: "Name of Objectionable Weed Plants", field: "objectionableWeedsName" },
              { label: "Name of Seed-borne Diseases", field: "seedBorneDiseasesName" },
              { label: "Names of Non-seed Borne Disease(s)", field: "nonSeedBorneDiseases" },
              { label: "Condition of Crop", field: "conditionOfCrop" },
              { label: "Does this crop confirm to standards of cert.?", field: "confirmsToStandards", type: "switch" },
              { label: "Quality of Production Work", field: "productionQuality" },
              { label: "Is this the final report?", field: "isFinalReport", type: "switch" },
              { label: "Estimated Raw Seed Yield (Kg/hect)", field: "estimatedRawSeedYield", keyboardType: "numeric" },
              { label: "Was Grower or his representative present at the time of inspection", field: "growerPresent", type: "switch" },
              { label: "Submitted for (Grower Name)", field: "growerName" },
              { label: "Submitted By (Name of Inspecting Official)", field: "submittedBy" },
              { label: "Designation", field: "designation" },
              { label: "Remarks", field: "remarks", multiline: true },
            ].map((item, idx) => (
              <View key={idx} style={styles.inputGroup}>
                <Text style={styles.label}>{item.label}</Text>
                {item.type === "switch" ? (
                  <View style={[styles.switchRow, { justifyContent: "flex-start" }]}>
                    <View style={styles.switchContainer}>
                      <Switch
                        value={!!formData[item.field]}
                        onValueChange={(value) => handleInputChange(item.field, value)}
                        trackColor={{ false: "#767577", true: Colors.lightGreen }}
                        thumbColor={formData[item.field] ? Colors.greenColor : "#f4f3f4"}
                      />
                    </View>
                  </View>
                ) : (
                  <TextInput
                    style={[styles.input, item.multiline ? styles.textArea : null]}
                    value={String(formData[item.field] ?? "")}
                    onChangeText={(text) => handleInputChange(item.field, text)}
                    keyboardType={item.keyboardType || "default"}
                    multiline={!!item.multiline}
                  />
                )}
              </View>
            ))}
          </>
        )}

        {cropFirTypeId === 3 && (
          <>
            {[ 
              { label: "Side of field from which inspection was started", field: "sideOfFieldFromWhichInspectionWasStarted" },
              { label: "Crop Condition", field: "cropCondition" },
              { label: "No. of times detasselled", field: "noOfTimesDetasselled", keyboardType: "numeric" },
              { label: "label.frequencyOfDetasselling", field: "frequencyOfDetasselling" },
              { label: "label.detassellingDoneAtInspectionTime", field: "detassellingDoneAtInspectionTime", type: "switch" },
              { label: "Quality of seed production work", field: "qualityOfSeedProductionWork" },
              { label: "Quality of seed production work", field: "qualityOfSeedProductionWork" },
              { label: "Estimated seed yield (Kgs./acres)", field: "estimatedSeedYieldKgsPerAcres", keyboardType: "numeric" },
              { label: "Was Grower or his representative present at the time of inspection", field: "growerPresent", type: "switch" },
              { label: "No. of Border Row", field: "noOfBorderRow", keyboardType: "numeric" },
              { label: "Is this final report", field: "isFinalReport", type: "switch" },
              { label: "Area rejected(in Ha)", field: "areaRejectedHa", keyboardType: "numeric" },
              { label: "Area certified (in Ha)", field: "areaCertifiedHa", keyboardType: "numeric" },
              { label: "Remarks", field: "remarks", multiline: true },
            ].map((item, idx) => (
              <View key={idx} style={styles.inputGroup}>
                <Text style={styles.label}>{item.label}</Text>
                {item.type === "switch" ? (
                  <View style={[styles.switchRow, { justifyContent: "flex-start" }]}>
                    <View style={styles.switchContainer}>
                      <Switch
                        value={!!formData[item.field]}
                        onValueChange={(value) => handleInputChange(item.field, value)}
                        trackColor={{ false: "#767577", true: Colors.lightGreen }}
                        thumbColor={formData[item.field] ? Colors.greenColor : "#f4f3f4"}
                      />
                    </View>
                  </View>
                ) : (
                  <TextInput
                    style={[styles.input, item.multiline ? styles.textArea : null]}
                    value={String(formData[item.field] ?? "")}
                    onChangeText={(text) => handleInputChange(item.field, text)}
                    keyboardType={item.keyboardType || "default"}
                    multiline={!!item.multiline}
                  />
                )}
              </View>
            ))}
          </>
        )}
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
