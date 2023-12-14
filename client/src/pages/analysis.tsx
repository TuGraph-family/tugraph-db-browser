import { useEffect, useState } from 'react';
import { useRafInterval } from 'ahooks';
import { Guidance } from '@/components/guidance';
import TuGraphGraphAppConfig from '@/constants/GI_EXPORT_FILES';
import '../components/studio/global.less';

//@ts-ignore
const { default: GI_SDK_APP } = window?.GI_SDK_APP;

const GraphAnalysis = () => {
  const id = 'credit-tugraph-antv';
  const service = async () => {
    const config = TuGraphGraphAppConfig;
    return {
      data: config,
      success: true,
    };
  };

  // 循环检测 GI SDK 是否已经渲染，只有在渲染结束之后，才去渲染新手引导！
  const [ready, setReady] = useState(false);
  const clearInterval = useRafInterval(() => {
    if (document.querySelector('div[id^="GI_STUDIO_credit"]')) {
      setReady(true);
    }
  }, 100);
  useEffect(() => {
    if (ready) clearInterval();
  }, [ready]);
  // end 循环检测

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        backgroundImage:
          'var(--layout-background,radial-gradient(at 13% 5%, hsla(214, 100%, 37%, 0.29) 0px, transparent 50%), radial-gradient(at 100% 100%, hsla(254, 66%, 56%, 0.11) 0px, transparent 50%), radial-gradient(at 0% 100%, hsla(355, 100%, 93%, 0) 0px, transparent 50%), radial-gradient(at 61% 52%, hsla(227, 64%, 46%, 0.05) 0px, transparent 50%), radial-gradient(at 88% 12%, hsla(227, 70%, 49%, 0.1) 0px, transparent 50%), radial-gradient(at 100% 37%, hsla(254, 68%, 56%, 0) 0px, transparent 50%))',
      }}
    >
      <GI_SDK_APP id={id} service={service} />
      {ready && <Guidance />}
    </div>
  );
};

export default GraphAnalysis;
