

class Neuron implements Disposable, Dualistic  { // This is the single dendrite of a single neuron in fact
  public id = getUniqueId();
  public code = getRandomSixMap();
  public codeMesh: Code;
  public spike: Spike;
  public state: KnockoutObservable<StateType>;
  public synapces: Synapce[];
  public mesh: NeuronMesh;

  constructor(
    public cortex: Cortex,
    public type: NeuronType
  ) {
    this.mesh = new NeuronMesh(this.synapces, this.type, this.cortex.scene, this.cortex.cortexState);
    this.toDefaultState();
    if(isLowResolution(this.cortex.cortexState.resolution)) {
      this.createSynapces();
    }
  }

  public includeInSignal(): void {
    this.type = NeuronType.Medium;
    this.mesh.resetMaterials(this.type);
    if(isLowResolution(this.cortex.cortexState.resolution) && this.synapces) {
      this.synapces.forEach((synapce) => {
        synapce.reset();
      });
    }
  }

  public dropToInitialState(type: NeuronType): void {
    this.type = type;
    this.mesh.setLegatee(false);
    this.mesh.resetMaterials(this.type);

    if(isLowResolution(this.cortex.cortexState.resolution) && this.synapces) {
      this.synapces.forEach((synapce) => {
        synapce.reset();
      });
    }
    this.preventSpikes();
  }

  public allowSpikes(): void {
    this.createSpike();
    this.startWatchForSpike();
    this.mesh.select();
  }

  public preventSpikes(): void {
    this.disposeSpike();
  }

  public setProgenyCodeMesh(): void {
    let scene = this.cortex.scene;
    let scale = this.cortex.scale;
    let path = this.mesh.curve;
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
    this.synapces = new Array<Synapce>();

    let scale = this.cortex.cortexState.scale;
    let synapcesAmount = this.cortex.cortexState.synapcesAmount;
    let path = this.mesh.curve;

    for(let i=0; i< synapcesAmount; i++) {
      let position = path[i*2+1];
      let synapce = new Synapce(this, position.clone());
      this.synapces.push(synapce);
    }
    this.mesh.setSynapces(this.synapces);
  }

  public resetSynapces(): void {
    this.disposeSynapces();
    this.createSynapces();
  }

  public hide(): void {
    this.mesh.setAlpha(0.07);
    if(this.spike) {
      this.spike.setAlpha(0.07);
    }
  }

  public show(): void {
    this.mesh.setAlpha(1);
    if(this.spike) {
      this.spike.setAlpha(1);
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
    this.disposeSpike();
    this.disposeSynapces();
    this.disposeMesh();
    this.disposeCodeMesh();
    this.state = null;
    this.cortex = null;
    this.type = null;
  }

  private disposeSpike(): void  {
    if(this.spike) {
      this.spike.dispose();
      this.spike = null;
    }
  }

  private disposeCodeMesh(): void {
    if(this.codeMesh && this.codeMesh.dispose) {
      this.codeMesh.dispose();
      this.codeMesh = null;
    }
  }

  private disposeMesh(): void {
    this.mesh.dispose();
    this.mesh = null;
  }

  private disposeSynapces(): void {
    _.each(this.synapces, (synapce) => {
      synapce.dispose();
    });
    this.synapces = null;
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

  public disposeMediators(): void {
    _.each(this.synapces, (synapce) => {synapce.resetMediator();});
  }
}
