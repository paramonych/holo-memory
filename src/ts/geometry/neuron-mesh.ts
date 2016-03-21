class NeuronMesh implements ActivatableMesh {
  public mesh: BABYLON.Mesh;
  public curve: BABYLON.Path3D;
  public material: BABYLON.StandardMaterial;
  public activeMaterial: BABYLON.StandardMaterial;

  constructor(private neuron: Neuron, private scene: BABYLON.Scene, public cortexState: CortexConfiguration) {
    this.setMaterials();
    this.curve = randomPath(this.cortexState.scale, (this.cortexState.synapcesAmount+1)*2);
    this.draw();
  }

  draw(): void {
    let scale = this.cortexState.scale;
    this.mesh = BABYLON.Mesh.CreateTube(
      't', this.curve.path, this.cortexState.scale/400, 60, null, 0, this.scene, true, BABYLON.Mesh.FRONTSIDE);
    this.mesh.material = this.material;
    if(this.mesh.actionManager) {
      this.mesh.actionManager.dispose();
    }
    this.mesh.actionManager = new BABYLON.ActionManager(this.scene);
    let self = this;

    this.mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function() {
      self.mesh.material = self.activeMaterial;
      self.neuron.synapces.forEach(function(synapce) {
        synapce.mesh.mesh.material = self.activeMaterial;
        synapce.mesh.synapceLegMesh.material = self.activeMaterial;
      });
    }));

    this.mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function() {
      self.mesh.material = self.material;
      self.neuron.synapces.forEach(function(synapce) {
        synapce.mesh.mesh.material = self.material;
        synapce.mesh.synapceLegMesh.material = self.material;
      });
    }));
  }

  setMaterials(): void {
    if(isMedium(this.neuron.type)) {
      this.material = forMediumNeuron(this.scene);
    } else {
      this.material = forProgenyNeuron(this.scene);
    }
    this.activeMaterial = forActiveNeuron(this.scene);
  }

  public activate(): void {
    this.mesh.material = this.activeMaterial;
  }
  public deactivate(): void {
    this.mesh.material = this.material;
  }

  public dispose(): void {
    this.mesh.actionManager.dispose();
    this.scene.removeMesh(this.mesh);
    this.mesh.dispose();
    this.mesh = null;
  }
}
