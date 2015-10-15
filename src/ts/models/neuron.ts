

class Neuron { // This is the single dendrite of the single neuron in fact
  private spike: Spike;
  private state: KnockoutObservable<StateType>;
  private synapces = new Array<Synapce>();
  private neuron: NeuronMesh;

  public activatable = false;

  constructor(
    public cortex: Cortex
  ) {
    this.neuron = new NeuronMesh(this.cortex.scene, this.cortex.scale);
    this.toDefaultState();
    this.setSpike();
    this.setSynapces();
  }

  private setSpike(): void {
    this.spike = new Spike(this);
    this.spike.state.subscribe((state) => {
      if(state === StateType.Silent) {
        this.deactivate();
      }
    });
  }

  private setSynapces(): void {
    let scale = this.cortex.scale;
    let devideFactor = scale/2;
    let path = this.neuron.curve.path;
    let step = Math.floor(path.length/devideFactor);
    let halfStep = Math.floor(step/2);
    for(let i=0; i< devideFactor; i++) {
      let position = path[i*step+halfStep];
      let synapce = new Synapce(this, position.clone());
      this.synapces.push(synapce);
      synapce.state.subscribe((state) => {
          if(state === StateType.Silent) {
            // TODO: update the blasts map
          }
      });
    }
  }

  public dispose(): void {
    this.spike.dispose();
    _.each(this.synapces, (synapce) => {synapce.dispose();});
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
