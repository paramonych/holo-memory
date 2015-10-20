let sunUrl = 'http://site1.2013321.brim.ru/nru/textures/sun.png';

class SpikeMesh implements ActivatableMesh {
  public shoulders: SpikeShoulders;
  public material: BABYLON.StandardMaterial;
  public activeMaterial: BABYLON.StandardMaterial;
  public activeLeftMaterial: BABYLON.StandardMaterial;
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

    this.position = this.curve[ Math.floor(this.curve.length/2)].clone();
    this.setMaterials();
    this.constructShoulders();
  }

  private constructShoulders(): void {
    this.shoulders = shouldersFrom(
      this.constructShoulderMesh(true),
      this.constructShoulderMesh(false));
    this.deactivate();
  }

  private constructShoulderMesh(isLeft: boolean): SpikeShoulder {
    let shoulder = BABYLON.Mesh.CreateSphere('s', 8, this.scale/40, this.scene, false);

    // TODO: remove this positioning and add another shoulder to animation circuit
    shoulder.position = this.position.clone();
    let light = this.getLight(isLeft);

    light.parent = shoulder;

    return shoulderFrom(shoulder, light);
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
    this.showMovingSpike();
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
      left.light.intensity = .4;
      right.light.intensity = .4;
    } else {
      left.mesh.material = this.material;
      right.mesh.material = this.material;
      left.light.intensity = 0;
      right.light.intensity = 0;
    }
  }

  private showMovingSpike(): void {
    let timelineLeft = new TimelineLite();
    let timelineRight = new TimelineLite();
    let quantity = 100;
    let duration = 2;

    let length = this.curve.length;
    let pos = Math.floor(this.curve.length/2);
    let pathLeft = reversedArrayClone(this.curve.slice(0,pos));
    let pathRight = arrayClone(this.curve.slice(pos, length));

    let positionLeft = {
        x: pathLeft[0].x,
        y: pathLeft[0].y,
        z: pathLeft[0].z
    };
    let positionRight = {
        x: pathRight[0].x,
        y: pathRight[0].y,
        z: pathRight[0].z
    };

    let tweenLeft = TweenLite.to(positionLeft, quantity, {bezier:pathLeft, ease:Linear.easeNone});
    let tweenRight = TweenLite.to(positionRight, quantity, {bezier:pathRight, ease:Linear.easeNone});

    for (let i = 0; i < quantity; i++) {
        tweenLeft.time(i);
        timelineLeft.set(this.shoulders.left.mesh.position, {
            x: positionLeft.x,
            y: positionLeft.y,
            z: positionLeft.z
        }, i * (duration / quantity));

        tweenRight.time(i);
        timelineRight.set(this.shoulders.right.mesh.position, {
            x: positionRight.x,
            y: positionRight.y,
            z: positionRight.z
        }, i * (duration / quantity));

        this.spike.reportMovement(doubleVectorFrom(
          new BABYLON.Vector3(positionLeft.x, positionLeft.y, positionLeft.z),
          new BABYLON.Vector3(positionRight.x, positionRight.y, positionRight.z)
        ));
    }

    //~ timeline.play();
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

function reversedArrayClone(array: Array<any>): Array<any> {
  let result = new Array<any>();
  for(let s=array.length-1; s>=0; s--) {
    result.push(array[s].clone());
  }
  return result;
}

function arrayClone(array: Array<any>): Array<any> {
  let result = new Array<any>();
  for(let s=0; s<array.length; s++) {
    result.push(array[s].clone());
  }
  return result;
}

interface DoubleVector{
  one: BABYLON.Vector3;
  two: BABYLON.Vector3;
}

function doubleVectorFrom(o: BABYLON.Vector3, t: BABYLON.Vector3): DoubleVector {
  return  {
    one: o,
    two: t
  };
}
