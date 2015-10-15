

class Neuron implements Disposable, Dualistic  { // This is the single dendrite of the single neuron in fact
  private spike: Spike;
  public state: KnockoutObservable<StateType>;
  private synapces = new Array<Synapce>();
  private neuron: NeuronMesh;

  constructor(
    public cortex: Cortex
  ) {
    this.neuron = new NeuronMesh(this.cortex.scene, this.cortex.scale);
    this.toDefaultState();
    this.setSynapces();
    this.setSpike(this.synapces[Math.floor(this.synapces.length/2)]);
  }

  private setSpike(synapce: Synapce): void {
    this.spike = new Spike(this, synapce);
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
    // TODO: more reset actions
    this.spike.deactivate();
  }

  public activate(): void {
    this.state(StateType.Active);
  }
  public deactivate(): void {
    this.state(StateType.Silent);
  }

  public serveState(newState: StateType): void {
    if(newState === StateType.Active) {
      this.neuron.activate();
      //this.spike.launch();
      _.each(this.synapces, (synapce) => {
        if(randomSign() > 0) {
          synapce.activate();
        }
      });
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
