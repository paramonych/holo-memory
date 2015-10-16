var SynapceMesh = (function () {
    function SynapceMesh(scene, scale, position) {
        this.scene = scene;
        this.scale = scale;
        this.position = position;
        this.setMaterials();
        this.draw();
    }
    SynapceMesh.prototype.draw = function () {
        this.mesh = BABYLON.Mesh.CreateSphere('s', 4, this.scale / 30, this.scene, false);
        this.mesh.position = this.position;
        this.deactivate();
    };
    SynapceMesh.prototype.activate = function () {
        this.mesh.material = this.activeMaterial;
    };
    SynapceMesh.prototype.deactivate = function () {
        this.mesh.material = this.material;
    };
    SynapceMesh.prototype.setMaterials = function () {
        this.material = new BABYLON.StandardMaterial('i', this.scene);
        this.material.alpha = 1;
        this.activeMaterial = new BABYLON.StandardMaterial('a', this.scene);
        this.activeMaterial.emissiveColor = new BABYLON.Color3(1, .2, 0);
        this.activeMaterial.ambientColor = new BABYLON.Color3(0, 0, 1);
        this.activeMaterial.alpha = 1;
    };
    SynapceMesh.prototype.dispose = function () {
        this.scene.removeMesh(this.mesh);
    };
    return SynapceMesh;
})();
