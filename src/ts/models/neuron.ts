

class Neuron { // This is the single dendrite of the single neuron in fact
  private spike: Spike;
  private state = toDefaultState();
  private receptorCluster = new Array<Receptor>();
  constructor(
    start: BABYLON.Vector3,
    end: BABYLON.Vector3
  ) {
    this.spike = new Spike(start, start, end);
  }
  activate() {
    activate(this.state);
    // TODO: set positioned spike and launch it
  }
}

export interface NeuronState {
  type: StateType;
}

enum StateType {
  'Locked',
  'Active',
  'Silent'
}

function toDefaultState(): NeuronState {
  return {
    type: StateType.Silent
  };
}

function activate(state: NeuronState): void {
  state.type = StateType.Active;
}
