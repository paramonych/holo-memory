class NeuronMesh implements ActivatableMesh {
  public mesh: BABYLON.Mesh;
  private isHighlighted = false;
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
      if(!self.isHighlighted) {
        self.highlightNeuron(self.activeMaterial, false);
      }
    }));

    this.mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function() {
      if(!self.isHighlighted) {
        self.highlightNeuron(self.material, false);
      }
    }));

    this.mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnLeftPickTrigger, function() {
      self.highlightNeuron((self.isHighlighted ? self.material : self.activeMaterial), !self.isHighlighted);
    }));
  }

  private highlightNeuron(material: BABYLON.StandardMaterial, isHighlighted: boolean): void {
    this.isHighlighted = isHighlighted;
    this.mesh.material = material;
    this.neuron.synapces.forEach(function(synapce) {
      synapce.mesh.mesh.material = material;
      synapce.mesh.synapceLegMesh.material = material;
    });
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
    this.mesh.actionManager = null;
    this.scene.removeMesh(this.mesh);
    this.mesh.dispose();
    this.mesh = null;
  }
}
