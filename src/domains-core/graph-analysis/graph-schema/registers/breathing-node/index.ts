import { Circle, ExtensionCategory, register } from '@antv/g6';

class BreathingNode extends Circle {
  onCreate() {
    const halo = this.shapeMap.halo;
    if (halo) {
      halo.animate([{ lineWidth: 0 }, { lineWidth: 20 }], {
        duration: 1000,
        iterations: Infinity,
        direction: 'alternate',
      });
    }
  }
  onUpdate() {
    const halo = this.shapeMap.halo;
    if (halo) {
      halo.animate([{ lineWidth: 0 }, { lineWidth: 20 }], {
        duration: 1000,
        iterations: Infinity,
        direction: 'alternate',
      });
    }
  }
}

export const registerBreathingNode = () => {
  register(ExtensionCategory.NODE, 'breathing-node', BreathingNode);
};
