class Code {
  public mesh: BABYLON.Mesh;

  constructor(
    public scene: BABYLON.Scene,
    public scale: number,
    public position: BABYLON.Vector3,
    public text: string,
    public isBig: boolean
  ) {

    this.mesh = BABYLON.Mesh.CreatePlane("outputplane", this.scale/(isBig?6:6), this.scene, false);
  	this.mesh.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
  	this.mesh.material = new BABYLON.StandardMaterial("outputplane", scene);
  	this.mesh.position = this.position;
  	this.mesh.scaling.y = 1;
    //this.mesh.material.alpha = 0;

  	var outputplaneTexture = new BABYLON.DynamicTexture("dynamic texture", 512, scene, true);
    outputplaneTexture.hasAlpha = true;
  	(<BABYLON.StandardMaterial>this.mesh.material).diffuseTexture = outputplaneTexture;
  	(<BABYLON.StandardMaterial>this.mesh.material).specularColor = new BABYLON.Color3(0, 0, 0);
  	(<BABYLON.StandardMaterial>this.mesh.material).emissiveColor = new BABYLON.Color3(1, 1, 1);
  	this.mesh.material.backFaceCulling = false;

    outputplaneTexture.drawText(this.text, null, isBig?200:160, isBig?'bold 230px arial':'120px arial', isBig?'gold':'silver', null);

    /*
    var context2D = outputplaneTexture.getContext();
    	var out = function(data) {
    		context2D.clearRect(0, 200, 512, 512);
    		outputplaneTexture.drawText(data, null, 380, "140px verdana", "white", null);
    	}
    */
  }

  public setVisibility(isVisible: boolean): void {
    this.mesh.material.alpha = isVisible ? 1 : 0;
  }

  public dispose(): void {
    this.mesh.dispose();
  }
}
