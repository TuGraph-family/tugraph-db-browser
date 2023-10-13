/**
 * 一个轻量的新手指引库！参考：https://driverjs.com/docs/configuration
 * 相比 driverjs，更轻量，只控制流程，其他的 popover 全部自定义。
 */

export type Step = {};

export type OnStepChange = (step: Step, idx: number, steps: Step[]) => void;

export class Driver {
  /**
   * 每一步的配置
   */
  private steps: Step[];

  /**
   * 更新的时候回调
   */
  private onStepChange: OnStepChange;

  private step = -1;

  constructor(steps: Step[], onStepChange: OnStepChange) {
    this.steps = steps;
    this.onStepChange = onStepChange;
  }

  /**
   * 跳转到某一步
   * @param step 
   */
  public go(step: number) {
    this.step = step;
    this.onStepChange(this.steps[step], step, this.steps);
  }

  /**
   * 开始第一步
   */
  public start() {
    this.step = 0
    this.go(this.step);
  }

  /**
   * 下一步
   */
  public next() {
    ++this.step;
    this.go(this.step);
  }

  /**
   * 上一步
   */
  public prev() {
    --this.step;
    this.go(this.step);
  }

  /**
   * 结束新手引导
   */
  public end() {
     this.step = -1;
    this.go(this.step);
  }
}