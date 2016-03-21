

class Neuron implements Disposable, Dualistic  { // This is the single dendrite of a single neuron in fact
  public id = getUniqueId();
  public code = getRandomSixMap();
  public codeMesh: Code;
  public spike: Spike;
  public state: KnockoutObservable<StateType>;
  public synapces = new Array<Synapce>();
  public mesh: NeuronMesh;

  public step: number = 0;

  constructor(
    public cortex: Cortex,
    public type: NeuronType
  ) {
    this.mesh = new NeuronMesh(this, this.cortex.scene, this.cortex.cortexState);
    this.toDefaultState();
    this.createSynapces();
  }

  public allowSpikes(): void {
    if(isMedium(this.type)) {
      this.createSpike();
      this.startWatchForSpike();
    }
  }

  public setProgenyCodeMesh(): void {
    let scene = this.cortex.scene;
    let scale = this.cortex.scale;
    let path = this.mesh.curve.path;
    let code =  toValues(this.code).join('');
    this.codeMesh = new Code(scene, scale, path[Math.floor(path.length/2)], code, true);
  }

  public hasCodeMesh(): boolean {
    return (this.codeMesh !== void 0);
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
   if(isMedium(this.type) && this.spike) {
     this.spike.tense.play();
   }
 }
 public pause(time: number): void {
   if(isMedium(this.type) && this.spike) {
     this.spike.tense.pause(time);
   }
 }
 public resume(): void {
   if(isMedium(this.type) && this.spike) {
     this.spike.tense.resume();
   }
 }
 public progress(value: number): void {
   if(isMedium(this.type) && this.spike) {
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
    if(isMedium(this.type) && this.spike) {
      this.spike.reset();
    }
  }

  private createSynapces(): void {
    let scale = this.cortex.cortexState.scale;
    let synapcesAmount = this.cortex.cortexState.synapcesAmount;
    let path = this.mesh.curve.path;

    for(let i=0; i< synapcesAmount; i++) {
      let position = path[i*2+1];
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
    if(isMedium(this.type) && this.spike) {
      this.spike.dispose();
      this.spike = null;
    }
    _.each(this.synapces, (synapce) => {synapce.dispose();});
    this.mesh.dispose();
    this.mesh = null;
    this.synapces = null;
    if(this.codeMesh && this.codeMesh.dispose) {
      this.codeMesh.dispose();
      this.codeMesh = null;
    }
    this.state = null;
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
