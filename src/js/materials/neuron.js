function forMediumNeuron(scene) {
    var material = new BABYLON.StandardMaterial('i', scene);
    material.emissiveColor = new BABYLON.Color3(1, 1, 1);
    material.alpha = 0.35;
    return material;
}
function forProgenyNeuron(scene) {
    var material = new BABYLON.StandardMaterial('i', scene);
    material.emissiveColor = new BABYLON.Color3(0, 0, 1);
    material.alpha = 0.20;
    return material;
}
function forMediumActiveNeuron(scene) {
    var material = forMediumNeuron(scene);
    material.ambientColor = new BABYLON.Color3(1, 1, 1);
    return material;
}
function forProgenyActiveNeuron(scene) {
    var material = forProgenyNeuron(scene);
    material.ambientColor = new BABYLON.Color3(1, 1, 1);
    return material;
}
function forMediumNeuronGG(scene) {
    var material = new BABYLON.StandardMaterial("kosh", scene);
    material.diffuseColor = new BABYLON.Color3(0.5, 0, 0);
    material.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    material.alpha = 0.2;
    material.specularPower = 16;
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
