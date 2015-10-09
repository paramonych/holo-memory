class Synapce {
  private mediator: Mediator;
  private state: KnockoutObservable<SynapceState>;

  constructor(private position: BABYLON.Vector3) {
    this.state = this.toDefaultState();
  }

  activate() {
    this.state(SynapceState.Opened);
    // TODO: set positioned spike and launch it
  }

  toDefaultState(): KnockoutObservable<SynapceState> {
    return ko.observable(SynapceState.Closed);
  }
}

enum SynapceState {
  'Closed',
  'Opened'
}
