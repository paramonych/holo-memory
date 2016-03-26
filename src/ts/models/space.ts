class Space {
  public cortex: Cortex;
  public time: Time;
  constructor(
    public scene: BABYLON.Scene,
    public scale: number,
    public lifetime: number,
    public cortexState: CortexConfiguration,
    uiCallback: (blastsAmount: number) => void) {
    this.cortex = new Cortex(scene, scale, lifetime, cortexState, uiCallback);
  }

  public expose(time: Time): void {
    this.time = time;
    this.cortex.chargeTense(time);
  }

  public freeze(time: Time): void {
    this.cortex.freezeTense(time);
  }

  public resume(time: Time): void {
    this.cortex.resumeTense(time);
  }

  public restart(time: Time): void {
    this.cortex.restartTense(time);
  }

  public shift(time: Time, progress: number): void {
    this.cortex.shiftTense(time, progress);
  }

  public dispose(): void {
    this.cortex.dispose();
    this.cortex = null;
    this.time = null;
  }
}
