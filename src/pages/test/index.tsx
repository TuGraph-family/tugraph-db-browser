import cytoscape from 'cytoscape';
import { useCallback, useEffect, useState } from 'react';
import elements from './data';
import { color } from 'framer-motion';

export default () => {
  const [cy, setCy] = useState(null);

  const data = {
    nodes: [
      {
        data: { id: 'Myriel', label: 'hah' },
        position: { x: 0, y: 0 },
        classes: ['foo'],
        style: {
          color: 'red',
          backgroundColor: 'green',
        },
      },
      {
        data: {
          id: 'Napoleon',
          label: 'hah1',
        },
        position: { x: 0, y: 100 },
      },
      {
        data: {
          id: 'Mlle.Baptistine',
          label: 'hah2',
        },
        position: { x: 50, y: 500 },
      },
    ],
    edges: [
      {
        data: {
          source: 'Napoleon',
          target: 'Myriel',
          value: 1,
          id: 'line1',
        },
      },
      {
        data: {
          source: 'Mlle.Baptistine',
          target: 'Napoleon',
          value: 8,
          id: 'line2',
        },
      },
      {
        data: {
          source: 'Myriel',
          target: 'Mlle.Baptistine',
          value: 10,
          id: 'line3',
        },
      },
    ],
  };
  useEffect(() => {
    const  newCy = cytoscape({
      container: document.getElementById('cy'), // container to render in
      elements: data,

      style: [
        // the stylesheet for the graph
        {
          selector: 'node',
          style: {
            'background-color': 'red',
            label: 'data(label)',
          },
        },

        {
          selector: 'edge',
          style: {
            width: 3,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            label: 'data(id)',
          },
        },
      ],

      boxSelectionEnabled: true,
      layout: {
        name: 'random',
      
        fit: true, // whether to fit to viewport
        padding: 30, // fit padding
        boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
        animate: false, // whether to transition the node positions
        animationDuration: 500, // duration of animation in ms if enabled
        animationEasing: undefined, // easing of animation if enabled
        animateFilter:  ( node, i )=>{ return true; }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
        ready: undefined, // callback on layoutready
        stop: undefined, // callback on layoutstop
        transform: (node, position )=>{ return position; } // transform a given node position. Useful for changing flow direction in discrete layouts 
      },
    });
    setCy(newCy);
  }, []);

  const add = useCallback(() => {
    cy?.add({
      group: 'node',
      data: { id: 'ccc' },
      position: { x: 200, y: 200 }
    });
  }, [cy]);

  return (
    <>
      <div onClick={add}>添加</div>
      <div id="cy" style={{ width: '100vw', height: '100vh' }} />;
    </>
  );
};
