class Synapce {
  private mediator: Mediator;
  public state: KnockoutObservable<StateType>;
  public mesh: SynapceMesh;

  constructor(public neuron: Neuron, public position: BABYLON.Vector3) {
    this.state = this.toDefaultState();
    let scene = this.neuron.cortex.scene;
    let scale = this.neuron.cortex.scale;
    this.mesh = new SynapceMesh(scene, scale, position);
    this.deactivate();
    this.neuron.watchState((state) => {
      if(state === StateType.Active) {
        this.activate();
      }
    });
  }

  public activate(): void {
    this.state(StateType.Active);
  }
  public deactivate(): void {
    this.state(StateType.Silent);
  }

  toDefaultState(): KnockoutObservable<StateType> {
    return ko.observable(StateType.Silent);
  }

  private serveState(newState: StateType): void {
    if(newState === StateType.Active) {
      this.mesh.activate();
    } else if(newState === StateType.Silent) {
      this.mesh.deactivate();
    }
  }

  public dispose(): void {
    this.mesh.dispose();
  }
}
