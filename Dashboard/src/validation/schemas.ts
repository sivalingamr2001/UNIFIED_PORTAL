import type { Schema } from "../utils/validate";

export const roleSchema: Schema = {
  roleName: { required: true, max: 100, message: "Role name is required (max 100 chars)" },
  remarks: { max: 400, message: "Remarks must be at most 400 chars" },
};

export const moduleSchema: Schema = {
  moduleName: { required: true, max: 100, message: "Module name is required (max 100 chars)" },
  defaultMenu: { max: 100, message: "Default menu must be at most 100 chars" },
  sortOrder: { required: true, min: 1, max: 999, message: "Sort order must be between 1 and 999" },
};

export const menuSchema: Schema = {
  displayName: { required: true, max: 100, message: "Display name is required (max 100 chars)" },
  moduleId: { required: true, message: "Module is required" },
  sortOrder: { required: true, min: 1, max: 999, message: "Sort order must be between 1 and 999" },
};

export const userCreateSchema: Schema = {
  fullName: { required: true, max: 150, message: "Full name is required (max 150 chars)" },
  userType: { required: true, message: "User type is required" },
  employeeId: { required: true, max: 50, message: "ID is required (max 50 chars)" },
  password: { required: true, min: 6, max: 128, message: "Password is required (6-128 chars)" },
  roleId: { required: true, message: "Role is required" },
  primaryEmail: { max: 150, message: "Email must be at most 150 chars" },
  primaryMobile: { max: 20, message: "Mobile must be at most 20 chars" },
};

export const userEditSchema: Schema = {
  fullName: { required: true, max: 150, message: "Full name is required (max 150 chars)" },
  userType: { required: true, message: "User type is required" },
  employeeId: { required: true, max: 50, message: "ID is required (max 50 chars)" },
  password: { min: 6, max: 128, message: "Password must be 6-128 chars" },
  roleId: { required: true, message: "Role is required" },
  primaryEmail: { max: 150, message: "Email must be at most 150 chars" },
  primaryMobile: { max: 20, message: "Mobile must be at most 20 chars" },
};
