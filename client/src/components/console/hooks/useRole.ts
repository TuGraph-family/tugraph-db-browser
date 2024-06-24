import { useRequest } from 'ahooks';
import { useModel } from 'umi';
import { InitialState } from '@/app';
import { deleteRole, disabledRole, listRoles } from '@/queries/security';
import { queryCreateRole, updateRole } from '../utils/query';

export const useRole = () => {
  const { initialState } = useModel('@@initialState');
  const { session } = initialState as InitialState;

  const {
    runAsync: onGetRoleList,
    loading: GetRoleListLoading,
    error: GetRoleListError,
  } = useRequest(() => session.run(listRoles()), { manual: true });

  const {
    runAsync: onDeleteRole,
    loading: DeleteRoleLoading,
    error: DeleteRoleError,
  } = useRequest(params => session.run(deleteRole(params)), { manual: true });

  const {
    runAsync: onDisabledRole,
    loading: DisabledRoleLoading,
    error: DisabledRoleError,
  } = useRequest(params => session.run(disabledRole(params)), { manual: true });

  const {
    runAsync: onCreateRole,
    loading: CreateRoleLoading,
    error: CreateRoleError,
  } = useRequest(queryCreateRole, { manual: true });

  const {
    runAsync: onEditRole,
    loading: EditRoleLoading,
    error: EditRoleError,
  } = useRequest(updateRole, { manual: true });

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
