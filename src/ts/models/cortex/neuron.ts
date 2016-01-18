

class Neuron implements Disposable, Dualistic  { // This is the single dendrite of a single neuron in fact
  public id = getUniqueId();
  public code = getRandomSixMap();
  public spike: Spike;
  public state: KnockoutObservable<StateType>;
  public synapces = new Array<Synapce>();
  public mesh: NeuronMesh;

  constructor(
    public cortex: Cortex,
    public type: NeuronType
  ) {
    this.mesh = new NeuronMesh(this.type, this.cortex.scene, this.cortex.scale);
    this.toDefaultState();
    this.createSynapces();
    if(isMedium(this.type)) {
      this.createSpike();
      this.startWatchForSpike();
    }
  }

  public getId(): String {
    return this.id.toString();
  }

////////////////////////////////// temporary workaround
// beacuse we need to serve multiple spikes
// so the spikes should be created and wired on fly
// and removed when it reaches the end of dendrit
// each spike should own it's own timeline
 public play(): void {
   if(isMedium(this.type)) {
     this.spike.tense.play();
   }
 }
 public pause(time: number): void {
   if(isMedium(this.type)) {
     this.spike.tense.pause(time);
   }
 }
 public resume(): void {
   if(isMedium(this.type)) {
     this.spike.tense.resume();
   }
 }
 public progress(value: number): void {
   if(isMedium(this.type)) {
     this.spike.tense.progress(value);
   }
 }
//////////////////////////////////

  private createSpike(): void {
    this.spike = new Spike(this);
    this.spike.state.subscribe((state) => {
      if(!isActiveState(state)) {
        this.deactivate();
      }
    });
  }

  public restartTense(): void {
    if(isMedium(this.type)) {
      this.spike.reset();
    }
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
