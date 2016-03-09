class Mediator {
  private scene: BABYLON.Scene;
  private texture: BABYLON.Texture;
  private cloud: BABYLON.ParticleSystem;

  constructor(private synapce: Synapce) {
    this.scene = this.synapce.neuron.cortex.scene;
    this.texture = new BABYLON.Texture(particleUrl, this.scene);

    this.cloud = new BABYLON.ParticleSystem("cloud", 2000, this.scene);
    this.cloud.disposeOnStop  = false;
    var step = this.synapce.neuron.step/2.5;
    this.cloud.updateFunction = function (newParticles) {
    	var stop = false;
      for (var index = 0; index < this.particles.length; index++) {
        var particle = this.particles[index];
        var emitterPosition = new BABYLON.Vector3(this.emitter.position.x, this.emitter.position.y, this.emitter.position.z);
        var distance = emitterPosition.subtract(particle.position).length();

				if (distance > step) {
					particle.lifeTime = 0;
					stop = true;
				}

        if (!stop) {
          particle.angle += particle.angularSpeed * this._scaledUpdateSpeed;

					particle.direction.scaleToRef(this._scaledUpdateSpeed, this._scaledDirection);
					particle.position.addInPlace(this._scaledDirection);

					this.gravity.scaleToRef(this._scaledUpdateSpeed, this._scaledGravity);
					particle.direction.addInPlace(this._scaledGravity);
        }
      }
    };
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
    cd.color1 = new BABYLON.Color4(ra(), ra(), ra(), 0.4);
    cd.color2 = cd.color1;
    //cd.colorDead = new BABYLON.Color4(this.ra(), this.ra(), this.ra(), 0);

    let size = 0.5;
    cd.emitRate = 550;
    cd.minSize = size;
    cd.maxSize = size;
  }

  private setParticles(): void {
    let cloud = this.cloud;
    let zero = new BABYLON.Vector3(0, 0, 0);
    cloud.particleTexture = this.texture;
    cloud.emitter = this.synapce.mesh.mesh;
    cloud.minEmitBox = zero;
    cloud.maxEmitBox = zero.clone();

    cloud.color1 = new BABYLON.Color4(0.1, 0.1, 0.1, 0.05);
    cloud.color2 = new BABYLON.Color4(0.1, 0.1, 0.1, 0.05);
  //  cloud.colorDead = new BABYLON.Color4(0, 0, 0, 0.0);

    let size = 0.4;
    cloud.minSize = size;
    cloud.maxSize = size;

    let lt = lifetime/2.5;

    cloud.minLifeTime = 10000000000000;//lt;
    cloud.maxLifeTime = 10000000000000;//lt;

    cloud.emitRate = 120;
    cloud.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
    //cloud.gravity = new BABYLON.Vector3(0, 0, 0);

    // Direction of each particle after it has been emitted
    cloud.direction1 = new BABYLON.Vector3(1, 1, 1);
    cloud.direction2 = new BABYLON.Vector3(-1, -1, -1);

    // Angular speed, in radians
    cloud.minAngularSpeed = Math.PI/100;
    cloud.maxAngularSpeed = Math.PI;

    // Speed
    cloud.minEmitPower = 2;
    cloud.maxEmitPower = 2;
    cloud.updateSpeed = 0.01;
  }

  public dispose(): void {
    this.cloud.dispose();
  }
}
