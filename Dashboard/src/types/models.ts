export interface RoleModel {
  roleId: number;
  roleCode: string;
  roleName: string;
  status?: string;
}

export interface ModuleModel {
  id: number;
  name: string;
  code?: string;
  description?: string;
  status?: string;
}

export interface MenuModel {
  id: number;
  name: string;
  code?: string;
  displayName?: string;
  path?: string;
  moduleId?: number;
  moduleName?: string;
  parentMenuId?: number;
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
  reportingTo?: number;
  reportsToName?: string;
  validFrom?: string;
  validTo?: string;
  status?: string;
  password?: string;
}

export interface RoleMenuModel {
  roleMenuId?: number;
  roleId: number;
  roleName?: string;
  moduleId: number;
  moduleName?: string;
  menuId: number;
  menuName?: string;
  permView?: string;
  permAdd?: string;
  permEdit?: string;
  permDelete?: string;
}

export interface ModuleAccessModel {
  roleId: number;
  roleName: string;
  moduleId: number;
  moduleName: string;
  hasAccess: boolean;
}

export interface OperatingUnitModel {
  operatingUnit: number;
  name?: string;
}

export interface OrganizationModel {
  organizationId: number;
  name?: string;
}

export interface UserAccessRightsModel {
  id: number;
  userId: number;
  roleId: number;
  moduleId?: number;
  canView?: boolean;
  userName?: string;
  remarks?: string;
  status?: string;
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
}

export interface LoginResponse {
  token: string;
  userId?: number;
  userName?: string;
  fullName?: string;
  roleName?: string;
  user?: UserModel;
}
