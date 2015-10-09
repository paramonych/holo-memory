class Spike {
  private speed: number = 1; // micrometers/milliseconds
  public state: KnockoutObservable<StateType>;
  private time = ko.observable<number>(0); // milliseconds
  private lifeTime: number = 2000; // milliseconds
  private timerId: number = 0;
  private grain: number = 5; //milliseconds
  public shoulders: SpikeShoulders;
  private spikeMaterial: BABYLON.StandardMaterial;
  private movingSpikeMaterial: BABYLON.StandardMaterial;
  private shift = new BABYLON.Vector3(0.01, 0.01, 0.01);
  //private animation: BABYLON.Animation;

  constructor(
    public scene: BABYLON.Scene,
    public position: BABYLON.Vector3,
    private rotation: BABYLON.Vector3,
    private neuronLength: number,
    neuronState: KnockoutObservable<StateType>
  ) {
    //this.setAnimation();
    this.toDefaultState();
    this.setMaterials();
    this.constructShoulders();
    this.deactivate();
    this.time.subscribe((time) => this.moveShoulders(time));
    neuronState.subscribe((state) => {
      if(state === StateType.Active) {
        this.launch();
      }
    });
  }

  private constructShoulders(): void {
    this.shoulders = shouldersFrom(this.constructShoulderMesh(), this.constructShoulderMesh());
    this.deactivate();
  }

  public activate(): void {
    this.state(StateType.Active);
  }
  public deactivate(): void {
    this.state(StateType.Silent);
    this.reset();
  }

  public dispose(): void {
    this.scene.removeMesh(this.shoulders.left);
    this.scene.removeMesh(this.shoulders.right);
  }

  private constructShoulderMesh(): BABYLON.Mesh {
    let scale = this.neuronLength/3;
    let shoulder = BABYLON.Mesh.CreateCylinder('cylinder', scale/50, 2/scale, 2/scale, scale, 1, this.scene, false);
    shoulder.position = this.position;
    shoulder.rotation = this.rotation;
    return shoulder;
  }
  /*private setAnimation(): void {
    let type = BABYLON.Animation.ANIMATIONTYPE_VECTOR3;
    let loop = BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT;
    this.animation = new BABYLON.Animation('myAnimation', 'position', 30, type, loop);
  }*/

  private moveShoulders(time: number): void {
    let left = this.shoulders.left.position;
    let right = this.shoulders.right.position;
    let newLeft = left.add(this.shift);
    let newRight = newLeft.negate();
    this.shoulders.left.position = newLeft;
    this.shoulders.right.position = newRight;
  }

  private reset(): void {
    this.shoulders.left.position = this.position;
    this.shoulders.right.position = this.position;
    this.time(0);
  }

  public launch(): void {
    this.activate();
    this.timerId = window.setInterval(() => this.tick(), this.grain);
  }

  private tick(): void {
    let currentTime = this.time() + this.grain;

    if(currentTime >= this.lifeTime) {
      window.clearInterval(this.timerId);
      this.deactivate();
    } else {
      this.time(currentTime);
    }
  }

  serveState(newState: StateType): void {
    if(newState === StateType.Active) {
      this.shoulders.left.material = this.movingSpikeMaterial;
      this.shoulders.right.material = this.movingSpikeMaterial;
    } else if(newState === StateType.Silent) {
      this.shoulders.left.material = this.spikeMaterial;
      this.shoulders.right.material = this.spikeMaterial;
    }
  }

  setMaterials(): void {
    this.spikeMaterial = new BABYLON.StandardMaterial('silent-spike', this.scene);
    this.spikeMaterial.alpha = 0;

    this.movingSpikeMaterial = new BABYLON.StandardMaterial('moving-spike', this.scene);
    this.movingSpikeMaterial.emissiveColor = new BABYLON.Color3(1, .2, 0);
    this.movingSpikeMaterial.ambientColor = new BABYLON.Color3(0, 0, 1);
    this.movingSpikeMaterial.alpha = 0.9;
  }

  toDefaultState(): void {
    this.state = ko.observable(StateType.Silent);
    this.state.subscribe((state) => this.serveState(state));
  }
}

interface SpikeShoulders {
  left: BABYLON.Mesh,
  right: BABYLON.Mesh
}

function shouldersFrom(left: BABYLON.Mesh, right: BABYLON.Mesh): SpikeShoulders {
  return {
    left: left,
    right: right
  };
}
