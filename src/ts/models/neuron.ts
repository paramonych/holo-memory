

class Neuron { // This is the single dendrite of the single neuron in fact
  private spike: Spike;
  private state: KnockoutObservable<StateType>;
  private receptorCluster = new Array<Synapce>();
  private neuron: NeuronMesh;

  public activatable = false;

  constructor(
    public scene: BABYLON.Scene, public scale: number
  ) {
    this.neuron = new NeuronMesh(this.scene, this.scale);
    this.toDefaultState();
    this.spike = new Spike(this);
    this.spike.state.subscribe((state) => {
      if(state === StateType.Silent) {
        this.deactivate();
      }
    });
  }

  public dispose(): void {
    this.spike.dispose();
    this.neuron.dispose();
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

  public getMesh(): BABYLON.Mesh {
    return this.neuron.mesh;
  }

  public watchState(action: (state: StateType) => void): void {
    this.state.subscribe(action);
  }
}

enum StateType {
  'Active',
  'Silent'
}
