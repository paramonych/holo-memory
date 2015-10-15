var particleUrl = 'http://i166.photobucket.com/albums/u83/j1m68/star.jpg';
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
        cloud.particleTexture = this.texture;
        cloud.emitter = this.synapce.mesh.mesh;
        cloud.minEmitBox = new BABYLON.Vector3(1, 0, 0);
        cloud.maxEmitBox = new BABYLON.Vector3(-1, 0, 0);
        cloud.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
        cloud.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
        cloud.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);
        cloud.minSize = 0.1;
        cloud.maxSize = 0.5;
        cloud.minLifeTime = 0.3;
        cloud.maxLifeTime = 1.5;
        cloud.emitRate = 1500;
        cloud.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        cloud.gravity = new BABYLON.Vector3(0, 0, 0);
        cloud.direction1 = new BABYLON.Vector3(-7, 8, 3);
        cloud.direction2 = new BABYLON.Vector3(7, 8, -3);
        cloud.minAngularSpeed = 0;
        cloud.maxAngularSpeed = Math.PI;
        cloud.minEmitPower = 1;
        cloud.maxEmitPower = 3;
        cloud.updateSpeed = 0.005;
    };
    return Mediator;
})();
