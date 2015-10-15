class SpikeMesh {
  public shoulders: SpikeShoulders;
  private spikeMaterial: BABYLON.StandardMaterial;
  private movingSpikeMaterial: BABYLON.StandardMaterial;
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
    let shoulder = BABYLON.Mesh.CreateSphere('sphere', 4, this.scale/30, this.scene, false);
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
    this.shoulders.left.material = this.movingSpikeMaterial;
    this.shoulders.right.material = this.movingSpikeMaterial;
  }

  public deactivate(): void {
    this.shoulders.left.material = this.spikeMaterial;
    this.shoulders.right.material = this.spikeMaterial;
  }

  setMaterials(): void {
    this.spikeMaterial = new BABYLON.StandardMaterial('silent-spike', this.scene);
    this.spikeMaterial.alpha = 0;

    this.movingSpikeMaterial = new BABYLON.StandardMaterial('moving-spike', this.scene);
    this.movingSpikeMaterial.emissiveColor = new BABYLON.Color3(1, .2, 0);
    this.movingSpikeMaterial.ambientColor = new BABYLON.Color3(0, 0, 1);
    this.movingSpikeMaterial.alpha = 0.9;
  }

  public dispose(): void {
    this.scene.removeMesh(this.shoulders.left);
    this.scene.removeMesh(this.shoulders.right);
  }
}
