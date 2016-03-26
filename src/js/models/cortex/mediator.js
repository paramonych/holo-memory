var Mediator = (function () {
    function Mediator(synapce) {
        this.synapce = synapce;
        this.scene = this.synapce.neuron.cortex.scene;
        this.texture = new BABYLON.Texture(particleUrl, this.scene);
        this.cloud = new BABYLON.ParticleSystem("cloud", 10, this.scene);
        this.cloud.disposeOnStop = false;
        var step = this.synapce.neuron.cortex.cortexState.blastRadius;
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
    Mediator.prototype.activate = function () {
        this.cloud.start();
    };
    Mediator.prototype.deactivate = function () {
        this.cloud.stop();
    };
    Mediator.prototype.willBeUsed = function () {
        var cd = this.cloud;
        cd.color1 = new BABYLON.Color4(ra(), ra(), ra(), 0.4);
        cd.color2 = cd.color1;
        var size = 0.5;
        cd.emitRate = 550;
        cd.minSize = size;
        cd.maxSize = size;
    };
    Mediator.prototype.setParticles = function () {
        var cloud = this.cloud;
        var zero = new BABYLON.Vector3(0, 0, 0);
        cloud.particleTexture = this.texture;
        cloud.emitter = this.synapce.mesh.mesh;
        cloud.minEmitBox = zero;
        cloud.maxEmitBox = zero.clone();
        var transparentGray = new BABYLON.Color4(0.1, 0.1, 0.1, 0.15);
        cloud.color1 = transparentGray;
        cloud.color2 = transparentGray;
        var size = 0.4;
        cloud.minSize = size;
        cloud.maxSize = size;
        var lt = lifetime / 2.5;
        cloud.minLifeTime = 10000000000000;
        cloud.maxLifeTime = 10000000000000;
        cloud.emitRate = 120;
        cloud.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        cloud.direction1 = new BABYLON.Vector3(1, 1, 1);
        cloud.direction2 = new BABYLON.Vector3(-1, -1, -1);
        cloud.minAngularSpeed = Math.PI / 100;
        cloud.maxAngularSpeed = Math.PI;
        cloud.minEmitPower = 2;
        cloud.maxEmitPower = 2;
        cloud.updateSpeed = 0.01;
    };
    Mediator.prototype.dispose = function () {
        this.cloud.dispose();
    };
    return Mediator;
}());
