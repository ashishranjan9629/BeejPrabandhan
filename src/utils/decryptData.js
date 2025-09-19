import CryptoJS from "crypto-js";

const CRYPTO_KEY =
  "ewerrwxr9bvcocvfIfIvEM3erLl34ldvczxcsp4txlki1as4gq22h%fa8fxfk";
const LGC = 4;

const getPmh = () => {
  let tem = CRYPTO_KEY;
  let res = "";
  for (let i = 0; i <= tem.length; i++) {
    if (i % LGC === 0) {
      res += tem[i];
    }
  }
  return res;
};

const secretKeyStr = getPmh();
const secretKey = CryptoJS.enc.Utf8.parse(secretKeyStr);

/**
 * Decrypt AES-encrypted string
 * @param {string} val - Encrypted string from server
 * @returns {string|null} - Decrypted string or null
 */
export const decryptAES = (val) => {
  if (!val) return null;

  // Replace symbols back to original base64 encoding
  val = val.replaceAll(".", "/").replaceAll(" ", "+");

  try {
    const decrypted = CryptoJS.AES.decrypt(val, secretKey, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });

    return decrypted.toString(CryptoJS.enc.Utf8) || null;
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
};

// export const deepDecryptObject = (obj) => {
//   if (!obj || typeof obj !== "object") return obj;

//   const decrypted = {};

//   for (const key in obj) {
//     if (!obj.hasOwnProperty(key)) continue;

//     const value = obj[key];

//     if (typeof value === "string") {
//       decrypted[key] = decryptAES(value) ?? value; // fallback to original if decryption fails
//     } else if (typeof value === "object" && value !== null) {
//       decrypted[key] = deepDecryptObject(value); // recursive for nested objects
//     } else {
//       decrypted[key] = value;
//     }
//   }

//   return decrypted;
// };

export const deepDecryptObject = (obj) => {
  if (!obj || typeof obj !== "object") return obj;

  const decrypted = Array.isArray(obj) ? [] : {};

  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue;

    const value = obj[key];

    if (typeof value === "string") {
      // Only attempt to decrypt if it looks like Base64 encrypted data
      if (isLikelyEncrypted(value)) {
        const decryptedValue = decryptAES(value);
        // If decryption returns null, keep it as null instead of the encrypted string
        decrypted[key] = decryptedValue !== null ? decryptedValue : null;
      } else {
        // For regular strings, keep as is
        decrypted[key] = value;
      }
    } else if (typeof value === "object" && value !== null) {
      decrypted[key] = deepDecryptObject(value); // recursive for nested objects
    } else {
      decrypted[key] = value;
    }
  }

  return decrypted;
};

// Helper function to detect if a string is likely encrypted
const isLikelyEncrypted = (value) => {
  // Check if it's a Base64 string (common pattern for encrypted data)
  const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;

  // Also check if it's not obviously unencrypted data
  return (
    base64Regex.test(value) &&
    value.length >= 16 && // Minimum length for meaningful encrypted data
    !value.includes(" ") && // Encrypted data usually doesn't have spaces
    !value.startsWith("{") && // Not JSON
    !value.startsWith("[") && // Not array
    !value.includes("@") // Not email
  );
};

export const encryptAES = (val, skipSymbolReplacement = false) => {
  if (val == null) return null;

  try {
    let encrypted = CryptoJS.AES.encrypt(val.toString(), secretKey, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }).toString();

    if (!skipSymbolReplacement) {
      encrypted = encrypted.replaceAll("/", ".").replaceAll("+", " ");
    }

    return encrypted;
  } catch (error) {
    console.error("Encryption error:", error);
    return val; // fallback to original value
  }
};

export const deepEncryptObject = (obj) => {
  if (!obj || typeof obj !== "object") return obj;

  const encrypted = {};

  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue;

    const value = obj[key];

    if (typeof value === "string" || typeof value === "number") {
      encrypted[key] = encryptAES(value.toString());
    } else if (typeof value === "object" && value !== null) {
      encrypted[key] = deepEncryptObject(value); // recursive
    } else {
      encrypted[key] = value;
    }
  }

  return encrypted;
};

export const encryptFullPayload = (obj) => {
  if (!obj || typeof obj !== "object") return null;

  try {
    const jsonString = JSON.stringify(obj);
    const encrypted = encryptAES(jsonString, true); // true = skip symbol replacement for server compatibility
    return { data: encrypted };
  } catch (error) {
    console.error("Full payload encryption failed:", error);
    return null;
  }
};

/**
 * Encrypt entire object into a single encrypted string
 * @param {Object} obj - The object to encrypt
 * @returns {string|null} - Encrypted string
 */
export const encryptWholeObject = (obj) => {
  if (!obj || typeof obj !== "object") return null;

  try {
    const jsonString = JSON.stringify(obj);
    return encryptAES(jsonString, true); // true to keep original characters (slashes, pluses, etc.)
  } catch (error) {
    console.error("Encryption failed:", error);
    return null;
  }
};
