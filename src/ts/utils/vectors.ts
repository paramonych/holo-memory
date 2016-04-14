
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

function randomPath(scale: number, segmentsAmount: number): BABYLON.Vector3[] {
  let path = new Array<BABYLON.Vector3>();
  let shift = -scale/2;

  let point = vectorFrom(shift,shift,shift);
  let deltaRadius = scale*2/segmentsAmount;

  let matrix = BABYLON.Matrix.Compose(
    new BABYLON.Vector3(0,0,0),
    new BABYLON.Quaternion(0,0,0),//Math.PI*random()*randomSign(), Math.PI*random()*randomSign(), Math.PI*random()*randomSign()),
    new BABYLON.Vector3(1,1,1)
  );

  for (let i = 0; i <= segmentsAmount; i += 1 ) {
    let rotatedVector = BABYLON.Vector3.TransformCoordinates(point.clone(), matrix);

    path.push( point);//rotatedVector.clone() );

    let doRandomSign = false;//(i%5 == 0) || (i%6 == 0) ? true : false;

    point = vectorFrom(
      (point.x + random()*deltaRadius),
      (point.y + random()*deltaRadius),
      (point.z + random()*deltaRadius)
    );
  }

  return path;
}

function vectorFrom(x: number, y: number, z: number): BABYLON.Vector3 {
  return new BABYLON.Vector3(x,y,z);
}

function compareVectors(one: BABYLON.Vector3, two: BABYLON.Vector3): boolean {
  var sum = one.add(two.negate());
  return sum.x === 0 && sum.y === 0 && sum.z === 0;
}
