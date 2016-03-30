class NeuronMesh implements ActivatableMesh {
  public mesh: BABYLON.Mesh;
  public isHighlighted = false;
  public curve: BABYLON.Path3D;
  private alpha = 1;
  public isLegatee = false;

  constructor(
    private synapces: Synapce[],
    private type: NeuronType,
    private scene: BABYLON.Scene,
    public cortexState: CortexConfiguration) {
    this.curve = randomPath(this.cortexState.scale, (this.cortexState.synapcesAmount+1)*2);
    this.draw();
    this.setMaterial();
  }

  draw(): void {
    let scale = this.cortexState.scale;
    this.mesh = BABYLON.Mesh.CreateTube(
      't', this.curve.path, this.cortexState.scale/400, 60, null, 0, this.scene, false, BABYLON.Mesh.FRONTSIDE);
    this.mesh.material = defaultMaterial(this.scene);
    this.deactivate();
    this.registerActions();
  }

  public setSynapces(synapces: Synapce[]): void {
    this.synapces = synapces;
  }

  private registerActions(): void {
    if(this.mesh.actionManager) {
      this.mesh.actionManager.dispose();
    }
    this.mesh.actionManager = new BABYLON.ActionManager(this.scene);
    let self = this;

    this.mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function() {
      if(!self.isHighlighted) {
        self.highlightNeuron(true);
      }
    }));

    this.mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function() {
      if(!self.isHighlighted) {
        self.highlightNeuron(false);
      }
    }));

    this.mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnLeftPickTrigger, function() {
      self.highlightNeuron();
    }));
  }

  public select(): void {
    this.isHighlighted = void 0;
    this.highlightNeuron();
  }

  public deselect(): void {
    this.isHighlighted = false;
    this.highlightNeuron(false);
  }

  private highlightNeuron(isHovered ?: boolean): void {
    let newMaterialConfig = (isMedium(this.type) ? mediumMaterial : progenyMaterial);
    let alpha = this.alpha;
    if((!this.isHighlighted && (isHovered === true)) || isHovered === void 0) {
      newMaterialConfig = this.isLegatee ? activeMaterial : selectedMaterial;
      alpha = 1;
    }
    if(isHovered === void 0) {
      this.isHighlighted = !this.isHighlighted;
    }
    resetMaterial(this.mesh.material, newMaterialConfig, alpha);
    this.synapces.forEach(function(synapce) {
      resetMaterial(synapce.mesh.mesh.material, newMaterialConfig, alpha);
      resetMaterial(synapce.mesh.synapceLegMesh.material, newMaterialConfig, alpha);
    });
  }

  public setAlpha(value: number): void {
    this.alpha = value;
    setAlpha(this.mesh.material, value);
    this.synapces.forEach(function(synapce) {
      setAlpha(synapce.mesh.mesh.material, Math.floor(value));
      setAlpha(synapce.mesh.synapceLegMesh.material, Math.floor(value));
      if(synapce.codeMesh) {
        setAlpha(synapce.codeMesh.mesh.material, Math.floor(value));
      }
    });
  }

  setMaterial(): void {
    if(isMedium(this.type)) {
      resetMaterial(this.mesh.material, mediumMaterial);
    } else {
      resetMaterial(this.mesh.material, progenyMaterial);
    }
  }

  public setLegatee(value: boolean): void {
    this.isLegatee = value;
  }

  public resetMaterials(type: NeuronType): void {
    this.type = type;
    this.setMaterial();
    this.isHighlighted = void 0;
  }

  public activate(): void {
    resetMaterial(this.mesh.material, activeMaterial);
  }
  public deactivate(): void {
    this.setMaterial();
  }

  public dispose(): void {
    this.mesh.actionManager.dispose();
    this.mesh.actionManager = null;
    this.scene.removeMesh(this.mesh);
    this.mesh.dispose();
    this.mesh = null;
  }
}
