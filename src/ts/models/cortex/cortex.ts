class Cortex implements Disposable {
  private neurons: Neuron[];
  public blasts: NeuroBlast[];
  private neuronsAmount = 4;

  constructor(
    public scene: BABYLON.Scene,
    public scale: number,
    public lifetime: number) {
    this.createNeurons();
  }

  private createNeurons(): void {
      _.each(this.neurons, (n) => n.dispose());
      this.neurons = new Array<Neuron>();
      let type = NeuronType.Medium;
      for(let i=0; i< this.neuronsAmount; i++) {
        if(i >= this.neuronsAmount/2) {
          type = NeuronType.Progeny;
        }
        this.neurons.push(new Neuron(this, type));
      }
  }

  public draw(): void {
    _.each(this.neurons, (neuron) => neuron.build());
  }

  public chargeTense(time: Time): void {
    _.each(this.neurons, (n) => {
      time.tense.add(() => n.play(), 0);
    });
  }

  public freezeTense(time: Time): void {
    _.each(this.neurons, (n) => {
      n.pause(time.tense.progress()*time.duration);
    });
  }

  public resumeTense(time: Time): void {
    _.each(this.neurons, (n) => {
      n.resume();
    });
  }

  public restartTense(time: Time): void {
    _.each(this.neurons, (n) => {
      n.restartTense();
    });
  }

  public shiftTense(time: Time, progress: number): void {
    _.each(this.neurons, (n) => {
      n.progress(progress);
    });
  }

  public dispose(): void {
    _.each(this.neurons, (neuron) => {neuron.dispose();});
  }
}
