import { Graph } from '@antv/g6';

export const resizeCanvas = (options: { graph?: Graph }) => {
  const { graph } = options;
  if (graph) {
    const canvasDom = document.getElementById(
      graph.getOptions().container as string,
    );
    if (canvasDom) {
      graph.resize(canvasDom.offsetWidth, canvasDom.offsetHeight);
      graph.fitCenter();
    }
  }
};
