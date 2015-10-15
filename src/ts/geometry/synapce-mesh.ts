class SynapceMesh {
  public mesh: BABYLON.Mesh;
  private material: BABYLON.StandardMaterial;
  private activeMaterial: BABYLON.StandardMaterial;

  constructor(
    public scene: BABYLON.Scene, public scale: number, private position: BABYLON.Vector3
  ) {
    this.setMaterials();
    this.draw();
  }

  private draw(): void {
    this.mesh = BABYLON.Mesh.CreateSphere('sphere', 4, this.scale/30, this.scene, false);
    this.mesh.position = this.position;
    this.activate();
  }

  public activate(): void {
    this.mesh.material = this.activeMaterial;
  }

  public deactivate(): void {
    this.mesh.material = this.material;
  }

  setMaterials(): void {
    this.material = new BABYLON.StandardMaterial('silent-spike', this.scene);
    this.material.alpha = 0;

    this.activeMaterial = new BABYLON.StandardMaterial('moving-spike', this.scene);
    this.activeMaterial.emissiveColor = new BABYLON.Color3(1, .2, 0);
    this.activeMaterial.ambientColor = new BABYLON.Color3(0, 0, 1);
    this.activeMaterial.alpha = 0.9;
  }

  public dispose(): void {
    this.scene.removeMesh(this.mesh);
  }
}
