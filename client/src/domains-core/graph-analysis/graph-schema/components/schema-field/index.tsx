/**
 * author: Allen
 * file: graph analyze entry
*/

import PageBackArrow from '@/domains-core/graph-analysis/graph-schema/components/page-back-arrow';
import PageTitle from '@/domains-core/graph-analysis/graph-schema/components/page-title';
import ArrayTabs from '@/domains-core/graph-analysis/graph-schema/components/array-tabs';
import CanvasSider from '@/domains-core/graph-analysis/graph-schema/components/canvas-sider';
// import AttributesFilter from '@/domains-core/graph-analysis/graph-schema/components/attibutes-filter';
// import CanvasContainer from '@/domains-core/graph-analysis/graph-schema/components/canvas-container';
// import ConfigCenter from '@/domains-core/graph-analysis/graph-schema/components/config-center';
// import configQuery from '@/domains-core/graph-analysis/graph-schema/components/config-query';
// import ContextMenu from '@/domains-core/graph-analysis/graph-schema/components/context-menu';
// import ElementInfo from '@/domains-core/graph-analysis/graph-schema/components/element-info';
// import FilterSegmented from '@/domains-core/graph-analysis/graph-schema/components/filter-segmented';
// import GraphCanvas from '@/domains-core/graph-analysis/graph-schema/components/graph-canvas';
// import GraphFilter from '@/domains-core/graph-analysis/graph-schema/components/graph-filter';
// import GraphStyleSetting from '@/domains-core/graph-analysis/graph-schema/components/graph-style-setting';
// import languageQuery from '@/domains-core/graph-analysis/graph-schema/components/language-query';
// import LayoutForm from '@/domains-core/graph-analysis/graph-schema/components/layout-form';
// import LayoutStyleSegmented from '@/domains-core/graph-analysis/graph-schema/components/layout-style-segmented';
// import PageLayoutSegmented from '@/domains-core/graph-analysis/graph-schema/components/page-layout-segmented';

// import PathQuery from '@/domains-core/graph-analysis/graph-schema/components/path-query';
// import QueryFilterSegmented from '@/domains-core/graph-analysis/graph-schema/components/query-filter-segmented';
// import QuerySegmented from '@/domains-core/graph-analysis/graph-schema/components/query-segmented';
// import StatisticsFilter from '@/domains-core/graph-analysis/graph-schema/components/statistics-filter';
// import TemplateQuery from '@/domains-core/graph-analysis/graph-schema/components/template-query';
// import ViewSelect from '@/domains-core/graph-analysis/graph-schema/components/view-select';
import { ArrayCards, ArrayCollapse } from '@formily/antd';
import { createSchemaField } from '@formily/react';
import { Divider } from 'antd';

export const SchemaField = createSchemaField({
  components: {
    PageBackArrow,
    PageTitle,
    // ViewSelect,
    ArrayTabs,
    CanvasSider,
    // GraphCanvas: GraphCanvas,
    // CanvasContainer: CanvasContainer,
    Divider: Divider,
    // QueryFilterSegmented: QueryFilterSegmented,
    // QuerySegmented: QuerySegmented,
    // CanvasSider: CanvasSider,
    // LanguageQuery: languageQuery,
    // TemplateQuery: TemplateQuery,
    // GraphFilter: GraphFilter,
    // ConfigQuery: configQuery,
    // PathQuery: PathQuery,
    // FilterSegmented: FilterSegmented,
    // AttributesFilter: AttributesFilter,
    // StatisticsFilter: StatisticsFilter,
    // LayoutStyleSegmented: LayoutStyleSegmented,
    // ContextMenu: ContextMenu,
    // LayoutForm: LayoutForm,
    // GraphStyleSetting: GraphStyleSetting,
    ArrayCards,
    // PageLayoutSegmented: PageLayoutSegmented,
    ArrayCollapse,
    // ElementInfo: ElementInfo,
    // ConfigCenter: ConfigCenter,
  },
});
