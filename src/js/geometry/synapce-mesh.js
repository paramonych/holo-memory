var SynapceMesh = (function () {
    function SynapceMesh(scene, scale, basePosition, neuron) {
        this.scene = scene;
        this.scale = scale;
        this.basePosition = basePosition;
        this.neuron = neuron;
        this.position = this.shiftPosition(this.basePosition.clone());
        this.setMaterials();
        this.draw(basePosition);
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
        this.mesh = BABYLON.Mesh.CreateSphere('s', 4, this.scale / (isMedium(this.neuron.type) ? 50 : 100), this.scene, false);
        this.mesh.position = this.position;
        this.synapceLegMesh = BABYLON.Mesh.CreateTube('t', [basePosition, this.position], this.scale / 470, 10, null, 0, this.scene, true, BABYLON.Mesh.FRONTSIDE);
        this.synapceLegMesh.material = this.material;
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
        if (isMedium(this.neuron.type)) {
            this.material = forMediumNeuron(this.scene);
        }
        else {
            this.material = forProgenyNeuron(this.scene);
        }
        this.activeMaterial = forActiveNeuron(this.scene);
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
