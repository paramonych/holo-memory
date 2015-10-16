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
  activate: () => void;
  deactivate: () => void;
  serveState: (state: StateType) => void;
  toDefaultState: () => void;
}

interface ActivatableMesh {
  material: BABYLON.StandardMaterial;
  activeMaterial: BABYLON.StandardMaterial;
  setMaterials: () => void;
}

enum StateType {
  'Active',
  'Silent'
}

function isActiveState(state: StateType): boolean {
  return state === StateType.Active;
}
