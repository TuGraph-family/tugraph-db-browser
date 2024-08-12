import {
  BaseLayout,
  ExtensionCategory,
  GraphData,
  NodeData,
  register,
} from '@antv/g6';

interface SamePropertyValue {
  count: number;
  indegree: number;
  outdegree: number;
  targetNeighbors: Record<string, number>;
  innerdegree: number;
  sourceNeighbors: Record<string, number>;
  nodes: NodeData[];
  nodeType: string;
  clusterPropertyValue: any;
  rank: number;
  posIdx?: number;
  beginIdx?: number;
  endIdx?: number;
}

type SamePropertyValueMap = Record<string, SamePropertyValue>;

class ClusterDagreLayout extends BaseLayout {
  public id = 'cluster-dagre';
  ascendCompare(p: string) {
    // 这是比较函数
    return function (m: any, n: any) {
      const keys = p.split('.');
      let a = 0,
        b = 0;
      if (keys.length === 1) {
        a = m[p];
        b = n[p];
      } else {
        // 最多两层
        a = m[keys[0]][keys[1]];
        b = n[keys[0]][keys[1]];
      }
      return a - b; // 升序
    };
  }
  sugiyamaNode(
    levelNodes: Array<SamePropertyValue[]>,
    samePropertyValueMap: SamePropertyValueMap,
    nodeNeighborMap: Record<string, string[]>,
    nodeMap: Record<string, any> = {},
  ) {
    // 初始化，给定每个 groupNode 中的每个真实节点 posIdx，范围 [groupNode.beginIdx, groupNode.endIdx]
    Object.keys(samePropertyValueMap).forEach((clusterPropertyValue) => {
      const group = samePropertyValueMap[clusterPropertyValue];
      const nodes = samePropertyValueMap[clusterPropertyValue].nodes;
      nodes.forEach((node: any, i) => {
        node.cDagreLayoutInfo.posIdx = group.beginIdx || 0 + i;
      });
    });

    // 自上而下，给定每个真实节点 posIdx
    levelNodes.forEach((groups, idx) => {
      // 若正在遍历最后一层
      if (idx === levelNodes.length - 1) return;
      // 若正在遍历非最后一层
      groups.forEach((group) => {
        const nodes = group.nodes;
        nodes.forEach((node: any, i) => {
          const neighbors = nodeNeighborMap[node.id];
          let posIdx = 0,
            nxtNeighborNum = 0;
          if (neighbors) {
            neighbors.forEach((neighborId) => {
              // 只有是下一层的节点才进行
              const neighborNode = nodeMap[neighborId];
              if (neighborNode.cDagreLayoutInfo.rank === group.rank + 1) {
                posIdx += neighborNode.cDagreLayoutInfo.posIdx;
                nxtNeighborNum++;
              }
            });
          }
          node.cDagreLayoutInfo.posIdx = posIdx / nxtNeighborNum || i;
        });
      });
    });

    // 自下而上，修正每个 groupNode posIdx
    for (let idx = levelNodes.length - 1; idx >= 0; idx--) {
      // 若正在遍历第一层
      if (idx === 0) continue;
      const groups = levelNodes[idx];
      // 若正在遍历非第一层
      groups.forEach((group) => {
        const nodes = group.nodes;
        nodes.forEach((node: any, i) => {
          const neighbors = nodeNeighborMap[node.id];
          let posIdx = 0,
            preNeighborNum = 0;
          if (neighbors) {
            neighbors.forEach((neighborId) => {
              // 只有是上一层的节点才进行
              const neighborNode = nodeMap[neighborId];
              if (neighborNode.cDagreLayoutInfo.rank === group.rank - 1) {
                posIdx += neighborNode.cDagreLayoutInfo.posIdx;
                preNeighborNum++;
              }
            });
          }

          node.cDagreLayoutInfo.posIdx = posIdx / preNeighborNum || i;
        });
      });
    }

    // 对于同组节点，根据上面计算出的 posIdx 大小进行排序，重新给定整数 posIdx
    Object.keys(samePropertyValueMap).forEach((clusterPropertyValue) => {
      const nodes = samePropertyValueMap[clusterPropertyValue].nodes;
      nodes.sort(this.ascendCompare('cDagreLayoutInfo.posIdx'));
      const begin = samePropertyValueMap[clusterPropertyValue].beginIdx;
      nodes.forEach((node: any, i) => {
        node.cDagreLayoutInfo.posIdx = begin || 0 + i;
      });
    });
  }
  sugiyamaGroup(
    levelNodes: Array<SamePropertyValue[]>,
    groupAdjMap: Record<string, number>,
  ) {
    const levelNums = levelNodes.length;
    // 自上而下，给定每个 groupNode posIdx
    levelNodes.forEach((groups, idx) => {
      // 若正在遍历最后一层
      if (idx === levelNums - 1) {
      } else {
        // 若正在遍历非最后一层，找到下一层，根据下一层的顺序决定本层 group 的 posIdx
        const nextLevelGroups = levelNodes[idx + 1];
        groups.forEach((group, i) => {
          let nxtAdjNum = 0,
            posIdx = 1;
          nextLevelGroups.forEach((nxtGroup, nxtIdx) => {
            const adjKey = `${group.clusterPropertyValue}|||${nxtGroup.clusterPropertyValue}`;
            if (!groupAdjMap[adjKey]) return;
            posIdx += nxtGroup.posIdx || nxtIdx;
            nxtAdjNum++;
          });
          posIdx /= nxtAdjNum * 2; // * 2 使得边数量多的更靠近
          group.posIdx = posIdx || i;
        });
      }
    });
    // 自下而上，修正每个 groupNode posIdx
    for (let idx = levelNums - 1; idx >= 0; idx--) {
      // 若正在遍历第一层
      if (idx === 0) continue;

      // 若正在遍历非第一层
      const groups = levelNodes[idx];
      const preLevelGroups = levelNodes[idx - 1];
      groups.forEach((group, i) => {
        let nxtAdjNum = 0,
          posIdx = 1;
        preLevelGroups.forEach((preGroup, preIdx) => {
          const adjKey = `${group.clusterPropertyValue}|||${preGroup.clusterPropertyValue}`;
          if (!groupAdjMap[adjKey]) return;
          posIdx += preGroup.posIdx || preIdx;
          nxtAdjNum++;
        });
        posIdx /= nxtAdjNum * 2; // * 2 使得边数量多的更靠近
        group.posIdx = posIdx || i;
      });
    }

    // 对于同层的 groupNodes，根据上面计算出的 posIdx 大小进行排序，并考虑腾出（内部真实节点数量）空间
    levelNodes.forEach((groups) => {
      groups.sort(this.ascendCompare('posIdx'));
      let preEndPos = 0;
      groups.forEach((group) => {
        const groupLength = group.nodes.length;
        group.posIdx = Math.round(preEndPos + groupLength / 2);
        group.beginIdx = preEndPos;
        group.endIdx = preEndPos + groupLength;
        preEndPos = group.endIdx + 1;
      });
    });
  }
  calcLevels(
    preLevel: any[],
    preRank: number,
    samePropertyValueMap: SamePropertyValueMap,
    taggedLevelNum: number,
  ) {
    // 递归的终止条件，所有 samePropertyValueMap 都有 rank
    if (taggedLevelNum >= Object.keys(samePropertyValueMap).length) return;

    let nextLevel: Array<string> = [];

    // 找出前一层的所有 neighbors 作为下一层
    preLevel.forEach((pre) => {
      nextLevel = nextLevel.concat(
        Object.keys(samePropertyValueMap[pre].sourceNeighbors).concat(
          Object.keys(samePropertyValueMap[pre].targetNeighbors),
        ),
      );
    });
    // 排除已经有过层级的 group
    for (let i = nextLevel.length - 1; i >= 0; i--) {
      if (!isNaN(samePropertyValueMap[nextLevel[i]].rank))
        nextLevel.splice(i, 1);
      else samePropertyValueMap[nextLevel[i]].rank = preRank + 1;
    }

    // 递归直到所有 samePropertyValueMap 都已经有 rank
    this.calcLevels(
      nextLevel,
      preRank + 1,
      samePropertyValueMap,
      nextLevel.length ? taggedLevelNum + nextLevel.length : Infinity,
    );
  }
  async execute(data: GraphData) {
    const { options } = this;
    const {
      clusterPropertyName,
      wrapThreshold = 20,
      begin = [50, 50],
      rankdir,
      radial,
      wrapLineHeight,
      width = 500,
      height = 500,
    } = options;
    const { nodes, edges } = data;
    if (!clusterPropertyName) {
      return {};
    }
    // 相同属性值的map
    const samePropertyValueMap: SamePropertyValueMap = {};
    // 节点map
    const nodeMap: Record<string, any> = {};

    nodes?.forEach((node: any) => {
      node.clusterPropertyValue = node.properties[clusterPropertyName];
      if (!samePropertyValueMap[node.clusterPropertyValue])
        samePropertyValueMap[node.clusterPropertyValue] = {
          count: 1,
          indegree: 0,
          outdegree: 0,
          innerdegree: 0,
          targetNeighbors: {}, // 存储该 group 指向的 group 的 clusterPropertyName
          sourceNeighbors: {}, // 存储该 group 指向的 group 的 clusterPropertyName
          nodes: [node],
          nodeType: node.nodeType,
          clusterPropertyValue: node.clusterPropertyValue,
          rank: 0,
        };
      else {
        samePropertyValueMap[node.clusterPropertyValue].count++;
        samePropertyValueMap[node.clusterPropertyValue].nodes.push(node);
      }
      nodeMap[node.id] = node;
    });
    const groupAdjMap: Record<string, number> = {};
    const nodeNeighborMap: Record<string, string[]> = {};
    edges?.forEach((edge) => {
      if (!nodeNeighborMap[edge.source])
        nodeNeighborMap[edge.source] = [edge.target];
      else nodeNeighborMap[edge.source].push(edge.target);
      if (!nodeNeighborMap[edge.target])
        nodeNeighborMap[edge.target] = [edge.source];
      else nodeNeighborMap[edge.target].push(edge.source);

      const sourceNode = nodeMap[edge.source];
      const targetNode = nodeMap[edge.target];
      if (!sourceNode || !targetNode) return;
      if (sourceNode.clusterPropertyValue === targetNode.clusterPropertyValue) {
        samePropertyValueMap[sourceNode.clusterPropertyValue].innerdegree++;
        return;
      }

      const sourceGroup = samePropertyValueMap[sourceNode.clusterPropertyValue];
      const targetGroup = samePropertyValueMap[targetNode.clusterPropertyValue];
      sourceGroup.outdegree++;
      sourceGroup.targetNeighbors[targetNode.clusterPropertyValue] = 1;
      targetGroup.indegree++;
      targetGroup.sourceNeighbors[sourceNode.clusterPropertyValue] = 1;
      const adjKey = `${sourceNode.clusterPropertyValue}|||${targetNode.clusterPropertyValue}`;
      if (!groupAdjMap[adjKey]) groupAdjMap[adjKey] = 1;
      else groupAdjMap[adjKey]++;
    });

    // NOTE: 保留原来的，没有指定attr的时候，用原来的实现
    if (!clusterPropertyName) {
      // 找出最小 indegree 的一组作为第一层
      let minInDegree = Infinity,
        firstLevel = [] as any[],
        minInDegreeDataType: any;
      Object.keys(samePropertyValueMap).forEach((clusterPropertyValue) => {
        if (
          samePropertyValueMap[clusterPropertyValue].indegree === 0 &&
          samePropertyValueMap[clusterPropertyValue].outdegree === 0
        ) {
          firstLevel.push(clusterPropertyValue);
          samePropertyValueMap[clusterPropertyValue].rank = 0;
        } else if (
          samePropertyValueMap[clusterPropertyValue].indegree < minInDegree
        ) {
          minInDegree = samePropertyValueMap[clusterPropertyValue].indegree;
          minInDegreeDataType = clusterPropertyValue;
        }
      });
      firstLevel.push(minInDegreeDataType);
      // 找到同样小的组共同作为第一层
      Object.keys(samePropertyValueMap).forEach((clusterPropertyValue) => {
        if (
          samePropertyValueMap[clusterPropertyValue].indegree === minInDegree
        ) {
          if (clusterPropertyValue !== minInDegreeDataType)
            firstLevel.push(clusterPropertyValue);
          samePropertyValueMap[clusterPropertyValue].rank = 0;
        }
      });

      this.calcLevels(firstLevel, 0, samePropertyValueMap, firstLevel.length);
    } else {
      const attrValues = Object.keys(samePropertyValueMap);
      const compFunc = (a: any, b: any) => {
        // 因为一些缺省值的缘故，需要把没有对应属性的放到最后边
        if (
          a !== samePropertyValueMap[a].nodeType &&
          b === samePropertyValueMap[b].nodeType
        )
          return -1;
        if (
          a === samePropertyValueMap[a].nodeType &&
          b !== samePropertyValueMap[b].nodeType
        )
          return 1;
        return !isNaN(a) && !isNaN(b)
          ? Number(a) - Number(b) // 数值型的，按从大到小排列
          : samePropertyValueMap[a].nodes.length -
              samePropertyValueMap[b].nodes.length; // 类别型的，按数量从小到大排序
      };
      attrValues.sort(compFunc);
      attrValues.forEach((attr, idx) => {
        samePropertyValueMap[attr].rank = idx;
      });
    }

    // 按照层级将 samePropertyValueMap 放入 levelNodes
    // 每一层中的每个 groupNode 先按照 samePropertyValueMap 的邻接关系进行 sugiyama 排序
    // 同时考虑每个 groupNode 所占据的范围
    const levelNodes: Array<SamePropertyValue[]> = [];
    Object.keys(samePropertyValueMap).forEach((clusterPropertyValue) => {
      const group = samePropertyValueMap[clusterPropertyValue];
      if (!levelNodes[group.rank]) levelNodes[group.rank] = [group];
      else levelNodes[group.rank].push(group);
      group.nodes.forEach((node) => {
        node.cDagreLayoutInfo = {
          rank: group.rank,
        };
      });
    });
    this.sugiyamaGroup(levelNodes, groupAdjMap);

    // 计算每个 groupNode 中每个真实节点的 posIdx，范围 [groupNode.beginIdx, groupNode.endIdx]
    this.sugiyamaNode(
      levelNodes,
      samePropertyValueMap,
      nodeNeighborMap,
      nodeMap,
    );

    // 此时，所有节点中 cDagreLayoutInfo 中都存有 rank 和 posIdx
    // 根据 rank 决定每个 node 的 y，posIdx 决定 x

    let maxNodeNumInLevel = -Infinity;
    levelNodes.forEach((groups) => {
      let nodeNum = 0;
      groups.forEach((group) => {
        nodeNum += group.nodes.length;
      });
      if (maxNodeNumInLevel < nodeNum) maxNodeNumInLevel = nodeNum;
    });

    // 根据限制的换行数量，添加节点的line和linePosIdx

    nodes?.forEach((node: any) => {
      const { posIdx } = node.cDagreLayoutInfo;
      node.cDagreLayoutInfo.line = Math.floor(posIdx / wrapThreshold); // 处在当前层的第几行
      node.cDagreLayoutInfo.linePosIdx = posIdx % wrapThreshold; // 行内的index
    });
    let nodesep = options.nodesep;
    if (radial) {
      // 同心圆化
      const center = [width / 2, height / 2];
      let ranksep = options.ranksep // 半径
        ? options.ranksep
        : (Math.min(width, height) * 0.4) / levelNodes.length || 50;
      nodes?.forEach((node: any) => {
        const { rank, posIdx } = node.cDagreLayoutInfo;
        const radius = (rank + 1) * ranksep;
        const angle = (Math.PI * 2 * posIdx) / maxNodeNumInLevel;
        node.style.x = radius * Math.cos(angle) + center[0];
        node.style.y = radius * Math.sin(angle) + center[1];
      });
    } else {
      let ranksep = options.ranksep; // 半径

      if (rankdir === 'TB' || rankdir === 'BT') {
        if (!ranksep) ranksep = (height * 0.8) / levelNodes.length || 150;
        if (!nodesep) nodesep = (width * 0.8) / maxNodeNumInLevel || 150;
      } else if (rankdir === 'LR' || rankdir === 'RL') {
        if (!ranksep) ranksep = (width * 0.8) / levelNodes.length || 150;
        if (!nodesep) nodesep = (height * 0.8) / maxNodeNumInLevel || 150;
      }

      nodes?.forEach((node: any) => {
        switch (rankdir) {
          case 'TB':
            node.style.x =
              begin[0] + nodesep * node.cDagreLayoutInfo.linePosIdx;
            node.style.y =
              begin[1] +
              ranksep * node.cDagreLayoutInfo.rank +
              wrapLineHeight * node.cDagreLayoutInfo.line;
            break;
          case 'BT':
            node.style.x =
              begin[0] + nodesep * node.cDagreLayoutInfo.linePosIdx;
            node.style.y =
              height -
              (begin[1] +
                ranksep * node.cDagreLayoutInfo.rank +
                wrapLineHeight * node.cDagreLayoutInfo.line);
            break;
          case 'LR':
            node.style.x =
              begin[0] +
              ranksep * node.cDagreLayoutInfo.rank +
              wrapLineHeight * node.cDagreLayoutInfo.line;
            node.style.y =
              begin[1] + nodesep * node.cDagreLayoutInfo.linePosIdx;
            break;
          case 'RL':
            node.style.x =
              width -
              (begin[0] +
                ranksep * node.cDagreLayoutInfo.rank +
                wrapLineHeight * node.cDagreLayoutInfo.line);
            node.style.y =
              begin[1] + nodesep * node.cDagreLayoutInfo.linePosIdx;
            break;
        }
      });
    }

    return {
      nodes: nodes?.map((node) => ({
        id: node.id,
        style: { x: node.style?.x, y: node.style?.y },
      })),
    };
  }
}

export const registerClusterDagreLayout = () => {
  register(ExtensionCategory.LAYOUT, 'cluster-dagre', ClusterDagreLayout);
};
