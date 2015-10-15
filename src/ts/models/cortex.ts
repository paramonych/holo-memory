class Cortex implements Disposable {
  private neurons: Neuron[];
  public blasts: NeuroBlast[];
  constructor(private neuronsNum: number, public scene: BABYLON.Scene, public scale: number) {
    this.createNeurons();
  }

  private createNeurons(): void {
      _.each(this.neurons, (n) => n.dispose());
      this.neurons = new Array<Neuron>();
      for(let i=0; i< this.neuronsNum; i++) {
        this.neurons.push( new Neuron(this));
      }
  }

  public draw(): void {
    _.each(this.neurons, (neuron) => neuron.build());
  }

  react(): void {
    _.each(this.neurons, (neuron) => neuron.react());
  }

  public dispose(): void {
    _.each(this.neurons, (neuron) => {neuron.dispose();});
  }
}

interface NeuroBlast {
  position: BABYLON.Vector3,
  signCode: Mediator
}

interface Disposable {
  dispose: () => void
}

interface Dualistic {
  state: KnockoutObservable<StateType>;
  activate: (state: StateType) => void;
  deactivate: (state: StateType) => void;
  serveState: (state: StateType) => void;
}
enum StateType {
  'Active',
  'Silent'
}
