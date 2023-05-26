export interface SubGraph {
  graph_name: string;
  configuration: {
    description?: string;
    max_size_GB?: number;
  };
}

export interface SubGraphInfo {
  isStatistics: boolean;
  description: string;
  maxSizeGB?: number;
  graphName: string;
  nodeEdgeStats?: any;
  isNodeEdgeObj?: boolean;
}
