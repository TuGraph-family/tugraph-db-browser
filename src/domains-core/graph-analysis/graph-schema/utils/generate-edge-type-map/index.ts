const generateEdgeTypeMap = ({
  nodes,
  edges,
}: Record<string, any>): Map<string, any> => {
  const edgesKeys: string[] = [];
  const edgesTypeMap = new Map();
  edges.forEach((item: Record<string, any>) => {
    const node1: Record<string, any> = nodes.find(
      (i: Record<string, any>) => item?.source === i?.id,
    );
    const node2: Record<string, any> = nodes.find(
      (i: Record<string, any>) => item?.target === i?.id,
    );

    const type = `+${item?.label}+<${node1?.label}=>${node2?.label}>`;
    if (edgesTypeMap && Array.isArray(edgesTypeMap.get(type))) {
      if (item?.label) edgesTypeMap.get(type).push(item);
    } else {
      if (item?.label) {
        edgesKeys.push(type);
        edgesTypeMap.set(type, [item]);
      }
    }
  });
  return edgesTypeMap;
};

export default generateEdgeTypeMap;
