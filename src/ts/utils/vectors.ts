
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
  let defaultHelper = new Array<BABYLON.Vector3>();
  let rotationHelper = new Array<BABYLON.Vector3>();

  let point = vectorFrom(0,0,0);
  let deltaRadius = (scale*2)/segmentsAmount;

  for (let i = 0; i <= segmentsAmount; i += 1 ) {
    defaultHelper.push( point );

    let doRandomSign = (i%7 == 0) || (i%6 == 0) ? true : false;

    point = vectorFrom(
      (point.x + random()*deltaRadius*(doRandomSign?randomSign():1)),
      (point.y + random()*deltaRadius*(doRandomSign?randomSign():1)),
      (point.z + random()*deltaRadius*(doRandomSign?randomSign():1))
    );
  }

  let quaternion = (new BABYLON.Quaternion(random()*randomSign(), random()*randomSign(), random()*randomSign())).normalize();

  let rotationMatrix = BABYLON.Matrix.Compose(
    new BABYLON.Vector3(1,1,1),
    quaternion,
    new BABYLON.Vector3(0,0,0)
  );

  for (let i = 0; i < defaultHelper.length; i += 1 ) {
    let rotatedVector = BABYLON.Vector3.TransformCoordinates(defaultHelper[i].clone(), rotationMatrix);
    rotationHelper.push( rotatedVector );
  }

  if(rotationHelper.length) {
    let rotatedPathEndPoint = rotationHelper[rotationHelper.length-1];
    let endPointX = rotatedPathEndPoint.x;
    let endPointY = rotatedPathEndPoint.y;
    let endPointZ = rotatedPathEndPoint.z;

    let shift = scale/2.2;

    let xShift = negate(endPointX/2) + random()*randomSign()*shift;
    let yShift = negate(endPointY/2) + random()*randomSign()*shift;
    let zShift = negate(endPointZ/2) + random()*randomSign()*shift;

    let translationMatrix = BABYLON.Matrix.Compose(
      new BABYLON.Vector3(1,1,1),
      quaternion,
      new BABYLON.Vector3(xShift, yShift, zShift)
    );

    for (let i = 0; i < defaultHelper.length; i += 1 ) {
      let rotatedVector = BABYLON.Vector3.TransformCoordinates(defaultHelper[i].clone(), translationMatrix);
      path.push( rotatedVector );
    }

    return path;
  }

  return rotationHelper;
}

function vectorFrom(x: number, y: number, z: number): BABYLON.Vector3 {
  return new BABYLON.Vector3(x,y,z);
}

function compareVectors(one: BABYLON.Vector3, two: BABYLON.Vector3): boolean {
  var sum = one.add(two.negate());
  return sum.x === 0 && sum.y === 0 && sum.z === 0;
}
