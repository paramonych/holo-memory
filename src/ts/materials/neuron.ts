function forMediumNeuron(scene: BABYLON.Scene): BABYLON.StandardMaterial {
 let material = new BABYLON.StandardMaterial('i', scene);
 material.emissiveColor = new BABYLON.Color3(0.5,0.5,0.5);
 material.specularColor = new BABYLON.Color3(1,1,1);
 material.ambientColor = new BABYLON.Color3(0,0,1);
 material.specularPower = 70;
 material.alpha = 1;
 return material;
}
function forProgenyNeuron(scene: BABYLON.Scene): BABYLON.StandardMaterial {
 let material = new BABYLON.StandardMaterial('sd', scene);
 material.emissiveColor = new BABYLON.Color3(0,0,0.35);
 material.specularColor = new BABYLON.Color3(0,0,0);
 material.ambientColor = new BABYLON.Color3(0,0,0.75);
 material.specularPower = 70;
 material.alpha = 1;
 return material;
}

function forSignalNeuron(scene: BABYLON.Scene): BABYLON.StandardMaterial {
  let material = new BABYLON.StandardMaterial('idd', scene);
  material.ambientColor = new BABYLON.Color3(1,0,0);
  material.specularColor = new BABYLON.Color3(1,1,1);
  material.emissiveColor = new BABYLON.Color3(1,0,0);
  material.specularPower = 70;
  material.alpha = 1;
  return material;
}

function forSelectedNeuron(scene: BABYLON.Scene): BABYLON.StandardMaterial {
  let material = new BABYLON.StandardMaterial('idd', scene);
  material.ambientColor = new BABYLON.Color3(1,0.9,0);
  material.specularColor = new BABYLON.Color3(1,1,1);
  material.emissiveColor = new BABYLON.Color3(1,0.9,0);
  material.specularPower = 70;
  material.alpha = 1;
  return material;
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
