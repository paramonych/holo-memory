function forBlastSphere(scene: BABYLON.Scene): BABYLON.StandardMaterial {
 let material = new BABYLON.StandardMaterial('i', scene);
 material.emissiveColor = new BABYLON.Color3(0,0,0);//(0.17, 0.57, 1);
 material.specularColor = new BABYLON.Color3(0,0,0);
 material.alpha = 0;
 return material;
}
