var Code = (function () {
    function Code(scene, scale, position, text) {
        this.scene = scene;
        this.scale = scale;
        this.position = position;
        this.text = text;
        this.mesh = BABYLON.Mesh.CreatePlane("outputplane", this.scale / 8, this.scene, false);
        this.mesh.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
        this.mesh.material = new BABYLON.StandardMaterial("outputplane", scene);
        this.mesh.position = this.position.add(new BABYLON.Vector3(0, 0, this.scale / 25));
        this.mesh.scaling.y = 1;
        var outputplaneTexture = new BABYLON.DynamicTexture("dynamic texture", 512, scene, true);
        outputplaneTexture.hasAlpha = true;
        this.mesh.material.diffuseTexture = outputplaneTexture;
        this.mesh.material.specularColor = new BABYLON.Color3(0, 0, 0);
        this.mesh.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
        this.mesh.material.backFaceCulling = false;
        outputplaneTexture.drawText(this.text, null, 140, 'normal 130px arial', 'white', null);
    }
    Code.prototype.setVisibility = function (isVisible) {
        this.mesh.material.alpha = isVisible ? 1 : 0;
    };
    Code.prototype.dispose = function () {
        this.mesh.dispose();
    };
    return Code;
})();
