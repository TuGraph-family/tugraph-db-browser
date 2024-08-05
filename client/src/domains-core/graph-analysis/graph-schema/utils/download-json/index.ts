import { GraphData } from '@antv/g6';
import { isEmpty } from '@antv/util';

export const downLoadJson = (graphData: GraphData) => {
  const { nodes = [], edges = [] } = graphData;
  if (isEmpty([...edges, ...nodes])) return;
  try {
    const data = {
      nodes,
      edges,
    };
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(data)], { type: 'text/json' });
    element.href = URL.createObjectURL(file);
    element.download = 'data.json';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(element.href);
  } catch (error) {
    console.log(error);
  }
};
