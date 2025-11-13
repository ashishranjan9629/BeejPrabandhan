import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import Colors from "../utils/Colors";

export default function DropDown({
  isVisible,
  setIsVisible,
  value,
  selectItem,
  data,
  disabled = false,
}) {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>Activity/Operation</Text>
      <TouchableOpacity
        disabled={disabled}
        style={styles.dropdownButton}
        onPress={() => {
          setIsVisible(!isVisible);
        }}
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
          {value || `Select Activity/Operation`}
        </Text>
        <Icon name="arrow-drop-down" size={24} color={Colors.grey} />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setIsVisible(!isVisible);
        }}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => {
            setIsVisible(!isVisible);
          }}
        >
          <View style={styles.dropdownModal}>
            <FlatList
              data={data}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      selectItem(item);
                    }}
                  >
                    {item?.operationName ? (
                      <Text>{item?.operationName}</Text>
                    ) : item?.macName ? (
                      <Text>{item?.macName}</Text>
                    ) : item?.itemName ? (
                      <Text>{item?.itemName}</Text>
                    ) : (
                      <Text>{item}</Text>
                    )}
                  </TouchableOpacity>
                );
              }}
              style={styles.dropdownList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
