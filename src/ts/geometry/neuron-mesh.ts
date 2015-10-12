class NeuronMesh {
  public mesh: BABYLON.Mesh;
  public position: BABYLON.Vector3;
  public rotation: BABYLON.Vector3;
  public length: number;
  private neuronMaterial: BABYLON.StandardMaterial;
  private activeNeuronMaterial: BABYLON.StandardMaterial;

  constructor(private scene: BABYLON.Scene, public scale: number) {
    this.position = randomVector(scale);
    this.rotation = randomAngleVector();
    this.length = scale*3;
    this.setMaterials();
  }

  draw(): void {
    let scale = this.scale;
    this.mesh = BABYLON.Mesh.CreateCylinder('cylinder', this.length, 2/scale, 2/scale, scale, 1, this.scene, false);
    this.mesh.position = this.position;
    this.mesh.rotation = this.rotation;
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


}
