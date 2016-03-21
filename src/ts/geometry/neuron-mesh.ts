class NeuronMesh implements ActivatableMesh {
  public mesh: BABYLON.Mesh;
  public curve: BABYLON.Path3D;
  public material: BABYLON.StandardMaterial;
  public activeMaterial: BABYLON.StandardMaterial;

  constructor(private type: NeuronType, private scene: BABYLON.Scene, public cortexState: CortexConfiguration) {
    this.setMaterials();
    this.curve = randomPath(this.cortexState.scale, (this.cortexState.synapcesAmount+1)*2);
    this.draw();
  }

  draw(): void {
    let scale = this.cortexState.scale;
    this.mesh = BABYLON.Mesh.CreateTube(
      't', this.curve.path, this.cortexState.scale/400, 60, null, 0, this.scene, true, BABYLON.Mesh.FRONTSIDE);
    this.mesh.material = this.material;
  }

  setMaterials(): void {
    if(isMedium(this.type)) {
      this.material = forMediumNeuron(this.scene);
      this.activeMaterial = forMediumActiveNeuron(this.scene);
    } else {
      this.material = forProgenyNeuron(this.scene);
      this.activeMaterial = forProgenyActiveNeuron(this.scene);
    }
  }

  public activate(): void {
    this.mesh.material = this.activeMaterial;
  }
  public deactivate(): void {
    this.mesh.material = this.material;
  }

  public dispose(): void {

    this.scene.removeMesh(this.mesh);
    this.mesh.dispose();
    this.mesh = null;
  }
}
