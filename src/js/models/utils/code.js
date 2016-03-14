var Code = (function () {
    function Code(scene, scale, position, text, isBig) {
        this.scene = scene;
        this.scale = scale;
        this.position = position;
        this.text = text;
        this.isBig = isBig;
        this.mesh = BABYLON.Mesh.CreatePlane("outputplane", this.scale / (isBig ? 6 : 6), this.scene, false);
        this.mesh.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
        this.mesh.material = new BABYLON.StandardMaterial("outputplane", scene);
        this.mesh.position = this.position;
        this.mesh.scaling.y = 1;
        var outputplaneTexture = new BABYLON.DynamicTexture("dynamic texture", 512, scene, true);
        outputplaneTexture.hasAlpha = true;
        this.mesh.material.diffuseTexture = outputplaneTexture;
        this.mesh.material.specularColor = new BABYLON.Color3(0, 0, 0);
        this.mesh.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
        this.mesh.material.backFaceCulling = false;
        outputplaneTexture.drawText(this.text, null, isBig ? 200 : 160, isBig ? 'bold 230px arial' : '120px arial', isBig ? 'gold' : 'silver', null);
    }
    Code.prototype.setVisibility = function (isVisible) {
        this.mesh.material.alpha = isVisible ? 1 : 0;
    };
    Code.prototype.dispose = function () {
        this.scene.removeMesh(this.mesh);
        this.mesh.dispose();
    };
    return Code;
}());
