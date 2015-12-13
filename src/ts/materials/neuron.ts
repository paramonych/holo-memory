function forMediumNeuron(scene: BABYLON.Scene): BABYLON.StandardMaterial {
 let material = new BABYLON.StandardMaterial('i', scene);
 material.emissiveColor = new BABYLON.Color3(1,0,0);//(0.17, 0.57, 1);
 material.alpha = 0.3;
 return material;
}

function forMediumActiveNeuron(scene: BABYLON.Scene): BABYLON.StandardMaterial {
  let material = new BABYLON.StandardMaterial('a', scene);
  material.emissiveColor = new BABYLON.Color3(1, 0, 0);
  material.ambientColor = new BABYLON.Color3(1, 0, 0);
  material.alpha = 0.3;
  return material;
}

function forProgenyNeuron(scene: BABYLON.Scene): BABYLON.StandardMaterial {
 let material = new BABYLON.StandardMaterial('i', scene);
 material.emissiveColor = new BABYLON.Color3(0,0,1);//(0.57, 0.17, 1);
 material.alpha = 0.3;
 return material;
}

function forProgenyActiveNeuron(scene: BABYLON.Scene): BABYLON.StandardMaterial {
  let material = new BABYLON.StandardMaterial('a', scene);
  material.emissiveColor = new BABYLON.Color3(0, 0, 1);
  material.ambientColor = new BABYLON.Color3(0, 0, 1);
  material.alpha = 0.3;
  return material;
}
