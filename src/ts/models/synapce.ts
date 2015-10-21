class Synapce implements Disposable, Dualistic {
  private mediator: Mediator;
  public state: KnockoutObservable<StateType>;
  public mesh: SynapceMesh;

  constructor(public neuron: Neuron, public position: BABYLON.Vector3) {
    this.toDefaultState();
    let scene = this.neuron.cortex.scene;
    let scale = this.neuron.cortex.scale;
    this.mesh = new SynapceMesh(scene, scale, position);
    this.setMediator();
    this.deactivate();
  }

  private setMediator(): void {
      this.mediator = new Mediator(this);
  }

  public activate(): void {
    this.state(StateType.Active);
  }
  public deactivate(): void {
    this.state(StateType.Silent);
  }

  public toDefaultState(): void {
    this.state = ko.observable(StateType.Silent);
    this.state.subscribe((state) => this.serveState(state));
  }

  public serveState(newState: StateType): void {
    if(isActiveState(newState)) {
      this.mesh.activate();
      this.mediator.activate();
    } else {
      this.mesh.deactivate();
      this.mediator.deactivate();
    }
  }

  public isActive(): boolean {
    return isActiveState(this.state());
  }

  public dispose(): void {
    this.mesh.dispose();
  }
}
