class Cortex implements Disposable {
  private neurons: Neuron[];
  public blasts: NeuroBlast[];
  private neuronsAmount = 1;

  constructor(public scene: BABYLON.Scene, public scale: number) {
    this.createNeurons();
  }

  private createNeurons(): void {
      _.each(this.neurons, (n) => n.dispose());
      this.neurons = new Array<Neuron>();
      for(let i=0; i< this.neuronsAmount; i++) {
        this.neurons.push( new Neuron(this));
      }
  }

  public draw(): void {
    _.each(this.neurons, (neuron) => neuron.build());
  }

  public chargeTense(time: Time): void {
    _.each(this.neurons, (n) => {
      time.tense.add(() => n.tense.play(), 0);
    });
  }

  react(): void {
    _.each(this.neurons, (neuron) => neuron.react());
  }

  public dispose(): void {
    _.each(this.neurons, (neuron) => {neuron.dispose();});
  }
}
