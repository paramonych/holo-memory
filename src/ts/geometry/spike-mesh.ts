class SpikeMesh implements ActivatableMesh {
  public mesh: BABYLON.Mesh;
  //light: BABYLON.PointLight;
  private numberPosition: number;
  private position: BABYLON.Vector3;
  private curve: Array<BABYLON.Vector3>;

  constructor(
    public scene: BABYLON.Scene,
    public scale: number,
    public spike: Spike,
    public direction: SpikeDirection
  ) {
    this.curve = new Array<BABYLON.Vector3>();
    _.each(this.spike.neuron.mesh.curve.path, (next) => {
      this.curve.push(next.clone());
    });

    this.constructMesh();
    this.chargeTense();
  }

  private setPositionInCurve(): void {
    this.numberPosition = isDirect(this.direction) ? 0 : (this.curve.length-1);//Math.floor(this.curve.length/2);
    if(this.position !== void 0 ) {
      _.each(this.curve, (next, index) => {
        if(compareVectors(next, this.position)) {
          this.numberPosition = index;
        }
      });
    }
  }

  public reset(): void {
    this.resetPosition();
  }

  private resetPosition(): void {
    this.position = void 0;
    this.setPositionInCurve();
    this.position = this.curve[this.numberPosition].clone();
    this.setPosition(this.position);
  }

  public setPosition(position: BABYLON.Vector3): void {
    this.position = position.clone();
    this.setPositionInCurve();
    this.positionShoulders();
  }

  private constructMesh(): void {
    this.mesh = BABYLON.Mesh.CreateSphere('s', 8, this.scale/45, this.scene, false);
    this.mesh.material = defaultMaterial(this.scene);
    this.deactivate();
  }

  private positionShoulders(): void {
    this.mesh.position = this.position.clone();
  }

  public activate(): void {
    resetMaterial(this.mesh.material, activeMaterial);
    setAlpha(this.mesh.material, 1);
  }

  public deactivate(): void {
    this.resetPosition();
    setAlpha(this.mesh.material, 0);
  }

  setMaterial(): void {
    resetMaterial(this.mesh.material, mediumMaterial);
  }

  private chargeTense(): void {
     let tense = this.spike.tense;
     let duration = this.spike.neuron.cortex.lifetime;

     let path = isDirect(this.direction)
      ? arrayClone(this.curve.slice(this.numberPosition, this.curve.length))
      : reversedArrayClone(this.curve.slice(0, this.numberPosition));

     let position = {x: this.position.x, y: this.position.y, z: this.position.z};

     tense.eventCallback( 'onStart',() => this.activate());
     tense.eventCallback( 'onUpdate',() => {
       this.checkIntersection();
       this.moveSpikeTo(position);
     });
     tense.eventCallback( 'onComplete', () => this.deactivate());

     tense.add(
       TweenMax.to(
         position,
         duration,
         {
           bezier: path,
           ease: Linear.easeNone
         }
       ),
       0
     );
  }

  private checkIntersection(): void {
    let synapces = this.spike.neuron.synapces;
    let synapcesToPositionsMap = newMap<Synapce>();
    let synapcesPositions = _.map(this.spike.neuron.synapces, (synapce) => {
      let nextSynapcePosition = synapce.mesh.basePosition;
      mapAdd(synapcesToPositionsMap, nextSynapcePosition, synapce);
      return nextSynapcePosition;
    });
    let checkedPointsMap = newMap<BABYLON.Vector3>();

    _.each(synapcesPositions, (point) => {
      if(!mapHasKey(checkedPointsMap, point)) {
        mapAdd(checkedPointsMap, point, point);
        if(this.mesh.intersectsPoint(point)) {
          let synapceToActivate = getByKey(synapcesToPositionsMap, point);
          synapceToActivate.activateUntil(700);
        }
      }
    });
  }

  private moveSpikeTo(position: SpikePosition): void {
  //private shiftShoulders(leftPos: SpikePosition, rightPos: SpikePosition): void {
    this.mesh.position.x = position.x;
    this.mesh.position.y = position.y;
    this.mesh.position.z = position.z;
  }

  public dispose(): void {
    //this.scene.removeMesh(this.mesh);
    this.deactivate();
    this.mesh.dispose();
    this.mesh = null;
    this.curve = null;
  }
}
