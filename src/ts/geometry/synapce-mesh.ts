class SynapceMesh implements ActivatableMesh {
  public mesh: BABYLON.Mesh;
  public material: BABYLON.StandardMaterial;
  public activeMaterial: BABYLON.StandardMaterial;

  constructor(
    public scene: BABYLON.Scene, public scale: number, private position: BABYLON.Vector3
  ) {
    this.setMaterials();
    this.draw();
  }

  private draw(): void {
    this.mesh = BABYLON.Mesh.CreateSphere('s', 4, this.scale/30, this.scene, false);
    this.mesh.position = this.position;
    this.deactivate();
  }

  public activate(): void {
    this.mesh.material = this.activeMaterial;
  }

  public deactivate(): void {
    this.mesh.material = this.material;
  }

  setMaterials(): void {
    this.material = new BABYLON.StandardMaterial('i', this.scene);
    this.material.alpha = 1;

    this.activeMaterial = new BABYLON.StandardMaterial('a', this.scene);
    this.activeMaterial.emissiveColor = new BABYLON.Color3(1, .2, 0);
    this.activeMaterial.ambientColor = new BABYLON.Color3(0, 0, 1);
    this.activeMaterial.alpha = 1;
  }

  public dispose(): void {
    this.scene.removeMesh(this.mesh);
  }
}
