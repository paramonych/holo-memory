class NeuroBlast {
  public sphere: BABYLON.Mesh;
  public neuronsMap: Map<Neuron>;
  public isExists: boolean = false;

  constructor(
    private synapce: Synapce,
    private radius: number,
    private synapces: Array<Synapce>,
    private scene: BABYLON.Scene) {

    this.neuronsMap = newMap<Neuron>();
    this.synapces.forEach((nextSynapce) => {
      let hasIntersections = this.checkIntersection(nextSynapce);
      let nextNeuron = nextSynapce.neuron;
      if(hasIntersections && !mapHasKey(this.neuronsMap, nextNeuron.getId())) {
        mapAdd(this.neuronsMap, nextNeuron.getId(), nextNeuron);
        if(!nextNeuron.hasCodeMesh()) {
          nextNeuron.setProgenyCodeMesh();
        }
      }
    });

    this.dispose();
  }

  private checkIntersection(nextSynapce: Synapce): boolean {
    let hasIntersections = this.checkIntersections(nextSynapce.position);

    if(hasIntersections) {
      nextSynapce.mesh.mesh.material = forBlastSphere(this.scene);

      if(!this.isExists) {
        this.isExists = true;
      }
    }

    return hasIntersections;
  }

  private checkIntersections(np: BABYLON.Vector3): boolean {
    let pos = this.synapce.position;
    let x = Math.pow((pos.x - np.x), 2);
    let y = Math.pow((pos.y - np.y), 2);
    let z = Math.pow((pos.z - np.z), 2);
    let distance = Math.sqrt(x + y + z);

    if(distance > 0 && distance < this.radius) {
      return true;
    }
    return false;
  }

  private dispose(): void {
    this.scene.removeMesh(this.sphere);
  }
}
