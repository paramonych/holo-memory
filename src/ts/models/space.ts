class Space {
  public cortex: Cortex;
  public time: Time;
  constructor(public scene: BABYLON.Scene, public scale: number) {
    this.cortex = new Cortex(scene, scale);
  }

  public expose(time: Time): void {
    this.time = time;
    this.cortex.draw();
  }
}
