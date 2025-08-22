import { showMessage } from "react-native-flash-message";
import { apiRequest } from "../services/APIRequest";
import { decryptAES, deepDecryptObject } from "./decryptData";
import { API_ROUTES } from "../services/APIRoutes";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/slice/UserSlice";
import { saveUserData } from "./Storage";

export const showSuccessMessage = (message) => {
  showMessage({
    message: message,
    icon: "success",
    type: "success",
  });
};

export const showErrorMessage = (message) => {
  showMessage({
    message: message,
    icon: "danger",
    type: "danger",
  });
};







