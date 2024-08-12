import { FileData } from '../interface/import';
import { map, find, compact, isEmpty } from 'lodash';
import { GraphData } from '../interface/schema';

export const mergeFileDataList = (fileList: FileData[], file: FileData) => {
  if (!find(fileList, fileItem => fileItem.fileName === file.fileName)) {
    return [...fileList, file];
  }
  const result = map(fileList, fileItem => {
    if (fileItem.fileName === file.fileName) {
      return file;
    } else {
      return fileItem;
    }
  });
  return result;
};

const mapToOption = (item: { labelName?: string }) => {
  if (item?.labelType == 'edge') {
    return item.labelName
      ? { value: item.labelName, label: item.labelName,  }
      : null;
  } else {
    return item.labelName
      ? { value: item.labelName, label: item.labelName }
      : null;
  }
};

export const cascaderOptionsTransform = (data: GraphData) => {
  const { nodes, edges } = data;
  const nodeOptions = compact(map(nodes, mapToOption));
  const edgeOptions = compact(map(edges, mapToOption));
  const nodeItem = isEmpty(nodeOptions)
    ? null
    : { value: 'node', label: '点', children: nodeOptions };
  const edgeItem = isEmpty(edgeOptions)
    ? null
    : { value: 'edge', label: '边', children: edgeOptions };
  return compact([nodeItem, edgeItem]);
};
