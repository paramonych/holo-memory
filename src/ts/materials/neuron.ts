var mediumMaterial = materialConfigFrom(
  colorFrom(0.5,0.5,0.5),
  colorFrom(1,1,1),
  colorFrom(0,0,1),
  70,
  1
);
var progenyMaterial = materialConfigFrom(
  colorFrom(0,0,0.35),
  colorFrom(0,0,0),
  colorFrom(0,0,0.75),
  70,
  1
);
var activeMaterial = materialConfigFrom(
  colorFrom(1,0,0),
  colorFrom(1,1,1),
  colorFrom(1,0,0),
  70,
  1
);
var selectedMaterial = materialConfigFrom(
  colorFrom(1,0.9,0),
  colorFrom(1,1,1),
  colorFrom(1,0.9,0),
  70,
  1
);
var invisibleMaterial = materialConfigFrom(
  colorFrom(1,0.9,0),
  colorFrom(1,1,1),
  colorFrom(1,0.9,0),
  0,
  0.1
);
interface NeuronMaterials {
  Medium: string;
  Progeny: string;
  Signal: string;
  Selected: string;
}

interface MaterialConfig {
  emissive: Color;
  specular: Color;
  ambient : Color;
  specularPower: number;
  alpha: number;
}
interface Color {
  r: number;
  g: number;
  b: number;
}

function colorizeMaterial(config: MaterialConfig, emissive: BABYLON.Color3): MaterialConfig {
  config.emissive = colorFrom(emissive.r, emissive.g, emissive.b);
  return config;
}

function defaultMaterial(scene: BABYLON.Scene): BABYLON.StandardMaterial {
  return new BABYLON.StandardMaterial('Name-'+(random()*random()), scene);
}

function colorFrom(r: number, g: number, b: number): Color {
  return {
    r: r,
    g: g,
    b: b
  }
}

function materialConfigFrom(
  emissive: Color,
  specular: Color,
  ambient : Color,
  specularPower: number,
  alpha: number): MaterialConfig {
  return {
    emissive: emissive,
    specular: specular,
    ambient : ambient,
    specularPower: specularPower,
    alpha: alpha
  }
}

function resetMaterial(material: BABYLON.Material, c: MaterialConfig, alpha ?: number): void {
  (<BABYLON.StandardMaterial>material).emissiveColor = new BABYLON.Color3(c.emissive.r,c.emissive.g,c.emissive.b);
  (<BABYLON.StandardMaterial>material).specularColor = new BABYLON.Color3(c.specular.r,c.specular.g,c.specular.b);
  (<BABYLON.StandardMaterial>material).ambientColor = new BABYLON.Color3(c.ambient.r,c.ambient.g,c.ambient.b);
  (<BABYLON.StandardMaterial>material).specularPower = c.specularPower;
  (<BABYLON.StandardMaterial>material).alpha = (alpha === void 0) ? c.alpha : alpha;
}

function setAlpha(material: BABYLON.Material, alpha: number): void {
  (<BABYLON.StandardMaterial>material).alpha = alpha;
}

var neuronMaterials = {
  Medium: 'medium-neuron',
  Progeny: 'progeny-neuron',
  Signal: 'signal-neuron',
  Selected: 'selected-neuron'
}


// DARK GLASS
function forMediumNeuronGGZ(scene: BABYLON.Scene): BABYLON.StandardMaterial {
  let material = new BABYLON.StandardMaterial("kosh", scene);
  //material.reflectionTexture = new BABYLON.CubeTexture("textures/TropicalSunnyDay", scene);
  material.diffuseColor = new BABYLON.Color3(0.5, 0, 0);
  material.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
  material.alpha = 0.2;
  material.specularPower = 16;

  // Fresnel
  material.reflectionFresnelParameters = new BABYLON.FresnelParameters();
  material.reflectionFresnelParameters.bias = 0.1;

  material.emissiveFresnelParameters = new BABYLON.FresnelParameters();
  material.emissiveFresnelParameters.power = 4;
  material.emissiveFresnelParameters.leftColor = BABYLON.Color3.White();
  material.emissiveFresnelParameters.rightColor = BABYLON.Color3.Black();

  material.opacityFresnelParameters = new BABYLON.FresnelParameters();
  material.opacityFresnelParameters.leftColor = BABYLON.Color3.White();
  material.opacityFresnelParameters.rightColor = BABYLON.Color3.Black();
  return material;
}
