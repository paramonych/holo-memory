class NeuronMesh {
  public mesh: BABYLON.Mesh;
  public curve: BABYLON.Path3D;
  private neuronMaterial: BABYLON.StandardMaterial;
  private activeNeuronMaterial: BABYLON.StandardMaterial;

  constructor(private scene: BABYLON.Scene, public scale: number) {
    this.setMaterials();
    this.curve = randomPath(this.scale, this.scale/20, this.scale/60);
    this.draw();
  }

  draw(): void {
    let scale = this.scale;
    this.mesh = BABYLON.Mesh.CreateTube(
      'tube', this.curve.path, this.scale/200, 60, null, 0, this.scene, true, BABYLON.Mesh.FRONTSIDE);
    this.mesh.material = this.neuronMaterial;
  }

  setMaterials(): void {
    this.neuronMaterial = new BABYLON.StandardMaterial('silent-neuron', this.scene);
    this.neuronMaterial.alpha = 1;

    this.activeNeuronMaterial = new BABYLON.StandardMaterial('active-neuron', this.scene);
    this.activeNeuronMaterial.emissiveColor = new BABYLON.Color3(1, .9, 0);
    this.activeNeuronMaterial.ambientColor = new BABYLON.Color3(0, 0, 1);
    this.activeNeuronMaterial.alpha = 0.3;
  }

  public activate(): void {
    this.mesh.material = this.activeNeuronMaterial;
  }
  public deactivate(): void {
    this.mesh.material = this.neuronMaterial;
  }

  public dispose(): void {
    this.scene.removeMesh(this.mesh);
  }
}
