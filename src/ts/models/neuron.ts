

class Neuron { // This is the single dendrite of the single neuron in fact
  private spike: Spike;
  private state: KnockoutObservable<StateType>;
  private receptorCluster = new Array<Receptor>();
  private mesh: BABYLON.Mesh;
  private position: BABYLON.Vector3;
  private rotation: BABYLON.Vector3;
  private length: number;
  private neuronMaterial: BABYLON.StandardMaterial;
  private activeNeuronMaterial: BABYLON.StandardMaterial;
  public activatable = false;

  constructor(
    private scene: BABYLON.Scene, private scale: number
  ) {
    this.position = randomVector(scale);
    this.rotation = randomAngleVector();
    this.length = scale*3;
    this.setMaterials();
    this.toDefaultState();
    this.spike = new Spike(this.scene, this.position, this.rotation, this.length, this.state);
    this.spike.state.subscribe((state) => {
      if(state === StateType.Silent) {
        this.deactivate();
      }
    });
  }
  public dispose(): void {
    this.spike.dispose();
    this.scene.removeMesh(this.mesh);
  }
  draw(): void {
    let scale = this.scale;
    this.mesh = BABYLON.Mesh.CreateCylinder('cylinder', this.length, 2/scale, 2/scale, scale, 1, this.scene, false);
    this.mesh.position = this.position;
    this.mesh.rotation = this.rotation;

    if(Math.random() > 0.5) {
      this.activatable = true;
    }
  }

  public react(): void {
    if(this.activatable) {
      this.activate();
    }
  }

  public activate(): void {
    this.state(StateType.Active);
  }
  public deactivate(): void {
    this.state(StateType.Silent);
  }

  serveState(newState: StateType): void {
    if(newState === StateType.Active) {
      this.mesh.material = this.activeNeuronMaterial;
    } else if(newState === StateType.Silent) {
      this.mesh.material = this.neuronMaterial;
    }
  }

  toDefaultState(): void {
    this.state = ko.observable(StateType.Silent);
    this.state.subscribe((state) => this.serveState(state));
  }

  setMaterials(): void {
    this.neuronMaterial = new BABYLON.StandardMaterial('silent-neuron', this.scene);
    this.neuronMaterial.alpha = 1;

    this.activeNeuronMaterial = new BABYLON.StandardMaterial('active-neuron', this.scene);
    this.activeNeuronMaterial.emissiveColor = new BABYLON.Color3(1, .9, 0);
    this.activeNeuronMaterial.ambientColor = new BABYLON.Color3(0, 0, 1);
    this.activeNeuronMaterial.alpha = 0.3;
  }
}

enum StateType {
  'Active',
  'Silent'
}
