

class Neuron { // This is the single dendrite of the single neuron in fact
  private spike: Spike;
  private state: KnockoutObservable<StateType>;
  private receptorCluster = new Array<Synapce>();
  private neuron: NeuronMesh;

  public activatable = false;

  constructor(
    private scene: BABYLON.Scene, private scale: number
  ) {
    this.neuron = new NeuronMesh(this.scene, this.scale);
    this.toDefaultState();
    this.spike = new Spike(this.scene, this.neuron.position, this.neuron.rotation, this.neuron.length, this.state);
    this.spike.state.subscribe((state) => {
      if(state === StateType.Silent) {
        this.deactivate();
      }
    });
  }

  public dispose(): void {
    this.spike.dispose();
    this.scene.removeMesh(this.neuron.mesh);
  }

  public react(): void {
  //  if(this.activatable) {
      this.reset();
      this.activate();
  //  }
  }

  public build(): void {
    this.neuron.draw();
  }

  private reset(): void {
    this.spike.deactivate();
  }

  public activate(): void {
    this.state(StateType.Active);
  }
  public deactivate(): void {
    this.state(StateType.Silent);
  }

  serveState(newState: StateType): void {
    if(newState === StateType.Active) {
      this.neuron.activate();
    } else if(newState === StateType.Silent) {
      this.neuron.deactivate();
    }
  }

  toDefaultState(): void {
    this.state = ko.observable(StateType.Silent);
    this.state.subscribe((state) => this.serveState(state));
  }
}

enum StateType {
  'Active',
  'Silent'
}
