import { Graph } from '@antv/g6';
import { createContext, useContext } from 'react';
import { Updater } from 'use-immer';

export interface GraphSchemaContextValue {
  graph?: Graph;
  updateContextValue?: Updater<GraphSchemaContextValue>;
}

export const SchemaGraphContext = createContext<GraphSchemaContextValue>({});

export const useSchemaGraphContext = () => useContext(SchemaGraphContext);
