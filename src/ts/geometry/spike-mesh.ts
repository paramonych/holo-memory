class SpikeMesh implements ActivatableMesh {
  public shoulders: SpikeShoulders;
  public material: BABYLON.StandardMaterial;
  public activeMaterial: BABYLON.StandardMaterial;
  private numberPosition: number;
  private position: BABYLON.Vector3;
  private curve: Array<BABYLON.Vector3>;

  constructor(
    public scene: BABYLON.Scene,
    public scale: number,
    public spike: Spike
  ) {
    this.curve = new Array<BABYLON.Vector3>();
    _.each(this.spike.neuron.neuron.curve.path, (next) => {
      this.curve.push(next.clone());
    });

    this.setMaterials();
    this.constructShoulders();
    this.resetPosition();

    this.chargeTense();
  }

  private setPositionInCurve(): void {
    this.numberPosition = Math.floor(this.curve.length/2);
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

  private constructShoulders(): void {
    this.shoulders = shouldersFrom(
      this.constructShoulderMesh(true),
      this.constructShoulderMesh(false));
    this.deactivate();
  }

  private constructShoulderMesh(isLeft: boolean): SpikeShoulder {
    let shoulder = BABYLON.Mesh.CreateSphere('s', 8, this.scale/45, this.scene, false);
    let light = this.getLight(isLeft);
    light.parent = shoulder;
    return shoulderFrom(shoulder, light);
  }

  private positionShoulders(): void {
    this.shoulders.left.mesh.position = this.position.clone();
    this.shoulders.right.mesh.position = this.position.clone();
  }

  private getLight(isLeft: boolean): BABYLON.PointLight {
    let light = new BABYLON.PointLight("Omni0", new BABYLON.Vector3(0, 1, 0), this.scene);
  	light.diffuse = new BABYLON.Color3(1, 0.5, 0);
  	light.specular = new BABYLON.Color3(0.9, 0.9, 1);
  	light.intensity = 0;
    return light;
  }

  public activate(): void {
    this.styleAsActive(true);
  }

  public deactivate(): void {
    this.resetPosition();
    this.styleAsActive(false);
  }

  private styleAsActive(isActive: boolean): void {
    let left = this.shoulders.left;
    let right = this.shoulders.right;

    if(isActive) {
      left.mesh.material = this.activeMaterial;
      right.mesh.material = this.activeMaterial;
      left.light.intensity = .35;
      right.light.intensity = .35;
    } else {
      left.mesh.material = this.material;
      right.mesh.material = this.material;
      left.light.intensity = 0;
      right.light.intensity = 0;
    }
  }

  private chargeTense(): void {
     let tense = this.spike.neuron.tense;
     let duration = this.spike.neuron.cortex.lifetime;

     let pathLeft = reversedArrayClone(this.curve.slice(0, this.numberPosition));
     let pathRight = arrayClone(this.curve.slice(this.numberPosition, this.curve.length));

     let positionLeft = {x:this.position.x, y:this.position.y, z:this.position.z};
     let positionRight = {x:this.position.x, y:this.position.y, z:this.position.z};

     tense.eventCallback( 'onStart',() => this.activate());
     tense.eventCallback( 'onUpdate',() => {
       this.checkIntersection();
       this.shiftShoulders(positionLeft, positionRight);
     });
     tense.eventCallback( 'onComplete', () => this.deactivate());

     let leftShoulderTween = TweenMax.to(positionLeft, duration, {bezier:pathLeft, ease:Linear.easeNone});
     let rightShoulderTween = TweenMax.to(positionRight, duration, {bezier:pathRight, ease:Linear.easeNone});

     tense.add(leftShoulderTween, 0).add(rightShoulderTween, 0);
  }

  private checkIntersection(): void {
    let leftShoulder = this.shoulders.left.mesh;
    let rightShoulder = this.shoulders.right.mesh;
    let synapces = this.spike.neuron.synapces;
    let synapcesToPositionsMap = newMap<Synapce>();
    let synapcesPositions = _.map(this.spike.neuron.synapces, (synapce) => {
      let nextSynapcePosition = synapce.position;
      mapAdd(synapcesToPositionsMap, nextSynapcePosition, synapce);
      return nextSynapcePosition;
    });
    let checkedPointsMap = newMap<BABYLON.Vector3>();

    _.each(synapcesPositions, (point) => {
      if(!mapHasKey(checkedPointsMap, point)) {
        mapAdd(checkedPointsMap, point, point);
        if(leftShoulder.intersectsPoint(point) || rightShoulder.intersectsPoint(point)) {
          let synapceToActivate = getByKey(synapcesToPositionsMap, point);
          synapceToActivate.activateUntil(700);
        }
      }
    });
  }

  private shiftShoulders(leftPos: SpikePosition, rightPos: SpikePosition): void {
    this.shoulders.left.mesh.position.x = leftPos.x;
    this.shoulders.left.mesh.position.y = leftPos.y;
    this.shoulders.left.mesh.position.z = leftPos.z;
    this.shoulders.right.mesh.position.x = rightPos.x;
    this.shoulders.right.mesh.position.y = rightPos.y;
    this.shoulders.right.mesh.position.z = rightPos.z;
  }

  setMaterials(): void {
    if(isMedium(this.spike.neuron.type)) {
      this.material = forSpike(this.scene);
    } else {
      this.activeMaterial = forSpikeActive(this.scene);
    }
  }

  public dispose(): void {
    this.scene.removeMesh(this.shoulders.left.mesh);
    this.scene.removeMesh(this.shoulders.right.mesh);
  }
}
