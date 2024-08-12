/**
 * author: Allen
 * file: graph analyze entry
 */

import ArrayTabs from '@/domains-core/graph-analysis/graph-schema/components/array-tabs';
import AttributesFilter from '@/domains-core/graph-analysis/graph-schema/components/attibutes-filter';
import CanvasContainer from '@/domains-core/graph-analysis/graph-schema/components/canvas-container';
import CanvasLegend from '@/domains-core/graph-analysis/graph-schema/components/canvas-legend';
import CanvasSider from '@/domains-core/graph-analysis/graph-schema/components/canvas-sider';
import ConfigQuery from '@/domains-core/graph-analysis/graph-schema/components/config-query';
import ContextMenu from '@/domains-core/graph-analysis/graph-schema/components/context-menu';
import DownloadCanvans from '@/domains-core/graph-analysis/graph-schema/components/download-canvas';
import ElementInfo from '@/domains-core/graph-analysis/graph-schema/components/element-info';
import FilterSegmented from '@/domains-core/graph-analysis/graph-schema/components/filter-segmented';
import GraphCanvas from '@/domains-core/graph-analysis/graph-schema/components/graph-canvas';
import GraphFilter from '@/domains-core/graph-analysis/graph-schema/components/graph-filter';
import GraphStyleSetting from '@/domains-core/graph-analysis/graph-schema/components/graph-style-setting';
import LanguageQuery from '@/domains-core/graph-analysis/graph-schema/components/language-query';
import LayoutForm from '@/domains-core/graph-analysis/graph-schema/components/layout-form';
import LayoutStyleSegmented from '@/domains-core/graph-analysis/graph-schema/components/layout-style-segmented';
import PageBackArrow from '@/domains-core/graph-analysis/graph-schema/components/page-back-arrow';
import PageLayoutSegmented from '@/domains-core/graph-analysis/graph-schema/components/page-layout-segmented';
// import PathQuery from '@/domains-core/graph-analysis/graph-schema/components/path-query';
import CanvasToolbarSegmented from '@/domains-core/graph-analysis/graph-schema/components/canvas-toolbar-segmented';
import GraphJsonView from '@/domains-core/graph-analysis/graph-schema/components/graph-json-view';
import GraphTableView from '@/domains-core/graph-analysis/graph-schema/components/graph-table-view';
import PageTitle from '@/domains-core/graph-analysis/graph-schema/components/page-title';
import QueryFilterSegmented from '@/domains-core/graph-analysis/graph-schema/components/query-filter-segmented';
import QuerySegmented from '@/domains-core/graph-analysis/graph-schema/components/query-segmented';
import StatisticsFilter from '@/domains-core/graph-analysis/graph-schema/components/statistics-filter';
import ViewSelect from '@/domains-core/graph-analysis/graph-schema/components/view-select';
import ZoomInOut from '@/domains-core/graph-analysis/graph-schema/components/zoom-in-out';
import { ArrayCards, ArrayCollapse } from '@formily/antd';
import { createSchemaField } from '@formily/react';
import { Divider } from 'antd';

export const SchemaField = createSchemaField({
  components: {
    PageTitle,
    PageBackArrow,
    ArrayTabs,
    CanvasContainer,
    CanvasSider,
    ViewSelect,
    GraphCanvas,
    Divider,
    QueryFilterSegmented,
    LayoutStyleSegmented,
    QuerySegmented,
    FilterSegmented,
    LayoutForm,
    GraphStyleSetting,
    LanguageQuery,
    GraphFilter,
    ConfigQuery,
    // PathQuery,
    AttributesFilter,
    StatisticsFilter,
    ContextMenu,
    ArrayCards,
    ArrayCollapse,
    ElementInfo,
    PageLayoutSegmented,
    CanvasToolbarSegmented,
    ZoomInOut,
    DownloadCanvans,
    CanvasLegend,
    GraphJsonView,
    GraphTableView,
  },
});
