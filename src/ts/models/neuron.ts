

class Neuron implements Disposable, Dualistic  { // This is the single dendrite of the single neuron in fact
  public spike: Spike;
  public state: KnockoutObservable<StateType>;
  private synapces = new Array<Synapce>();
  public neuron: NeuronMesh;
  public tense: TimelineMax;

  constructor(
    public cortex: Cortex
  ) {
    this.tense = new TimelineMax({repeat: 0, paused : true});
    this.neuron = new NeuronMesh(this.cortex.scene, this.cortex.scale);
    this.toDefaultState();
    this.createSpike();
    this.createSynapces();
    this.startWatchForSpike();
  }

  private createSpike(): void {
    this.spike = new Spike(this);
    this.spike.state.subscribe((state) => {
      if(!isActiveState(state)) {
        this.deactivate();
      }
    });
  }

  private createSynapces(): void {
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
          if(!isActiveState(state)) {
            // TODO: update the blasts map
          }
      });
    }
  }

  private startWatchForSpike(): void {
    this.spike.moved.subscribe((frontPosition) => {
      _.chain(this.synapces)
       .filter((s) => !s.isActive())
       .each((s) => {
         if(s.mesh.affect(frontPosition)) {
           s.activate();
         }
       });
    });
  }

  public dispose(): void {
    this.spike.dispose();
    _.each(this.synapces, (synapce) => {synapce.dispose();});
    this.neuron.dispose();
  }

  public react(): void {
    if(isActiveState(this.state())) {
      this.deactivate();
    } else {
      this.activate();
    }
  }

  public build(): void {
    this.neuron.draw();
  }

  public activate(): void {
    this.state(StateType.Active);
  }
  public deactivate(): void {
    this.state(StateType.Silent);
  }

  public serveState(newState: StateType): void {
    if(isActiveState(newState)) {
      this.spike.launch();
      /*_.each(this.synapces, (synapce) => {
        if(randomSign() > 0) {
          synapce.activate();
        }
      });*/
    } else {
      this.spike.deactivate();
      /*_.each(this.synapces, (synapce) => {
        synapce.deactivate();
      });*/
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
