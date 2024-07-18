/**
 * author: Allen
 * file: graph analyze entry
*/

import PageTitle from '@/domains-core/graph-analysis/graph-schema/components/page-title';
import PageBackArrow from '@/domains-core/graph-analysis/graph-schema/components/page-back-arrow';
import ArrayTabs from '@/domains-core/graph-analysis/graph-schema/components/array-tabs';
import CanvasContainer from '@/domains-core/graph-analysis/graph-schema/components/canvas-container';
import CanvasSider from '@/domains-core/graph-analysis/graph-schema/components/canvas-sider';
import ViewSelect from '@/domains-core/graph-analysis/graph-schema/components/view-select';
import QueryFilterSegmented from '@/domains-core/graph-analysis/graph-schema/components/query-filter-segmented';
import LayoutStyleSegmented from '@/domains-core/graph-analysis/graph-schema/components/layout-style-segmented';
import QuerySegmented from '@/domains-core/graph-analysis/graph-schema/components/query-segmented';
import FilterSegmented from '@/domains-core/graph-analysis/graph-schema/components/filter-segmented';
import LayoutForm from '@/domains-core/graph-analysis/graph-schema/components/layout-form';
import GraphStyleSetting from '@/domains-core/graph-analysis/graph-schema/components/graph-style-setting';
import AttributesFilter from '@/domains-core/graph-analysis/graph-schema/components/attibutes-filter';
import ConfigQuery from '@/domains-core/graph-analysis/graph-schema/components/config-query';
import ContextMenu from '@/domains-core/graph-analysis/graph-schema/components/context-menu';
import ElementInfo from '@/domains-core/graph-analysis/graph-schema/components/element-info';
import GraphCanvas from '@/domains-core/graph-analysis/graph-schema/components/graph-canvas';
import GraphFilter from '@/domains-core/graph-analysis/graph-schema/components/graph-filter';
import LanguageQuery from '@/domains-core/graph-analysis/graph-schema/components/language-query';
import PageLayoutSegmented from '@/domains-core/graph-analysis/graph-schema/components/page-layout-segmented';
import PathQuery from '@/domains-core/graph-analysis/graph-schema/components/path-query';
import StatisticsFilter from '@/domains-core/graph-analysis/graph-schema/components/statistics-filter';
import { ArrayCards, ArrayCollapse } from '@formily/antd';
import { createSchemaField } from '@formily/react';
import { Divider } from 'antd';
// import TemplateQuery from '@/domains-core/graph-analysis/graph-schema/components/template-query';
// import ConfigCenter from '@/domains-core/graph-analysis/graph-schema/components/config-center';

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
    PathQuery,
    AttributesFilter,
    StatisticsFilter,
    ContextMenu,
    ArrayCards,
    ArrayCollapse,
    ElementInfo,
    PageLayoutSegmented,
    // ConfigCenter: ConfigCenter,
  },
});
