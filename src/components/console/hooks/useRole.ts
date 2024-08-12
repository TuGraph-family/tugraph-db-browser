import { useRequest } from 'ahooks';
import { useModel } from 'umi';
import { InitialState } from '@/app';
import { deleteRole, disabledRole, listRoles } from '@/queries/security';
import { queryCreateRole, updateRole } from '../utils/query';
import { request } from '@/services/request';

export const useRole = () => {
  const { initialState } = useModel('@@initialState');
  const { driver } = initialState as InitialState;

  const {
    runAsync: onGetRoleList,
    loading: GetRoleListLoading,
    error: GetRoleListError,
  } = useRequest(() => request({ driver, cypher: listRoles() }), {
    manual: true,
  });

  const {
    runAsync: onDeleteRole,
    loading: DeleteRoleLoading,
    error: DeleteRoleError,
  } = useRequest(params => request({ driver, cypher: deleteRole(params) }), {
    manual: true,
  });

  const {
    runAsync: onDisabledRole,
    loading: DisabledRoleLoading,
    error: DisabledRoleError,
  } = useRequest(params => request({ driver, cypher: disabledRole(params) }), {
    manual: true,
  });

  const {
    runAsync: onCreateRole,
    loading: CreateRoleLoading,
    error: CreateRoleError,
  } = useRequest(params => queryCreateRole(driver, params), { manual: true });

  const {
    runAsync: onEditRole,
    loading: EditRoleLoading,
    error: EditRoleError,
  } = useRequest(params => updateRole(driver, params), { manual: true });

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
