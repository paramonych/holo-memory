class Cortex implements Disposable {
  private neurons: Neuron[];
  private dormantSignalNeurons: Neuron[];
  private actualSignalNeurons: Neuron[];
  private usedSignalNeuronsIdsMap: Map<Neuron>;

  public waveFrontNeurons: Map<Neuron>;
  public firstLineDeltaAchievableNeuronsMap: Map<Neuron[]>;
  public secondLineDeltaAchievableNeuronsMap: Map<Neuron[]>;
  public secondLineDeltaAchievableNeuronsIdsMap: Map<Map<number>>;
  public distressDeltaAchievableNeuronsIdsMap: Map<number[]>;
  public distressedNeuronsIdsMap: Map<number>;

  public spiritsMap: Map<Spirit>;
  public spiritsIdsMap: Map<number>;

  private blastsArray: NeuroBlast[];
  public blasts: Map<NeuroBlast>;
  private timer: any;
  private firstLaunch = true;

  constructor(
    public scene: BABYLON.Scene,
    public scale: number,
    public lifetime: number,
    public cortexState: CortexConfiguration,
    private spaceCallback: (blastsAmount: number, density ?: number, restoreLaunch?: boolean) => void
  ) {
    this.createNeurons();
    this.createSpirits();
    this.resetNeuronsCodes();

    if(isLowResolution(cortexState.resolution)) {
      this.spaceCallback(null, this.checkSynapcesAmountInBox());
      this.preprocessLowBlasts();
    } else {
      this.fillDeltaAchievableMap();
    }
  }

  private preprocessLowBlasts(): void {
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
  }

  private resetNeuronsCodes(): void {
    _.each(this.neurons, (neuron) => {
      neuron.setCodes(this.cortexState.wordLength, this.cortexState.vocabLength);
    });
  }

  private fillDeltaAchievableMap(): void {
    this.firstLineDeltaAchievableNeuronsMap = newMap<Neuron[]>();
    this.secondLineDeltaAchievableNeuronsMap = newMap<Neuron[]>();
    this.distressDeltaAchievableNeuronsIdsMap = newMap<number[]>();
    this.secondLineDeltaAchievableNeuronsIdsMap = newMap<Map<number>>();

    _.each(this.neurons, (neuronOne) => {
      let firstLineAchievableNeurons = new Array<Neuron>();
      _.each(this.neurons, (neuronTwo) => {
          if(checkUpperDistanceLimitFromPointToPoint(neuronOne.mesh.center, neuronTwo.mesh.center, this.cortexState.transportDistance)) {
            if(neuronOne.isForwardCompatibleByCodes(neuronOne)) {
                firstLineAchievableNeurons.push(neuronTwo);
            }
          }
      });
      mapAdd(this.firstLineDeltaAchievableNeuronsMap, neuronOne.id, firstLineAchievableNeurons);
    });

    _.each(this.neurons, (neuronOne) => {
      let firstLineAchievableNeurons = getByKey(this.firstLineDeltaAchievableNeuronsMap, neuronOne.id);
      let secondLineAchievableNeurons = new Array<Neuron>();
      let secondLineAchievableNeuronsMap = newMap<number>();

      _.each(firstLineAchievableNeurons, (neuronTwo) => {
          if(checkUpperDistanceLimitFromVectorToVector(neuronOne, neuronTwo, this.cortexState.transportDistance /*should use more strict constraint here*/)) {
            secondLineAchievableNeurons.push(neuronTwo);
            mapAdd(secondLineAchievableNeuronsMap, neuronTwo.id, neuronTwo.id);
          }
      });
      mapAdd(this.secondLineDeltaAchievableNeuronsMap, neuronOne.id, secondLineAchievableNeurons);
      mapAdd(this.secondLineDeltaAchievableNeuronsIdsMap, neuronOne.id, secondLineAchievableNeuronsMap);
    });

    _.each(this.neurons, (neuronOne) => {
      let distresNeuronsIds = new Array<number>();
      _.each(this.neurons, (neuronTwo) => {
          if(checkUpperDistanceLimitFromPointToPoint(neuronOne.mesh.center, neuronTwo.mesh.center, this.cortexState.distressDistance)) {
            distresNeuronsIds.push(neuronTwo.id);
          }
      });
      mapAdd(this.distressDeltaAchievableNeuronsIdsMap, neuronOne.id, distresNeuronsIds);
    });
  }

  private resolveSignalInheritanse(): void {

    for(let i=0; i< this.blastsArray.length; i++) {
      let nextBlast = this.blastsArray[i];
      for(let n=0; n< this.neurons.length; n++) {
        let isLegatee = false;
        let nextNeuron = this.neurons[n];
        if(!isMedium(nextNeuron.type)) {
          for(let s=0; s< nextNeuron.synapces.length; s++) {
            isLegatee = nextBlast.checkIntersection(nextNeuron.synapces[s]);
            if(isLegatee) {
              break;
            }
          }
          if(isLegatee) {
            nextNeuron.mesh.setLegatee(true);
            nextNeuron.mesh.select();
            break;
          }
        }
      }
    };
  }

  private resolveNextLayer(): void {
    _.each(this.actualSignalNeurons, (nextSignalNeuron) => {
      let achievableTransportNeurons = getByKey(this.secondLineDeltaAchievableNeuronsMap, nextSignalNeuron.id);
      let achievableDistressNeuronsIds = getByKey(this.distressDeltaAchievableNeuronsIdsMap, nextSignalNeuron.id);

      _.each(achievableTransportNeurons, (nextTransportNeuron) => {
        let backwardAchievableSignalNeuronsIdsMap = getByKey(this.secondLineDeltaAchievableNeuronsIdsMap, nextTransportNeuron.id);
        let backwardAchievableSignalNeuronsAmount = 0;
        _.each(this.actualSignalNeurons, (signalNeuron) => {
          if(mapHasKeyFast(backwardAchievableSignalNeuronsIdsMap, signalNeuron.stringId)) {
            backwardAchievableSignalNeuronsAmount += 1;
          }
        });

        if(!mapHasKeyFast(this.usedSignalNeuronsIdsMap, nextTransportNeuron.stringId)
           && !mapHasKeyFast(this.waveFrontNeurons, nextTransportNeuron.stringId)
           && !mapHasKeyFast(this.distressedNeuronsIdsMap, nextTransportNeuron.stringId)
           && !nextTransportNeuron.isDroppedOff
           && (backwardAchievableSignalNeuronsAmount >= this.cortexState.patternLimit)
        ) {
          nextTransportNeuron.mesh.setLegatee(true);
          nextTransportNeuron.mesh.select();
          mapAddFast(this.waveFrontNeurons, nextTransportNeuron.stringId, nextTransportNeuron);
        }
      });

      _.each(achievableDistressNeuronsIds, (nextDistressedNeuronId) => {
        mapAdd(this.distressedNeuronsIdsMap, nextDistressedNeuronId, nextDistressedNeuronId);
      });
    });
  }

  public processWaveFromStart(): void {
      this.distressedNeuronsIdsMap = newMap<number>();

      if(this.timer) {
        clearInterval(this.timer);
      }

      this.resolveNextLayer();

      this.timer = setInterval(() => {
        this.processNextLayer();
      }, 1000);
  }

  public resumeNextLayer(): void {
      if(this.timer) {
        clearInterval(this.timer);
      }

      this.timer = setInterval(() => {
        this.processNextLayer();
      }, 1000);
  }

  public processNextLayer(): void {
    if(mapSize(this.waveFrontNeurons) > 0) {
      this.prepareNextLayer();
      this.resolveNextLayer();
    } else {
      clearInterval(this.timer);
      this.spaceCallback(1, null, true);
    }
  }

  public freezeLayer(): void {
    clearInterval(this.timer);
  }

  private prepareNextLayer() {
    _.each(this.actualSignalNeurons, (n) => {
      resetMaterial(n.mesh.mesh.material, mediumMaterial, 0.1);
    })

    this.actualSignalNeurons = new Array<Neuron>();

    _.each(toValues(this.waveFrontNeurons), (nextFrontNeuron) => {
      nextFrontNeuron.includeInSignal();
      mapAdd(this.usedSignalNeuronsIdsMap, nextFrontNeuron.id, nextFrontNeuron);
      this.actualSignalNeurons.push(nextFrontNeuron);
    });

    this.waveFrontNeurons = newMap<Neuron>();
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

  private checkSynapcesAmountInBox(): number {
    let amount = 0;
    let checkBounds = (val: number): boolean => {
      let bound = cortexState.scale/1.25;
      return (val < bound) && (val > -bound);
    }

    this.neurons.forEach((neuron) => {
      neuron.synapces.forEach((synapce) => {
        let pos = synapce.mesh.position;
        if(checkBounds(pos.x) && checkBounds(pos.y) && checkBounds(pos.z)) {
          amount++;
        }
      });
    });

    return amount;
  }

  private createNeurons(): void {
    this.neurons = new Array<Neuron>();

    for(let i=0; i< this.cortexState.dendritsAmount; i++) {
      this.neurons.push(new Neuron(this, NeuronType.Progeny));
    }

    let halfScale = this.cortexState.scale/2;
    let waveStartingPoint = new BABYLON.Vector3(halfScale,halfScale,halfScale);
    this.revealDormantSignalNeurons(waveStartingPoint);
  }

  private createSpirits(): void {
    this.spiritsMap = newMap<Spirit>();
    let halfScale = this.cortexState.scale/2 - SPIRIT_SIZE/2;
    let spiritsInlineLimit = Math.floor(this.cortexState.scale/SPIRIT_SIZE);
    let spiritsAmount = Math.pow(spiritsInlineLimit, 3);
    let x;
    let y;
    let z;
    let xSteps = 0;
    let ySteps = 0;
    let zSteps = 0;

    for(let i=0; i< spiritsAmount; i++) {
      if(xSteps >= spiritsInlineLimit) {
        ySteps += 1;
        xSteps = 0;
      }

      if(ySteps >= spiritsInlineLimit) {
        zSteps += 1;
        xSteps = 0;
        ySteps = 0;
      }

      x = xSteps*SPIRIT_SIZE - halfScale;
      y = ySteps*SPIRIT_SIZE - halfScale;
      z = zSteps*SPIRIT_SIZE - halfScale;

      xSteps += 1;

      let position = new BABYLON.Vector3(x, y, z);
      let spirit = new Spirit(position, this.scene, this.cortexState);

      mapAdd(this.spiritsMap, spirit.id, spirit);
    }
  }

  private revealDormantSignalNeurons(basePosition: BABYLON.Vector3): void {
    this.dormantSignalNeurons = new Array<Neuron>();

    _.each(this.neurons, (n) => {
      if(checkLowerDistanceLimitFromPointToPoint(n.mesh.center, basePosition, this.cortexState.distressDistance)) {
        if(checkUpperDistanceLimitFromPointToPoint(n.mesh.center, basePosition, this.cortexState.transportDistance)) {
          this.dormantSignalNeurons.push(n);
        }
      }
    });
  }

  public initSignal(
    wavePower: number, distressDistance: number,
    transportDistance: number, patternLimit: number,
    wordLength: number, vocabLength: number
  ): void {
    this.dropSignal();

    this.cortexState.patternLimit = patternLimit;
    this.cortexState.wordLength = wordLength;
    this.cortexState.vocabLength = vocabLength;

    this.resetNeuronsCodes();

    this.actualSignalNeurons = new Array<Neuron>();
    this.waveFrontNeurons = newMap<Neuron>();
    this.usedSignalNeuronsIdsMap = newMap<Neuron>();

    if(this.timer) {
      clearInterval(this.timer);
    }

    _.each(this.neurons, (n) => {
      if(n.isDroppedOff) {
        n.isDroppedOff = false;
      }
    });

    for(let i=0; i< wavePower; i++) {
      if(this.dormantSignalNeurons && this.dormantSignalNeurons.length > 0) {
        let index = Math.floor((this.dormantSignalNeurons.length-1)*random());
        let nextSignalNeuron = this.dormantSignalNeurons[index]; // random neuron from dormant (localized in the specific initial area)

        nextSignalNeuron.includeInSignal();
        mapAdd(this.usedSignalNeuronsIdsMap, nextSignalNeuron.id, nextSignalNeuron);

        this.actualSignalNeurons.push(nextSignalNeuron);
      } else {
        break;
      }
    }

    if(isLowResolution(cortexState.resolution)) {
      this.preprocessLowBlasts();
      this.resolveSignalInheritanse();
      this.spaceCallback(this.blastsArray.length);
    } else {
      this.cortexState.distressDistance = distressDistance;
      this.cortexState.transportDistance = transportDistance;
      this.fillDeltaAchievableMap();
      this.spaceCallback(1);
    }
  }

  public resetSynapces(): void {
    this.neurons.forEach((neuron) => {
      neuron.resetSynapces();
    });
  }

  public dropSpikes(): void {
    this.neurons.forEach((neuron) => {
      neuron.dropToInitialState(neuron.type);
    });
  }

  private dropSignal(): void {
    this.disposeBlasts();
    this.neurons.forEach((neuron) => {
      neuron.dropToInitialState(NeuronType.Progeny);
    });
  }

  public computeBlasts(): void {
    if(isLowResolution(cortexState.resolution)) {
      this.preprocessLowBlasts();
      this.resolveSignalInheritanse();
      this.spaceCallback(this.blastsArray.length);
    } else {
      this.fillDeltaAchievableMap();
    }
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
    this.scene = null;
    this.cortexState = null;
    this.spaceCallback = null;
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
