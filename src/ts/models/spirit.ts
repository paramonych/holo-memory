class Spirit {
  public id = getUniqueId();
  public stringId: String;
  public mesh: BABYLON.Mesh;
  public isHighlighted = false;
  private alpha = 1;

  public availableCodes: Map<String>;

  constructor(
    private position: BABYLON.Vector3,
    private scene: BABYLON.Scene,
    public cortexState: CortexConfiguration) {
    this.stringId = this.id.toString();
    this.draw();
  }

  draw(): void {
    let scale = this.cortexState.scale;
    this.mesh = BABYLON.Mesh.CreateBox('a', SPIRIT_SIZE, this.scene);
    this.mesh.material = defaultMaterial(this.scene);
    this.mesh.position = this.position;
    this.deactivate();
  }

  private highlightCube(): void {
    let newMaterialConfig =  invisibleMaterial;
    let alpha = 0.007;

    if(!this.isHighlighted) {
      newMaterialConfig = selectedMaterial;
      alpha = 0.02;
    }

    resetMaterial(this.mesh.material, newMaterialConfig, alpha);
  }

  public setAlpha(value: number): void {
    this.alpha = value;
    setAlpha(this.mesh.material, value);
  }

  public activate(): void {
    this.isHighlighted = true;
    this.highlightCube();
  }
  public deactivate(): void {
    this.isHighlighted = false;
    this.highlightCube();
  }

  public dispose(): void {
    this.scene.removeMesh(this.mesh);
    this.mesh.dispose();
    this.mesh = null;

    this.scene = null;
    this.cortexState = null;
  }
}
