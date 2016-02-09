class NeuroBlast {
  public sphere: BABYLON.Mesh;
  public neuronsMap: Map<Neuron>;
  public synapcesMap: Map<Synapce>;
  public isExists: boolean = false;
  private synapcesCount: number = 0;

  constructor(
    private synapce: Synapce,
    private radius: number,
    private synapces: Array<Synapce>,
    private scene: BABYLON.Scene) {

    this.neuronsMap = newMap<Neuron>();
    this.synapcesMap = newMap<Synapce>();

    this.synapces.forEach((nextSynapce) => {
      let hasIntersections = this.checkIntersection(nextSynapce);
      let nextNeuron = nextSynapce.neuron;
      if(hasIntersections) {
        if(!mapHasKey(this.neuronsMap, nextNeuron.getId())) {
          mapAdd(this.neuronsMap, nextNeuron.getId(), nextNeuron);
        }
        if(!mapHasKey(this.synapcesMap, nextSynapce.getId())) {
          mapAdd(this.synapcesMap, nextSynapce.getId(), nextSynapce);
        }
        if(!nextNeuron.hasCodeMesh()) {
          //nextNeuron.setProgenyCodeMesh();
        }
      }
    });

    this.synapcesCount = mapSize(this.synapcesMap);

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

  public getIntersectionsCount(): number {
    return this.synapcesCount;
  }

  private dispose(): void {
    this.scene.removeMesh(this.sphere);
  }
}
