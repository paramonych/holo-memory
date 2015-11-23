var Mediator = (function () {
    function Mediator(synapce) {
        this.synapce = synapce;
        this.scene = this.synapce.neuron.cortex.scene;
        this.texture = new BABYLON.Texture(particleUrl, this.scene);
        this.cloud = new BABYLON.ParticleSystem("cloud", 2000, this.scene);
        this.setParticles();
    }
    Mediator.prototype.activate = function () {
        this.cloud.start();
    };
    Mediator.prototype.deactivate = function () {
        this.cloud.stop();
    };
    Mediator.prototype.setParticles = function () {
        var cloud = this.cloud;
        var zero = new BABYLON.Vector3(0, 0, 0);
        cloud.particleTexture = this.texture;
        cloud.emitter = this.synapce.mesh.mesh;
        cloud.minEmitBox = zero;
        cloud.maxEmitBox = zero.clone();
        cloud.color1 = new BABYLON.Color4(random(), random(), random(), 1);
        cloud.minSize = 0.7;
        cloud.maxSize = 0.7;
        cloud.minLifeTime = 1.5;
        cloud.maxLifeTime = 1.5;
        cloud.emitRate = 17;
        cloud.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        cloud.direction1 = new BABYLON.Vector3(1, 1, 1);
        cloud.direction2 = new BABYLON.Vector3(-1, -1, -1);
        cloud.minAngularSpeed = Math.PI;
        cloud.maxAngularSpeed = Math.PI;
        cloud.minEmitPower = 2;
        cloud.maxEmitPower = 2;
        cloud.updateSpeed = 0.01;
    };
    return Mediator;
})();
