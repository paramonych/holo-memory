class Cortex {
  private neurons: Neuron[];
  constructor(private neuronsNum: number, private scene: BABYLON.Scene, private scale: number) {
    //this.createNeurons(neuronsNum);
  }

  private createNeurons(): void {
      this.neurons = new Array<Neuron>();
      for(let i=0; i< this.neuronsNum; i++) {
        this.neurons.push( new Neuron(this.scene, this.scale));
      }
  }

  public draw(): void {
    _.each(this.neurons, (n) => n.dispose());
    this.createNeurons();
    _.each(this.neurons, (neuron) => neuron.draw());
  }

  react(): void {
    _.each(this.neurons, (neuron) => neuron.react());
  }
}
