/**
 * file: console entry, include auth and database
 * author: Allen
*/
import { useState } from 'react';

import Auth from '@/components/console/auth-manager';
import Database from '@/components/console/database-info';
import ConsoleMenu from '@/components/consoleMenu';
import Nav from '@/layouts/nav';
import {
  ConsoleContainer,
  ConsoleContentContainer,
  Container,
} from '@/layouts';

import { getQueryString } from '@/components/studio/utils/routeParams';

const components: any = {
  TU_GRAPH_AUTH: <Auth />,
  TU_GRAPH_DATABASE: <Database />,
};

const ConsolePage = () => {
  const key: string = getQueryString('menu') || 'TU_GRAPH_AUTH';
  const [menuKey, setMenuKey] = useState<string>(key);
  return (
    <Container>
      <Nav />
      <ConsoleContainer
        sidebar={
          <ConsoleMenu
            menuKey={menuKey}
            onMenuChange={value => setMenuKey(value)}
          />
        }
        content={<ConsoleContentContainer>{components[menuKey]}</ConsoleContentContainer>}
      />
    </Container>
  );
};

export default ConsolePage;
