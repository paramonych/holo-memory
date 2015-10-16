class NeuronMesh implements ActivatableMesh {
  public mesh: BABYLON.Mesh;
  public curve: BABYLON.Path3D;
  public material: BABYLON.StandardMaterial;
  public activeMaterial: BABYLON.StandardMaterial;

  constructor(private scene: BABYLON.Scene, public scale: number) {
    this.setMaterials();
    this.curve = randomPath(this.scale, this.scale/20, this.scale/60);
    this.draw();
  }

  draw(): void {
    let scale = this.scale;
    this.mesh = BABYLON.Mesh.CreateTube(
      't', this.curve.path, this.scale/200, 60, null, 0, this.scene, true, BABYLON.Mesh.FRONTSIDE);
    this.mesh.material = this.material;
  }

  setMaterials(): void {
    this.material = new BABYLON.StandardMaterial('i', this.scene);
    this.material.alpha = 1;

    this.activeMaterial = new BABYLON.StandardMaterial('a', this.scene);
    this.activeMaterial.emissiveColor = new BABYLON.Color3(1, .9, 0);
    this.activeMaterial.ambientColor = new BABYLON.Color3(0, 0, 1);
    this.activeMaterial.alpha = 0.3;
  }

  public activate(): void {
    this.mesh.material = this.activeMaterial;
  }
  public deactivate(): void {
    this.mesh.material = this.material;
  }

  public dispose(): void {
    this.scene.removeMesh(this.mesh);
  }
}
