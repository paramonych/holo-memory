class Mediator {
  private scene: BABYLON.Scene;
  private texture: BABYLON.Texture;
  private cloud: BABYLON.ParticleSystem;

  constructor(private synapce: Synapce) {
    this.scene = this.synapce.neuron.cortex.scene;
    this.texture = new BABYLON.Texture(particleUrl, this.scene);
    this.cloud = new BABYLON.ParticleSystem("cloud", 2000, this.scene);
    this.setParticles();
  }

  public activate(): void {
    this.cloud.start();
  }

  public deactivate(): void {
    this.cloud.stop();
  }

  public willBeUsed(): void {
    let cd = this.cloud;
    cd.color1 = new BABYLON.Color4(this.ra(), this.ra(), this.ra(), 1);
    cd.color2 = new BABYLON.Color4(this.ra(), this.ra(), this.ra(), 1);
    cd.colorDead = new BABYLON.Color4(this.ra(), this.ra(), this.ra(), 0);

    let size = 1.2;
    cd.minSize = size;
    cd.maxSize = size;
  }

  private ra(): number {
    let r = random();
    return (r < 0.5) ? (1-r) : r;
  }

  private setParticles(): void {
    let cloud = this.cloud;
    let zero = new BABYLON.Vector3(0, 0, 0);
    cloud.particleTexture = this.texture;
    cloud.emitter = this.synapce.mesh.mesh;
    cloud.minEmitBox = zero;
    cloud.maxEmitBox = zero.clone();

    cloud.color1 = new BABYLON.Color4(0.1, 0.1, 0.1, 0.6);
    cloud.color2 = new BABYLON.Color4(0.1, 0.1, 0.1, 0.6);
    cloud.colorDead = new BABYLON.Color4(0, 0, 0, 0.0);

    let size = 0.9;
    cloud.minSize = size;
    cloud.maxSize = size;

    let lt = lifetime/2.5;

    cloud.minLifeTime = lt;
    cloud.maxLifeTime = lt;

    cloud.emitRate = 21;
    cloud.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
    //cloud.gravity = new BABYLON.Vector3(0, 0, 0);

    // Direction of each particle after it has been emitted
    cloud.direction1 = new BABYLON.Vector3(1, 1, 1);
    cloud.direction2 = new BABYLON.Vector3(-1, -1, -1);

    // Angular speed, in radians
    cloud.minAngularSpeed = Math.PI;
    cloud.maxAngularSpeed = Math.PI;

    // Speed
    cloud.minEmitPower = 2;
    cloud.maxEmitPower = 2;
    cloud.updateSpeed = 0.01;
  }
}
