class Receptor {
  private mediator: Mediator;
  private state: KnockoutObservable<ReceptorState>;

  constructor(private position: BABYLON.Vector3) {
    this.state = this.toDefaultState();
  }

  activate() {
    this.state(ReceptorState.Opened);
    // TODO: set positioned spike and launch it
  }

  toDefaultState(): KnockoutObservable<ReceptorState> {
    return ko.observable(ReceptorState.Closed);
  }
}

enum ReceptorState {
  'Closed',
  'Opened'
}
