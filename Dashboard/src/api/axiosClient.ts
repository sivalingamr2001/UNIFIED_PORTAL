import axios,{
    type AxiosInstance,
    type AxiosRequestConfig,
    type AxiosResponse,
} from "axios";

/** API models from the supplied OpenAPI document. */
export interface ChangePasswordRequest {
    newPassword?: string | null;
}

export interface MenuModel {
    menuId?: number;
    menuCode?: string | null;
    menuName?: string | null;
    displayName?: string | null;
    moduleId?: number;
    moduleName?: string | null;
    parentMenuId?: number | null;
    menuType?: string | null;
    nature?: string | null;
    sortOrder?: number;
    status?: string | null;
}

export interface ModuleModel {
    moduleId?: number;
    moduleCode?: string | null;
    moduleName?: string | null;
    defaultMenu?: string | null;
    sortOrder?: number;
    remarks?: string | null;
    status?: string | null;
}

export interface OrgUnitLine {
    uarId?: number;
    operatingUnit?: number;
    operatingUnitName?: string | null;
    organizationId?: number;
    organizationCode?: string | null;
    limitValue?: number;
}

export interface RoleMenuModel {
    roleMenuId?: number;
    roleId?: number;
    roleName?: string | null;
    moduleId?: number;
    moduleName?: string | null;
    menuId?: number;
    menuName?: string | null;
    permView?: string | null;
    permAdd?: string | null;
    permEdit?: string | null;
    permDelete?: string | null;
    permExport?: string | null;
    permApprove?: string | null;
    restrictedColumns?: string | null;
}

export interface RoleModel {
    roleId?: number;
    roleCode?: string | null;
    roleName?: string | null;
    sourceType?: string | null;
    remarks?: string | null;
    roleVersion?: string | null;
    status?: string | null;
}

export interface UserAccessRightsModel {
    uarId?: number;
    userId?: number;
    userName?: string | null;
    accessChannel?: string | null;
    status?: string | null;
    remarks?: string | null;
    orgUnitsSelected?: number;
    totalOrgUnits?: number;
    orgUnits?: OrgUnitLine[] | null;
}

export interface UserLoginRequest {
    userName?: string | null;
    password?: string | null;
}

export interface UserModel {
    userId?: number;
    userCode?: string | null;
    employeeId?: string | null;
    fullName?: string | null;
    userName?: string | null;
    password?: string | null;
    userType?: string | null;
    securityLevel?: number;
    roleId?: number;
    roleName?: string | null;
    reportingTo?: number | null;
    reportsToName?: string | null;
    validFrom?: string;
    validTo?: string | null;
    status?: string | null;
    primaryEmail?: string | null;
    primaryMobile?: string | null;
    passwordPolicy?: string | null;
    workOperatingUnit?: number | null;
    theme?: string | null;
    timezone?: string | null;
    maxSessions?: number;
    loginWorkdaysOnly?: string | null;
    loginFromTime?: string | null;
    loginToTime?: string | null;
    allowedMachines?: string | null;
    allowedIps?: string | null;
}

export interface AxiosClientOptions {
    /** Defaults to the OpenAPI server URL: `/janadmin`. */
    baseURL?: string;
    /** Optional token provider, useful when the token is stored outside localStorage. */
    getAccessToken?: () => string | null | undefined;
    axiosConfig?: AxiosRequestConfig;
}

export type ApiResponse<T> = Promise<AxiosResponse<T>>;

export function createAxiosClient(options: AxiosClientOptions = {}) {
    const instance: AxiosInstance = axios.create({
        baseURL: options.baseURL ?? import.meta.env.VITE_API_BASE_URL_PROD ?? "https://api.janaticsindia.com/janadmin/api/",
        headers: {
            "Content-Type": "application/json",
        },
        ...options.axiosConfig,
    });

    instance.interceptors.request.use((config: any) => {
        const storedToken =
            typeof window !== "undefined" ? window.localStorage.getItem("accessToken") : null;
        const token = options.getAccessToken?.() ?? storedToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    return instance;
}

export const axiosClient = createAxiosClient();

/** Named API methods generated from the supplied OpenAPI paths. */
export const api = {
    auth: {
        login: (payload: UserLoginRequest): ApiResponse<unknown> =>
            axiosClient.post("/api/auth/login", payload),
        logout: (): ApiResponse<unknown> =>
            axiosClient.post("/api/auth/logout"),
    },

    menus: {
        getAll: (moduleId?: number): ApiResponse<MenuModel[]> =>
            axiosClient.get("/api/menus", { params: { moduleId } }),
        create: (payload: MenuModel): ApiResponse<MenuModel> =>
            axiosClient.post("/api/menus", payload),
        getById: (id: number): ApiResponse<MenuModel> =>
            axiosClient.get(`/api/menus/${id}`),
        update: (id: number, payload: MenuModel): ApiResponse<MenuModel> =>
            axiosClient.put(`/api/menus/${id}`, payload),
        remove: (id: number): ApiResponse<unknown> =>
            axiosClient.delete(`/api/menus/${id}`),
    },

    modules: {
        getAll: (): ApiResponse<ModuleModel[]> =>
            axiosClient.get("/api/modules"),
        create: (payload: ModuleModel): ApiResponse<ModuleModel> =>
            axiosClient.post("/api/modules", payload),
        getById: (id: number): ApiResponse<ModuleModel> =>
            axiosClient.get(`/api/modules/${id}`),
        update: (id: number, payload: ModuleModel): ApiResponse<ModuleModel> =>
            axiosClient.put(`/api/modules/${id}`, payload),
        remove: (id: number): ApiResponse<unknown> =>
            axiosClient.delete(`/api/modules/${id}`),
    },

    orgUnits: {
        getOperatingUnits: (): ApiResponse<unknown[]> =>
            axiosClient.get("/api/org-units/operating-units"),
        getOrganizations: (operatingUnit?: number): ApiResponse<unknown[]> =>
            axiosClient.get("/api/org-units/organizations", {
                params: { operatingUnit },
            }),
    },

    roleMenu: {
        getAll: (): ApiResponse<RoleMenuModel[]> =>
            axiosClient.get("/api/role-menu"),
        create: (payload: RoleMenuModel): ApiResponse<RoleMenuModel> =>
            axiosClient.post("/api/role-menu", payload),
        getByRole: (roleId: number): ApiResponse<RoleMenuModel[]> =>
            axiosClient.get(`/api/role-menu/by-role/${roleId}`),
        getModuleAccess: (): ApiResponse<unknown[]> =>
            axiosClient.get("/api/role-menu/module-access"),
        getModuleAccessByRole: (roleId: number): ApiResponse<unknown[]> =>
            axiosClient.get(`/api/role-menu/module-access/by-role/${roleId}`),
        getRestrictedColumns: (menuId: number): ApiResponse<unknown[]> =>
            axiosClient.get(`/api/role-menu/restricted-columns/${menuId}`),
        getRestrictedColumnsForRole: (
            menuId: number,
            roleId: number,
        ): ApiResponse<unknown[]> =>
            axiosClient.get(
                `/api/role-menu/restricted-columns/${menuId}/for-role/${roleId}`,
            ),
        remove: (id: number): ApiResponse<unknown> =>
            axiosClient.delete(`/api/role-menu/${id}`),
    },

    roles: {
        getAll: (): ApiResponse<RoleModel[]> =>
            axiosClient.get("/api/roles"),
        create: (payload: RoleModel): ApiResponse<RoleModel> =>
            axiosClient.post("/api/roles", payload),
        getById: (id: number): ApiResponse<RoleModel> =>
            axiosClient.get(`/api/roles/${id}`),
        update: (id: number, payload: RoleModel): ApiResponse<RoleModel> =>
            axiosClient.put(`/api/roles/${id}`, payload),
        remove: (id: number): ApiResponse<unknown> =>
            axiosClient.delete(`/api/roles/${id}`),
    },

    sessions: {
        getAll: (): ApiResponse<unknown[]> =>
            axiosClient.get("/api/sessions"),
        end: (id: number): ApiResponse<unknown> =>
            axiosClient.post(`/api/sessions/${id}/end`),
    },

    userAccessRights: {
        getAll: (): ApiResponse<UserAccessRightsModel[]> =>
            axiosClient.get("/api/user-access-rights"),
        create: (
            payload: UserAccessRightsModel,
        ): ApiResponse<UserAccessRightsModel> =>
            axiosClient.post("/api/user-access-rights", payload),
        getByUser: (userId: number): ApiResponse<UserAccessRightsModel[]> =>
            axiosClient.get(`/api/user-access-rights/by-user/${userId}`),
        removeByUser: (userId: number): ApiResponse<unknown> =>
            axiosClient.delete(`/api/user-access-rights/by-user/${userId}`),
    },

    users: {
        getAll: (): ApiResponse<UserModel[]> =>
            axiosClient.get("/api/users"),
        create: (payload: UserModel): ApiResponse<UserModel> =>
            axiosClient.post("/api/users", payload),
        getById: (id: number): ApiResponse<UserModel> =>
            axiosClient.get(`/api/users/${id}`),
        update: (id: number, payload: UserModel): ApiResponse<UserModel> =>
            axiosClient.put(`/api/users/${id}`, payload),
        remove: (id: number): ApiResponse<unknown> =>
            axiosClient.delete(`/api/users/${id}`),
        changePassword: (
            id: number,
            payload: ChangePasswordRequest,
        ): ApiResponse<unknown> =>
            axiosClient.put(`/api/users/${id}/password`, payload),
    },
};

export default axiosClient;
