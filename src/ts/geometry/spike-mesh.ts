let sunUrl = 'http://site1.2013321.brim.ru/nru/textures/sun.png';

class SpikeMesh implements ActivatableMesh {
  public shoulders: SpikeShoulders;
  public material: BABYLON.StandardMaterial;
  public activeMaterial: BABYLON.StandardMaterial;
  public activeLeftMaterial: BABYLON.StandardMaterial;
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

    this.setPositionInCurve();
    this.setPosition(this.curve[this.numberPosition]);
    this.setSpikeshoulders();
    this.spike.neuron.tense.eventCallback('onComplete', () => {
      console.debug('spike moving complete', this.position.x, this.position.y, this.position.z);
      this.resetPosition();
    });
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

  private resetPosition(): void {
    this.position = void 0;
    this.setPositionInCurve();
    this.position = this.curve[this.numberPosition].clone();
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
    let shoulder = BABYLON.Mesh.CreateSphere('s', 8, this.scale/40, this.scene, false);
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
  	light.diffuse = new BABYLON.Color3(1, 0.8, 0);
  	light.specular = new BABYLON.Color3(0.9, 0.9, 1);
  	light.intensity = 0;
    return light;
  }

  public activate(): void {
    this.styleAsActive(true);
    //this.showMovingSpike();
  }

  public deactivate(): void {
    this.styleAsActive(false);
  }

  private styleAsActive(isActive: boolean): void {
    let left = this.shoulders.left;
    let right = this.shoulders.right;

    if(isActive) {
      this.activeLeftMaterial
      left.mesh.material = this.activeMaterial;
      right.mesh.material = this.activeMaterial;
      left.light.intensity = .25;
      right.light.intensity = .25;
    } else {
      left.mesh.material = this.material;
      right.mesh.material = this.material;
      left.light.intensity = 0;
      right.light.intensity = 0;
    }
  }

/*  private showMovingSpike(): void {
    let quantity = this.curve.length*2;
    let duration = 2;

    let tense = this.spike.neuron.tense;

    let pathLeft = reversedArrayClone(this.curve.slice(0, this.numberPosition));
    let pathRight = arrayClone(this.curve.slice(this.numberPosition, this.curve.length));

    let positionLeft = {x:this.position.x, y:this.position.y, z:this.position.z};
    let positionRight = {x:this.position.x, y:this.position.y, z:this.position.z};

    let tweenLeft = TweenLite.to(positionLeft, quantity, {bezier:pathLeft, ease:Linear.easeNone});
    let tweenRight = TweenLite.to(positionRight, quantity, {bezier:pathRight, ease:Linear.easeNone});

    for (let i = 0; i < quantity; i++) {
        tweenLeft.time(i);
        tense.set(this.shoulders.left.mesh.position, {
            x: positionLeft.x,
            y: positionLeft.y,
            z: positionLeft.z
        }, i * (duration / quantity));

        tweenRight.time(i);
        tense.set(this.shoulders.right.mesh.position, {
            x: positionRight.x,
            y: positionRight.y,
            z: positionRight.z
        }, i * (duration / quantity));

      /*  this.spike.reportMovement(doubleVectorFrom(
          new BABYLON.Vector3(positionLeft.x, positionLeft.y, positionLeft.z),
          new BABYLON.Vector3(positionRight.x, positionRight.y, positionRight.z)
        ));*/
  /*  }

    tense.play();
  }*/

  private setSpikeshoulders(): void {
     let duration = 2;

     let tense = this.spike.neuron.tense;

     let pathLeft = reversedArrayClone(this.curve.slice(0, this.numberPosition));
     let pathRight = arrayClone(this.curve.slice(this.numberPosition, this.curve.length));

     let positionLeft = {x:this.position.x, y:this.position.y, z:this.position.z};
     let positionRight = {x:this.position.x, y:this.position.y, z:this.position.z};

     tense.to(positionLeft, duration,
       {bezier:pathLeft, ease:Linear.easeNone, onUpdate:() => { this.shiftLeftShoulder(positionLeft);}});
     tense.to(positionRight, duration,
       {bezier:pathRight, ease:Linear.easeNone, onUpdate:() => { this.shiftRightShoulder(positionRight);}});
  }

  shiftLeftShoulder(position: {x: number, y: number, z: number}): void {
    console.debug('shiftLeftShoulder',  position.x, position.y, position.z);
  }

  shiftRightShoulder(position: {x: number, y: number, z: number}): void {
    console.debug('shiftRightShoulder', position.x, position.y, position.z);
  }

  setMaterials(): void {
    this.material = new BABYLON.StandardMaterial('i', this.scene);
    this.material.alpha = 0;

    this.activeMaterial = new BABYLON.StandardMaterial('a', this.scene);
    this.activeMaterial.emissiveColor = new BABYLON.Color3(1, 0.8, 0.3);
  }

  public dispose(): void {
    this.scene.removeMesh(this.shoulders.left.mesh);
    this.scene.removeMesh(this.shoulders.right.mesh);
  }
}
