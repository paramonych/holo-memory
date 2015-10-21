class Spike implements Disposable, Dualistic {
  private speed: number = 1; // micrometers/milliseconds
  public state: KnockoutObservable<StateType>;
  public tense: TimelineMax;
  public mesh: SpikeMesh;
  public moved: KnockoutObservable<DoubleVector>;

  constructor(
    public neuron: Neuron
  ) {
    let neuronMesh = this.neuron.getMesh();
    let scene = this.neuron.cortex.scene;
    let scale = this.neuron.cortex.scale;
    this.tense = new TimelineMax();
    this.mesh = new SpikeMesh(scene, scale, this);
    this.toDefaultState();
    this.deactivate();
    this.moved = ko.observable(doubleVectorFrom(new BABYLON.Vector3(0,0,0),new BABYLON.Vector3(0,0,0)));
  }

  public activate(): void {
    this.state(StateType.Active);
  }
  public deactivate(): void {
    this.state(StateType.Silent);
  }

  public reportMovement(vectors: DoubleVector): void {
    this.moved(vectors);
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
