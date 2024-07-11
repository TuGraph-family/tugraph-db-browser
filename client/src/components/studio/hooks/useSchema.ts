import {
  addFieldToLabel,
  deleteLabelField,
  deleteSchema,
  getSchema,
  updateFieldToLabel,
  createIndexSchema,
  deleteIndexSchema,
} from '@/services/schema';
import {
  createLabelSchema,
} from '../services/SchemaController';
import { useRequest } from 'ahooks';
import { useModel } from 'umi';
import { InitialState } from '@/app';

export const useSchema = () => {
  const { initialState } = useModel('@@initialState');
  const { driver } = initialState as InitialState;
  const {
    runAsync: onGetGraphSchema,
    loading: GetGraphSchemaLoading,
    error: GetGraphSchemaError,
  } = useRequest(params=>getSchema(driver,params), { manual: true });
  const {
    runAsync: onCreateLabelSchema,
    loading: CreateLabelSchemaLoading,
    error: CreateLabelSchemaError,
  } = useRequest(params=>createLabelSchema(driver,params), { manual: true });
  const {
    runAsync: onDeleteLabelSchema,
    loading: DeleteLabelSchemaLoading,
    error: DeleteLabelSchemaError,
  } = useRequest(params=>deleteSchema(driver,params), { manual: true });
  const {
    runAsync: onDeleteLabelPropertySchema,
    loading: DeleteLabelPropertySchemaLoading,
    error: DeleteLabelPropertySchemaError,
  } = useRequest(params=>deleteLabelField(driver,params), { manual: true });
  const {
    runAsync: onEditLabelPropertySchema,
    loading: EditLabelPropertySchemaLoading,
    error: EditLabelPropertySchemaError,
  } = useRequest(params=>updateFieldToLabel(driver,params), { manual: true });
  const {
    runAsync: onCreateLabelPropertySchema,
    loading: CreateLabelPropertySchemaLoading,
    error: CreateLabelPropertySchemaError,
  } = useRequest(params=>addFieldToLabel(driver,params), { manual: true });

  const {
    runAsync: onCreateIndexSchema,
    loading: CreateIndexSchemaLoading,
    error: CreateIndexSchemaError,
  } = useRequest(params=>createIndexSchema(driver,params), { manual: true });
  const {
    runAsync: onDeleteIndexSchema,
    loading: DeleteIndexSchemaLoading,
    error: DeleteIndexSchemaError,
  } = useRequest(params=>deleteIndexSchema(driver,params), { manual: true });

  return {
    onGetGraphSchema,
    GetGraphSchemaLoading,
    GetGraphSchemaError,
    onCreateLabelSchema,
    CreateLabelSchemaLoading,
    CreateLabelSchemaError,
    onDeleteLabelSchema,
    DeleteLabelSchemaLoading,
    DeleteLabelSchemaError,
    onDeleteLabelPropertySchema,
    DeleteLabelPropertySchemaLoading,
    DeleteLabelPropertySchemaError,
    onEditLabelPropertySchema,
    EditLabelPropertySchemaLoading,
    EditLabelPropertySchemaError,
    onCreateLabelPropertySchema,
    CreateLabelPropertySchemaLoading,
    CreateLabelPropertySchemaError,
    onCreateIndexSchema,
    CreateIndexSchemaLoading,
    CreateIndexSchemaError,
    onDeleteIndexSchema,
    DeleteIndexSchemaLoading,
    DeleteIndexSchemaError,
  };
};
