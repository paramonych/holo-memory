class Space {
  public cortex: Cortex;
  public time: Time;
  constructor(
    public scene: BABYLON.Scene,
    public scale: number,
    public lifetime: number,
    neuronsAmount: number,
    blastRadius: number,
    blastPower: number) {
    this.cortex = new Cortex(scene, scale, lifetime, neuronsAmount, blastRadius, blastPower);
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

  public applyConfig(neuronsAmount: number, blastRadius: number, blastPower: number): void {
    this.cortex.dispose();
    this.cortex = new Cortex(this.scene, this.scale, this.lifetime, neuronsAmount, blastRadius, blastPower);
  }
}
