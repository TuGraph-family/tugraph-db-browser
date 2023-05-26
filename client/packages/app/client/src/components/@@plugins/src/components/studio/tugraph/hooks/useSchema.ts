import {
  getGraphSchema,
  createLabelSchema,
  deleteLabelSchema,
  deleteLabelPropertySchema,
  editLabelPropertySchema,
  createLabelPropertySchema,
  createIndexSchema,
  deleteIndexSchema,
} from '../services/SchemaController';
import { useRequest } from 'ahooks';

export const useSchema = () => {
  const {
    runAsync: onGetGraphSchema,
    loading: GetGraphSchemaLoading,
    error: GetGraphSchemaError,
  } = useRequest(getGraphSchema, { manual: true });
  const {
    runAsync: onCreateLabelSchema,
    loading: CreateLabelSchemaLoading,
    error: CreateLabelSchemaError,
  } = useRequest(createLabelSchema, { manual: true });
  const {
    runAsync: onDeleteLabelSchema,
    loading: DeleteLabelSchemaLoading,
    error: DeleteLabelSchemaError,
  } = useRequest(deleteLabelSchema, { manual: true });
  const {
    runAsync: onDeleteLabelPropertySchema,
    loading: DeleteLabelPropertySchemaLoading,
    error: DeleteLabelPropertySchemaError,
  } = useRequest(deleteLabelPropertySchema, { manual: true });
  const {
    runAsync: onEditLabelPropertySchema,
    loading: EditLabelPropertySchemaLoading,
    error: EditLabelPropertySchemaError,
  } = useRequest(editLabelPropertySchema, { manual: true });
  const {
    runAsync: onCreateLabelPropertySchema,
    loading: CreateLabelPropertySchemaLoading,
    error: CreateLabelPropertySchemaError,
  } = useRequest(createLabelPropertySchema, { manual: true });

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
