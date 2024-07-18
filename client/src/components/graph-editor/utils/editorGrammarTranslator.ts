import { concat, map } from 'lodash';
// import { any } from '@alipay/e2-language-isogql';

export const grammarTranslator = (params: any[]) => {
  return map(params, (item: any) => {
    if (item?.filterText) {
      return item;
    }
    return {
      detail: item?.detail,
      label: item?.label,
      documentation: item?.documentation,
    };
  });
};

export const getMergeGrammar = (
  params0: any[],
  params1: any[],
) => {
  return concat(grammarTranslator(params0), grammarTranslator(params1));
};
