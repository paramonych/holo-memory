class SpikeMesh implements ActivatableMesh {
  public shoulders: SpikeShoulders;
  public material: BABYLON.StandardMaterial;
  public activeMaterial: BABYLON.StandardMaterial;
  private shift = new BABYLON.Vector3(0.01, 0.01, 0.01);
  private position: BABYLON.Vector3;

  constructor(
    public scene: BABYLON.Scene,
    public scale: number,
    synapcePosition: BABYLON.Vector3
  ) {
    this.position = synapcePosition.clone();
    this.setMaterials();
    this.constructShoulders();
  }

  private constructShoulders(): void {
    this.shoulders = shouldersFrom(this.constructShoulderMesh(), this.constructShoulderMesh());
    this.deactivate();
  }

  private constructShoulderMesh(): BABYLON.Mesh {
    let shoulder = BABYLON.Mesh.CreateSphere('s', 4, this.scale/30, this.scene, false);
    shoulder.position = this.position;

    return shoulder;
  }

  public move(): void {
    let left = this.shoulders.left.position;
    let right = this.shoulders.right.position;
    let newLeft = left.add(this.shift);
    let newRight = newLeft.negate();
    this.shoulders.left.position = newLeft;
    this.shoulders.right.position = newRight;
  }

  public reset(): void {
  //  this.shoulders.left.position = this.position;
  //  this.shoulders.right.position = this.position;
  }

  public activate(): void {
    this.shoulders.left.material = this.activeMaterial;
    this.shoulders.right.material = this.activeMaterial;
  }

  public deactivate(): void {
    this.shoulders.left.material = this.material;
    this.shoulders.right.material = this.material;
  }

  setMaterials(): void {
    this.material = new BABYLON.StandardMaterial('i', this.scene);
    this.material.alpha = 0;

    this.activeMaterial = new BABYLON.StandardMaterial('a', this.scene);
    this.activeMaterial.emissiveColor = new BABYLON.Color3(1, .2, 0);
    this.activeMaterial.ambientColor = new BABYLON.Color3(0, 0, 1);
    this.activeMaterial.alpha = 0.9;
  }

  public dispose(): void {
    this.scene.removeMesh(this.shoulders.left);
    this.scene.removeMesh(this.shoulders.right);
  }
}
