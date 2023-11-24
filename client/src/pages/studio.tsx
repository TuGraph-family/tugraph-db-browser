import { GraphList } from '@/components/studio/index';
import Nav from '@/layouts/nav';
import { Container } from '@/layouts/index';

const StudioPage = () => {
  return (
    <Container>
      <Nav />
      <GraphList />
    </Container>
  );
};

export default StudioPage;
