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

  private setParticles(): void {
    let cloud = this.cloud;
    let zero = new BABYLON.Vector3(0, 0, 0);
    cloud.particleTexture = this.texture;
    cloud.emitter = this.synapce.mesh.mesh;
    cloud.minEmitBox = zero;
    cloud.maxEmitBox = zero.clone();

    cloud.color1 = new BABYLON.Color4(random(), random(), random(), 1);
  //  cloud.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
  //  cloud.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

    cloud.minSize = 0.7;
    cloud.maxSize = 0.7;

    cloud.minLifeTime = 1.5;
    cloud.maxLifeTime = 1.5;

    cloud.emitRate = 17;
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
