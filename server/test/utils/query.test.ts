import assert from 'assert';
// import { IPathParams } from '../../app/utils/interface';
import { formatVertexResponse, formatEdgeResponse, formatPathResponse, formatMultipleResponse } from '../../app/utils/query';

describe('query method', () => {
  it('formatVertexResponse', () => {
    const mockData = [
      {
        n: {
          identity: 0,
          label: 'person',
          properties: {
            born: 1961,
            id: 2,
            name: 'Laurence Fishburne',
            poster_image: 'https://image.tmdb.org/t/p/w185/mh0lZ1XsT84FayMNiT6Erh91mVu.jpg',
          },
        },
      },
      {
        n: {
          identity: 1,
          label: 'person',
          properties: {
            born: 1967,
            id: 3,
            name: 'Carrie-Anne Moss',
            poster_image: 'https://image.tmdb.org/t/p/w185/8iATAc5z5XOKFFARLsvaawa8MTY.jpg',
          },
        },
      },
    ];

    const resultData = formatVertexResponse(mockData);
    assert(resultData.length === 2);
    const keys = Object.keys(resultData[0]);
    assert(keys.length === 3);
    assert(keys[0] === 'label');
    assert(keys[1] === 'properties');
    assert(keys[2] === 'id');
  });

  it('formatEdgeResponse', () => {
    const mockEdgeData = [
      {
        e: {
          dst: 3937,
          forward: true,
          identity: 0,
          label: 'acted_in',
          label_id: 0,
          properties: {
            role: 'Morpheus',
          },
          src: 0,
          temporal_id: 0,
        },
      },
      {
        e: {
          dst: 3937,
          forward: true,
          identity: 1,
          label: 'acted_in',
          label_id: 0,
          properties: {
            role: 'Morpheus',
          },
          src: 0,
          temporal_id: 0,
        },
      },
    ];

    const result = formatEdgeResponse(mockEdgeData);
    assert(result.length === 2);
    const keys = Object.keys(result[0]);
    assert(keys.length === 6);
  });

  it('formatPathResponse', () => {
    const mockPathData: any = [
      {
        p: [
          {
            identity: 0,
            label: 'person',
            properties: {
              born: 1961,
              id: 2,
              name: 'Laurence Fishburne',
              poster_image: 'https://image.tmdb.org/t/p/w185/mh0lZ1XsT84FayMNiT6Erh91mVu.jpg',
            },
          },
          {
            dst: 3937,
            forward: true,
            identity: 0,
            label: 'acted_in',
            label_id: 0,
            properties: {
              role: 'Morpheus',
            },
            src: 0,
            temporal_id: 0,
          },
          {
            identity: 3937,
            label: 'movie',
            properties: {
              duration: 136,
              id: 1,
              poster_image: 'http://image.tmdb.org/t/p/w185/gynBNzwyaHKtXqlEKKLioNkjKgN.jpg',
              rated: 'R',
              summary: 'Thomas A. Anderson is a man living two lives. By day he is an average computer programmer and by night a malevolent hacker known as Neo who finds himself targeted by the police when he is contacted by Morpheus a legendary computer hacker who reveals the shocking truth about our reality.',
              tagline: 'Welcome to the Real World.',
              title: 'The Matrix',
            },
          },
        ],
      },
      {
        p: [
          {
            identity: 0,
            label: 'person',
            properties: {
              born: 1961,
              id: 2,
              name: 'Laurence Fishburne',
              poster_image: 'https://image.tmdb.org/t/p/w185/mh0lZ1XsT84FayMNiT6Erh91mVu.jpg',
            },
          },
          {
            dst: 3937,
            forward: true,
            identity: 1,
            label: 'acted_in',
            label_id: 0,
            properties: {
              role: 'Morpheus',
            },
            src: 0,
            temporal_id: 0,
          },
          {
            identity: 3937,
            label: 'movie',
            properties: {
              duration: 136,
              id: 1,
              poster_image: 'http://image.tmdb.org/t/p/w185/gynBNzwyaHKtXqlEKKLioNkjKgN.jpg',
              rated: 'R',
              summary: 'Thomas A. Anderson is a man living two lives. By day he is an average computer programmer and by night a malevolent hacker known as Neo who finds himself targeted by the police when he is contacted by Morpheus a legendary computer hacker who reveals the shocking truth about our reality.',
              tagline: 'Welcome to the Real World.',
              title: 'The Matrix',
            },
          },
        ],
      },
    ];

    const result = formatPathResponse(mockPathData);
    console.log(result);
  });

  it.only('formatMultipleResponse', () => {
    const mockData = [
      {
        e: {
          dst: 3937,
          forward: true,
          identity: 0,
          label: 'acted_in',
          label_id: 0,
          properties: {
            role: 'Morpheus',
          },
          src: 0,
          temporal_id: 0,
        },
        n: {
          identity: 0,
          label: 'person',
          properties: {
            born: 1961,
            id: 2,
            name: 'Laurence Fishburne',
            poster_image: 'https://image.tmdb.org/t/p/w185/mh0lZ1XsT84FayMNiT6Erh91mVu.jpg',
          },
        },
        'n.id': 2,
        p: [
          {
            identity: 0,
            label: 'person',
            properties: {
              born: 1961,
              id: 2,
              name: 'Laurence Fishburne',
              poster_image: 'https://image.tmdb.org/t/p/w185/mh0lZ1XsT84FayMNiT6Erh91mVu.jpg',
            },
          },
          {
            dst: 3937,
            forward: true,
            identity: 0,
            label: 'acted_in',
            label_id: 0,
            properties: {
              role: 'Morpheus',
            },
            src: 0,
            temporal_id: 0,
          },
          {
            identity: 3937,
            label: 'movie',
            properties: {
              duration: 136,
              id: 1,
              poster_image: 'http://image.tmdb.org/t/p/w185/gynBNzwyaHKtXqlEKKLioNkjKgN.jpg',
              rated: 'R',
              summary: 'Thomas A. Anderson is a man living two lives. By day he is an average computer programmer and by night a malevolent hacker known as Neo who finds himself targeted by the police when he is contacted by Morpheus a legendary computer hacker who reveals the shocking truth about our reality.',
              tagline: 'Welcome to the Real World.',
              title: 'The Matrix',
            },
          },
        ],
      },
      {
        e: {
          dst: 3937,
          forward: true,
          identity: 1,
          label: 'acted_in',
          label_id: 0,
          properties: {
            role: 'Morpheus',
          },
          src: 0,
          temporal_id: 0,
        },
        n: {
          identity: 0,
          label: 'person',
          properties: {
            born: 1961,
            id: 2,
            name: 'Laurence Fishburne',
            poster_image: 'https://image.tmdb.org/t/p/w185/mh0lZ1XsT84FayMNiT6Erh91mVu.jpg',
          },
        },
        'n.id': 2,
        p: [
          {
            identity: 0,
            label: 'person',
            properties: {
              born: 1961,
              id: 2,
              name: 'Laurence Fishburne',
              poster_image: 'https://image.tmdb.org/t/p/w185/mh0lZ1XsT84FayMNiT6Erh91mVu.jpg',
            },
          },
          {
            dst: 3937,
            forward: true,
            identity: 1,
            label: 'acted_in',
            label_id: 0,
            properties: {
              role: 'Morpheus',
            },
            src: 0,
            temporal_id: 0,
          },
          {
            identity: 3937,
            label: 'movie',
            properties: {
              duration: 136,
              id: 1,
              poster_image: 'http://image.tmdb.org/t/p/w185/gynBNzwyaHKtXqlEKKLioNkjKgN.jpg',
              rated: 'R',
              summary: 'Thomas A. Anderson is a man living two lives. By day he is an average computer programmer and by night a malevolent hacker known as Neo who finds himself targeted by the police when he is contacted by Morpheus a legendary computer hacker who reveals the shocking truth about our reality.',
              tagline: 'Welcome to the Real World.',
              title: 'The Matrix',
            },
          },
        ],
      },
    ];

    const result = formatMultipleResponse(mockData);
    const { nodes, edges, properties, paths } = result
    assert(nodes.length === 2)
    assert(edges.length === 2)
    assert(properties.length === 2)
    assert(paths.length === 2)
  });
});
