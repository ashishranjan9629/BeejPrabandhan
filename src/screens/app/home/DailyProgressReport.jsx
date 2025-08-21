import { StyleSheet, Text, View } from "react-native";
import React from "react";
import WrapperContainer from "../../../utils/WrapperContainer";
import InnerHeader from "../../../components/InnerHeader";

const DailyProgressReport = () => {
  return (
    <WrapperContainer>
      <InnerHeader title={"Daily Progress Report"} />
    </WrapperContainer>
  );
};

export default DailyProgressReport;

const styles = StyleSheet.create({});
