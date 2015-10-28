class Space {
  public cortex: Cortex;
  public time: Time;
  constructor(
    public scene: BABYLON.Scene,
    public scale: number,
    public lifetime: number) {
    this.cortex = new Cortex(scene, scale, lifetime);
  }

  public expose(time: Time): void {
    this.time = time;
    this.cortex.draw();
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
}
