function forBlastSphere(scene, emissiveColor) {
    var material = new BABYLON.StandardMaterial('i', scene);
    material.emissiveColor = emissiveColor;
    material.specularColor = new BABYLON.Color3(1, 1, 1);
    material.alpha = 1;
    return material;
}
function forIndicator(scene) {
    var material = new BABYLON.StandardMaterial('i', scene);
    material.diffuseColor = new BABYLON.Color3(0, 1, 0);
    material.emissiveColor = new BABYLON.Color3(0, 1, 0);
    material.specularColor = new BABYLON.Color3(0, 0, 0);
    material.alpha = 0;
    return material;
}
function glass(scene) {
    var material = new BABYLON.StandardMaterial("kosh", scene);
    material.diffuseColor = new BABYLON.Color3(1, 1, 1);
    material.emissiveColor = new BABYLON.Color3(0.3, 0.3, 0.3);
    material.alpha = 0.03;
    material.specularPower = 9;
    material.reflectionFresnelParameters = new BABYLON.FresnelParameters();
    material.reflectionFresnelParameters.bias = 0.6;
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
