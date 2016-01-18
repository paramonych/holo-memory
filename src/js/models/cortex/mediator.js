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
    Mediator.prototype.willBeUsed = function () {
        var cd = this.cloud;
        cd.color1 = new BABYLON.Color4(this.ra(), this.ra(), this.ra(), 1);
        cd.color2 = new BABYLON.Color4(this.ra(), this.ra(), this.ra(), 1);
        cd.colorDead = new BABYLON.Color4(this.ra(), this.ra(), this.ra(), 0);
        var size = 1.2;
        cd.minSize = size;
        cd.maxSize = size;
    };
    Mediator.prototype.ra = function () {
        var r = random();
        return (r < 0.5) ? (1 - r) : r;
    };
    Mediator.prototype.setParticles = function () {
        var cloud = this.cloud;
        var zero = new BABYLON.Vector3(0, 0, 0);
        cloud.particleTexture = this.texture;
        cloud.emitter = this.synapce.mesh.mesh;
        cloud.minEmitBox = zero;
        cloud.maxEmitBox = zero.clone();
        cloud.color1 = new BABYLON.Color4(0.1, 0.1, 0.1, 0.6);
        cloud.color2 = new BABYLON.Color4(0.1, 0.1, 0.1, 0.6);
        cloud.colorDead = new BABYLON.Color4(0, 0, 0, 0.0);
        var size = 0.9;
        cloud.minSize = size;
        cloud.maxSize = size;
        var lt = lifetime / 2.5;
        cloud.minLifeTime = lt;
        cloud.maxLifeTime = lt;
        cloud.emitRate = 21;
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
