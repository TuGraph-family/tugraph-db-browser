import ArrayTabs from '@/domains-core/graph-analysis/graph-schema/components/array-tabs';
// import AttributesFilter from '@/domains-core/graph-analysis/graph-schema/components/attibutes-filter';
// import CanvasContainer from '@/domains-core/graph-analysis/graph-schema/components/canvas-container';
// import CanvasSider from '@/domains-core/graph-analysis/graph-schema/components/canvas-sider';
// import ConfigCenter from '@/domains-core/graph-analysis/graph-schema/components/config-center';
// import configQuery from '@/domains-core/graph-analysis/graph-schema/components/config-query';
// import ContextMenu from '@/domains-core/graph-analysis/graph-schema/components/context-menu';
// import ElementInfo from '@/domains-core/graph-analysis/graph-schema/components/element-info';
// import EnvSelect from '@/domains-core/graph-analysis/graph-schema/components/env-select';
// import FilterSegmented from '@/domains-core/graph-analysis/graph-schema/components/filter-segmented';
// import GraphCanvas from '@/domains-core/graph-analysis/graph-schema/components/graph-canvas';
// import GraphFilter from '@/domains-core/graph-analysis/graph-schema/components/graph-filter';
// import GraphStyleSetting from '@/domains-core/graph-analysis/graph-schema/components/graph-style-setting';
// import JumpToOld from '@/domains-core/graph-analysis/graph-schema/components/jump-to-old';
// import languageQuery from '@/domains-core/graph-analysis/graph-schema/components/language-query';
// import LayoutForm from '@/domains-core/graph-analysis/graph-schema/components/layout-form';
// import LayoutStyleSegmented from '@/domains-core/graph-analysis/graph-schema/components/layout-style-segmented';
// import PageBackArrow from '@/domains-core/graph-analysis/graph-schema/components/page-back-arrow';
// import PageLayoutSegmented from '@/domains-core/graph-analysis/graph-schema/components/page-layout-segmented';
// import PageTitle from '@/domains-core/graph-analysis/graph-schema/components/page-title';
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
    // PageBackArrow,
    // ViewSelect,
    ArrayTabs,
    // GraphCanvas: GraphCanvas,
    // CanvasContainer: CanvasContainer,
    // JumpToOld: JumpToOld,
    Divider: Divider,
    // QueryFilterSegmented: QueryFilterSegmented,
    // QuerySegmented: QuerySegmented,
    // CanvasSider: CanvasSider,
    // LanguageQuery: languageQuery,
    // PageTitle: PageTitle,
    // TemplateQuery: TemplateQuery,
    // EnvSelect: EnvSelect,
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
