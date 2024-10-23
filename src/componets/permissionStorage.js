// src/utils/permissionStorage.js
import { decryptData, encryptData } from "./cryptoUtils";

export const savePermissions = (permissions) => {
  const encryptedPermissions = encryptData(permissions);
  localStorage.setItem('permissions', encryptedPermissions);
};

export const getPermissions = () => {
  const encryptedPermissions = localStorage.getItem('permissions');
  if (encryptedPermissions) {
    try {
      return decryptData(encryptedPermissions);
    } catch (error) {
      console.error('Failed to decrypt permissions', error);
      return [];
    }
  }
  return [];
};
