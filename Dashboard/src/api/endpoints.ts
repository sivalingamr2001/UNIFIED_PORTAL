import type { QueryExecutionRequest, QueryExecutionResponse } from "@/types/domain";
import { apiClient } from "./axiosClient";
import type {
  RoleModel, ModuleModel, MenuModel, UserModel, RoleMenuModel, ModuleAccessModel,
  OperatingUnitModel, OrganizationModel, UserAccessRightsModel, ProcedureResult, LoginResponse,
} from "@/types/models";

type ApiRecord = Record<string, unknown>;

function asRecords(value: unknown): ApiRecord[] {
  if (Array.isArray(value)) return value.filter((item): item is ApiRecord => typeof item === "object" && item !== null);
  if (typeof value === "object" && value !== null) {
    const record = value as ApiRecord;
    const nested = record.data ?? record.items ?? record.result;
    if (Array.isArray(nested)) return asRecords(nested);
  }
  return [];
}

function numberValue(record: ApiRecord, ...keys: string[]): number {
  const value = keys.map((key) => record[key]).find((candidate) => candidate !== undefined && candidate !== null);
  return Number(value ?? 0);
}

function textValue(record: ApiRecord, ...keys: string[]): string | undefined {
  const value = keys.map((key) => record[key]).find((candidate) => typeof candidate === "string" && candidate.trim());
  return typeof value === "string" ? value : undefined;
}

function normalizeModules(value: unknown): ModuleModel[] {
  return asRecords(value).map((record) => {
    const id = numberValue(record, "id", "Id", "moduleId", "ModuleId", "module_id");
    const name = textValue(record, "name", "Name", "moduleName", "ModuleName", "module_name") ?? "";
    return {
      id,
      name,
      moduleId: id,
      moduleName: name,
      code: textValue(record, "code", "Code", "moduleCode", "ModuleCode", "module_code"),
      moduleCode: textValue(record, "code", "Code", "moduleCode", "ModuleCode", "module_code"),
      description: textValue(record, "description", "Description", "moduleDescription", "ModuleDescription", "module_description"),
      status: textValue(record, "status", "Status"),
      sortOrder: numberValue(record, "sortOrder", "SortOrder", "sort_order"),
      defaultMenu: textValue(record, "defaultMenu", "DefaultMenu", "default_menu"),
    };
  }).filter((module) => module.id > 0 && module.name);
}

function normalizeMenus(value: unknown): MenuModel[] {
  return asRecords(value).map((record) => {
    const id = numberValue(record, "id", "Id", "menuId", "MenuId", "menu_id");
    const name = textValue(record, "name", "Name", "menuName", "MenuName", "menu_name") ?? "";
    return {
      id,
      name,
      menuId: id,
      menuName: name,
      code: textValue(record, "code", "Code", "menuCode", "MenuCode", "menu_code"),
      menuCode: textValue(record, "code", "Code", "menuCode", "MenuCode", "menu_code"),
      displayName: textValue(record, "displayName", "DisplayName", "display_name") ?? name,
      path: textValue(record, "path", "Path", "route", "Route"),
      moduleId: numberValue(record, "moduleId", "ModuleId", "module_id") || undefined,
      moduleName: textValue(record, "moduleName", "ModuleName", "module_name"),
      parentMenuId: numberValue(record, "parentMenuId", "ParentMenuId", "parent_menu_id") || undefined,
      menuType: textValue(record, "menuType", "MenuType", "menu_type"),
      nature: textValue(record, "nature", "Nature"),
      sortOrder: numberValue(record, "sortOrder", "SortOrder", "sort_order"),
      status: textValue(record, "status", "Status"),
    };
  }).filter((menu) => menu.id > 0 && menu.name);
}

function normalizeAccess(value: unknown): UserAccessRightsModel | UserAccessRightsModel[] {
  const records = asRecords(value).map((record) => {
    const uarId = numberValue(record, "uarId", "uar_id");
    const id = numberValue(record, "id", "Id");
    
    // If it's a full UserAccessRightsModel
    if (record.accessChannel !== undefined || record.orgUnits !== undefined || record.uarId !== undefined) {
      const orgUnitsRaw = record.orgUnits ?? record.OrgUnits;
      return {
        uarId: uarId || id,
        userId: numberValue(record, "userId", "UserId", "user_id"),
        userName: textValue(record, "userName", "UserName", "user_name") ?? null,
        accessChannel: (textValue(record, "accessChannel", "AccessChannel", "access_channel") as any) ?? "SYSTEM",
        status: textValue(record, "status", "Status") ?? "ACTIVE",
        remarks: textValue(record, "remarks", "Remarks") ?? null,
        orgUnitsSelected: numberValue(record, "orgUnitsSelected", "OrgUnitsSelected"),
        totalOrgUnits: numberValue(record, "totalOrgUnits", "TotalOrgUnits"),
        orgUnits: Array.isArray(orgUnitsRaw) ? orgUnitsRaw.map((line) => ({
          uarId: numberValue(line, "uarId", "uar_id", "id"),
          operatingUnit: numberValue(line, "operatingUnit", "operating_unit"),
          operatingUnitName: textValue(line, "operatingUnitName", "operating_unit_name"),
          organizationId: numberValue(line, "organizationId", "organization_id"),
          organizationCode: textValue(line, "organizationCode", "organization_code"),
          limitValue: numberValue(line, "limitValue", "limit_value"),
        })) : [],
      };
    }
    
    // Default legacy mapping
    return {
      id: id || uarId,
      userId: numberValue(record, "userId", "UserId", "user_id"),
      roleId: numberValue(record, "roleId", "RoleId", "role_id"),
      moduleId: numberValue(record, "moduleId", "ModuleId", "module_id") || undefined,
      canView: [record.canView, record.CanView, record.can_view].find((value): value is boolean => typeof value === "boolean"),
    };
  });
  return records.length === 1 ? records[0] : records;
}

export const authApi = {
  login: (userName: string, password: string) =>
    apiClient.post<LoginResponse>("/auth/login", { userName, password }),
  logout: () => apiClient.post<void>("/auth/logout"),
};

export const rolesApi = {
  list: () => apiClient.get<RoleModel[]>("/roles"),
  get: (id: number) => apiClient.get<RoleModel>(`/roles/${id}`),
  create: (data: Partial<RoleModel>) => apiClient.post<ProcedureResult>("/roles", data),
  update: (id: number, data: Partial<RoleModel>) => apiClient.put<ProcedureResult>(`/roles/${id}`, data),
  remove: (id: number) => apiClient.delete<ProcedureResult>(`/roles/${id}`),
};

export const modulesApi = {
  list: async () => normalizeModules(await apiClient.get<unknown>("/modules")),
  get: (id: number) => apiClient.get<ModuleModel>(`/modules/${id}`),
  create: (data: Partial<ModuleModel>) => apiClient.post<ProcedureResult>("/modules", data),
  update: (id: number, data: Partial<ModuleModel>) => apiClient.put<ProcedureResult>(`/modules/${id}`, data),
  remove: (id: number) => apiClient.delete<ProcedureResult>(`/modules/${id}`),
};

export const menusApi = {
  list: async (moduleId?: number) => normalizeMenus(await apiClient.get<unknown>(`/menus${moduleId ? `?moduleId=${moduleId}` : ""}`)),
  get: (id: number) => apiClient.get<MenuModel>(`/menus/${id}`),
  create: (data: Partial<MenuModel>) => apiClient.post<ProcedureResult>("/menus", data),
  update: (id: number, data: Partial<MenuModel>) => apiClient.put<ProcedureResult>(`/menus/${id}`, data),
  remove: (id: number) => apiClient.delete<ProcedureResult>(`/menus/${id}`),
};

export const usersApi = {
  list: () => apiClient.get<UserModel[]>("/users"),
  get: (id: number) => apiClient.get<UserModel>(`/users/${id}`),
  create: (data: Partial<UserModel>) => apiClient.post<ProcedureResult>("/users", data),
  update: (id: number, data: Partial<UserModel>) => apiClient.put<ProcedureResult>(`/users/${id}`, data),
  changePassword: (id: number, newPassword: string) =>
    apiClient.put<ProcedureResult>(`/users/${id}/password`, { newPassword }),
  remove: (id: number) => apiClient.delete<ProcedureResult>(`/users/${id}`),
  verifyEmployee: (employeeId: string) =>
    apiClient.get<{ found: boolean; employeeName?: string }>(`/users/verify-employee/${encodeURIComponent(employeeId)}`),
};

export const roleMenuApi = {
  list: () => apiClient.get<RoleMenuModel[]>("/role-menu"),
  listByRole: (roleId: number) => apiClient.get<RoleMenuModel[]>(`/role-menu/by-role/${roleId}`),
  listModuleAccess: () => apiClient.get<ModuleAccessModel[]>("/role-menu/module-access"),
  listModuleAccessByRole: (roleId: number) =>
    apiClient.get<ModuleAccessModel[]>(`/role-menu/module-access/by-role/${roleId}`),
  getRestrictedColumns: (menuId: number) => apiClient.get<string[]>(`/role-menu/restricted-columns/${menuId}`),
  save: (data: RoleMenuModel) => apiClient.post<ProcedureResult>("/role-menu", data),
  remove: (id: number) => apiClient.delete<ProcedureResult>(`/role-menu/${id}`),
};

export const orgUnitsApi = {
  listOperatingUnits: () => apiClient.get<OperatingUnitModel[]>("/org-units/operating-units"),
  listOrganizations: (operatingUnit: number) =>
    apiClient.get<OrganizationModel[]>(`/org-units/organizations?operatingUnit=${encodeURIComponent(operatingUnit)}`),
};

export const userAccessRightsApi = {
  list: () => apiClient.get<UserAccessRightsModel[]>("/user-access-rights"),
  getByUser: async (userId: number) => normalizeAccess(await apiClient.get<unknown>(`/user-access-rights/by-user/${userId}`)) as UserAccessRightsModel,
  save: (data: UserAccessRightsModel) => apiClient.post<ProcedureResult>("/user-access-rights", data),
  removeAllForUser: (userId: number) => apiClient.delete<ProcedureResult>(`/user-access-rights/by-user/${userId}`),
};

export const queryApi = {
  execute: (request: QueryExecutionRequest) =>
    apiClient.post<QueryExecutionResponse>("/query/execute", request),
}