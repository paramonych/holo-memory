class Spike {
  private speed: number = 1; // micrometers/milliseconds
  public state: KnockoutObservable<StateType>;
  private time = ko.observable<number>(0); // milliseconds
  private lifeTime: number = 2000; // milliseconds
  private timerId: number = 0;
  private grain: number = 5; //milliseconds
  public mesh: SpikeMesh;

  constructor(
    private neuron: Neuron,
    private synapce: Synapce
  ) {
    let neuronMesh = this.neuron.getMesh();
    let scene = this.neuron.cortex.scene;
    let scale = this.neuron.cortex.scale;
    this.mesh = new SpikeMesh(scene, scale, synapce.position);
    this.toDefaultState();
    this.deactivate();
    this.time.subscribe((time) => this.move(time));
  }

  public move(time: number): void {
    this.mesh.move();
  }

  public activate(): void {
    this.state(StateType.Active);
  }
  public deactivate(): void {
    this.state(StateType.Silent);
    this.reset();
  }

  public dispose(): void {
    this.mesh.dispose();
  }

  private reset(): void {
    this.clearTimer();
    this.mesh.reset();
    this.time(0);
  }

  public launch(): void {
    this.activate();
    this.timerId = window.setInterval(() => this.tick(), this.grain);
  }

  private tick(): void {
    let nextTime = this.time() + this.grain;
    this.time(this.checkTick(nextTime));
  }

  private checkTick(nextTime: number): number {
    if(nextTime >= this.lifeTime) {
      this.clearTimer();
      this.deactivate();
      return 0;
    } else {
      return nextTime;
    }
  }

  private clearTimer(): void {
    window.clearInterval(this.timerId);
  }

  serveState(newState: StateType): void {
    if(newState === StateType.Active) {
      this.mesh.activate();
    } else if(newState === StateType.Silent) {
      this.mesh.deactivate();
    }
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
