var SynapceMesh = (function () {
    function SynapceMesh(scene, scale, basePosition, type) {
        this.scene = scene;
        this.scale = scale;
        this.type = type;
        this.position = isMedium(type) ? this.shiftPosition(basePosition) : basePosition;
        this.setMaterials();
        this.draw(basePosition);
    }
    SynapceMesh.prototype.shiftPosition = function (basePosition) {
        var shift = this.scale / 10;
        var baseVector = new BABYLON.Vector3(shift, shift, shift);
        var rotation = new BABYLON.Quaternion(randomWithRandomSign(), randomWithRandomSign(), randomWithRandomSign());
        var normalVector = new BABYLON.Vector3(1, 1, 1);
        var zeroVector = new BABYLON.Vector3(0, 0, 0);
        var matrix = BABYLON.Matrix.Compose(normalVector, rotation, zeroVector);
        var rotatedVector = BABYLON.Vector3.TransformCoordinates(baseVector, matrix);
        var result = basePosition.add(rotatedVector);
        return result;
    };
    SynapceMesh.prototype.draw = function (basePosition) {
        this.mesh = BABYLON.Mesh.CreateSphere('s', 4, this.scale / (isMedium(this.type) ? 50 : 100), this.scene, false);
        this.mesh.position = this.position;
        if (isMedium(this.type)) {
            this.synapceLegMesh = BABYLON.Mesh.CreateTube('t', [basePosition, this.position], this.scale / 470, 10, null, 0, this.scene, true, BABYLON.Mesh.FRONTSIDE);
            this.synapceLegMesh.material = this.material;
        }
        this.deactivate();
    };
    SynapceMesh.prototype.affect = function (frontPosition) {
        return this.isCloseEnough(frontPosition.one) || this.isCloseEnough(frontPosition.two);
    };
    SynapceMesh.prototype.isCloseEnough = function (vector) {
        var delta = this.scale / 4;
        var x = Math.abs(this.position.x - vector.x);
        var y = Math.abs(this.position.y - vector.y);
        var z = Math.abs(this.position.z - vector.z);
        console.debug('delta', x, y, z, delta);
        return x < delta && y < delta && z < delta;
    };
    SynapceMesh.prototype.activate = function () {
        this.mesh.material = this.activeMaterial;
        this.synapceLegMesh.material = this.activeMaterial;
    };
    SynapceMesh.prototype.deactivate = function () {
        this.mesh.material = this.material;
    };
    SynapceMesh.prototype.setMaterials = function () {
        if (isMedium(this.type)) {
            this.material = forMediumNeuron(this.scene);
            this.activeMaterial = forMediumActiveNeuron(this.scene);
        }
        else {
            this.material = forProgenyNeuron(this.scene);
            this.activeMaterial = forProgenyActiveNeuron(this.scene);
        }
    };
    SynapceMesh.prototype.dispose = function () {
        this.scene.removeMesh(this.mesh);
    };
    return SynapceMesh;
}());
