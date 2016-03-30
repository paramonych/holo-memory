class Cortex implements Disposable {
  private neurons: Neuron[];
  private blastsArray: NeuroBlast[];
  public blasts: Map<NeuroBlast>;

  constructor(
    public scene: BABYLON.Scene,
    public scale: number,
    public lifetime: number,
    public cortexState: CortexConfiguration,
    private spaceCallback: (blastsAmount: number, density ?: number) => void) {
    this.createNeurons();
    this.spaceCallback(null, this.checkSynapcesDensity());
    this.preprocessBlasts();
  }

  private preprocessBlasts(): void {
    let mediumSynapces = this.collectMediumSynapces();
    let progenySynapces = this.collectProgenySynapces();
    this.blasts = newMap<NeuroBlast>();
    this.blastsArray = new Array<NeuroBlast>();

    mediumSynapces.forEach((synapce) => {
      let filteredSynapces = _.filter(mediumSynapces, function(nextSynapce) {
        return synapce.neuron.id !== nextSynapce.neuron.id;
      });
      let newBlast = new NeuroBlast(synapce, this.cortexState.blastRadius, filteredSynapces, this.scene, this.cortexState.blastPower);
      if(newBlast.isExists) {
        this.blastsArray.push(newBlast);
      } else {
        newBlast = null;
      }
    });

    this.spaceCallback(this.blastsArray.length);
  }

  private collectMediumSynapces(): Synapce[] {
    var allSynapces = new Array<Synapce>();

    this.neurons.forEach((neuron) => {
      if(isMedium(neuron.type)) {
        appendAll(allSynapces, neuron.synapces);
      }
    });

    return allSynapces;
  }

  private collectProgenySynapces(): Synapce[] {
    var allSynapces = new Array<Synapce>();

    this.neurons.forEach((neuron) => {
      if(!isMedium(neuron.type)) {
        appendAll(allSynapces, neuron.synapces);
      }
    });

    return allSynapces;
  }

  private checkSynapcesDensity(): number {
    let density = 0;
    let checkBounds = (val: number): boolean => {
      let bound = cortexSate.scale/2;
      return (val < bound) && (val > -bound);
    }

    this.neurons.forEach((neuron) => {
      neuron.synapces.forEach((synapce) => {
        let pos = synapce.mesh.position;
        if(checkBounds(pos.x) && checkBounds(pos.y) && checkBounds(pos.z)) {
          density++;
        }
      });
    });

    return density;
  }

  private createNeurons(): void {
    this.neurons = new Array<Neuron>();

    for(let i=0; i< this.cortexState.dendritsAmount; i++) {
      this.neurons.push(new Neuron(this, NeuronType.Progeny));
    }
  }

  public initSignal(wavePower: number): void {
    this.dropSignal();

    for(let i=0; i< wavePower; i++) {
      let progenyNeurons = _.filter(this.neurons, (neuron) => {
        return !isMedium(neuron.type);
      });
      if(progenyNeurons.length > 0) {
        let index = Math.floor((progenyNeurons.length-1)*random());
        progenyNeurons[index].includeInSignal();
      } else {
        break;
      }
    }

    this.preprocessBlasts();
  }

  public resetSynapces(): void {
    this.neurons.forEach((neuron) => {
      neuron.resetSynapces();
    });
  }

  public dropSpikes(): void {
    this.neurons.forEach((neuron) => {
      neuron.preventSpikes();
    });
  }

  private dropSignal(): void {
    this.disposeBlasts();
    this.neurons.forEach((neuron) => {
      neuron.dropToInitialState();
    });
  }

  public computeBlasts(): void {
    this.preprocessBlasts();
  }

  public chargeTense(time: Time): void {
    _.each(this.neurons, (n) => {
      time.tense.add(() => n.play(), 0);
    });
  }

  public freezeTense(time: Time): void {
    _.each(this.neurons, (n) => {
      n.pause(time.tense.progress()*time.duration);
    });
  }

  public resumeTense(time: Time): void {
    _.each(this.neurons, (n) => {
      n.resume();
    });
  }

  public restartTense(time: Time): void {
    _.each(this.neurons, (n) => {
      n.restartTense();
    });
  }

  public shiftTense(time: Time, progress: number): void {
    _.each(this.neurons, (n) => {
      n.progress(progress);
    });
  }

  public keepSelected(keepSelected: boolean): void {
    _.each(this.neurons, (n) => {
      if(keepSelected && !n.mesh.isHighlighted) {
        n.hide();
      }
      if(!keepSelected && !n.mesh.isHighlighted) {
        n.show();
      }
    });
  }

  public dispose(): void {
    this.disposeBlasts();

    _.each(this.neurons, (neuron) => {
      neuron.dispose();
    });
    this.neurons = null;
  }

  public disposeBlasts(): void {
    this.disposeMediators();

    if(this.blastsArray) {
      for(let i=0; i< this.blastsArray.length; i++) {
        this.blastsArray[i].dispose();
      }
      this.blasts = null;
      this.blastsArray = null;
    }
  }

  private disposeMediators(): void {
    _.each(this.neurons, (neuron) => {neuron.disposeMediators();});
  }
}
