var SynapceMesh = (function () {
    function SynapceMesh(scene, scale, basePosition, neuron) {
        this.scene = scene;
        this.scale = scale;
        this.basePosition = basePosition;
        this.neuron = neuron;
        this.position = this.shiftPosition(this.basePosition.clone());
        this.draw(basePosition);
        this.setMaterial();
    }
    SynapceMesh.prototype.shiftPosition = function (basePosition) {
        var pinMaxLength = this.neuron.cortex.cortexState.pinMaxLength;
        var synapcesAmount = this.neuron.cortex.cortexState.synapcesAmount;
        pinMaxLength = pinMaxLength / (synapcesAmount / (this.neuron.cortex.cortexState.scale / realSynapcesDistance));
        var shift = pinMaxLength * random();
        var neuronPath = this.neuron.mesh.curve.path;
        var first = neuronPath[0];
        var last = neuronPath[neuronPath.length - 1];
        var baseVector = last.subtract(first).normalize();
        var delta = 0.49;
        var rotation = new BABYLON.Quaternion(limitedRandomWithRandomSign(delta), limitedRandomWithRandomSign(delta), limitedRandomWithRandomSign(delta));
        var scaleVector = new BABYLON.Vector3(shift, shift, shift);
        var zeroVector = new BABYLON.Vector3(0, 0, 0);
        var matrix = BABYLON.Matrix.Compose(scaleVector, rotation, zeroVector);
        var rotatedVector = BABYLON.Vector3.TransformCoordinates(baseVector, matrix);
        var result = basePosition.add(rotatedVector);
        return result;
    };
    SynapceMesh.prototype.draw = function (basePosition) {
        this.mesh = BABYLON.Mesh.CreateSphere('s', 4, this.scale / (isMedium(this.neuron.type) ? 50 : 100), this.scene, true);
        this.mesh.position = this.position;
        this.synapceLegMesh = BABYLON.Mesh.CreateTube('t', [basePosition, this.position], this.scale / 470, 10, null, 0, this.scene, true, BABYLON.Mesh.FRONTSIDE);
        this.mesh.material = defaultMaterial(this.scene);
        this.synapceLegMesh.material = defaultMaterial(this.scene);
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
        resetMaterial(this.mesh.material, activeMaterial);
        resetMaterial(this.synapceLegMesh.material, activeMaterial);
    };
    SynapceMesh.prototype.deactivate = function () {
        this.setMaterial();
    };
    SynapceMesh.prototype.setMaterial = function () {
        if (isMedium(this.neuron.type)) {
            resetMaterial(this.mesh.material, mediumMaterial);
            resetMaterial(this.synapceLegMesh.material, mediumMaterial);
        }
        else {
            resetMaterial(this.mesh.material, progenyMaterial);
            resetMaterial(this.synapceLegMesh.material, progenyMaterial);
        }
    };
    SynapceMesh.prototype.resetMaterials = function () {
        this.setMaterial();
    };
    SynapceMesh.prototype.dispose = function () {
        this.scene.removeMesh(this.mesh);
        this.mesh.dispose();
        this.mesh = null;
        this.scene.removeMesh(this.synapceLegMesh);
        if (this.synapceLegMesh && this.synapceLegMesh.dispose) {
            this.synapceLegMesh.dispose();
        }
        this.synapceLegMesh = null;
    };
    return SynapceMesh;
}());
