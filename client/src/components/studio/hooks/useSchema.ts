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

export const useSchema = () => {
  const {
    runAsync: onGetGraphSchema,
    loading: GetGraphSchemaLoading,
    error: GetGraphSchemaError,
  } = useRequest(getSchema, { manual: true });
  const {
    runAsync: onCreateLabelSchema,
    loading: CreateLabelSchemaLoading,
    error: CreateLabelSchemaError,
  } = useRequest(createLabelSchema, { manual: true });
  const {
    runAsync: onDeleteLabelSchema,
    loading: DeleteLabelSchemaLoading,
    error: DeleteLabelSchemaError,
  } = useRequest(deleteSchema, { manual: true });
  const {
    runAsync: onDeleteLabelPropertySchema,
    loading: DeleteLabelPropertySchemaLoading,
    error: DeleteLabelPropertySchemaError,
  } = useRequest(deleteLabelField, { manual: true });
  const {
    runAsync: onEditLabelPropertySchema,
    loading: EditLabelPropertySchemaLoading,
    error: EditLabelPropertySchemaError,
  } = useRequest(updateFieldToLabel, { manual: true });
  const {
    runAsync: onCreateLabelPropertySchema,
    loading: CreateLabelPropertySchemaLoading,
    error: CreateLabelPropertySchemaError,
  } = useRequest(addFieldToLabel, { manual: true });

  const {
    runAsync: onCreateIndexSchema,
    loading: CreateIndexSchemaLoading,
    error: CreateIndexSchemaError,
  } = useRequest(createIndexSchema, { manual: true });
  const {
    runAsync: onDeleteIndexSchema,
    loading: DeleteIndexSchemaLoading,
    error: DeleteIndexSchemaError,
  } = useRequest(deleteIndexSchema, { manual: true });

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
