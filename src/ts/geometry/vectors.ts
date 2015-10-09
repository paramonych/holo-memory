
function randomAngleVector(): BABYLON.Vector3 {
  var angle = () => randomSign()*Math.PI/Math.random();
  return new BABYLON.Vector3(angle(),angle(),angle());
}

function randomVector(scale: number): BABYLON.Vector3 {
  var num = () => (scale/2)*Math.random()*randomSign();
  return new BABYLON.Vector3(num(),num(),num());
}
