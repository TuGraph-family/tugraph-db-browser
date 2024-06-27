/* 修改密码 */
export const updatePassword = (params: {
  curPassword: string;
  password: string;
}) => {
  const { curPassword, password } = params;
  return `CALL dbms.security.changePassword('${curPassword}', '${password}')`;
};

/* 删除用户 */
export const deleteUser = (username: string) => {
  return `CALL dbms.security.deleteUser('${username}')`;
};

/* 禁用启用用户 */
export const disabledUser = (params: {
  username: string;
  disabled: boolean;
}) => {
  const { username, disabled } = params;
  return `CALL dbms.security.disableUser('${username}', ${disabled})`;
};

/* 删除角色 */
export const deleteRole = (params: { role: string }) => {
  const { role } = params;
  return `CALL dbms.security.deleteRole('${role}')`;
};

/* 禁用启用角色 */
export const disabledRole = (params: { role: string; disabled: boolean }) => {
  const { role, disabled } = params;
  return `CALL dbms.security.disableRole('${role}', ${disabled})`;
};
`CALL dbms.security.listRoles()`;

/* 列出所有角色 */
export const listRoles = () => {
  return `CALL dbms.security.listRoles()`;
};

/* 获取所有用户 */
export const listUsers = () => {
  return `CALL dbms.security.listUsers()`;
};

/* 获取用户 */
export const getUserInfo = (username: string) => {
  return `CALL dbms.security.getUserInfo('${username}')`;
};

/* 创建用户 */
export const createUser = (username: string, password: string) => {
  return `CALL dbms.security.createUser('${username}', '${password}')`;
};

/* 1.设置用户描述 2.赋予用户角色 */
export const queryCreateCyphers = (
  username: string,
  description: boolean | string,
  roles?: string,
) => {
  return [
    `CALL dbms.security.setUserDesc('${username}', '${description}')`,
    `CALL dbms.security.addUserRoles('${username}', ${roles})`,
  ];
};

/* 编辑用户 */
export const queryCyphers = (params: {
  username: string;
  password: string;
  description: boolean | string;
  roles: string;
}) => {
  const { username, password, description, roles } = params;
  return [
    // 1.修改密码
    `CALL dbms.security.changeUserPassword('${username}','${password}')`,
    // 2. 修改用户描述
    `CALL dbms.security.setUserDesc('${username}', '${description}')`,
    // 3. 赋予用户角色
    `CALL dbms.security.rebuildUserRoles('${username}', ${roles})`,
  ];
};

/*  创建角色 */
export const createRole = (role: string, description: boolean | string) => {
  return `CALL dbms.security.createRole('${role}','${description}')`;
};

/* 修改角色对图的访问权限  */
export const modRoleAccessLevel = (role: string, permissions: string) => {
  return `CALL dbms.security.modRoleAccessLevel('${role}', ${permissions})`;
};

/* 修改角色对图的访问权限  */
export const modRoleDesc = (role: string, description: boolean | string) => {
  return `CALL dbms.security.modRoleDesc('${role}','${description}')`;
};
