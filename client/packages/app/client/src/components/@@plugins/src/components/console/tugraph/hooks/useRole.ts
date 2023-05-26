import { getRoleList, deleteRole, disabledRole, createRole, editRole } from '../services/RoleController';
import { useRequest } from 'ahooks';
export const useRole = () => {
  const {
    runAsync: onGetRoleList,
    loading: GetRoleListLoading,
    error: GetRoleListError,
  } = useRequest(getRoleList, { manual: true });

  const {
    runAsync: onDeleteRole,
    loading: DeleteRoleLoading,
    error: DeleteRoleError,
  } = useRequest(deleteRole, { manual: true });

  const {
    runAsync: onDisabledRole,
    loading: DisabledRoleLoading,
    error: DisabledRoleError,
  } = useRequest(disabledRole, { manual: true });

  const {
    runAsync: onCreateRole,
    loading: CreateRoleLoading,
    error: CreateRoleError,
  } = useRequest(createRole, { manual: true });

  const {
    runAsync: onEditRole,
    loading: EditRoleLoading,
    error: EditRoleError,
  } = useRequest(editRole, { manual: true });

  return {
    onGetRoleList,
    GetRoleListLoading,
    GetRoleListError,
    onDeleteRole,
    DeleteRoleLoading,
    DeleteRoleError,
    onDisabledRole,
    DisabledRoleLoading,
    DisabledRoleError,
    onCreateRole,
    CreateRoleLoading,
    CreateRoleError,
    onEditRole,
    EditRoleLoading,
    EditRoleError,
  };
};
