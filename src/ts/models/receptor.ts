class Receptor {
  private mediator: Mediator;
  private state = toDefaultState();
  constructor(private position: BABYLON.Vector3) {}
  public open(): void {
    this.state.locked = ReceptorLock.Opened;
  }
}

interface ReceptorState {
  locked: ReceptorLock;
}

enum ReceptorLock {
  'Closed',
  'Opened'
}

function toDefaultState(): ReceptorState {
  return {
    locked: ReceptorLock.Closed
  };
}
