import { map, find, isEmpty, merge } from 'lodash';
import { GraphData, NodeProp } from '../interface/schema';
import { FileData, FileSchema } from '../interface/import';
import { getLocalData, setLocalData } from './localStorage';

export const graphDataToOptions = (data: {
  graphData: GraphData;
  type: string;
  label: string;
}) => {
  const { graphData, type, label } = data;
  const target = find(
    graphData?.[`${type}s`],
    item => item.labelName === label,
  );
  if (!target) {
    return [];
  }
  return (
    map(target?.properties, item => {
      return { value: item.name, label: item.name };
    }) ?? []
  );
};

export const nodesDataToOptions = (nodes: NodeProp[]) => {
  return (
    map(nodes, item => {
      return { value: item.labelName, label: item.labelName };
    }) ?? []
  );
};

export const fileSchemaTransform = (fileDataList: FileData[]): FileSchema[] => {
  return map(fileDataList, item => {
    return {
      ...item.fileSchema,
      file: item.file,
    } as any;
  });
};

export const mergeTaskInfo = (taskId: string, graphName: string) => {
  const taskList = getLocalData('TUGRAPH_INFO');
  const newRecord = { taskId: taskId, graphName: graphName };
  if (!isEmpty(taskList)) {
    const findRecord = find(taskList, info => info.graphName === graphName);
    if (findRecord) {
      const newTaskInfo = map(taskList, info => {
        if (info.graphName === graphName) {
          return newRecord;
        }
        return info;
      });
      setLocalData('TUGRAPH_INFO', newTaskInfo);
    } else {
      setLocalData('TUGRAPH_INFO', [...taskList, newRecord]);
    }
  } else {
    setLocalData('TUGRAPH_INFO', [newRecord]);
  }
};
