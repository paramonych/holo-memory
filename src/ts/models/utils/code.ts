class Code {
  public mesh: BABYLON.Mesh;

  constructor(
    public scene: BABYLON.Scene,
    public scale: number,
    public position: BABYLON.Vector3,
    public text: string
  ) {

    this.mesh = BABYLON.Mesh.CreatePlane("outputplane", this.scale/8, this.scene, false);
  	this.mesh.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
  	this.mesh.material = new BABYLON.StandardMaterial("outputplane", scene);
  	this.mesh.position = this.position.add(new BABYLON.Vector3(0, 0, this.scale/25));
  	this.mesh.scaling.y = 1;
    //this.mesh.material.alpha = 0;

  	var outputplaneTexture = new BABYLON.DynamicTexture("dynamic texture", 512, scene, true);
    outputplaneTexture.hasAlpha = true;
  	(<BABYLON.StandardMaterial>this.mesh.material).diffuseTexture = outputplaneTexture;
  	(<BABYLON.StandardMaterial>this.mesh.material).specularColor = new BABYLON.Color3(0, 0, 0);
  	(<BABYLON.StandardMaterial>this.mesh.material).emissiveColor = new BABYLON.Color3(1, 1, 1);
  	this.mesh.material.backFaceCulling = false;

    outputplaneTexture.drawText(this.text, null, 140, 'normal 130px arial', 'white', null);
  }

  public setVisibility(isVisible: boolean): void {
    this.mesh.material.alpha = isVisible ? 1 : 0;
  }

  public dispose(): void {
    this.mesh.dispose();
  }
}
