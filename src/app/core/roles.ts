export enum AppRoleId {
  SystemAdmin = 1,
  EntityAdmin = 2,
  EntityUser = 3,
  VendorAdmin = 4,
  VendorUser = 5,
}

export const AppRoleName = {
  SystemAdmin: 'SystemAdmin',
  EntityAdmin: 'EntityAdmin',
  EntityUser: 'EntityUser',
  VendorAdmin: 'VendorAdmin',
  VendorUser: 'VendorUser',
} as const;

export const AdminRoles: string[] = [AppRoleName.SystemAdmin, AppRoleName.EntityAdmin];

export function hasAnyRole(myRoles: string[] | null | undefined, required: string[]): boolean {
  if (!myRoles || myRoles.length === 0) return false;
  return required.some(r => myRoles.includes(r));
}

// Roles allowed to be assigned by the creator's role
export const AssignableRolesByCreator: Record<string, string[]> = {
  [AppRoleName.SystemAdmin]: [
    AppRoleName.EntityAdmin,
    AppRoleName.EntityUser,
    AppRoleName.VendorAdmin,
    AppRoleName.VendorUser,
  ],
  [AppRoleName.EntityAdmin]: [
    AppRoleName.EntityUser,
    AppRoleName.VendorAdmin,
    AppRoleName.VendorUser,
  ],
  [AppRoleName.VendorAdmin]: [
    AppRoleName.VendorAdmin,
    AppRoleName.VendorUser,
  ],
};

// Bidirectional mapping helpers between numeric ids and string names
export const RoleNameById: Record<number, string> = {
  [AppRoleId.SystemAdmin]: AppRoleName.SystemAdmin,
  [AppRoleId.EntityAdmin]: AppRoleName.EntityAdmin,
  [AppRoleId.EntityUser]: AppRoleName.EntityUser,
  [AppRoleId.VendorAdmin]: AppRoleName.VendorAdmin,
  [AppRoleId.VendorUser]: AppRoleName.VendorUser,
};

export const RoleIdByName: Record<string, number> = {
  [AppRoleName.SystemAdmin]: AppRoleId.SystemAdmin,
  [AppRoleName.EntityAdmin]: AppRoleId.EntityAdmin,
  [AppRoleName.EntityUser]: AppRoleId.EntityUser,
  [AppRoleName.VendorAdmin]: AppRoleId.VendorAdmin,
  [AppRoleName.VendorUser]: AppRoleId.VendorUser,
};

export function roleIdToName(id: number | null | undefined): string | undefined {
  if (id == null) return undefined;
  return RoleNameById[id];
}

export function roleNameToId(name: string | null | undefined): number | undefined {
  if (!name) return undefined;
  return RoleIdByName[name];
}
