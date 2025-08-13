import { MMKV } from "react-native-mmkv";
const storage = new MMKV();
const STORAGE_KEY = "BeejPrabandhan";

//  Function to save User data
export const saveUserData = (userData) => {
  try {
    storage.set(STORAGE_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error("Error saving user data:", error);
  }
};

//  Function to save User token
export const saveUserToken = (userData) => {
  try {
    storage.set(STORAGE_KEY, JSON.stringify(userData?.token));
    console.log("User token saved successfully");
  } catch (error) {
    console.error("Error saving user data:", error);
  }
};

// Function to get user data
export const getUserData = () => {
  try {
    const data = storage.getString(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error retrieving user data:", error);
    return null;
  }
};

// Function to get user data
export const getUserToken = () => {
  try {
    const data = storage.getString(STORAGE_KEY);
    return data?.token ? JSON.parse(data?.token) : null;
  } catch (error) {
    console.error("Error retrieving user data:", error);
    return null;
  }
};

// Function to remove user data (logout)
export const removeUserData = () => {
  try {
    storage.delete(STORAGE_KEY);
    console.log("User data removed successfully");
  } catch (error) {
    console.error("Error removing user data:", error);
  }
};

// Custom storage engine for redux-persist
export const mmkvStorage = {
  setItem: (key, value) => {
    storage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: (key) => {
    const value = storage.getString(key);
    return Promise.resolve(value);
  },
  removeItem: (key) => {
    storage.delete(key);
    return Promise.resolve(true);
  },
};
