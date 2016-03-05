function forBlastSphere(scene: BABYLON.Scene, emissiveColor: BABYLON.Color3): BABYLON.StandardMaterial {
 let material = new BABYLON.StandardMaterial('i', scene);
 material.emissiveColor = emissiveColor;//(0.17, 0.57, 1);
 material.specularColor = new BABYLON.Color3(1,1,1);
 material.alpha = 1;
 return material;
}

function forIndicator(scene: BABYLON.Scene): BABYLON.StandardMaterial {
 let material = new BABYLON.StandardMaterial('i', scene);
 material.diffuseColor = new BABYLON.Color3(0,1,0);
 material.emissiveColor = new BABYLON.Color3(0,1,0);//(0.17, 0.57, 1);
 material.specularColor = new BABYLON.Color3(0,0,0);
 material.alpha = 0;
 return material;
}
function glass(scene: BABYLON.Scene): BABYLON.StandardMaterial {
  let material = new BABYLON.StandardMaterial("kosh", scene);

  //material.reflectionTexture = new BABYLON.CubeTexture("textures/TropicalSunnyDay", scene);
  material.diffuseColor = new BABYLON.Color3(1, 1, 1);
  material.emissiveColor = new BABYLON.Color3(0.45, 0.45, 0.45);
  material.alpha = 0.03;
  material.specularPower = 12;

  // Fresnel
  material.reflectionFresnelParameters = new BABYLON.FresnelParameters();
  material.reflectionFresnelParameters.bias = 0.5;

  material.emissiveFresnelParameters = new BABYLON.FresnelParameters();
  material.emissiveFresnelParameters.bias = 0.7;
  material.emissiveFresnelParameters.power = 2;
  material.emissiveFresnelParameters.leftColor = BABYLON.Color3.White();
  material.emissiveFresnelParameters.rightColor = BABYLON.Color3.Black();

  material.opacityFresnelParameters = new BABYLON.FresnelParameters();
  material.opacityFresnelParameters.leftColor = BABYLON.Color3.White();
  material.opacityFresnelParameters.rightColor = BABYLON.Color3.Black();

  return material;
}
