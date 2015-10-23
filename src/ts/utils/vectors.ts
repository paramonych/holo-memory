
function randomAngleVector(): BABYLON.Vector3 {
  let angle = () => randomSign()*Math.PI/Math.random();
  return new BABYLON.Vector3(angle(),angle(),angle());
}

function randomVector(scale: number): BABYLON.Vector3 {
  let num = () => scale*Math.random()*randomSign();
  return new BABYLON.Vector3(num(),num(),num());
}

function randomPointOnSphere(radius: number): BABYLON.Vector3 {
  let num = () => Math.random()*randomSign();
  let vector = new BABYLON.Vector3(num(),num(),num());
  vector.scale(radius);
  return vector;
}

function randomPath(scale: number, deltaRadius: number, deltaSegment: number): BABYLON.Path3D {
  let path = new Array<BABYLON.Vector3>();
  let next = randomVector(scale);//randomPointOnSphere(scale);//vectorFrom(0,0,0);
  let steps = Math.floor(scale/deltaSegment);
  let xSign = (-1)*next.x/Math.abs(next.x);
  let ySign = (-1)*next.y/Math.abs(next.y);
  let zSign = (-1)*next.z/Math.abs(next.z);

  for (let i = 0; i <= steps; i += 1 ) {
    path.push( next );
    next = vectorFrom(
      (next.x+xSign*Math.random()*deltaRadius),
      (next.y+ySign*Math.random()*deltaRadius),
      (next.z+zSign*Math.random()*deltaRadius)
    );
  }
  let path3D = new BABYLON.Path3D(path);
  return path3D;
}

function vectorFrom(x: number, y: number, z: number): BABYLON.Vector3 {
  return new BABYLON.Vector3(x,y,z);
}

function compareVectors(one: BABYLON.Vector3, two: BABYLON.Vector3): boolean {
  var sum = one.add(two.negate());
  return sum.x === 0 && sum.y === 0 && sum.z === 0;
}
