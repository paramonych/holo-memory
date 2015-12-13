class NeuroBlast {
  public sphere: BABYLON.Mesh;
  public synapcesMap: Map<Synapce>;

  constructor(
    private synapce: Synapce, radius: number,
    private synapces: Array<Synapce>,
    private scene: BABYLON.Scene) {

    this.sphere = BABYLON.Mesh.CreateSphere('blast', 8, radius, scene, false);
    this.sphere.material = forBlastSphere(scene);
    this.sphere.position = synapce.position.clone();

    this.synapcesMap = newMap<Synapce>();
    this.synapces.forEach((nextSynapce) => {
      this.checkIntersection(nextSynapce);
    });

    this.dispose();
  }

  private checkIntersection(nextSynapce: Synapce): void {
    if(this.sphere.intersectsMesh(nextSynapce.mesh.mesh, true)) {
      mapAdd(this.synapcesMap, nextSynapce.getId(), nextSynapce);
    }
  }

  private dispose(): void {
    this.scene.removeMesh(this.sphere);
  }
}
