export type StepUIProps = {
  prev: () => void;
  next: () => void;
  end: () => void;
  x?: number;
  y?: number;
  canvasX?: number;
  canvasY?: number;
}