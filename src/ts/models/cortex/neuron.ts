

class Neuron implements Disposable, Dualistic  { // This is the single dendrite of the single neuron in fact
  public id = getUniqueId();
  public spike: Spike;
  public state: KnockoutObservable<StateType>;
  public synapces = new Array<Synapce>();
  public mesh: NeuronMesh;
  public tense: TimelineMax;

  constructor(
    public cortex: Cortex,
    public type: NeuronType
  ) {
    this.chargeTense();
    this.mesh = new NeuronMesh(this.type, this.cortex.scene, this.cortex.scale);
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

  public restartTense(): void {
    this.tense.restart();
    this.spike.reset();
  }

  private createSynapces(): void {
    let scale = this.cortex.scale;
    let devideFactor = scale/2;
    let path = this.mesh.curve.path;
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

  private chargeTense(): void {
    this.tense = new TimelineMax({repeat: 0, paused : true});
    // TODO: add label for all synapces
    //  this.tense.addCallback(() => this.affectNearestSynapce(), nextSynapceLabel);
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
    this.mesh.dispose();
  }

  public build(): void {
    this.mesh.draw();
  }

  public activate(): void {
    this.state(StateType.Active);
  }
  public deactivate(): void {
    this.state(StateType.Silent);
  }

  public serveState(newState: StateType): void {
    if(isActiveState(newState)) {
      this.spike.activate();
    } else {
      this.spike.deactivate();
    }
  }

  toDefaultState(): void {
    this.state = ko.observable(StateType.Silent);
    this.state.subscribe((state) => this.serveState(state));
  }

  public getMesh(): BABYLON.Mesh {
    return this.mesh.mesh;
  }

  public watchState(action: (state: StateType) => void): void {
    this.state.subscribe(action);
  }
}
