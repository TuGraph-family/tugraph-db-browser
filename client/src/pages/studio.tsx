import { GraphList } from '@/components/studio/index';
import Nav from '@/layouts/nav';
import { Container } from '@/layouts/index';

const StudioPage = () => {

  if (!window.location.hash && window.location.pathname === '/') {
    window.location.hash = '/home';
  }

  return (
    <Container>
      <Nav />
      <GraphList />
    </Container>
  );
};

export default StudioPage;
