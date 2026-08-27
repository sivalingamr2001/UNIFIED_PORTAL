export interface RoleModel {
  roleId: number;
  roleCode: string;
  roleName: string;
  status?: string;
  sourceType?: string;
  remarks?: string;
  roleVersion?: number;
}

export interface ModuleModel {
  id: number;
  name: string;
  moduleId?: number;
  moduleName?: string;
  code?: string;
  moduleCode?: string;
  description?: string;
  status?: string;
  sortOrder?: number;
  defaultMenu?: string;
}

export interface MenuModel {
  id: number;
  name: string;
  menuId?: number;
  menuName?: string;
  code?: string;
  menuCode?: string;
  displayName?: string;
  path?: string;
  moduleId?: number | null;
  moduleName?: string;
  parentMenuId?: number | null;
  menuType?: string;
  nature?: string;
  sortOrder?: number;
  status?: string;
}

export interface UserModel {
  userId: number;
  userCode: string;
  userName: string;
  fullName: string;
  primaryEmail: string;
  primaryMobile: string;
  roleId?: number;
  roleName?: string;
  userType?: string;
  securityLevel?: number;
  reportingTo?: number | null;
  reportsToName?: string;
  validFrom?: string;
  validTo?: string;
  status?: string;
  password?: string;
  employeeId?: string;
  maxSessions?: number;
  loginWorkdaysOnly?: string;
  loginFromTime?: string;
  loginToTime?: string;
}

export interface RoleMenuModel {
  roleMenuId?: number;
  roleId: number;
  roleName?: string | null;
  moduleId: number;
  moduleName?: string | null;
  menuId: number;
  menuName?: string | null;
  permView?: string;
  permAdd?: string;
  permEdit?: string;
  permDelete?: string;
  permExport?: string;
  permApprove?: string;
  restrictedColumns?: string | null;
}

export interface ModuleAccessModel {
  roleId: number;
  roleName: string;
  moduleId: number;
  moduleName: string;
  hasAccess?: boolean;
  accessFlag?: string;
}

export interface OperatingUnitModel {
  operatingUnit: number;
  name?: string;
  operatingUnitName?: string;
}

export interface OrganizationModel {
  organizationId: number;
  name?: string;
  organizationCode?: string;
}

export interface OrgUnitLine {
  uarId: number;
  operatingUnit: number;
  operatingUnitName?: string | null;
  organizationId: number;
  organizationCode?: string | null;
  limitValue: number;
}

export interface UserAccessRightsModel {
  uarId?: number;
  userId: number;
  userName?: string | null;
  accessChannel?: "SYSTEM" | "MOBILE" | "BOTH";
  status?: string;
  remarks?: string | null;
  orgUnitsSelected?: number;
  totalOrgUnits?: number;
  orgUnits?: OrgUnitLine[];
  id?: number;
  roleId?: number;
  moduleId?: number;
  canView?: boolean;
}

export interface ProcedureResult {
  success: boolean;
  message?: string;
  userId?: number;
  roleId?: number;
  moduleId?: number;
  menuId?: number;
  roleMenuId?: number;
  data?: any;
  generatedCode?: string;
}

export interface LoginResponse {
  token: string;
  userId?: number;
  userName?: string;
  fullName?: string;
  roleName?: string;
  user?: UserModel;
}
