const particleUrl = 'http://i166.photobucket.com/albums/u83/j1m68/star.jpg';

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

    cloud.particleTexture = this.texture;

      // Where the particles come from
      cloud.emitter = this.synapce.mesh.mesh; // the starting object, the emitter
      cloud.minEmitBox = new BABYLON.Vector3(1, 0, 0); // Starting all from
      cloud.maxEmitBox = new BABYLON.Vector3(-1, 0, 0); // To...

      // Colors of all particles
      cloud.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
      cloud.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
      cloud.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

      // Size of each particle (random between...
      cloud.minSize = 0.1;
      cloud.maxSize = 0.5;

      // Life time of each particle (random between...
      cloud.minLifeTime = 0.3;
      cloud.maxLifeTime = 1.5;

      // Emission rate
      cloud.emitRate = 1500;

      // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
      cloud.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

      // Set the gravity of all particles
      cloud.gravity = new BABYLON.Vector3(0, 0, 0);

      // Direction of each particle after it has been emitted
      cloud.direction1 = new BABYLON.Vector3(-7, 8, 3);
      cloud.direction2 = new BABYLON.Vector3(7, 8, -3);

      // Angular speed, in radians
      cloud.minAngularSpeed = 0;
      cloud.maxAngularSpeed = Math.PI;

      // Speed
      cloud.minEmitPower = 1;
      cloud.maxEmitPower = 3;
      cloud.updateSpeed = 0.005;
  }
}
