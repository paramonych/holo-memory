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

  public affect(frontPosition: DoubleVector): boolean {
    return this.isCloseEnough(frontPosition.one) || this.isCloseEnough(frontPosition.two);
  }

  private isCloseEnough(vector: BABYLON.Vector3): boolean {
    let delta = this.scale/4;
    let x = Math.abs(this.position.x - vector.x);
    let y = Math.abs(this.position.y - vector.y);
    let z = Math.abs(this.position.z - vector.z);
    console.debug('delta', x, y, z, delta);
    return x < delta && y < delta && z < delta;
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
