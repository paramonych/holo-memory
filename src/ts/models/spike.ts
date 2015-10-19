class Spike implements Disposable, Dualistic {
  private speed: number = 1; // micrometers/milliseconds
  public state: KnockoutObservable<StateType>;
  private lifeTime: number = 2000; // milliseconds
  public mesh: SpikeMesh;

  constructor(
    private neuron: Neuron,
    private synapce: Synapce
  ) {
    let neuronMesh = this.neuron.getMesh();
    let scene = this.neuron.cortex.scene;
    let scale = this.neuron.cortex.scale;
    this.mesh = new SpikeMesh(scene, scale, synapce, neuron);
    this.toDefaultState();
    this.deactivate();
  }

  public activate(): void {
    this.state(StateType.Active);
  }
  public deactivate(): void {
    this.state(StateType.Silent);
  }

  public dispose(): void {
    this.mesh.dispose();
  }

  public launch(): void {
    this.activate();
    setTimeout(() => this.deactivate(), 3000);
    this.mesh.activate();
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
  left: SpikeShoulder,
  right: SpikeShoulder
}

interface SpikeShoulder {
  mesh: BABYLON.Mesh,
  light: BABYLON.PointLight
}

function shouldersFrom(
  left: SpikeShoulder,
  right: SpikeShoulder
): SpikeShoulders {
  return {
    left: left,
    right: right
  };
}

function shoulderFrom(
  mesh: BABYLON.Mesh,
  light: BABYLON.PointLight
): SpikeShoulder {
  return {
    mesh: mesh,
    light: light
  };
}
