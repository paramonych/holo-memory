class Synapce implements Disposable, Dualistic {
  public id = getUniqueId();
  private mediator: Mediator;
  public state: KnockoutObservable<StateType>;
  public mesh: SynapceMesh;

  constructor(public neuron: Neuron, public position: BABYLON.Vector3) {
    this.toDefaultState();
    let scene = this.neuron.cortex.scene;
    let scale = this.neuron.cortex.scale;
    this.mesh = new SynapceMesh(scene, scale, position, neuron.type);
    this.setMediator();
    this.deactivate();
  }

  public getId(): String {
    return this.id.toString();
  }

  private setMediator(): void {
    this.mediator = new Mediator(this);
  }

  public activate(): void {
    this.state(StateType.Active);
  }
  public activateUntil(timeInMillis: number): void {
    this.state(StateType.Active);
    setTimeout(() => this.deactivate(), timeInMillis);
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
